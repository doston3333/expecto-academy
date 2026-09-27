import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { FAME_END, FAME_LEFT, FAME_RIGHT, TELEGRAM_URL, TESTIMONIALS, type FameReport } from "@/lib/content";
import { cn } from "@/lib/cn";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Button, DrawPath, EASE, Eyebrow, FadeUp, house, HOUSE, RevealLines, Star } from "./ui/primitives";

type Testimonial = (typeof TESTIMONIALS)[number];

/* ------------------------------------------------------------------ */
/* Letters home                                                        */
/* ------------------------------------------------------------------ */

const TILT = ["md:-rotate-[1.4deg]", "md:rotate-[1.1deg] md:mt-16", "md:rotate-[0.8deg] md:-mt-6", "md:-rotate-[1deg] md:mt-10"];

function Seal({ index }: { index: number }) {
  const h = house(index);
  return (
    <span
      aria-hidden="true"
      className="absolute -top-5 right-7 grid size-12 place-items-center rounded-full shadow-[inset_0_-3px_8px_rgb(0_0_0/0.3),0_6px_14px_-4px_rgb(0_0_0/0.35)] md:size-14"
      style={{ background: `radial-gradient(circle at 35% 30%, ${h.bright}, ${h.deep} 72%)` }}
    >
      <Star className="text-gold-3/90" size={16} />
    </span>
  );
}

function Letter({ t, index }: { t: Testimonial; index: number }) {
  const h = house(index);
  return (
    <FadeUp delay={(index % 2) * 0.12} className={cn("relative", TILT[index % TILT.length])}>
      <article className="relative rounded-[4px] bg-card px-6 pt-9 pb-7 shadow-[0_40px_70px_-40px_rgb(22_33_43/0.45),0_1px_0_rgb(22_33_43/0.06)] md:px-10 md:pt-12 md:pb-9">
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 rounded-t-[4px]" style={{ backgroundColor: h.fill }} />
        <Seal index={index} />

        <p className="font-serif text-[0.95rem] text-ink-soft italic">From {t.city}</p>
        <blockquote className="mt-5 font-serif text-[1.3rem] leading-[1.4] font-light text-ink-2 italic md:text-[1.5rem]">
          “{t.quote}”
        </blockquote>
        <p className="hand mt-5 text-[1.9rem] leading-none text-ink">{t.name}</p>

        <div className="mt-8 flex items-end gap-4 border-t border-ink/10 pt-6">
          <span className="relative pb-1.5 font-serif text-[1.35rem] font-light text-ink-faint tnum">
            {t.before}
            <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="boil absolute inset-x-[-8%] top-[18%] h-[60%] w-[116%] text-ink-soft" aria-hidden="true">
              <DrawPath d="M2 13 C 30 9, 68 14, 98 6" stroke="currentColor" strokeWidth="2" duration={0.6} delay={0.4} />
            </svg>
          </span>
          <span className="display text-[3.2rem] leading-[0.85] tnum md:text-[3.8rem]">{t.after}</span>
          <span className="relative ml-auto px-3 py-1" style={{ color: h.deep }}>
            <span className="hand text-[1.6rem] leading-none">+{t.after - t.before}</span>
            <svg viewBox="0 0 120 60" preserveAspectRatio="none" className="boil pointer-events-none absolute -inset-x-2 -inset-y-2 h-[calc(100%+1rem)] w-[calc(100%+1rem)]" aria-hidden="true">
              <DrawPath
                d="M64 5 C 102 4, 117 19, 114 33 C 110 50, 72 57, 42 54 C 14 51, 3 38, 7 24 C 11 11, 36 4, 70 7"
                stroke="currentColor"
                strokeWidth="2"
                duration={0.9}
                delay={0.8}
              />
            </svg>
          </span>
        </div>
        <p className="mt-3 text-[0.86rem] text-ink-soft">
          {t.school}, {t.award.toLowerCase()}
        </p>
      </article>
    </FadeUp>
  );
}

/* ------------------------------------------------------------------ */
/* The register — every report, stacked by score                       */
/* ------------------------------------------------------------------ */

const BANDS = [1300, 1350, 1400, 1450, 1500, 1550] as const;
const REPORTS: FameReport[] = [...FAME_LEFT, ...FAME_RIGHT, FAME_END];
const COLUMNS = BANDS.map((min, i) => {
  const max = BANDS[i + 1] ?? Number.POSITIVE_INFINITY;
  return { min, reports: REPORTS.filter((r) => r.score >= min && r.score < max).sort((a, b) => a.score - b.score) };
});
const TALLEST = COLUMNS.reduce((best, c, i) => (c.reports.length > COLUMNS[best].reports.length ? i : best), 0);

