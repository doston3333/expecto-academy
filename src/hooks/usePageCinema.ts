import { useEffect, type RefObject } from "react";

const clamp = (value: number, low = 0, high = 1) => Math.max(low, Math.min(high, value));
const smooth = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

// Layout coordinates deliberately exclude transforms, including animated ancestors.
// Reading a translated element's client rect would feed its own motion back into the clock.
function layoutTop(element: HTMLElement) {
  let top = 0;
  for (let node: HTMLElement | null = element; node; node = node.offsetParent as HTMLElement | null) {
    top += node.offsetTop;
  }
  return top;
}

/** Per-chapter progress → named CSS variables. Scenery is pure CSS; JS only supplies the clock. */
function paintChapter(element: HTMLElement, progress: number) {
  element.style.setProperty("--xc-chapter", progress.toFixed(4));
  switch (element.dataset.chapter) {
    case "overture": {
      const iris = smooth(progress / 0.82);
      const compact = window.innerWidth <= 760;
      element.style.setProperty(
        "--xc-whisper-o",
        String(1 - smooth(progress / (compact ? 0.4 : 0.26))),
      );
      element.style.setProperty(
        "--xc-whisper-y",
        `${smooth(progress / (compact ? 0.44 : 0.3)) * -80}px`,
      );
      element.style.setProperty("--xc-iris", iris.toFixed(4));
      element.style.setProperty("--xc-iris-x", `${iris * (compact ? 30 : 36)}%`);
      element.style.setProperty("--xc-iris-y", `${iris * 30}%`);
      element.style.setProperty("--xc-iris-round", `${smooth(progress / 0.5) * 44}px`);
      element.style.setProperty("--xc-iris-tilt", `${smooth((progress - 0.12) / 0.7) * -10}deg`);
      element.style.setProperty("--xc-iris-lift", `${smooth((progress - 0.42) / 0.45) * -150}px`);
      element.style.setProperty("--xc-iris-fade", String(1 - smooth((progress - 0.74) / 0.16)));
      element.style.setProperty("--xc-iris-depth", String(1 + iris * 0.16));
      element.style.setProperty("--xc-title", smooth((progress - 0.55) / 0.4).toFixed(4));
      break;
    }
    case "curtain":
      element.style.setProperty("--xc-curtain", smooth(progress / 0.9).toFixed(4));
      element.style.setProperty("--xc-curtain-label", String(1 - smooth(progress / 0.4)));
      break;
    case "desk": {
      const release = smooth((progress - 0.4) / 0.48);
      element.style.setProperty("--xc-panorama", smooth(progress / 0.38).toFixed(4));
      element.style.setProperty("--xc-release", release.toFixed(4));
      element.style.setProperty("--xc-carry-o", String(clamp(1 - release * 2.3)));
      element.style.setProperty("--xc-room-o", String(clamp((release - 0.48) / 0.52)));
      break;
    }
    case "words":
      element.style.setProperty("--xc-words-gather", smooth(progress / 0.6).toFixed(4));
      element.style.setProperty("--xc-words-out", smooth((progress - 0.4) / 0.24).toFixed(4));
      element.style.setProperty("--xc-scene-title", smooth((progress - 0.59) / 0.36).toFixed(4));
      break;
    case "horizon":
      element.style.setProperty("--xc-clock-turn", `${progress * 230}deg`);
      element.style.setProperty("--xc-clock-out", smooth(progress / 0.55).toFixed(4));
      element.style.setProperty("--xc-horizon", smooth((progress - 0.12) / 0.7).toFixed(4));
      element.style.setProperty("--xc-scene-title", smooth((progress - 0.34) / 0.43).toFixed(4));
      break;
    case "canopy": {
      for (let index = 0; index < 7; index += 1) {
        element.style.setProperty(
          `--xc-panel-${index}`,
          smooth((progress - index * 0.045) / 0.6).toFixed(4),
        );
      }
      const title = smooth((progress - 0.35) / 0.57);
      element.style.setProperty("--xc-canopy-label", String(1 - smooth(progress / 0.28)));
      element.style.setProperty("--xc-scene-title", title.toFixed(4));
      // The nav reads this to know the dark hall is actually exposed.
      // Guard the write — a same-value setAttribute still pings observers.
      const peek = title > 0.35;
      if (element.dataset.peek !== String(peek)) element.dataset.peek = String(peek);
      break;
    }
  }
}

function settleChapter(element: HTMLElement) {
  paintChapter(element, 1);
  element.dataset.chapterVisible = "true";
  if (element.dataset.chapter === "canopy") element.dataset.peek = "true";
}

/**
 * Native scroll with a short, compositor-only settle for the scenery.
 * One rAF loop batches layout reads, then writes CSS variables —
 * chapters, scenes and reveals are pure CSS driven by the scroll clock.
 */
