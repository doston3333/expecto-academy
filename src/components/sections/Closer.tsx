import { Candle } from "@/components/ui/Candle";
import { Logo } from "@/components/ui/Logo";
import { Embers } from "@/components/ui/Embers";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Stars } from "@/components/ui/Stars";
import { useCompactLayout } from "@/hooks/useMedia";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { EMAIL, NEXT_COHORT, TELEGRAM_URL } from "@/lib/content";
import { getHouse, HOUSES } from "@/lib/houses";
import { CREAM, SAGE } from "@/lib/palette";
import { motion, motionValue, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";

const STATIC_PROGRESS = motionValue(1);

/** Metal inks read on the night-hall background; Amberfell keeps its gold. */
function houseGlow(index: number): string {
  const house = HOUSES[index % HOUSES.length];
  return house.id === "amberfell" ? house.hex : house.metal;
}

/**
 * One letter of the closer headline. Enters scattered and house-lit,
 * converges to its place in cream as the hall scrolls in.
 */
function AssemblyLetter({
  char,
  index,
  total,
  finalColor,
  progress,
}: {
  char: string;
  index: number;
  total: number;
  finalColor: string;
  progress: MotionValue<number>;
}) {
  const start = 0.04 + (index / total) * 0.22;
  const end = start + 0.18;
  const y = useTransform(progress, [start, end], [46 - (index % 3) * 22, 0], { clamp: true });
  const rotate = useTransform(progress, [start, end], [(index % 2 === 0 ? -1 : 1) * (6 + (index % 4) * 3), 0], {
    clamp: true,
  });
  const color = useTransform(progress, [start + 0.06, start + 0.3], [houseGlow(index), finalColor], {
    clamp: true,
  });

  if (char === " ") return <span aria-hidden="true" className="inline-block w-[0.28em]" />;
  return (
    <motion.span aria-hidden="true" className="inline-block" style={{ y, rotate, color }}>
      {char}
    </motion.span>
  );
}

function AssemblyLine({
  text,
  finalColor,
  progress,
  className,
}: {
  text: string;
  finalColor: string;
  progress: MotionValue<number>;
  className?: string;
}) {
  const letters = text.split("");
  return (
    <span className={`block ${className ?? ""}`} role="text" aria-label={text}>
      {letters.map((char, i) => (
        <AssemblyLetter
          key={i}
          char={char}
          index={i}
          total={letters.length}
          finalColor={finalColor}
          progress={progress}
        />
      ))}
    </span>
  );
}

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  passed: boolean;
}

function computeCountdown(target: Date): Countdown {
  const diff = target.getTime() - Date.now();
  const abs = Math.max(0, diff);
  return {
    days: Math.floor(abs / 86_400_000),
    hours: Math.floor((abs / 3_600_000) % 24),
    minutes: Math.floor((abs / 60_000) % 60),
    seconds: Math.floor((abs / 1_000) % 60),
    passed: diff <= 0,
  };
}

