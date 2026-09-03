import { Candle } from "@/components/ui/Candle";
import { HouseScarf } from "@/components/ui/HouseScarf";
import { HouseSigil } from "@/components/ui/HouseSigil";
import { Embers } from "@/components/ui/Embers";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useCompactLayout } from "@/hooks/useMedia";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { TELEGRAM_URL } from "@/lib/content";
import { FOREST_DEEP } from "@/lib/palette";
import { HOUSES, onHouseType, type House } from "@/lib/houses";
import { FINAL_T, inMountWindow, useCoverY, useSceneTime, WIPE } from "@/lib/motion";
import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef, useState } from "react";

const COUNT = HOUSES.length;

function plateInk(house: House) {
  const onGold = house.onHouse === "forest";
  return {
    ink: onHouseType(house),
    sub: onGold
      ? `color-mix(in srgb, ${FOREST_DEEP} 62%, transparent)`
      : "color-mix(in srgb, white 74%, transparent)",
  };
}

function PlateContent({
  house,
  index,
  t,
  compact,
}: {
  house: House;
  index: number;
  t: MotionValue<number>;
  compact: boolean;
}) {
  const { ink, sub } = plateInk(house);
  const nameY = useTransform(t, [0.02, 0.3], ["112%", "0%"], { clamp: true });
  const lineY = useTransform(t, [0.08, 0.36], ["112%", "0%"], { clamp: true });
  const metaOpacity = useTransform(t, [0.3, 0.52], [0, 1], { clamp: true });
  const metaY = useTransform(t, [0.3, 0.52], [20, 0], { clamp: true });
  const sigilDraw = useTransform(t, [0.1, 0.68], [0, 1], { clamp: true });
  const sigilRotate = useTransform(t, [0.1, 0.68], [-6, 0], { clamp: true });

  return (
    <div
      className="absolute inset-0 flex flex-col"
      style={{ backgroundColor: house.hex, color: ink }}
    >
      {compact ? null : <Embers color={house.metal} opacity={0.5} count={6} />}
      <Candle className="absolute top-[15%] left-[5%] hidden lg:block" height={88} delay={0.6} />
      <Candle className="absolute bottom-[22%] left-[9%] hidden lg:block" height={62} delay={2.4} />
      <div className="relative mx-auto flex w-full max-w-[1240px] items-center justify-between px-5 pt-[calc(5.25rem+env(safe-area-inset-top))] md:px-8 md:pt-24">
        <p
          className="text-[0.7rem] font-medium tracking-[0.16em] uppercase"
          style={{ color: sub }}
        >
          The sorting
        </p>
        <p className="text-[0.72rem] tabular-nums" style={{ color: sub }}>
          0{index + 1} / 0{COUNT}
        </p>
      </div>

      <div className="mx-auto grid w-full max-w-[1240px] flex-1 items-center gap-6 px-5 md:grid-cols-12 md:gap-8 md:px-8">
        <div className="md:col-span-8">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-display text-base italic md:text-lg" style={{ color: sub }}>
                House of the {house.animal} · {house.trait}
              </p>
              <span className="mt-2 block overflow-hidden">
                <motion.h3
                  style={{ y: nameY }}
                  className="font-display text-[clamp(2.8rem,13vw,4.2rem)] leading-[0.95] italic tracking-[-0.02em] md:text-[clamp(4rem,12vw,9rem)]"
                >
                  {house.name}
                </motion.h3>
              </span>
            </div>
            {compact ? (
              <motion.span className="mt-3 shrink-0" style={{ rotate: sigilRotate, color: house.metal }}>
                <HouseSigil house={house.id} t={sigilDraw} className="size-[4.25rem]" />
              </motion.span>
            ) : null}
          </div>
          <span className="mt-3 block overflow-hidden md:mt-4">
            <motion.p
              style={{ y: lineY }}
              className="text-sm font-medium tracking-[0.12em] uppercase"
            >
              {house.track} · {house.duration}
            </motion.p>
          </span>
          <span className="mt-1.5 block overflow-hidden md:mt-2">
            <motion.p
              style={{ y: lineY, color: sub }}
              className="font-display text-lg italic"
            >
              {house.motto}
            </motion.p>
          </span>
          <motion.p
            style={{ opacity: metaOpacity, y: metaY }}
            className="mt-6 max-w-md text-[0.95rem] leading-relaxed line-clamp-4 md:line-clamp-none"
          >
            {house.description}
          </motion.p>
        </div>
        <div className="hidden md:col-span-4 md:flex md:justify-end">
          <motion.div style={{ rotate: sigilRotate, color: house.metal }}>
            <HouseSigil house={house.id} t={sigilDraw} className="size-56 xl:size-64" />
          </motion.div>
        </div>
      </div>

      <motion.div
        style={{ opacity: metaOpacity }}
        className="relative mx-auto flex w-full max-w-[1240px] flex-col gap-5 px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-4 md:px-8 md:pb-8"
      >
        <p className="max-w-sm text-[0.92rem] leading-relaxed md:text-sm" style={{ color: sub }}>
          {house.outcome}
        </p>
        <MagneticButton href={TELEGRAM_URL} external variant="invert" className="w-full min-w-0 md:w-auto">
          Sort me into {house.name}
        </MagneticButton>
      </motion.div>
      <HouseScarf house={house} className="relative h-2.5 w-full" />
    </div>
  );
}

