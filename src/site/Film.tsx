import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { FILM_BEATS } from "@/lib/content";
import { cn } from "@/lib/cn";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef, useState } from "react";
import { SCENES } from "./FilmScenes";
import { EASE, EASE_FILM, Eyebrow, FadeUp, house, HOUSE, RevealLines } from "./ui/primitives";

const N = FILM_BEATS.length;

function Segment({ progress, i }: { progress: MotionValue<number>; i: number }) {
  const scaleX = useTransform(progress, (v) => Math.min(1, Math.max(0, v * N - i)));
  return (
    <span className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-ink/10">
      <motion.span className="absolute inset-0 origin-left" style={{ scaleX, backgroundColor: house(i).fill }} />
    </span>
  );
}

function WindowFrame({ breadcrumb, children, className }: { breadcrumb: string; children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-[22px] border border-ink/10 bg-card shadow-[0_50px_100px_-50px_rgb(22_33_43/0.45),0_2px_6px_rgb(22_33_43/0.04)] md:rounded-[28px]",
        className,
      )}
    >
      <div className="flex h-11 shrink-0 items-center gap-3 border-b border-ink/8 px-4 md:h-12 md:px-5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-gryffindor-2" />
          <span className="size-2.5 rounded-full bg-hufflepuff-2" />
          <span className="size-2.5 rounded-full bg-slytherin-2" />
        </span>
        <span className="flex-1 truncate text-center text-[0.72rem] font-medium text-ink-soft">{breadcrumb}</span>
        <span className="hidden text-[0.62rem] tracking-[0.2em] text-ink-faint uppercase sm:block">Expecto</span>
      </div>
      <div className="relative flex-1">{children}</div>
    </div>
  );
}

function FilmIntro() {
  return (
    <div className="mx-auto max-w-[1320px] px-5 pt-24 pb-10 md:px-10 md:pt-40 md:pb-16">
      <div className="grid gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <Eyebrow color={HOUSE.gryffindor.deep}>How a score is built</Eyebrow>
          <RevealLines
            as="h2"
            className="display mt-6 text-[clamp(2.6rem,6.4vw,6rem)]"
            lines={["Watch the score", <em key="hi" className="text-gryffindor">get built.</em>]}
          />
        </div>
        <FadeUp className="md:col-span-4" delay={0.2}>
          <p className="max-w-sm text-[1rem] leading-relaxed text-ink-soft md:ml-auto">
            One window. Six beats of a real preparation.
          </p>
        </FadeUp>
      </div>
    </div>
  );
}

function FilmStatic() {
  return (
    <section id="film" aria-label="How a score is built" className="bg-paper pb-24">
      <FilmIntro />
      <div className="mx-auto max-w-[1320px] space-y-16 px-5 md:px-10">
        {FILM_BEATS.map((beat, i) => {
          const Scene = SCENES[i];
          return (
            <div key={beat.index} className="grid gap-8 md:grid-cols-12 md:items-center">
              <div className="md:col-span-5">
                <Eyebrow plain>
                  {beat.index} · {beat.kicker}
                </Eyebrow>
                <h3 className="display mt-4 text-[2.2rem]">{beat.title}</h3>
                <p className="mt-4 max-w-md leading-relaxed text-ink-soft">{beat.body}</p>
              </div>
              <WindowFrame breadcrumb={beat.breadcrumb} className="h-[440px] md:col-span-7">
                <Scene />
              </WindowFrame>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function Film() {
  const reduced = usePrefersReducedMotion();
  return reduced ? <FilmStatic /> : <FilmPinned />;
}

function FilmPinned() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [index, setIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(N - 1, Math.max(0, Math.floor(v * N)));
    setIndex((cur) => (cur === next ? cur : next));
  });

  const beat = FILM_BEATS[index];
  const Scene = SCENES[index];

  const jump = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + span * ((i + 0.35) / N), behavior: "smooth" });
  };

  return (
    <section id="film" aria-label="How a score is built" className="relative bg-paper">
      <FilmIntro />
      <ol className="sr-only">
        {FILM_BEATS.map((b) => (
          <li key={b.index}>
            {b.index} · {b.title}. {b.body}
          </li>
        ))}
      </ol>

      <div ref={ref} style={{ height: `${N * 80 + 100}svh` }} className="relative">
        <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden" aria-hidden="true">
          <div className="mx-auto grid w-full max-w-[1320px] gap-6 px-5 pt-16 md:grid-cols-12 md:gap-10 md:px-10 md:pt-10">
            {/* Copy */}
            <div className="flex flex-col md:col-span-5 md:justify-between md:py-6">
              <div>
                <div className="flex items-center gap-4">
                  <span className="relative h-[1.1em] overflow-hidden font-serif text-[0.95rem] tnum transition-colors duration-500" style={{ color: house(index).deep }}>
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={beat.index}
                        className="block"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-100%" }}
                        transition={{ duration: 0.6, ease: EASE_FILM }}
                      >
                        {beat.index}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <span className="text-[0.95rem] text-ink-faint">/ 0{N}</span>
                  <span className="h-px flex-1 bg-ink/10" />
                </div>
                <div className="relative mt-5 min-h-[9.5rem] md:mt-10 md:min-h-[21rem]">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={beat.index}
                      initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -18, filter: "blur(6px)" }}
                      transition={{ duration: 0.55, ease: EASE }}
                    >
                      <p className="eyebrow eyebrow--plain">{beat.kicker}</p>
                      <h3 className="display mt-3 text-[clamp(1.8rem,3.6vw,3.5rem)] md:mt-5">{beat.title}</h3>
                      <p className="mt-3 max-w-md text-[0.9rem] leading-relaxed text-ink-soft md:mt-6 md:text-[1.02rem]">{beat.body}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
              <ul className="mt-8 hidden space-y-1 md:block">
                {FILM_BEATS.map((b, i) => (
                  <li key={b.index}>
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => jump(i)}
                      className={cn(
                        "flex w-full items-center gap-4 py-1.5 text-left text-[0.8rem] transition-colors duration-500",
                        i === index ? "text-ink" : "text-ink-faint hover:text-ink-soft",
                      )}
                    >
                      <span className="w-5 tnum">{b.index}</span>
                      <motion.span
                        className="h-px bg-current"
                        animate={{ width: i === index ? 36 : 12 }}
                        transition={{ duration: 0.6, ease: EASE }}
                      />
                      {b.kicker}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Window */}
            <div className="md:col-span-7">
              <WindowFrame breadcrumb={beat.breadcrumb} className="h-[min(52svh,440px)] md:h-[min(68svh,580px)]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={beat.index}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 0.985 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.01, filter: "blur(4px)" }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    <Scene />
                  </motion.div>
                </AnimatePresence>
              </WindowFrame>
              <div className="mt-5 flex gap-2">
                {FILM_BEATS.map((b, i) => (
                  <Segment key={b.index} progress={scrollYProgress} i={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
