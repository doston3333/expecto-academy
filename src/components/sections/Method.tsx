import { useCompactLayout } from "@/hooks/useMedia";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { METHOD_PILLARS, METHOD_SUPPORT } from "@/lib/content";
import { HOUSES } from "@/lib/houses";
import { beatIndex, easeCinematic } from "@/lib/motion";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, useState } from "react";

function PillarRow({
  pillar,
  progress,
  index,
}: {
  pillar: (typeof METHOD_PILLARS)[number];
  progress: MotionValue<number>;
  index: number;
}) {
  const count = METHOD_PILLARS.length;
  const start = index / count;
  const end = start + 0.8 / count;
  const y = useTransform(progress, [start, end], ["115%", "0%"], { clamp: true });
  const opacity = useTransform(progress, [start, end], [0.15, 1], { clamp: true });

  return (
    <div className="grid gap-4 border-t border-forest/12 py-12 sm:grid-cols-12 sm:items-baseline sm:gap-6 sm:py-14">
      <div className="overflow-hidden sm:col-span-3">
        <motion.span
          style={{ y, color: `${HOUSES[index % HOUSES.length].hex}38` }}
          className="block text-[3.2rem] leading-none font-semibold tracking-[-0.05em] tabular-nums sm:text-[6.5rem]"
        >
          {pillar.n}
        </motion.span>
      </div>
      <div className="overflow-hidden sm:col-span-4">
        <motion.h3
          style={{ y }}
          className="text-2xl font-medium tracking-[-0.03em] text-forest-deep sm:text-3xl"
        >
          {pillar.title}
        </motion.h3>
      </div>
      <motion.p
        style={{ opacity }}
        className="max-w-md text-[0.95rem] leading-relaxed text-muted sm:col-span-5"
      >
        {pillar.body}
      </motion.p>
    </div>
  );
}

function MethodFilm() {
  const count = METHOD_PILLARS.length;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [index, setIndex] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = beatIndex(v, count);
    if (next !== index) setIndex(next);
  });
  const pillar = METHOD_PILLARS[index];
  const house = HOUSES[index % HOUSES.length];
  const supportOpacity = useTransform(scrollYProgress, [0.68, 0.9], [0, 1], { clamp: true });

  return (
    <section ref={ref} id="method" aria-label="The method" className="relative h-[240svh]">
      <div className="cinema-stage sticky top-0 flex min-h-svh flex-col justify-center overflow-hidden px-5 pt-24 pb-10">
        <div className="flex items-center justify-between">
          <p className="text-[0.7rem] font-medium tracking-[0.16em] text-moss uppercase">The method</p>
          <p className="text-[0.72rem] text-muted tabular-nums">0{index + 1} / 0{count}</p>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={pillar.n} className="mt-10">
            <div className="overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                exit={{ y: "-110%" }}
                transition={{ duration: 0.46, ease: easeCinematic }}
                className="block text-[4.2rem] leading-none font-semibold tracking-[-0.05em] tabular-nums"
                style={{ color: `${house.hex}38` }}
              >
                {pillar.n}
              </motion.span>
            </div>
            <div className="mt-4 overflow-hidden">
              <motion.h3
                initial={{ y: "112%" }}
                animate={{ y: 0 }}
                exit={{ y: "-112%" }}
                transition={{ duration: 0.48, ease: easeCinematic, delay: 0.04 }}
                className="text-[1.85rem] leading-[1.12] font-medium tracking-[-0.03em] text-forest-deep"
              >
                {pillar.title}
              </motion.h3>
            </div>
            <div className="mt-4 overflow-hidden">
              <motion.p
                initial={{ y: "120%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                transition={{ duration: 0.44, ease: easeCinematic, delay: 0.08 }}
                className="max-w-md text-[1.02rem] leading-relaxed text-muted"
              >
                {pillar.body}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="mt-10 flex items-center gap-2" aria-hidden="true">
          {METHOD_PILLARS.map((item, i) => (
            <span
              key={item.n}
              className={`h-1 rounded-full ${i === index ? "w-7" : "w-2.5 bg-forest/15"}`}
              style={i === index ? { backgroundColor: house.hex } : undefined}
            />
          ))}
        </div>
        <motion.div style={{ opacity: supportOpacity }} className="mt-8 space-y-1.5 border-t border-forest/12 pt-5">
          {METHOD_SUPPORT.map((line) => (
            <p key={line} className="text-[0.8rem] text-muted">
              {line}
            </p>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function MethodDocument({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.45"],
  });

  return (
    <section ref={ref} id="method" aria-label="The method" className="py-16 sm:py-28">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        <p className="text-[0.7rem] font-medium tracking-[0.16em] text-moss uppercase">The method</p>
        <h2 className="mt-4 max-w-2xl text-3xl leading-[1.05] font-medium tracking-[-0.03em] text-forest-deep sm:text-5xl">
          Three things that move a score.
        </h2>
        <div className="mt-12 sm:mt-16">
          {reduced
            ? METHOD_PILLARS.map((pillar, i) => (
                <div
                  key={pillar.n}
                  className="grid gap-4 border-t border-forest/12 py-12 sm:grid-cols-12 sm:items-baseline sm:gap-6 sm:py-14"
                >
                  <span
                    className="text-[3.2rem] leading-none font-semibold tracking-[-0.05em] tabular-nums sm:col-span-3 sm:text-[6.5rem]"
                    style={{ color: `${HOUSES[i % HOUSES.length].hex}38` }}
                  >
                    {pillar.n}
                  </span>
                  <h3 className="text-2xl font-medium tracking-[-0.03em] text-forest-deep sm:col-span-4 sm:text-3xl">
                    {pillar.title}
                  </h3>
                  <p className="max-w-md text-[0.95rem] leading-relaxed text-muted sm:col-span-5">
                    {pillar.body}
                  </p>
                </div>
              ))
            : METHOD_PILLARS.map((pillar, i) => (
                <PillarRow key={pillar.n} pillar={pillar} progress={scrollYProgress} index={i} />
              ))}
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-2 border-t border-forest/12 pt-6">
          {METHOD_SUPPORT.map((line) => (
            <p key={line} className="text-[0.8rem] text-muted">
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Method() {
  const reduced = usePrefersReducedMotion();
  const compact = useCompactLayout();
  if (!reduced && compact) return <MethodFilm />;
  return <MethodDocument reduced={reduced} />;
}
