import { useOverDark } from "@/hooks/useOverDark";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { CHAPTERS } from "@/lib/content";
import { HOUSES } from "@/lib/houses";
import { smoothScrollToY } from "@/lib/motion";
import { useLenis } from "lenis/react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useState, type MouseEvent as ReactMouseEvent } from "react";

function useActiveChapter(): number {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + window.innerHeight * 0.38;
      let idx = 0;
      for (let i = 0; i < CHAPTERS.length; i += 1) {
        const el = document.querySelector(CHAPTERS[i].href);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= y) idx = i;
      }
      setActive(idx);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    // Layout shifts (e.g. the animation switch) move every anchor — recompute.
    const resize = "ResizeObserver" in window ? new ResizeObserver(onScroll) : undefined;
    resize?.observe(document.body);
    return () => {
      window.removeEventListener("scroll", onScroll);
      resize?.disconnect();
    };
  }, []);
  return active;
}

function RailMarker({
  chapter,
  active,
  dark,
  index,
  onNavigate,
}: {
  chapter: (typeof CHAPTERS)[number];
  active: boolean;
  dark: boolean;
  index: number;
  onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
  return (
    <a
      href={chapter.href}
      aria-label={`${chapter.numeral}. ${chapter.label}`}
      aria-current={active ? "true" : undefined}
      className="group relative flex h-11 min-w-11 items-center"
      onClick={(event) => onNavigate(event, chapter.href)}
    >
      <span
        className={`block h-px transition-[width,background-color] duration-500 ${
          active
            ? "w-7"
            : `w-3.5 group-hover:w-5 ${
                dark
                  ? "bg-cream/25 group-hover:bg-cream/55"
                  : "bg-forest/25 group-hover:bg-forest/55"
              }`
        }`}
        style={active ? { backgroundColor: HOUSES[index % HOUSES.length].hex } : undefined}
      />
      <span
        className={`font-display ml-2 text-[0.8rem] italic transition-colors duration-500 ${
          active
            ? dark
              ? "text-cream"
              : "text-forest-deep"
            : dark
              ? "text-cream/30 group-hover:text-cream"
              : "text-forest/30 group-hover:text-forest"
        }`}
      >
        {chapter.numeral}
      </span>
      <span
        aria-hidden="true"
        className={`ml-2.5 max-w-0 overflow-hidden text-[0.64rem] font-medium tracking-[0.14em] whitespace-nowrap uppercase opacity-0 transition-[max-width,opacity] duration-500 ${
          dark ? "text-cream/80" : "text-forest-deep/80"
        } ${active ? "min-[1500px]:max-w-28 min-[1500px]:opacity-100" : ""}`}
      >
        {chapter.label}
      </span>
      <span
        className={`pointer-events-none absolute left-14 rounded-full bg-cream/95 px-2.5 py-1 text-[0.68rem] font-medium tracking-[0.12em] text-forest-deep uppercase opacity-0 shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-forest)_10%,transparent)] transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 ${
          active ? "xl:opacity-0" : ""
        }`}
      >
        {chapter.label}
      </span>
    </a>
  );
}

export function ChapterRail() {
  const active = useActiveChapter();
  const dark = useOverDark();
  const reduced = usePrefersReducedMotion();
  const lenis = useLenis();
  const { scrollYProgress } = useScroll();
  const rule = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
  const ruleHeight = useTransform(rule, [0, 1], ["0%", "100%"]);

  const onNavigate = (event: ReactMouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    const el = document.querySelector<HTMLElement>(href);
    if (!el) return;
    history.replaceState(null, "", href);
    const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - 88);
    if (reduced) window.scrollTo(0, top);
    else if (lenis) lenis.scrollTo(top, { duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4) });
    else smoothScrollToY(top);
  };

  return (
    <nav
      aria-label="Chapters"
      className="fixed top-1/2 left-[max(0.75rem,env(safe-area-inset-left))] z-40 hidden -translate-y-1/2 xl:block"
    >
      <div className="relative flex flex-col">
        <span
          aria-hidden="true"
          className={`absolute top-2 bottom-2 left-0 w-px transition-colors duration-500 ${dark ? "bg-cream/15" : "bg-forest/10"}`}
        />
        <motion.span
          aria-hidden="true"
          className={`absolute top-2 left-0 w-px transition-colors duration-500 ${dark ? "bg-cream/60" : "bg-forest/50"}`}
          style={{ height: ruleHeight }}
        />
        <div className="relative flex flex-col py-2">
          {CHAPTERS.map((chapter, i) => (
            <RailMarker
              key={chapter.href}
              chapter={chapter}
              active={i === active}
              dark={dark}
              index={i}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}
