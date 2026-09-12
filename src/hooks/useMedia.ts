import { useEffect, useState } from "react";

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}

/** Phone layout — Tailwind `md` and below. */
export function useCompactLayout(): boolean {
  return useMediaQuery("(max-width: 767.98px)");
}

/** Chapter rail is desktop-only; do not even mount the scroll listener on a phone. */
export function useWideDesktop(): boolean {
  return useMediaQuery("(min-width: 1280px)");
}

/** Inline top-bar links — `lg` and up. Below that the nav collapses into a sidebar drawer. */
export function useDesktopNav(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}

/**
 * Lenis, paper grain, and per-letter physics.
 * Touch devices keep native scrolling; a laggy lerp feels like the page is stuck.
 */
export function useAllowSmoothScroll(): boolean {
  const wide = useMediaQuery("(min-width: 768px)");
  const fine = useMediaQuery("(pointer: fine)");
  return wide && fine;
}
