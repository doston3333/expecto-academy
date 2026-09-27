import { UNIVERSITY_INDEX } from "@/lib/content";
import { cn } from "@/lib/cn";
import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import { EASE, Eyebrow, FadeUp, HOUSE, RevealLines } from "./ui/primitives";

const MIN = 1200;
const MAX = 1600;

const ROWS = UNIVERSITY_INDEX.map((u) => ({ ...u, min: Number.parseInt(u.threshold, 10) })).sort(
  (a, b) => b.min - a.min,
);

export function Worth() {
  const [score, setScore] = useState(1450);
  const inputId = useId();
  const unlocked = ROWS.filter((r) => score >= r.min).length;
  const fill = ((score - MIN) / (MAX - MIN)) * 100;
  const ticks = [1250, 1300, 1350, 1400, 1450, 1480];

  return (
    <section id="scholarships" aria-label="Universities and scholarships" className="bg-paper py-28 md:py-40">
      <div className="mx-auto grid max-w-[1320px] gap-14 px-5 md:grid-cols-12 md:gap-10 md:px-10">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-28">
            <Eyebrow color={HOUSE.hufflepuff.deep}>The scholarship index</Eyebrow>
            <RevealLines
              as="h2"
              className="display mt-6 text-[clamp(2.4rem,5vw,4.6rem)]"
              lines={["What a score", <em key="hi" className="text-gold">is worth.</em>]}
            />
            <FadeUp delay={0.15}>
              <p className="mt-6 max-w-md text-[1rem] leading-relaxed text-ink-soft">
                Every university here publishes SAT thresholds for merit awards. After your final mocks,
                we map your score to a band and help you apply before the deadline.
              </p>
            </FadeUp>

            <FadeUp delay={0.25} className="mt-12 rounded-[26px] border border-ink/10 bg-card p-6 md:p-8">
              <div className="flex items-end justify-between gap-4">
                <label htmlFor={inputId} className="text-[0.7rem] font-medium tracking-[0.18em] text-ink-soft uppercase">
                  Your score
                </label>
                <p className="text-[0.8rem] text-ink-soft">
                  <span className="font-medium text-ink tnum">{unlocked}</span> of {ROWS.length} unlocked
                </p>
              </div>
              <p className="display mt-3 text-[5.2rem] leading-none tnum md:text-[6.4rem]" aria-live="polite">
                {score}
              </p>
              <div className="relative mt-6">
                <div className="pointer-events-none absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-ink/10" />
                <div
                  className="pointer-events-none absolute top-1/2 left-0 h-[2px] -translate-y-1/2 rounded-full bg-gold"
                  style={{ width: `calc(0.875rem + (100% - 1.75rem) * ${fill / 100})` }}
                />
                {ticks.map((t) => (
                  <span
                    key={t}
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none absolute top-1/2 size-1.5 -translate-1/2 rounded-full transition-colors duration-300",
                      score >= t ? "bg-gold" : "bg-ink/20",
                    )}
                    style={{ left: `calc(0.875rem + (100% - 1.75rem) * ${(t - MIN) / (MAX - MIN)})` }}
                  />
                ))}
                <input
                  id={inputId}
                  type="range"
                  min={MIN}
                  max={MAX}
                  step={10}
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="score-range relative"
                />
              </div>
              <div className="mt-1 flex justify-between text-[0.7rem] text-ink-faint tnum">
                <span>{MIN}</span>
                <span className="hand text-[1.1rem] text-gold">drag me</span>
                <span>{MAX}</span>
              </div>
            </FadeUp>
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <ul className="divide-y divide-ink/10 border-y border-ink/10">
            {ROWS.map((row, i) => {
              const open = score >= row.min;
              return (
                <FadeUp as="li" key={row.school} delay={i * 0.04} y={14}>
                  <div className={cn("flex items-center gap-5 py-5 transition-opacity duration-500 md:py-6", open ? "opacity-100" : "opacity-40")}>
                    <span
                      className={cn(
                        "grid size-9 shrink-0 place-items-center rounded-full border transition-colors duration-500",
                        open ? "border-ink bg-ink text-paper" : "border-ink/20 text-ink-faint",
                      )}
                      aria-hidden="true"
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {open ? (
                          <motion.svg key="on" width="14" height="14" viewBox="0 0 16 16" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.35, ease: EASE }}>
                            <path d="M3 8.5 6.5 12 13 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </motion.svg>
                        ) : (
                          <motion.svg key="off" width="12" height="12" viewBox="0 0 16 16" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.35, ease: EASE }}>
                            <rect x="3.5" y="7" width="9" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" fill="none" stroke="currentColor" strokeWidth="1.5" />
                          </motion.svg>
                        )}
                      </AnimatePresence>
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-serif text-[1.2rem] font-light tracking-[-0.01em] md:text-[1.4rem]">{row.school}</p>
                      <p className="mt-0.5 text-[0.8rem] text-ink-soft">{row.band}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[0.95rem] font-medium tnum">{row.threshold}</p>
                      <p className={cn("mt-0.5 text-[0.72rem] tnum", open ? "text-gold" : "text-ink-faint")}>
                        {open ? "unlocked" : `+${row.min - score} to go`}
                      </p>
                    </div>
                  </div>
                </FadeUp>
              );
            })}
          </ul>
          <p className="mt-6 text-[0.8rem] leading-relaxed text-ink-faint">
            Thresholds shift each admissions cycle — we verify this table with every cohort. 340+
            scholarships won at these institutions so far.
          </p>
        </div>
      </div>
    </section>
  );
}
