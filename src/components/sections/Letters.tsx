import { OwlPost } from "@/components/ui/OwlPost";
import { WaxStamp } from "@/components/ui/WaxStamp";
import { useCompactLayout } from "@/hooks/useMedia";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { TESTIMONIALS } from "@/lib/content";
import { getHouse } from "@/lib/houses";
import { easeCinematic, useSegment } from "@/lib/motion";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, useState } from "react";

type Story = (typeof TESTIMONIALS)[number];
const COUNT = TESTIMONIALS.length;

function ScoreTrack({ story, progress, index }: { story: Story; progress: MotionValue<number>; index: number }) {
  const segment = useSegment(progress, index, COUNT);
  const fill = useTransform(
    segment,
    [0.15, 0.85],
    [story.before / 1600, story.after / 1600],
    { clamp: true },
  );
  const house = getHouse(story.houseId);

  return (
    <div className="mt-8">
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-muted tabular-nums">{story.before}</span>
        <span className="text-2xl font-semibold text-forest-deep tabular-nums sm:text-3xl">
          {story.after}
        </span>
      </div>
      <div className="relative mt-2 h-1 overflow-hidden rounded-full bg-forest/10">
        <motion.span
          className="absolute inset-y-0 left-0 w-full origin-left rounded-full"
          style={{ scaleX: fill, backgroundColor: house.hex }}
        />
      </div>
      <div className="mt-2 flex justify-between text-[0.66rem] tracking-[0.08em] text-muted uppercase">
        <span>Diagnostic</span>
        <span>Official score</span>
      </div>
    </div>
  );
}

function StoryMeta({ story }: { story: Story }) {
  return (
    <p className="mt-6 text-[0.78rem] text-muted">
      <span className="font-medium text-forest-deep">{story.name}</span> · {story.city} ·{" "}
      {story.school} — <span className="font-medium text-forest-deep">{story.award}</span>
    </p>
  );
}

/* The Archive — a deck of real score reports that fans open on scroll */

const FAN = [
  { x: -1, rotate: -8 },
  { x: -0.36, rotate: -2.5 },
  { x: 0.36, rotate: 2.5 },
  { x: 1, rotate: 8 },
] as const;

function ArchivePlate({
  story,
  index,
  progress,
  compact,
}: {
  story: Story;
  index: number;
  progress: MotionValue<number>;
  compact: boolean;
}) {
  const house = getHouse(story.houseId);
  const fan = FAN[index];
  const spread = compact ? 16 : 26;
  const lift = compact ? 16 : 26;
  const x = useTransform(progress, [0.08, 0.55], ["-50%", `calc(-50% + ${fan.x * spread}vw)`], {
    clamp: true,
  });
  const rotate = useTransform(progress, [0.08, 0.55], [0, fan.rotate], { clamp: true });
  const y = useTransform(
    progress,
    [0.08, 0.55],
    [`calc(-50% + ${index * -6}px)`, `calc(-50% + ${Math.abs(fan.x) * lift}px)`],
    { clamp: true },
  );
  const bar = useTransform(progress, [0.5, 0.8], [0, 1], { clamp: true });

  return (
    <motion.article
      className="window-lift absolute top-1/2 left-1/2 w-[min(10.75rem,38vw)] rounded-2xl border border-forest/12 bg-cream sm:w-64"
      style={{ x, y, rotate, zIndex: index + 1 }}
      aria-label={`Score report — ${story.school}`}
    >
      <div className="h-1.5 rounded-t-2xl" style={{ backgroundColor: house.hex }} />
      <div className="px-4 py-3.5 sm:px-5">
        <div className="flex items-center justify-between">
          <p className="text-[0.6rem] font-medium tracking-[0.14em] text-moss uppercase sm:text-[0.62rem]">
            Expecto · Score report
          </p>
          <span
            aria-hidden="true"
            className="grid size-10 -rotate-12 place-items-center rounded-full border border-dashed text-center text-[0.4rem] leading-[1.15] font-semibold tracking-[0.1em] uppercase"
            style={{ borderColor: house.ink, color: house.ink }}
          >
            Owl
            <br />
            post
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-sm text-muted line-through tabular-nums">{story.before}</span>
          <span className="text-[2.2rem] leading-none font-semibold tracking-[-0.04em] text-forest-deep tabular-nums sm:text-[2.6rem]">
            {story.after}
          </span>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-forest/8">
          <motion.span
            className="block h-full origin-left rounded-full"
            style={{
              backgroundColor: house.hex,
              width: `${(story.after / 1600) * 100}%`,
              scaleX: bar,
            }}
          />
        </div>
        <p className="mt-2.5 text-[0.62rem] font-medium text-forest-deep sm:text-[0.68rem]">
          {story.school} · {story.award}
        </p>
        <p className="text-[0.6rem] text-muted sm:text-[0.64rem]">
          {story.name} · {story.city}
        </p>
      </div>
    </motion.article>
  );
}

