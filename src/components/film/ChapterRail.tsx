import { CHAPTERS } from "@/lib/content";
import { HOUSES } from "@/lib/houses";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useState } from "react";

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
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return active;
}

function RailMarker({
  chapter,
  active,
  index,
}: {
  chapter: (typeof CHAPTERS)[number];
  active: boolean;
  index: number;
}) {
  return (
    <a
      href={chapter.href}
      aria-label={`${chapter.numeral}. ${chapter.label}`}
      aria-current={active ? "true" : undefined}
      className="group relative flex h-11 min-w-11 items-center"
    >
      <span
        className={`block h-px transition-[width,background-color] duration-500 ${
          active ? "w-7" : "w-3.5 bg-forest/25 group-hover:w-5 group-hover:bg-forest/55"
        }`}
        style={active ? { backgroundColor: HOUSES[index % HOUSES.length].hex } : undefined}
      />
      <span
        className={`font-display ml-2 text-[0.8rem] italic transition-colors duration-500 ${
          active ? "text-forest-deep" : "text-forest/30 group-hover:text-forest"
        }`}
      >
        {chapter.numeral}
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
  const { scrollYProgress } = useScroll();
  const rule = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
  const ruleHeight = useTransform(rule, [0, 1], ["0%", "100%"]);

  return (
    <nav
      aria-label="Chapters"
      className="fixed top-1/2 left-[max(0.75rem,env(safe-area-inset-left))] z-40 hidden -translate-y-1/2 xl:block"
    >
      <div className="relative flex flex-col">
        <span
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-0 w-px bg-forest/10"
        />
        <motion.span
          aria-hidden="true"
          className="absolute top-2 left-0 w-px bg-forest/50"
          style={{ height: ruleHeight }}
        />
        <div className="relative flex flex-col py-2">
          {CHAPTERS.map((chapter, i) => (
            <RailMarker key={chapter.href} chapter={chapter} active={i === active} index={i} />
          ))}
        </div>
      </div>
    </nav>
  );
}