function useCountdown(target: Date): Countdown {
  const [value, setValue] = useState<Countdown>(() => computeCountdown(target));

  useEffect(() => {
    const timer = window.setInterval(() => setValue(computeCountdown(target)), 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  return value;
}

function CountdownCell({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-3xl font-semibold tabular-nums sm:text-4xl" style={{ color }}>
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 text-[0.62rem] font-medium tracking-[0.16em] text-sage uppercase">
        {label}
      </span>
    </div>
  );
}

function CloserHeadline({ progress, compact }: { progress: MotionValue<number>; compact: boolean }) {
  const lineY = useTransform(progress, [0.06, 0.4], ["112%", "0%"], { clamp: true });
  const seatY = useTransform(progress, [0.18, 0.52], ["112%", "0%"], { clamp: true });
  const lineColor = useTransform(progress, [0.1, 0.48], [houseGlow(0), CREAM], { clamp: true });
  const seatColor = useTransform(progress, [0.22, 0.6], [houseGlow(2), SAGE], { clamp: true });

  if (compact) {
    return (
      <>
        <span className="block overflow-hidden">
          <motion.span style={{ y: lineY, color: lineColor }} className="block font-medium">
            Get Sorted.
          </motion.span>
        </span>
        <span className="block overflow-hidden">
          <motion.span style={{ y: seatY, color: seatColor }} className="block">
            Earn the seat.
          </motion.span>
        </span>
      </>
    );
  }

  return (
    <>
      <AssemblyLine text="Get Sorted." finalColor={CREAM} progress={progress} className="font-medium" />
      <AssemblyLine text="Earn the seat." finalColor={SAGE} progress={progress} />
    </>
  );
}

function CloserInner({
  progress,
  compact,
}: {
  progress: MotionValue<number> | null;
  compact?: boolean;
}) {
  const countdown = useCountdown(NEXT_COHORT);
  const scale = useTransform(progress ?? STATIC_PROGRESS, [0, 0.55], [0.97, 1], { clamp: true });
  const y = useTransform(progress ?? STATIC_PROGRESS, [0, 0.55], [36, 0], { clamp: true });

  return (
    <motion.div style={{ scale, y }} className="relative flex flex-col items-center text-center">
      <Logo className="mb-6 h-16 sm:h-20" />
      <div
        className="mb-6 h-1 w-28 overflow-hidden rounded-full bg-[linear-gradient(90deg,#8a6a28,#e8d08a,#c9a056)]"
        aria-hidden="true"
      />
      <p className="text-[0.7rem] font-medium tracking-[0.16em] text-sage uppercase">
        Next cohort · 8 September 2026
      </p>
          <h2 className="mt-6 text-[clamp(2.6rem,14vw,9.5rem)] leading-[1.02] tracking-[-0.045em] sm:text-[clamp(3.4rem,11vw,9.5rem)] sm:leading-[0.94]">
        {progress ? (
          <CloserHeadline progress={progress} compact={Boolean(compact)} />
        ) : (
          <>
            <span className="block font-medium text-cream">Get Sorted.</span>
            <span className="block text-sage">Earn the seat.</span>
          </>
        )}
      </h2>
      <div className="mt-8 flex items-start gap-5 sm:mt-10 sm:gap-10" aria-live="off">
        {countdown.passed ? (
          <p className="text-lg font-medium text-cream">
            This cohort has started — message us about the next one.
          </p>
        ) : (
          <>
            <CountdownCell value={countdown.days} label="days" color={houseGlow(0)} />
            <CountdownCell value={countdown.hours} label="hours" color={houseGlow(1)} />
            <CountdownCell value={countdown.minutes} label="minutes" color={houseGlow(2)} />
            <CountdownCell value={countdown.seconds} label="seconds" color={houseGlow(3)} />
          </>
        )}
      </div>
      <div className="mt-10 flex flex-col items-center gap-4">
        <MagneticButton href={TELEGRAM_URL} external variant="invert" className="h-12 w-full min-w-0 px-7 text-base sm:w-auto">
          Enroll on Telegram
        </MagneticButton>
        <a
          href={`mailto:${EMAIL}`}
          className="inline-flex min-h-11 items-center text-[0.82rem] text-cream/60 underline decoration-cream/25 underline-offset-4 hover:text-cream"
        >
          {EMAIL}
        </a>
      </div>
    </motion.div>
  );
}

function HallAtmosphere({ compact }: { compact?: boolean }) {
  return (
    <>
      <Stars count={compact ? 10 : undefined} />
      <Embers color={getHouse("aurelion").metal} opacity={0.5} count={compact ? 4 : 7} />
      <Candle className="absolute top-[16%] left-[7%] hidden lg:block" height={112} delay={0} />
      <Candle className="absolute top-[30%] right-[8%] hidden lg:block" height={84} delay={1.8} />
      <Candle className="absolute bottom-[20%] left-[13%] hidden lg:block" height={68} delay={3.1} />
      <Candle className="absolute top-[10%] right-[24%] hidden xl:block" height={58} delay={4.4} />
      <Candle className="absolute right-[18%] bottom-[28%] hidden xl:block" height={74} delay={2.5} />
    </>
  );
}

export function Closer() {
  const reduced = usePrefersReducedMotion();
  const compact = useCompactLayout();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });

  if (reduced) {
    return (
      <section
        id="enroll"
        aria-label="Enroll"
        className="relative overflow-hidden border-t border-cream/10 bg-hall py-24 text-cream sm:py-32"
      >
        <HallAtmosphere compact={compact} />
        <div className="relative mx-auto max-w-[1240px] px-5 md:px-8">
          <CloserInner progress={null} compact={compact} />
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      id="enroll"
      aria-label="Enroll"
      className="relative h-[150svh] border-t border-cream/10 bg-hall text-cream md:h-[190svh]"
    >
      <div className="cinema-stage sticky top-0 flex min-h-svh items-center overflow-hidden">
        <HallAtmosphere compact={compact} />
        <div className="relative mx-auto w-full max-w-[1240px] px-5 md:px-8">
          <CloserInner progress={scrollYProgress} compact={compact} />
        </div>
      </div>
    </section>
  );
}