export function usePageCinema(root: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const page = root.current;
    if (!page) return;
    const reveals = Array.from(page.querySelectorAll<HTMLElement>("[data-reveal]"));
    const scenes = Array.from(page.querySelectorAll<HTMLElement>("[data-scene]"));
    const chapters = Array.from(page.querySelectorAll<HTMLElement>("[data-chapter]"));
    let frame = 0;
    let lastTime = 0;
    let scroll = window.scrollY;
    const revealProgress = new Map<HTMLElement, number>();

    const measure = (time: number) => {
      frame = 0;
      if (!enabled || document.visibilityState === "hidden") return;
      const delta = lastTime ? Math.max(0, time - lastTime) : 16;
      lastTime = time;
      scroll += (window.scrollY - scroll) * (1 - Math.exp(-delta / 75));
      if (Math.abs(window.scrollY - scroll) < 0.2) scroll = window.scrollY;
      const viewport = window.innerHeight;
      // Batch layout reads ahead of all writes.
      const scenePositions = scenes.map((element) => ({
        element,
        top: layoutTop(element) - scroll,
        height: element.offsetHeight,
      }));
      const chapterPositions = chapters.map((element) => ({
        element,
        top: layoutTop(element) - scroll,
        height: element.offsetHeight,
        stageHeight:
          element.querySelector<HTMLElement>(".xc-chapter-stage")?.offsetHeight ?? viewport,
      }));
      const revealPositions = reveals.map((element) => ({
        element,
        top: layoutTop(element) - scroll,
      }));

      page.style.setProperty("--xc-distance", window.innerWidth <= 760 ? ".55" : "1");

      scenePositions.forEach(({ element, top, height }) => {
        const enter = clamp((viewport * 0.94 - top) / (viewport * 0.76));
        const travel = clamp(
          (viewport * 0.5 - top - Math.min(height, viewport) * 0.5) / viewport,
          -1,
          1,
        );
        element.style.setProperty("--xc-enter", enter.toFixed(4));
        element.style.setProperty("--xc-travel", travel.toFixed(4));
        // Same-value attribute sets still dirty selector recalc — guard them.
        const sceneOn = String(top < viewport + 120 && top + height > -120);
        if (element.dataset.sceneVisible !== sceneOn) element.dataset.sceneVisible = sceneOn;
      });
      revealPositions.forEach(({ element, top }) => {
        const progress = Math.max(
          revealProgress.get(element) ?? 0,
          clamp((viewport * 0.96 - top) / (viewport * 0.42)),
        );
        revealProgress.set(element, progress);
        element.style.setProperty("--xc-reveal", progress.toFixed(4));
        const on = String(progress > 0);
        if (element.dataset.revealed !== on) element.dataset.revealed = on;
      });
      chapterPositions.forEach(({ element, top, height, stageHeight }) => {
        paintChapter(element, clamp(-top / Math.max(1, height - stageHeight)));
        const on = String(top < viewport && top + height > 0);
        if (element.dataset.chapterVisible !== on) element.dataset.chapterVisible = on;
      });
      if (scroll !== window.scrollY) frame = requestAnimationFrame(measure);
    };

    const requestMeasure = () => {
      if (!frame && document.visibilityState !== "hidden") frame = requestAnimationFrame(measure);
    };
    const anchorNavigation = () => {
      scroll = window.scrollY;
      requestMeasure();
    };
    // Keyboard and anchor navigation reveal their destination immediately.
    const revealFocusedContent = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      reveals
        .filter((element) => element.contains(event.target as Node))
        .forEach((element) => {
          revealProgress.set(element, 1);
          element.style.setProperty("--xc-reveal", "1");
          element.dataset.revealed = "true";
        });
    };
    const visibility = () => {
      document.documentElement.dataset.visible = String(
        document.visibilityState !== "hidden",
      );
      if (document.visibilityState === "hidden") {
        cancelAnimationFrame(frame);
        frame = 0;
        lastTime = 0;
      } else {
        scroll = window.scrollY;
        requestMeasure();
      }
    };

    // Content remains readable if the animation driver is unavailable or off.
    // Initial progress uses the same curve as `measure` so nothing flashes
    // hidden after the first paint.
    reveals.forEach((element) => {
      const top = layoutTop(element) - window.scrollY;
      const progress = !enabled
        ? 1
        : Math.max(
            clamp((window.innerHeight * 0.96 - top) / (window.innerHeight * 0.42)),
            top < window.innerHeight * 0.7 ? 1 : 0,
          );
      revealProgress.set(element, progress);
      element.style.setProperty("--xc-reveal", String(progress));
      element.dataset.revealed = String(progress > 0);
    });

    let resize: ResizeObserver | undefined;
    if (enabled) {
      window.addEventListener("scroll", requestMeasure, { passive: true });
      window.addEventListener("resize", requestMeasure);
      window.addEventListener("hashchange", anchorNavigation);
      document.addEventListener("visibilitychange", visibility);
      page.addEventListener("focusin", revealFocusedContent);
      if ("ResizeObserver" in window) {
        resize = new ResizeObserver(requestMeasure);
        resize.observe(page);
      }
      visibility();
    } else {
      chapters.forEach(settleChapter);
      scenes.forEach((element) => {
        element.style.setProperty("--xc-enter", "1");
        element.style.setProperty("--xc-travel", "0");
        element.dataset.sceneVisible = "true";
      });
    }
    return () => {
      cancelAnimationFrame(frame);
      resize?.disconnect();
      window.removeEventListener("scroll", requestMeasure);
      window.removeEventListener("resize", requestMeasure);
      window.removeEventListener("hashchange", anchorNavigation);
      document.removeEventListener("visibilitychange", visibility);
      page.removeEventListener("focusin", revealFocusedContent);
    };
  }, [root, enabled]);
}
