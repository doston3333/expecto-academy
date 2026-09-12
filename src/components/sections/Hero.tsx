import { MagneticButton } from "@/components/ui/MagneticButton";
import { Logo } from "@/components/ui/Logo";
import { Candle } from "@/components/ui/Candle";
import { Embers } from "@/components/ui/Embers";
import { OwlPost } from "@/components/ui/OwlPost";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { HERO_PLATES, PROOF, TELEGRAM_URL } from "@/lib/content";
import { getHouse, HOUSES } from "@/lib/houses";
import { FOREST } from "@/lib/palette";
import { easeSpace } from "@/lib/motion";
import { motion, useInView, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Check, Sparkles } from "lucide-react";

function MaskedLine({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  return (
    <span className={`block overflow-hidden ${className ?? ""}`}>
      <motion.span
        className="block"
        initial={reduced ? false : { y: "112%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, ease: easeSpace, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

const PLATE_POSE = [
  { left: "0%", top: "16%", rotate: -9, z: 1 },
  { left: "17%", top: "2%", rotate: -3, z: 2 },
  { left: "36%", top: "20%", rotate: 4, z: 3 },
  { left: "54%", top: "7%", rotate: 10, z: 4 },
] as const;

function Plate({
  plate,
  pose,
  progress,
  index,
}: {
  plate: (typeof HERO_PLATES)[number];
  pose: (typeof PLATE_POSE)[number];
  progress: MotionValue<number>;
  index: number;
}) {
  const house = getHouse(plate.houseId);
  const reduced = usePrefersReducedMotion();
  const dir = index < 2 ? -1 : 1;
  const y = useTransform(progress, [0, 1], [0, reduced ? 0 : -(26 + index * 22)]);
  const x = useTransform(progress, [0, 1], [0, reduced ? 0 : dir * (10 + index * 9)]);
  const rotate = useTransform(progress, [0, 1], [pose.rotate, reduced ? pose.rotate : pose.rotate * 1.8]);

  return (
    <motion.div
      className="window-lift absolute w-40 rounded-2xl border border-forest/12 bg-cream sm:w-48 lg:w-56"
      style={{
        left: pose.left,
        top: pose.top,
        zIndex: pose.z,
        x,
        y,
        rotate,
        transformOrigin: "50% 120%",
      }}
      initial={reduced ? false : { opacity: 0, y: 60, rotate: pose.rotate - 6 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: easeSpace, delay: 0.35 + index * 0.1 }}
    >
      <div className="plate-breathe" style={{ animationDelay: `${index * -1.9}s` }}>
        <div className="h-1.5 rounded-t-2xl" style={{ backgroundColor: house.hex }} />
      <div className="relative px-3.5 py-3 sm:px-4 sm:py-3.5">
        {index === HERO_PLATES.length - 1 ? (
          <span
            aria-hidden="true"
            className="absolute -top-2.5 right-4 grid size-6 rotate-[-8deg] place-items-center rounded-full text-[0.7rem] text-[#e8d08a] sm:size-7 sm:text-[0.8rem]"
            style={{ backgroundColor: "#1a2430", boxShadow: "0 1px 3px rgb(12 36 28 / 0.3)" }}
          >
            ✦
          </span>
        ) : null}
        <div className="flex items-center justify-between">
          <p className="text-[0.6rem] font-medium tracking-[0.14em] text-moss uppercase sm:text-[0.62rem]">
            Expecto · Score report
          </p>
          <span className="size-1.5 rounded-full" style={{ backgroundColor: house.metal }} />
        </div>
        <p
          className="mt-2 text-[2rem] leading-none font-semibold tracking-[-0.04em] tabular-nums sm:text-[2.5rem]"
          style={{ color: house.ink }}
        >
          {plate.score}
        </p>
        <p className="mt-1 text-[0.66rem] font-medium text-forest-deep sm:text-[0.7rem]">
          {plate.school} · {plate.award}
        </p>
        <div className="mt-2.5 space-y-1" aria-hidden="true">
          <div className="h-[3px] w-full rounded-full bg-forest/8" />
          <div className="h-[3px] w-4/5 rounded-full bg-forest/8" />
          <div className="h-[3px] w-3/5 rounded-full bg-forest/8" />
        </div>
      </div>
      </div>
    </motion.div>
  );
}

function WindowPeek({ progress }: { progress: MotionValue<number> }) {
  const reduced = usePrefersReducedMotion();
  const y = useTransform(progress, [0, 0.9], ["0%", reduced ? "0%" : "-46%"]);
  return (
    <motion.div aria-hidden="true" style={{ y }} className="relative z-10 mx-auto w-full max-w-[880px] px-5 md:px-8">
      <motion.div
        className="window-lift overflow-hidden rounded-t-[20px] border border-b-0 border-forest/12 bg-cream sm:rounded-t-[24px]"
        initial={reduced ? false : { y: 90 }}
        animate={{ y: 0 }}
        transition={{ duration: 1.1, ease: easeSpace, delay: 0.7 }}
      >
        <div className="flex h-10 items-center gap-3 border-b border-forest/10 bg-cream-2/60 px-4 sm:h-11">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: HOUSES[0].hex }} />
            <span className="size-2.5 rounded-full" style={{ backgroundColor: HOUSES[3].hex }} />
            <span className="size-2.5 rounded-full" style={{ backgroundColor: HOUSES[1].hex }} />
          </div>
          <p className="flex-1 text-center text-[0.68rem] font-medium tracking-[0.03em] text-moss sm:text-[0.72rem]">
            Bluebook · Practice Exam 1
          </p>
          <span className="hidden text-[0.62rem] font-medium tracking-[0.14em] text-forest/35 uppercase sm:block">
            Expecto
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2.5 sm:justify-between sm:gap-3 sm:px-5">
          <span className="min-w-0 truncate text-[0.58rem] font-medium tracking-[0.08em] text-moss uppercase sm:text-[0.66rem]">
            <span className="sm:hidden">Section 1 · RW</span>
            <span className="hidden sm:inline">Section 1 · Reading and Writing</span>
          </span>
          <span className="shrink-0 rounded-full border border-forest/15 bg-cream-2/70 px-2.5 py-0.5 text-[0.62rem] font-semibold text-forest-deep tabular-nums">
            24:16
          </span>
          <span className="min-w-0 truncate text-right text-[0.58rem] font-medium tracking-[0.08em] text-moss uppercase sm:text-[0.66rem]">
            <span className="sm:hidden">Mod 1 / 2</span>
            <span className="hidden sm:inline">Module 1 of 2</span>
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CompactPlate({
  plate,
  pose,
  progress,
  index,
}: {
  plate: (typeof HERO_PLATES)[number];
  pose: { left: string; top: string; rotate: number; z: number };
  progress: MotionValue<number>;
  index: number;
}) {
  const house = getHouse(plate.houseId);
  const reduced = usePrefersReducedMotion();
  const dir = index === 0 ? 1 : -1;
  const y = useTransform(progress, [0, 1], [0, reduced ? 0 : -(18 + index * 22)]);
  const x = useTransform(progress, [0, 1], [0, reduced ? 0 : dir * (8 + index * 6)]);
  const rotate = useTransform(
    progress,
    [0, 1],
    [pose.rotate, reduced ? pose.rotate : pose.rotate * 1.85],
  );

  return (
    <motion.div
      className="window-lift absolute w-[11.75rem] rounded-2xl border border-forest/12 bg-cream"
      style={{
        left: pose.left,
        top: pose.top,
        zIndex: pose.z,
        x,
        y,
        rotate,
        transformOrigin: "50% 120%",
      }}
      initial={reduced ? false : { opacity: 0, y: 48, rotate: pose.rotate - 8 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, ease: easeSpace, delay: 0.32 + index * 0.1 }}
    >
      <div className="h-1.5 rounded-t-2xl" style={{ backgroundColor: house.hex }} />
      <div className="px-3.5 py-3">
        <p className="text-[0.58rem] font-medium tracking-[0.14em] text-moss uppercase">
          Expecto · Score report
        </p>
        <p
          className="mt-1.5 text-[1.85rem] leading-none font-semibold tracking-[-0.04em] tabular-nums"
          style={{ color: house.ink }}
        >
          {plate.score}
        </p>
        <p className="mt-1 text-[0.62rem] font-medium text-forest-deep">
          {plate.school} · {plate.award}
        </p>
      </div>
    </motion.div>
  );
}

const VIGNETTE_PROMPT = "I need a 1450 by December — Math is the wall.";

/**
 * A tiny request card writing itself among the score plates — the
 * student's ask, answered by the pact line underneath.
 */
function HeroVignette() {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-12% 0px -12% 0px" });
  const [chars, setChars] = useState(reduced ? VIGNETTE_PROMPT.length : 0);
  const [answered, setAnswered] = useState(reduced);

  useEffect(() => {
    if (reduced || !inView) return;
    if (chars < VIGNETTE_PROMPT.length) {
      const id = window.setTimeout(() => setChars((c) => c + 1), chars === 0 ? 500 : 26);
      return () => window.clearTimeout(id);
    }
    if (!answered) {
      const id = window.setTimeout(() => setAnswered(true), 650);
      return () => window.clearTimeout(id);
    }
  }, [inView, chars, answered, reduced]);

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      className="xc-vignette"
      data-phase={answered ? "ready" : "typing"}
      initial={reduced ? false : { opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: easeSpace, delay: 0.95 }}
    >
      <div className="xc-vignette-head">
        <span>Request · A. Karimova</span>
        <Sparkles className="size-3" />
      </div>
      <p className="xc-vignette-body">
        {VIGNETTE_PROMPT.slice(0, chars)}
        <span className="xc-vignette-caret" />
      </p>
      <div className="xc-vignette-foot">
        <span className="xc-vignette-reply">
          <Check className="size-3" />
          Pact: +230 or 4 weeks free
        </span>
        <span>2m</span>
      </div>
    </motion.div>
  );
}

function CompactReports({ progress }: { progress: MotionValue<number> }) {
  const poses = [
    { left: "22%", top: "4%", rotate: 5, z: 3 },
    { left: "12%", top: "14%", rotate: -2, z: 2 },
    { left: "4%", top: "26%", rotate: -7, z: 1 },
  ] as const;

  return (
    <div className="relative z-0 mx-auto h-[17rem] w-full max-w-[19rem] overflow-hidden md:hidden">
      {HERO_PLATES.slice(0, 3).map((plate, i) => (
        <CompactPlate key={plate.school} plate={plate} pose={poses[i]} progress={progress} index={i} />
      ))}
    </div>
  );
}

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const platesY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, { stiffness: 55, damping: 14, mass: 0.6 });
  const rotateY = useSpring(tiltY, { stiffness: 55, damping: 14, mass: 0.6 });

  return (
    <section
      ref={ref}
      id="top"
      data-scene
      className="relative flex flex-col overflow-x-clip pt-[env(safe-area-inset-top)] md:min-h-svh md:overflow-clip"
      onMouseMove={(event) => {
        if (reduced) return;
        const rect = event.currentTarget.getBoundingClientRect();
        tiltY.set(((event.clientX - rect.left) / rect.width - 0.5) * 7);
        tiltX.set(-((event.clientY - rect.top) / rect.height - 0.5) * 5);
      }}
      onMouseLeave={() => {
        tiltX.set(0);
        tiltY.set(0);
      }}
    >
      <Embers color={FOREST} opacity={0.22} count={7} className="hidden md:block" />
      <Candle className="absolute top-[24%] left-[2.5%] hidden xl:block" height={96} delay={1.2} />
      <Candle className="absolute top-[58%] right-[2.5%] hidden xl:block" height={72} delay={3.4} />
      {reduced ? null : (
        <div className="pointer-events-none absolute bottom-24 left-5 z-10 flex items-center gap-2.5 md:bottom-28 md:left-8">
          <span className="text-[0.62rem] font-medium tracking-[0.18em] text-moss uppercase">
            Scroll
          </span>
          <span className="relative h-8 w-px overflow-hidden bg-forest/15">
            <span
              className="absolute inset-x-0 top-0 h-3 bg-forest"
              style={{ animation: "scroll-cue 1.8s cubic-bezier(0.16, 1, 0.3, 1) infinite" }}
            />
          </span>
        </div>
      )}
      <div className="mx-auto grid w-full max-w-[1240px] flex-1 items-center gap-10 px-5 pt-24 pb-10 sm:gap-12 md:grid-cols-12 md:pt-36 md:pb-16">
        <div className="relative z-10 md:col-span-7">
          <MaskedLine delay={0.0}>
            <Logo className="h-16 sm:h-20" />
          </MaskedLine>
          <MaskedLine delay={0.02}>
            <span className="font-display text-sm italic tracking-[0.1em] text-moss">
              <span aria-hidden="true" className="text-aurelion">✦</span> Per numerum, sedes.{" "}
              <span aria-hidden="true" className="text-noctis">✦</span>
            </span>
          </MaskedLine>
          <MaskedLine delay={0.05}>
            <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-forest/12 bg-cream-2/60 px-3.5 py-1.5 text-xs font-medium tracking-[0.1em] text-moss uppercase">
              <OwlPost className="size-4" />
              Digital SAT · next cohort 8 Sep
            </span>
          </MaskedLine>
          <h1 className="mt-7 text-[clamp(2.35rem,11vw,6.4rem)] leading-[1.02] tracking-[-0.04em] sm:mt-7 sm:text-[clamp(2.7rem,8.2vw,6.4rem)] sm:leading-[0.98]">
            <MaskedLine delay={0.14}>
              <span className="font-medium text-forest-deep">Raise your SAT score.</span>
            </MaskedLine>
            <MaskedLine delay={0.24}>
              <span className="text-moss">Lower your tuition.</span>
            </MaskedLine>
          </h1>
          <MaskedLine delay={0.36} className="mt-6 max-w-lg">
            <span className="text-[1.02rem] leading-[1.55] text-muted sm:text-lg">
              An English-language Digital SAT school for students across Uzbekistan — small
              evening classes, real mocks, and a target score we put in writing. The right
              number doesn't just get you in. It gets you funded.
            </span>
          </MaskedLine>
          <MaskedLine delay={0.46} className="mt-8">
            <span className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <MagneticButton href={TELEGRAM_URL} external className="w-full min-w-0 sm:w-auto">
                Get Sorted
              </MagneticButton>
              <MagneticButton href="#film" variant="ghost" className="w-full min-w-0 sm:w-auto">
                See how it works
              </MagneticButton>
            </span>
          </MaskedLine>
          <MaskedLine delay={0.56} className="mt-8">
            <span className="flex items-center gap-3">
              <span
                className="h-1 w-24 overflow-hidden rounded-full bg-[linear-gradient(90deg,#8a6a28,#e8d08a,#c9a056)]"
                aria-hidden="true"
              />
              <span className="text-xs font-medium tracking-[0.08em] text-moss uppercase">
                {PROOF}
              </span>
            </span>
          </MaskedLine>
        </div>
        <CompactReports progress={scrollYProgress} />
        <motion.div
          style={{ y: platesY, rotateX, rotateY, transformPerspective: 1000 }}
          className="relative z-0 hidden h-[220px] sm:h-[340px] md:col-span-5 md:block md:h-[440px]"
        >
          <div aria-hidden="true" className="absolute -inset-8 grid grid-cols-2 grid-rows-2 sm:-inset-12">
            {HOUSES.map((house) => (
              <span
                key={house.id}
                className="m-auto size-36 rounded-full blur-3xl sm:size-52"
                style={{ backgroundColor: house.hex, opacity: 0.17 }}
              />
            ))}
          </div>
          {HERO_PLATES.map((plate, i) => (
            <Plate key={plate.school} plate={plate} pose={PLATE_POSE[i]} progress={scrollYProgress} index={i} />
          ))}
          <HeroVignette />
        </motion.div>
      </div>
      <WindowPeek progress={scrollYProgress} />
    </section>
  );
}
