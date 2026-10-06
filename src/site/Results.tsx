import { SCORE_REPORTS, TESTIMONIALS, type ScoreReport } from "@/lib/content";
import { cn } from "@/lib/cn";
import { DrawPath, EnrollButton, Eyebrow, FadeUp, house, HOUSE, RevealLines, Star } from "./ui/primitives";

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
/* Real score reports                                                  */
/* ------------------------------------------------------------------ */

const LOWEST = Math.min(...SCORE_REPORTS.map((r) => r.total));
const PERFECT_MATH = SCORE_REPORTS.filter((r) => r.math === 800).length;

function Section({ label, value }: { label: string; value: number }) {
  const perfect = value === 800;
  return (
    <div className="flex flex-col-reverse justify-end gap-0.5">
      <dt className="text-[0.7rem] leading-snug text-ink-soft">{label}</dt>
      <dd className={cn("inline-flex items-center gap-1 font-serif text-[1.1rem] tnum md:text-[1.2rem]", perfect && "text-gryffindor")}>
        {value}
        {perfect ? <Star size={10} className="text-gold" /> : null}
      </dd>
    </div>
  );
}

function ReportCard({ r, index }: { r: ScoreReport; index: number }) {
  const h = house(index);
  return (
    <FadeUp as="li" delay={(index % 5) * 0.06} y={16} className="h-full">
      <article className="relative flex h-full flex-col overflow-hidden rounded-[12px] border border-ink/10 bg-card p-4 shadow-[0_24px_40px_-32px_rgb(22_33_43/0.4)] md:p-5">
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: h.fill }} />
        <p className="text-[0.72rem] text-ink-soft">{r.date ? `Digital SAT · ${r.date}` : "Digital SAT"}</p>
        <p className="display mt-2 text-[2.6rem] leading-none tnum md:text-[3rem]">
          <span className="sr-only">Total </span>
          {r.total}
        </p>
        <dl className="mt-4 grid grid-cols-2 gap-2 border-t border-ink/10 pt-3">
          <Section label="Reading & Writing" value={r.rw} />
          <Section label="Math" value={r.math} />
        </dl>
        {r.note ? (
          <p className="hand mt-3 text-[1.05rem] leading-tight md:text-[1.15rem]" style={{ color: h.deep }}>
            {r.note}
          </p>
        ) : null}
      </article>
    </FadeUp>
  );
}

function Reports() {
  return (
    <div className="mt-28 md:mt-40">
      <div className="grid gap-6 md:grid-cols-12 md:items-end">
        <div className="md:col-span-6">
          <h3 className="display text-[clamp(2rem,3.6vw,3.2rem)]">Real score reports.</h3>
        </div>
        <FadeUp className="md:col-span-5 md:col-start-8">
          <p className="max-w-md text-[0.98rem] leading-relaxed text-ink-soft">
            {SCORE_REPORTS.length} official College Board results from our students, names removed. Every one is {LOWEST} or
            higher, and {PERFECT_MATH} are a perfect 800 in Math.
          </p>
        </FadeUp>
      </div>

      <ul className="mt-14 grid grid-cols-2 gap-3 md:mt-20 md:grid-cols-3 md:gap-4 lg:grid-cols-5">
        {SCORE_REPORTS.map((r, i) => (
          <ReportCard key={`${r.total}-${r.rw}-${r.math}`} r={r} index={i} />
        ))}
      </ul>

      <FadeUp className="mt-14 flex flex-col items-start gap-5 md:mt-20 md:flex-row md:items-center md:justify-between">
        <p className="font-serif text-[1.3rem] font-light text-ink-2 italic md:text-[1.5rem]">The next report here could be yours.</p>
        <EnrollButton source="results" />
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

        <Reports />
      </div>
    </section>
  );
}
