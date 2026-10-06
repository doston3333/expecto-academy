import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { motion, useScroll, useTransform } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { INTRO_DELAY } from "./Intro";
import { Ocean } from "./ui/Ocean";
import { Button, DrawPath, EASE, EnrollButton, FadeUp, HouseGradient, HOUSES, RevealLines, Star, useSvgId } from "./ui/primitives";

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const d = reduced ? 0 : INTRO_DELAY;
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [horizon, setHorizon] = useState(0.7);
  const ribbonId = useSvgId("hero-ribbon");

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -140]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, reduced ? 1 : 0]);
  const seaY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 90]);
  const notesOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;
    const measure = () => {
      const fit = (content.offsetTop + content.offsetHeight + 36) / section.offsetHeight;
      setHorizon(Math.min(0.8, Math.max(0.66, fit)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(section);
    ro.observe(content);
    return () => ro.disconnect();
  }, []);

  const boatTop = (horizon + 0.42 * (1 - horizon)) * 100;

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-paper"
    >
      <motion.div className="absolute inset-0" style={{ y: seaY }}>
        <motion.div
          className="size-full"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, ease: EASE, delay: d + 0.2 }}
        >
          <Ocean mode="day" horizon={horizon} progress={scrollYProgress} sun boat birds />
        </motion.div>
      </motion.div>

      <motion.div
        ref={contentRef}
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto w-full max-w-[1320px] px-5 pt-28 md:px-10 md:pt-[max(8rem,15svh)]"
      >
        <FadeUp immediate delay={d} y={12}>
          <span className="inline-flex items-center gap-3 rounded-full border border-ink/10 bg-paper/60 py-1.5 pr-4 pl-3 text-[0.72rem] font-medium tracking-[0.14em] text-ink-soft uppercase backdrop-blur-sm">
            <span className="flex gap-1" aria-hidden="true">
              {HOUSES.map((h) => (
                <span key={h.id} className="size-2 rounded-full" style={{ backgroundColor: h.fill }} />
              ))}
            </span>
            Digital SAT · next cohort 8 Sep
          </span>
        </FadeUp>

        <h1 className="display mt-6 text-[clamp(2.9rem,8.2vw,8.6rem)] text-ink md:mt-8">
          <RevealLines
            immediate
            delay={d + 0.08}
            stagger={0.12}
            lines={[
              "Raise your SAT score.",
              <em key="hi" className="relative inline-block text-gold">
                Lower your tuition.
                <svg viewBox="0 0 400 24" preserveAspectRatio="none" className="boil absolute -bottom-[0.05em] left-0 h-[0.14em] w-full" aria-hidden="true">
                  <defs>
                    <HouseGradient id={ribbonId} />
                  </defs>
                  <DrawPath play delay={d + 1.1} duration={1.2} d="M4 14 C 90 6, 200 20, 396 9" stroke={`url(#${ribbonId})`} strokeWidth="6" />
                </svg>
              </em>,
            ]}
          />
        </h1>

        <div className="mt-7 flex flex-col gap-8 md:mt-10">
          <FadeUp immediate delay={d + 0.4} className="max-w-[31rem]">
            <p className="text-[1rem] leading-[1.65] text-ink-soft md:text-[1.075rem]">
              An English-language Digital SAT school for students across Uzbekistan — small evening
              classes, real mocks, and a target score we put in writing. The right number doesn't
              just get you in. <span className="text-ink">It gets you funded.</span>
            </p>
          </FadeUp>
          <FadeUp immediate delay={d + 0.52} className="flex flex-col items-start gap-3">
            <div className="flex w-full flex-wrap items-center gap-3">
              <EnrollButton source="hero" className="min-h-14 w-full px-7 text-[1.05rem] sm:w-auto" />
              <Button href="#film" variant="ghost" arrow={false} className="w-full sm:w-auto">
                See how it works
              </Button>
            </div>
            <p className="text-[0.82rem] text-ink-soft">
              Takes a minute · we’ll get back to you fast
            </p>
          </FadeUp>
        </div>
      </motion.div>

      <div className="min-h-[30svh] flex-1" aria-hidden="true" />

      {/* Margin notes on the drawing */}
      <motion.div
        aria-hidden="true"
        style={{ opacity: notesOpacity, top: `calc(${boatTop}% - 118px)` }}
        className="pointer-events-none absolute left-[calc(17%+34px)] z-10 hidden text-ink-soft md:block"
      >
        <span className="hand block -rotate-3 text-[1.45rem]">week 0 — you, here</span>
        <svg width="70" height="60" viewBox="0 0 70 60" className="boil -mt-1 ml-1 text-ink-soft">
          <DrawPath play delay={d + 1.3} duration={0.9} d="M40 4 C 30 18, 16 26, 10 50" stroke="currentColor" strokeWidth="1.4" />
          <DrawPath play delay={d + 2.1} duration={0.35} d="M4 40 L10 52 L20 43" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </motion.div>
      <motion.div
        aria-hidden="true"
        style={{ opacity: notesOpacity, top: `calc(${horizon * 100}% - 13.5rem)` }}
        className="pointer-events-none absolute right-[calc(30%-11rem)] z-10 hidden text-gold lg:block"
      >
        <span className="hand block rotate-2 text-[1.45rem]">a funded seat</span>
        <svg width="60" height="46" viewBox="0 0 60 46" className="boil -mt-1 -ml-6 text-gold">
          <DrawPath play delay={d + 1.6} duration={0.8} d="M30 4 C 22 14, 14 24, 8 40" stroke="currentColor" strokeWidth="1.4" />
          <DrawPath play delay={d + 2.3} duration={0.35} d="M2 30 L8 42 L17 33" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 mx-auto flex max-w-[1320px] items-end justify-between px-5 pb-6 md:px-10 md:pb-8">
        <FadeUp immediate delay={d + 0.9} y={8} className="flex items-center gap-3">
          <span className="relative block h-10 w-px overflow-hidden bg-ink/15">
            {reduced ? null : <span className="scroll-thread absolute inset-0 bg-ink" />}
          </span>
          <span className="text-[0.66rem] font-medium tracking-[0.22em] text-ink-soft uppercase">Scroll</span>
        </FadeUp>
        <FadeUp immediate delay={d + 1} y={8} className="flex items-center gap-3">
          <span className="flex gap-1.5" aria-hidden="true">
            {HOUSES.map((h) => (
              <Star key={h.id} size={13} style={{ color: h.fill }} />
            ))}
          </span>
          <span className="font-serif text-sm text-ink-soft italic">Per numerum, sedes.</span>
        </FadeUp>
      </div>
    </section>
  );
}
