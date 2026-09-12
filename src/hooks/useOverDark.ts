import { useEffect, useState } from "react";

/**
 * True while a dark region (`[data-nav-dark]` — the lit hall, the footer)
 * sits under the fixed chrome. Elements marked `data-peek-gated` count only
 * once their chapter's `data-peek` flag says the dark surface is exposed.
 * The flag is painted by the cinema loop on rAF, so a MutationObserver
 * catches the exact flip plus a rAF-scheduled re-check on scroll.
 */
export function useOverDark(): boolean {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const over = Array.from(document.querySelectorAll<HTMLElement>("[data-nav-dark]")).some(
        (el) => {
          if (el.hasAttribute("data-peek-gated")) {
            const chapter = el.closest<HTMLElement>("[data-chapter]");
            if (chapter?.dataset.peek !== "true") return false;
          }
          const rect = el.getBoundingClientRect();
          return rect.top <= 76 && rect.bottom > 0;
        },
      );
      setDark(over);
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = "ResizeObserver" in window ? new ResizeObserver(schedule) : undefined;
    observer?.observe(document.body);
    const mutations = new MutationObserver(update);
    document
      .querySelectorAll<HTMLElement>("[data-chapter]")
      .forEach((el) =>
        mutations.observe(el, { attributes: true, attributeFilter: ["data-peek"] }),
      );
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer?.disconnect();
      mutations.disconnect();
    };
  }, []);
  return dark;
}