function Archive() {
  const compact = useCompactLayout();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const headY = useTransform(scrollYProgress, [0.02, 0.2], ["112%", "0%"], { clamp: true });
  const subOpacity = useTransform(scrollYProgress, [0.55, 0.75], [0, 1], { clamp: true });

  return (
    <section ref={ref} aria-label="The archive of results" className="relative h-[170svh] md:h-[220svh]">
      <div className="cinema-stage sticky top-0 flex min-h-svh flex-col items-center justify-center overflow-hidden">
        <div className="relative z-10 text-center">
          <p className="text-[0.7rem] font-medium tracking-[0.16em] text-moss uppercase">
            Chapter IV · The archive
          </p>
          <span className="mt-4 block overflow-hidden">
            <motion.h2
              style={{ y: headY }}
              className="text-3xl leading-[1.05] font-medium tracking-[-0.03em] text-forest-deep sm:text-5xl"
            >
              Proof, on paper.
            </motion.h2>
          </span>
          <motion.p
            style={{ opacity: subOpacity }}
            className="mx-auto mt-4 max-w-md text-[0.9rem] leading-relaxed text-muted"
          >
            Four graduates, four funded seats. Their own words are below.
          </motion.p>
        </div>
        <div className="relative mt-8 h-[260px] w-full max-w-[900px] sm:mt-10 sm:h-[340px]">
          {TESTIMONIALS.map((story, i) => (
            <ArchivePlate
              key={story.name}
              story={story}
              index={i}
              progress={scrollYProgress}
              compact={compact}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ArchiveStatic() {
  return (
    <section aria-label="The archive of results" className="py-16 sm:py-24">
      <div className="mx-auto max-w-[1240px] px-5 text-center md:px-8">
        <p className="text-[0.7rem] font-medium tracking-[0.16em] text-moss uppercase">
          Chapter IV · The archive
        </p>
        <h2 className="mt-4 text-3xl leading-[1.05] font-medium tracking-[-0.03em] text-forest-deep sm:text-5xl">
          Proof, on paper.
        </h2>
        <div className="mt-10 grid gap-6 text-left sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {TESTIMONIALS.map((story) => {
            const house = getHouse(story.houseId);
            return (
              <article
                key={story.name}
                className="window-lift overflow-hidden rounded-2xl border border-forest/12 bg-cream"
              >
                <div className="h-1.5" style={{ backgroundColor: house.hex }} />
                <div className="px-4 py-3.5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-muted line-through tabular-nums">{story.before}</span>
                    <span className="text-3xl leading-none font-semibold tracking-[-0.04em] text-forest-deep tabular-nums">
                      {story.after}
                    </span>
                  </div>
                  <p className="mt-2 text-[0.66rem] font-medium text-forest-deep">
                    {story.school} · {story.award}
                  </p>
                  <p className="text-[0.62rem] text-muted">
                    {story.name} · {story.city}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function LettersMotion() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [index, setIndex] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(COUNT - 1, Math.max(0, Math.floor(v * COUNT)));
    if (next !== index) setIndex(next);
  });
  const story = TESTIMONIALS[index];

  return (
    <section ref={ref} id="stories" aria-label="Letters home" className="relative h-[280svh] md:h-[420svh]">
      <div className="cinema-stage sticky top-0 flex min-h-svh items-center overflow-hidden">
        <motion.div
          aria-hidden="true"
          className="absolute inset-0"
          initial={false}
          animate={{ backgroundColor: `${getHouse(story.houseId).hex}14` }}
          transition={{ duration: 0.6, ease: easeCinematic }}
        />
        <div className="relative mx-auto w-full max-w-[880px] px-5 md:px-8">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-[0.7rem] font-medium tracking-[0.16em] text-moss uppercase">
              <OwlPost className="size-4.5" />
              Letters home
            </p>
            <p className="text-[0.72rem] text-muted tabular-nums" aria-live="polite">
              0{index + 1} / 0{COUNT}
            </p>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.figure key={index} className="mt-8 sm:mt-12">
              <div className="overflow-hidden">
                <motion.blockquote
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-110%" }}
                  transition={{ duration: 0.5, ease: easeCinematic }}
                  className="text-[1.5rem] leading-[1.18] font-medium tracking-[-0.02em] text-forest-deep sm:text-[2.4rem]"
                >
                  <span style={{ color: getHouse(story.houseId).hex }}>“</span>
                  {story.quote}”
                </motion.blockquote>
              </div>
              <motion.figcaption
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, delay: 0.12 }}
              >
                <ScoreTrack story={story} progress={scrollYProgress} index={index} />
                <StoryMeta story={story} />
                <WaxStamp
                  house={getHouse(story.houseId)}
                  className="mt-6 size-14 -rotate-6 drop-shadow-md"
                />
              </motion.figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function LettersStatic() {
  return (
    <section id="stories" aria-label="Letters home" className="py-16 sm:py-28">
      <div className="mx-auto max-w-[880px] px-5 md:px-8">
        <p className="flex items-center gap-2 text-[0.7rem] font-medium tracking-[0.16em] text-moss uppercase">
          <OwlPost className="size-4.5" />
          Letters home
        </p>
        <div className="mt-10 space-y-16 sm:mt-10 sm:space-y-14">
          {TESTIMONIALS.map((story) => {
            const house = getHouse(story.houseId);
            return (
              <figure key={story.name} className="border-t border-forest/12 pt-8">
                <blockquote className="text-[1.35rem] leading-[1.35] font-medium tracking-[-0.02em] text-forest-deep sm:text-[2rem]">
                  <span style={{ color: house.hex }}>“</span>
                  {story.quote}”
                </blockquote>
                <figcaption className="mt-6">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-muted tabular-nums">{story.before}</span>
                    <span className="text-2xl font-semibold text-forest-deep tabular-nums">
                      {story.after}
                    </span>
                  </div>
                  <div className="relative mt-2 h-1 overflow-hidden rounded-full bg-forest/10">
                    <span
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{ width: `${(story.after / 1600) * 100}%`, backgroundColor: house.hex }}
                    />
                  </div>
                  <StoryMeta story={story} />
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Letters() {
  const reduced = usePrefersReducedMotion();
  if (reduced) {
    return (
      <>
        <ArchiveStatic />
        <LettersStatic />
      </>
    );
  }
  return (
    <>
      <Archive />
      <LettersMotion />
    </>
  );
}