function BasePlate({
  house,
  progress,
  compact,
}: {
  house: House;
  progress: MotionValue<number>;
  compact: boolean;
}) {
  const t = useSceneTime(progress, 0, COUNT);
  return (
    <div className="absolute inset-0" style={{ zIndex: 1 }}>
      <PlateContent house={house} index={0} t={t} compact={compact} />
    </div>
  );
}

function WipedPlate({
  house,
  index,
  progress,
  compact,
}: {
  house: House;
  index: number;
  progress: MotionValue<number>;
  compact: boolean;
}) {
  const t = useSceneTime(progress, index, COUNT);
  const start = index / COUNT;
  const end = start + WIPE / COUNT;
  const mid = start + (end - start) * 0.8;
  const topRight = useTransform(progress, [start, mid], [100, -6], { clamp: true });
  const topLeft = useTransform(progress, [start, end], [100, -12], { clamp: true });
  const clipPath = useMotionTemplate`polygon(0% ${topLeft}%, 100% ${topRight}%, 100% 100%, 0% 100%)`;
  const y = useCoverY(progress, index, COUNT);

  return (
    <motion.div
      className="absolute inset-0"
      style={compact ? { y, zIndex: index + 1 } : { clipPath, zIndex: index + 1 }}
    >
      <PlateContent house={house} index={index} t={t} compact={compact} />
    </motion.div>
  );
}

function HousesMotion() {
  const compact = useCompactLayout();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const [index, setIndex] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(COUNT - 1, Math.max(0, Math.floor(v * COUNT)));
    if (next !== index) setIndex(next);
  });

  return (
    <section
      ref={ref}
      id="houses"
      aria-label="The four houses"
      className="relative h-[360svh] md:h-[520svh]"
    >
      <div className="cinema-stage sticky top-0 min-h-svh overflow-hidden">
        {inMountWindow(index, 0) ? (
          <BasePlate house={HOUSES[0]} progress={scrollYProgress} compact={compact} />
        ) : null}
        {HOUSES.slice(1).map((house, i) => {
          const plateIndex = i + 1;
          if (compact && !inMountWindow(index, plateIndex)) return null;
          return (
            <WipedPlate
              key={house.id}
              house={house}
              index={plateIndex}
              progress={scrollYProgress}
              compact={compact}
            />
          );
        })}
      </div>
    </section>
  );
}

function HousesStatic() {
  return (
    <section id="houses" aria-label="The four houses" className="py-20 sm:py-28">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        <p className="text-[0.7rem] font-medium tracking-[0.16em] text-moss uppercase">
          Get Sorted
        </p>
        <h2 className="mt-4 max-w-2xl text-3xl leading-[1.05] font-medium tracking-[-0.03em] text-forest-deep sm:text-5xl">
          Four houses. Four ways through the exam.
        </h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {HOUSES.map((house) => {
            const { ink, sub } = plateInk(house);
            return (
              <article
                key={house.id}
                className="flex min-h-[22rem] flex-col overflow-hidden rounded-[24px] p-6 pb-0 sm:p-8 sm:pb-0"
                style={{ backgroundColor: house.hex, color: ink }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-sm italic" style={{ color: sub }}>
                      House of the {house.animal} · {house.trait}
                    </p>
                    <h3 className="font-display mt-2 text-5xl italic tracking-[-0.02em]">
                      {house.name}
                    </h3>
                    <p
                      className="mt-2 text-xs font-medium tracking-[0.12em] uppercase"
                      style={{ color: sub }}
                    >
                      {house.track} · {house.duration}
                    </p>
                    <p className="font-display mt-1.5 text-base italic" style={{ color: sub }}>
                      {house.motto}
                    </p>
                  </div>
                  <span style={{ color: house.metal }}>
                    <HouseSigil house={house.id} t={FINAL_T} className="size-16" />
                  </span>
                </div>
                <p className="mt-6 max-w-md text-[0.92rem] leading-relaxed">{house.description}</p>
                <div className="mt-auto pt-8">
                  <p className="mb-5 text-sm" style={{ color: sub }}>
                    {house.outcome}
                  </p>
                  <div className="pb-6">
                    <MagneticButton href={TELEGRAM_URL} external variant="invert">
                      Sort me into {house.name}
                    </MagneticButton>
                  </div>
                </div>
                <HouseScarf house={house} className="-mx-6 h-2.5 sm:-mx-8" />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Houses() {
  const reduced = usePrefersReducedMotion();
  if (reduced) return <HousesStatic />;
  return <HousesMotion />;
}
