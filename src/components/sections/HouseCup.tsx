import { HouseSigil } from "@/components/ui/HouseSigil";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { HOUSE_POINTS } from "@/lib/content";
import { getHouse } from "@/lib/houses";
import { FINAL_T } from "@/lib/motion";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

const MAX_POINTS = 600;

function Tube({
  entry,
  index,
  progress,
}: {
  entry: (typeof HOUSE_POINTS)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  const house = getHouse(entry.houseId);
  const start = 0.08 + index * 0.12;
  const fill = useTransform(progress, [start, start + 0.38], [0, entry.points / MAX_POINTS], {
    clamp: true,
  });
  const counted = useTransform(progress, [start, start + 0.38], [0, entry.points], {
    clamp: true,
  });
  const shown = useTransform(counted, (v) => String(Math.round(v)));

  return (
    <div className="flex flex-col items-center transition-transform duration-300 ease-out hover:-translate-y-1.5">
      <span style={{ color: house.ink }}>
        <HouseSigil house={house.id} t={FINAL_T} className="size-9 sm:size-11" />
      </span>
      <div className="relative mt-4 h-48 w-10 overflow-hidden rounded-full border border-forest/15 bg-cream-2/50 sm:h-64 sm:w-12">
        <motion.div
          className="absolute inset-x-0 bottom-0 origin-bottom rounded-b-full"
          style={{
            scaleY: fill,
            height: "100%",
            background: `linear-gradient(180deg, ${house.metal}, ${house.hex} 30%)`,
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-2 left-1.5 w-1 rounded-full bg-cream/50"
        />
      </div>
      <p
        className="mt-4 text-2xl font-semibold tracking-[-0.03em] tabular-nums sm:text-3xl"
        style={{ color: house.ink }}
      >
        <motion.span>{shown}</motion.span>
      </p>
      <p className="font-display text-base italic" style={{ color: house.ink }}>
        {house.name}
      </p>
      <p className="mt-1 text-center text-[0.68rem] tracking-[0.08em] text-muted uppercase">
        {entry.note}
      </p>
    </div>
  );
}

export function HouseCup() {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.55"],
  });
  const progress = reduced ? FINAL_T : scrollYProgress;

  return (
    <section ref={ref} aria-label="The house cup" className="py-16 sm:py-28">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.7rem] font-medium tracking-[0.16em] text-moss uppercase">
              The house cup
            </p>
            <h2 className="mt-4 max-w-xl text-3xl leading-[1.05] font-medium tracking-[-0.03em] text-forest-deep sm:text-5xl">
              Points are earned, not given.
            </h2>
          </div>
          <p className="max-w-xs text-[0.85rem] leading-relaxed text-muted">
            Spellwork streaks, mock gains, gauntlet discipline. Standings reset every term —
            the hourglasses do not flatter anyone.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:mt-14 sm:grid-cols-4 sm:gap-6">
          {HOUSE_POINTS.map((entry, i) => (
            <Tube key={entry.houseId} entry={entry} index={i} progress={progress} />
          ))}
        </div>
      </div>
    </section>
  );
}
