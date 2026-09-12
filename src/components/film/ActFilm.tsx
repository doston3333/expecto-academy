import { useCompactLayout } from "@/hooks/useMedia";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { FILM_BEATS } from "@/lib/content";
import { HOUSES } from "@/lib/houses";
import {
  beatIndex,
  easeCinematic,
  FINAL_T,
  inMountWindow,
  useCoverY,
  useDock,
  useRack,
  useSceneTime,
  WIPE,
} from "@/lib/motion";
import { WindowChrome } from "@/components/film/WindowChrome";
import { Candle } from "@/components/ui/Candle";
import {
  SceneDiagnostic,
  SceneErrorLog,
  SceneGauntlet,
  SceneReport,
  SceneTelegram,
  SceneTrap,
} from "@/components/film/scenes";
import { AnimatePresence, motion, useMotionValueEvent, useMotionTemplate, useScroll, useTransform } from "motion/react";
import { useRef, useState, type ComponentType } from "react";
import type { MotionValue } from "motion/react";

const COUNT = FILM_BEATS.length;
/** Each beat spills a faint house tint across the stage — the ambient light of the scene. */
const FILM_TONES = FILM_BEATS.map(
  (_, i) => `color-mix(in srgb, ${HOUSES[i % HOUSES.length].hex} 8%, var(--color-cream))`,
);
const FILM_SCENES = [
  SceneDiagnostic,
  SceneTrap,
  SceneErrorLog,
  SceneGauntlet,
  SceneReport,
  SceneTelegram,
] as const;

type SceneComponent = ComponentType<{ t: MotionValue<number> }>;

function BaseScene({ progress, Scene }: { progress: MotionValue<number>; Scene: SceneComponent }) {
  const t = useSceneTime(progress, 0, COUNT);
  const rack = useRack(progress, 0, COUNT);
  return (
    <motion.div className="absolute inset-0" style={{ zIndex: 1, scale: rack.scale, opacity: rack.opacity }}>
      <Scene t={t} />
    </motion.div>
  );
}

