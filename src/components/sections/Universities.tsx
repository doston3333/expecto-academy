import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { UNIVERSITY_INDEX } from "@/lib/content";
import { HOUSES, onHouseType } from "@/lib/houses";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

const KNOWN = new Set(["Full tuition", "100% merit", "Presidential", "Merit band"]);

function IndexRow({
  row,
  index,
  progress,
}: {
  row: (typeof UNIVERSITY_INDEX)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  const start = 0.03 + index * 0.05;
  const y = useTransform(progress, [start, start + 0.1], ["130%", "0%"], { clamp: true });
  const hairline = useTransform(progress, [start + 0.04, start + 0.12], [0, 1], { clamp: true });
  const known = KNOWN.has(row.band);
  const house = HOUSES[index % HOUSES.length];

  return (
    <div className="relative">
      <motion.span
        aria-hidden="true"
        style={{ scaleX: hairline }}
        className="absolute top-0 left-0 h-px w-full origin-left bg-forest/15"
      />
      <div className="-mx-2 grid grid-cols-12 items-baseline gap-2 rounded-xl px-2 py-4 transition-colors duration-200 hover:bg-cream-2/70 sm:py-5">
        <span
          className="col-span-2 text-[0.66rem] font-medium tracking-[0.12em] uppercase tabular-nums sm:col-span-1"
          style={{ color: house.ink }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="col-span-10 block overflow-hidden sm:col-span-6">
          <motion.span
            style={{ y }}
            className="block text-lg font-medium tracking-[-0.02em] text-forest-deep sm:text-2xl"
          >
            {row.school}
          </motion.span>
        </span>
        <span className="col-span-6 text-right text-[0.72rem] text-muted tabular-nums sm:col-span-2 sm:text-left">
          {row.threshold}
        </span>
        <span className="col-span-6 text-right sm:col-span-3">
          <span
            className={`inline-block rounded-full px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.06em] uppercase ${
              known ? "" : "border border-forest/15 text-moss"
            }`}
            style={
              known
                ? {
                    backgroundColor: house.hex,
                    color: onHouseType(house),
                  }
                : undefined
            }
          >
            {row.band}
          </span>
        </span>
      </div>
    </div>
  );
}

export function Universities() {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.6"],
  });

  return (
    <section ref={ref} aria-label="Universities and scholarships" className="py-16 sm:py-28" data-scene>
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4" data-reveal>
          <div>
            <p className="text-[0.7rem] font-medium tracking-[0.16em] text-moss uppercase">
              The scholarship index
            </p>
            <h2 className="mt-4 max-w-xl text-3xl leading-[1.05] font-medium tracking-[-0.03em] text-forest-deep sm:text-5xl">
              What a score is worth.
            </h2>
          </div>
          <p className="max-w-xs text-[0.85rem] leading-relaxed text-muted">
            Every university here publishes SAT thresholds for merit awards. After your final
            mocks, we map your score to a band and help you apply before the deadline.
          </p>
        </div>
        <div className="mt-12">
          {reduced
            ? UNIVERSITY_INDEX.map((row, i) => {
                const house = HOUSES[i % HOUSES.length];
                return (
                <div key={row.school} className="relative border-t border-forest/15">
                  <div className="-mx-2 grid grid-cols-12 items-baseline gap-2 rounded-xl px-2 py-4 transition-colors duration-200 hover:bg-cream-2/70 sm:py-5">
                    <span
                      className="col-span-2 text-[0.66rem] font-medium tracking-[0.12em] uppercase tabular-nums sm:col-span-1"
                      style={{ color: house.ink }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="col-span-10 text-lg font-medium tracking-[-0.02em] text-forest-deep sm:col-span-6 sm:text-2xl">
                      {row.school}
                    </span>
                    <span className="col-span-6 text-right text-[0.72rem] text-muted tabular-nums sm:col-span-2 sm:text-left">
                      {row.threshold}
                    </span>
                    <span className="col-span-6 text-right sm:col-span-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.06em] uppercase ${
                          KNOWN.has(row.band) ? "" : "border border-forest/15 text-moss"
                        }`}
                        style={
                          KNOWN.has(row.band)
                            ? {
                                backgroundColor: house.hex,
                                color: onHouseType(house),
                              }
                            : undefined
                        }
                      >
                        {row.band}
                      </span>
                    </span>
                  </div>
                </div>
                );
              })
            : UNIVERSITY_INDEX.map((row, i) => (
                <IndexRow key={row.school} row={row} index={i} progress={scrollYProgress} />
              ))}
          <div className="border-t border-forest/15" />
        </div>
        <p className="mt-6 text-[0.78rem] text-muted" data-reveal>
          Thresholds shift each admissions cycle — we verify this table with every cohort.
          340+ scholarships won at these institutions so far.
        </p>
      </div>
    </section>
  );
}
