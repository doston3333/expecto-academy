import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { OATH_RIDER, OATH_TERMS } from "@/lib/content";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { DrawPath, Eyebrow, FadeUp, HouseRibbon, RevealLines, Star } from "./ui/primitives";

const SIGNATURE =
  "M8 36 C 30 8, 44 6, 50 24 C 54 36, 40 44, 52 40 C 70 34, 78 12, 92 18 C 104 23, 96 40, 110 36 C 128 30, 138 14, 152 20 C 162 24, 158 38, 172 34 C 188 29, 198 22, 212 26";

function Seal() {
  const text = "Expecto Academy · Score pact · In writing · ";
  return (
    <div className="relative size-28 md:size-32" aria-hidden="true">
      <svg viewBox="0 0 120 120" className="spin-slow absolute inset-0 size-full text-gold">
        <defs>
          <path id="seal-ring" d="M60 60 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0" />
        </defs>
        <text fontSize="7.6" letterSpacing="1.5" fill="currentColor" className="font-sans uppercase">
          <textPath href="#seal-ring">{text}</textPath>
        </text>
      </svg>
      <div className="absolute inset-[26%] grid place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#c9483c,#7a1a12_72%)] shadow-[inset_0_-4px_10px_rgb(0_0_0/0.3),0_8px_18px_-6px_rgb(0_0_0/0.45)]">
        <Star className="text-gold-3/85" size={22} />
      </div>
    </div>
  );
}

export function Pact() {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const rotate = useTransform(scrollYProgress, [0, 1], reduced ? [-1.2, -1.2] : [5, -1.2]);
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [140, 0]);

  return (
    <section id="oath" aria-label="The score pact" data-theme="dark" className="relative overflow-hidden bg-gryffindor-night py-28 text-paper md:py-44">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/2 size-[70rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(212_169_94/0.2),transparent_60%)]"
      />
      <div className="relative mx-auto grid max-w-[1320px] gap-16 px-5 md:grid-cols-12 md:items-center md:gap-10 md:px-10">
        <div className="md:col-span-5">
          <Eyebrow className="text-gold-2">The score pact</Eyebrow>
          <RevealLines
            as="h2"
            className="display mt-6 text-[clamp(2.5rem,4.4vw,4.4rem)]"
            lines={["A promise with", <em key="hi" className="text-gold-2">a signature on it.</em>]}
          />
          <FadeUp delay={0.2}>
            <p className="mt-8 max-w-md font-serif text-[1.3rem] leading-[1.45] font-light text-paper/80 italic md:text-[1.45rem]">
              {OATH_RIDER}
            </p>
          </FadeUp>
        </div>

        <div ref={ref} className="md:col-span-6 md:col-start-7">
          <motion.article
            style={{ rotate, y }}
            className="relative rounded-[6px] bg-paper p-7 text-ink shadow-[0_60px_120px_-40px_rgb(0_0_0/0.7),0_0_0_1px_rgb(0_0_0/0.05)] md:p-12"
          >
            <HouseRibbon className="absolute inset-x-0 top-0 h-1.5 rounded-t-[6px]" />
            <div className="absolute inset-3 rounded-[3px] border border-gold/30 md:inset-4" aria-hidden="true" />
            <div className="relative">
              <p className="text-center text-[0.64rem] font-medium tracking-[0.22em] text-ink-soft uppercase">
                Expecto Academy
              </p>
              <h3 className="mt-5 text-center font-serif text-[2.2rem] font-light tracking-[-0.03em] italic md:text-[2.8rem]">
                The score pact
              </h3>
              <div className="mx-auto mt-4 flex w-32 items-center gap-3 text-gold" aria-hidden="true">
                <span className="h-px flex-1 bg-current opacity-50" />
                <Star size={10} />
                <span className="h-px flex-1 bg-current opacity-50" />
              </div>
              <ol className="mt-8 space-y-6 md:mt-10">
                {OATH_TERMS.map((term, i) => (
                  <FadeUp as="li" key={term.n} delay={0.2 + i * 0.15} className="grid grid-cols-[2.5rem_1fr] gap-3">
                    <span className="font-serif text-[1.3rem] text-gold italic">{term.n}</span>
                    <span className="text-[1rem] leading-relaxed text-ink-2 md:text-[1.06rem]">{term.term}</span>
                  </FadeUp>
                ))}
              </ol>
              <div className="mt-10 flex items-end justify-between gap-4 border-t border-ink/10 pt-6">
                <div>
                  <svg viewBox="0 0 220 50" className="boil h-12 w-48 text-ink md:h-14 md:w-56" role="img" aria-label="Headmaster's signature">
                    <DrawPath d={SIGNATURE} stroke="currentColor" strokeWidth="2" duration={2.2} delay={0.7} />
                  </svg>
                  <p className="mt-1 text-[0.66rem] tracking-[0.16em] text-ink-soft uppercase">Sealed by the Headmaster · Tashkent</p>
                </div>
                <div className="-mr-2 -mb-2 md:-mr-6 md:-mb-6">
                  <Seal />
                </div>
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