function WipedScene({
  progress,
  index,
  Scene,
  cover,
}: {
  progress: MotionValue<number>;
  index: number;
  Scene: SceneComponent;
  cover: boolean;
}) {
  const t = useSceneTime(progress, index, COUNT);
  const rack = useRack(progress, index, COUNT);
  const start = index / COUNT;
  const end = start + WIPE / COUNT;
  const mid = start + (end - start) * 0.8;
  const topRight = useTransform(progress, [start, mid], [100, -6], { clamp: true });
  const topLeft = useTransform(progress, [start, end], [100, -12], { clamp: true });
  const clipPath = useMotionTemplate`polygon(0% ${topLeft}%, 100% ${topRight}%, 100% 100%, 0% 100%)`;
  const y = useCoverY(progress, index, COUNT);
  // House-colored glow riding the wipe's slanted edge — the cut carries the
  // incoming scene's tint the way Eden's iris carried the next chapter.
  const house = HOUSES[index % HOUSES.length].hex;
  const edge = useTransform(progress, [start, mid, end], [`${house}00`, `${house}8c`, `${house}00`]);
  const filter = useMotionTemplate`drop-shadow(0 -10px 22px ${edge})`;
  return (
    <motion.div
      className="absolute inset-0"
      style={{ zIndex: index + 1, filter: cover ? undefined : filter }}
    >
      <motion.div
        className="absolute inset-0"
        style={cover ? { y } : { clipPath }}
      >
        <motion.div className="absolute inset-0" style={{ scale: rack.scale, opacity: rack.opacity }}>
          <Scene t={t} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function BeatCopy({ progress }: { progress: MotionValue<number> }) {
  const [index, setIndex] = useState(0);
  useMotionValueEvent(progress, "change", (v) => {
    const next = beatIndex(v, COUNT);
    if (next !== index) setIndex(next);
  });
  const beat = FILM_BEATS[index];

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={`n-${index}`}
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="pointer-events-none absolute -top-[0.32em] -left-[0.06em] -z-10 hidden text-[5.4rem] leading-none font-semibold tracking-[-0.05em] select-none sm:block sm:text-[7.5rem]"
          style={{ color: `${HOUSES[index % HOUSES.length].hex}1f` }}
        >
          {beat.index}
        </motion.span>
      </AnimatePresence>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={index}>
          <div className="overflow-hidden">
            <motion.p
              initial={{ y: "115%" }}
              animate={{ y: 0 }}
              exit={{ y: "-115%" }}
              transition={{ duration: 0.4, ease: easeCinematic }}
              className="text-[0.7rem] font-medium tracking-[0.16em] text-moss uppercase"
            >
              {beat.kicker}
            </motion.p>
          </div>
          <div className="mt-3 overflow-hidden">
            <motion.h2
              initial={{ y: "112%" }}
              animate={{ y: 0 }}
              exit={{ y: "-112%" }}
              transition={{ duration: 0.46, ease: easeCinematic, delay: 0.04 }}
              className="text-[1.15rem] leading-[1.12] font-medium tracking-[-0.03em] text-forest-deep sm:text-4xl lg:text-[2.6rem]"
            >
              {beat.title}
            </motion.h2>
          </div>
          <div className="mt-3 overflow-hidden sm:mt-4">
            <motion.p
              initial={{ y: "120%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              transition={{ duration: 0.42, ease: easeCinematic, delay: 0.08 }}
              className="max-w-md text-[0.82rem] leading-relaxed text-muted line-clamp-2 sm:line-clamp-none sm:text-base"
            >
              {beat.body}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="mt-5 flex items-center gap-2 sm:mt-6" aria-hidden="true">
        {FILM_BEATS.map((b, i) => (
          <span
            key={b.index}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === index ? "w-7" : "w-2.5 bg-forest/15"
            }`}
            style={
              i === index
                ? { backgroundColor: HOUSES[index % HOUSES.length].hex }
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}

function FilmMotion() {
  const compact = useCompactLayout();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const dock = useDock(scrollYProgress);
  const [index, setIndex] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = beatIndex(v, COUNT);
    if (next !== index) setIndex(next);
  });

  return (
    <section ref={ref} id="film" aria-label="How a score is built" className="relative h-[460svh] md:h-[680svh]" data-scene>
      <div className="cinema-stage sticky top-0 flex h-svh min-h-svh flex-col justify-center overflow-hidden pt-[4.6rem] pb-5 md:pt-0 md:pb-0">
        <div
          aria-hidden="true"
          className="xc-film-ambient"
          style={{ backgroundColor: FILM_TONES[index] }}
        />
        <Candle className="absolute top-[18%] left-[1.5%] hidden xl:block" height={88} delay={0.9} />
        <Candle className="absolute right-[1.5%] bottom-[16%] hidden xl:block" height={72} delay={2.7} />
        <div className="relative z-10 mx-auto grid w-full max-w-[1240px] min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] items-start gap-3 px-5 md:flex-none md:grid-cols-12 md:grid-rows-none md:items-center md:gap-12 md:px-8">
          <div className="md:col-span-5">
            <BeatCopy progress={scrollYProgress} />
          </div>
          <div className="flex min-h-0 w-full items-center md:col-span-7">
            <motion.div
              className="w-full"
              style={
                compact
                  ? { y: dock.y, scale: dock.scale }
                  : {
                      scale: dock.scale,
                      y: dock.y,
                      rotateX: dock.rotateX,
                      transformPerspective: 1400,
                    }
              }
            >
              <WindowChrome breadcrumb={FILM_BEATS[index].breadcrumb} progress={scrollYProgress}>
                {inMountWindow(index, 0) ? (
                  <BaseScene progress={scrollYProgress} Scene={FILM_SCENES[0]} />
                ) : null}
                {FILM_SCENES.slice(1).map((Scene, i) => {
                  const sceneIndex = i + 1;
                  if (!inMountWindow(index, sceneIndex)) return null;
                  return (
                    <WipedScene
                      key={sceneIndex}
                      progress={scrollYProgress}
                      index={sceneIndex}
                      Scene={Scene}
                      cover={compact}
                    />
                  );
                })}
              </WindowChrome>
            </motion.div>
          </div>
        </div>
        <div className="xc-film-notes absolute inset-x-8 bottom-6 z-10">
          <p>
            A window into a real week at Expecto — the diagnostic, the trap,
            the log, the gauntlet, the report, the sort.
          </p>
          <details>
            <summary>Read the film's transcript</summary>
            {FILM_BEATS.map((beat) => (
              <p key={beat.index}>
                <strong className="text-forest-deep">{beat.index} · {beat.title}.</strong>{" "}
                {beat.body}
              </p>
            ))}
          </details>
        </div>
      </div>
    </section>
  );
}

function FilmStatic() {
  return (
    <section id="film" aria-label="How a score is built" className="py-16 sm:py-28">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        <div className="grid items-center gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="text-[0.7rem] font-medium tracking-[0.16em] text-moss uppercase">
              The letter
            </p>
            <h2 className="mt-3 text-3xl leading-[1.06] font-medium tracking-[-0.03em] text-forest-deep sm:text-4xl">
              A number that funds a seat
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-muted">
              1480 — up 300 from the diagnostic, 98th percentile. Then the part that matters:
              which universities in Uzbekistan turn that number into tuition.
            </p>
          </div>
          <div className="md:col-span-7">
            <WindowChrome breadcrumb="Score report · 14 Aug 2026">
              <SceneReport t={FINAL_T} />
            </WindowChrome>
          </div>
        </div>
        <div className="mt-16 border-t border-forest/10">
          {FILM_BEATS.map((beat) => (
            <div key={beat.index} className="grid gap-2 border-b border-forest/10 py-6 sm:grid-cols-12">
              <span className="text-sm font-semibold text-moss tabular-nums sm:col-span-2">
                {beat.index}
              </span>
              <h3 className="text-lg font-medium tracking-[-0.02em] text-forest-deep sm:col-span-4">
                {beat.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted sm:col-span-6">{beat.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ActFilm() {
  const reduced = usePrefersReducedMotion();
  return reduced ? <FilmStatic /> : <FilmMotion />;
}