function Slip({ r, top, delay, play }: { r: FameReport; top: boolean; delay: number; play: boolean }) {
  const reduced = usePrefersReducedMotion();
  return (
    <motion.li
      initial={reduced ? false : { opacity: 0, y: -14 }}
      animate={play ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, ease: EASE, delay }}
      className={cn(
        "flex items-center justify-center gap-2 rounded-[3px] border px-1.5 py-1.5 md:justify-between md:px-3 md:py-2",
        top ? "border-gold/50 bg-gold-3" : "border-ink/10 bg-card",
      )}
    >
      <span className="font-serif text-[0.8rem] tnum md:text-[1rem]">{r.score}</span>
      <span className="hidden truncate text-[0.74rem] text-ink-soft md:inline">
        {top ? (
          <span className="inline-flex items-center gap-1.5">
            <Star size={9} className="text-gold" />
            {r.name}
          </span>
        ) : (
          r.name
        )}
      </span>
    </motion.li>
  );
}

function Register() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduced = usePrefersReducedMotion();
  const play = reduced || inView;

  return (
    <div className="mt-28 md:mt-40">
      <div className="grid gap-6 md:grid-cols-12 md:items-end">
        <div className="md:col-span-6">
          <h3 className="display text-[clamp(2rem,3.6vw,3.2rem)]">Every report from last cohort.</h3>
        </div>
        <FadeUp className="md:col-span-5 md:col-start-8">
          <p className="max-w-md text-[0.98rem] leading-relaxed text-ink-soft">
            All {REPORTS.length} Digital SAT results, stacked by score. The highest is {FAME_END.name}’s {FAME_END.score}.
          </p>
        </FadeUp>
      </div>

      <div ref={ref} className="mt-14 md:mt-20">
        <div className="flex items-end gap-1.5 md:gap-4">
          {COLUMNS.map((col, c) => (
            <div key={col.min} className="flex min-w-0 flex-1 flex-col">
              {c === TALLEST ? (
                <motion.p
                  aria-hidden="true"
                  initial={reduced ? false : { opacity: 0 }}
                  animate={play ? { opacity: 1 } : undefined}
                  transition={{ duration: 0.6, ease: EASE, delay: 1.2 }}
                  className="mb-1.5 rounded-[3px] border border-dashed border-ink/30 py-1 text-center md:py-1.5"
                >
                  <span className="hand text-[1rem] leading-none text-gryffindor md:text-[1.3rem]">yours?</span>
                </motion.p>
              ) : null}
              <ul aria-label={`Scores from ${col.min}`} className="flex flex-col-reverse gap-1.5">
                {col.reports.map((r, i) => (
                  <Slip key={r.name} r={r} top={r === FAME_END} play={play} delay={c * 0.07 + i * 0.06} />
                ))}
              </ul>
            </div>
          ))}
        </div>
        <svg viewBox="0 0 1000 12" preserveAspectRatio="none" className="boil mt-3 h-3 w-full text-ink" aria-hidden="true">
          <DrawPath d="M2 7 C 250 3, 500 10, 998 5" stroke="currentColor" strokeWidth="1.6" play={play} duration={1.1} />
        </svg>
        <div className="mt-2 flex gap-1.5 md:gap-4" aria-hidden="true">
          {COLUMNS.map((col, c) => (
            <p key={col.min} className="flex-1 text-center text-[0.68rem] text-ink-soft tnum md:text-[0.78rem]">
              {c === COLUMNS.length - 1 ? col.min : `${col.min}+`}
            </p>
          ))}
        </div>
      </div>

      <FadeUp className="mt-14 flex flex-col items-start gap-5 md:mt-20 md:flex-row md:items-center md:justify-between">
        <p className="font-serif text-[1.3rem] font-light text-ink-2 italic md:text-[1.5rem]">The next report on this pile could be yours.</p>
        <Button href={TELEGRAM_URL} external>
          Get Sorted
        </Button>
      </FadeUp>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function Results() {
  return (
    <section id="stories" aria-label="Results" className="bg-hufflepuff-wash py-28 md:py-40">
      <div className="mx-auto max-w-[1320px] px-5 md:px-10">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Eyebrow color={HOUSE.hufflepuff.deep}>Letters home</Eyebrow>
            <RevealLines
              as="h2"
              className="display mt-6 text-[clamp(2.6rem,6vw,5.6rem)]"
              lines={["Proof,", <em key="hi" className="text-gold">on paper.</em>]}
            />
          </div>
          <FadeUp className="md:col-span-4 md:col-start-9" delay={0.15}>
            <p className="max-w-sm text-[1rem] leading-relaxed text-ink-soft">
              Four graduates wrote back after results day. Four funded seats between them.
            </p>
          </FadeUp>
        </div>

        <div className="mt-20 grid gap-12 md:mt-28 md:grid-cols-2 md:gap-x-12 md:gap-y-16 lg:gap-x-20">
          {TESTIMONIALS.map((t, i) => (
            <Letter key={t.name} t={t} index={i} />
          ))}
        </div>

        <Register />
      </div>
    </section>
  );
}
