import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { HouseGradient, useSvgId } from "./ui/primitives";

function Word({
  children,
  progress,
  range,
  className,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  className?: string;
}) {
  const opacity = useTransform(progress, range, [0.1, 1], { clamp: true });
  const y = useTransform(progress, range, [18, 0], { clamp: true });
  const blur = useTransform(progress, range, [8, 0], { clamp: true });
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  return (
    <motion.span className={cn("inline-block will-change-transform", className)} style={{ opacity, y, filter }}>
      {children}
    </motion.span>
  );
}

/**
 * A single sentence, full-bleed, read word by word as the page scrolls.
 * `highlight` is the tail of the sentence set in gold italic, underlined in the four house colors.
 */
export function Statement({
  lead,
  highlight,
  sub,
  eyebrow,
  id,
}: {
  lead: string;
  highlight: string;
  sub?: string;
  eyebrow?: string;
  id?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const ribbonId = useSvgId("ribbon");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end end"] });
  const underline = useTransform(scrollYProgress, [0.62, 0.86], [0, 1], { clamp: true });
  const subOpacity = useTransform(scrollYProgress, [0.72, 0.92], [0, 1], { clamp: true });
  const subY = useTransform(scrollYProgress, [0.72, 0.92], [16, 0], { clamp: true });

  const leadWords = lead.split(" ").filter(Boolean);
  const hiWords = highlight.split(" ").filter(Boolean);
  const total = leadWords.length + hiWords.length;
  const rangeFor = (i: number): [number, number] => {
    const start = (i / total) * 0.62;
    return [start, start + 0.16];
  };

  const heading = (
    <h2 className="display text-center text-[clamp(2.6rem,7.6vw,7.8rem)] leading-[1.02]">
      <span className="sr-only">
        {lead} {highlight}
      </span>
      <span aria-hidden="true">
        {leadWords.map((w, i) =>
          reduced ? (
            <span key={i}>{w} </span>
          ) : (
            <span key={i}>
              <Word progress={scrollYProgress} range={rangeFor(i)}>
                {w}
              </Word>{" "}
            </span>
          ),
        )}
        <span className="relative inline-block italic text-gold">
          {hiWords.map((w, i) =>
            reduced ? (
              <span key={i}>
                {w}
                {i < hiWords.length - 1 ? " " : ""}
              </span>
            ) : (
              <span key={i}>
                <Word progress={scrollYProgress} range={rangeFor(leadWords.length + i)}>
                  {w}
                </Word>
                {i < hiWords.length - 1 ? " " : ""}
              </span>
            ),
          )}
          <svg viewBox="0 0 400 24" preserveAspectRatio="none" className="boil absolute -bottom-[0.14em] left-0 h-[0.22em] w-full" aria-hidden="true">
            <defs>
              <HouseGradient id={ribbonId} />
            </defs>
            <motion.path
              d="M4 16 C 90 6, 200 20, 396 8"
              fill="none"
              stroke={`url(#${ribbonId})`}
              strokeWidth="4"
              strokeLinecap="round"
              style={{ pathLength: reduced ? 1 : underline }}
            />
          </svg>
        </span>
      </span>
    </h2>
  );

  if (reduced) {
    return (
      <section id={id} className="bg-paper px-5 py-32 md:py-44">
        {eyebrow ? <p className="eyebrow eyebrow--plain mb-8 w-full justify-center">{eyebrow}</p> : null}
        <div className="mx-auto max-w-[1200px]">{heading}</div>
        {sub ? <p className="mx-auto mt-10 max-w-xl text-center text-[1.05rem] leading-relaxed text-ink-soft">{sub}</p> : null}
      </section>
    );
  }

  return (
    <section ref={ref} id={id} className="relative h-[210svh] bg-paper">
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center px-5">
        {eyebrow ? <p className="eyebrow eyebrow--plain mb-8">{eyebrow}</p> : null}
        <div className="mx-auto max-w-[1200px]">{heading}</div>
        {sub ? (
          <motion.p
            style={{ opacity: subOpacity, y: subY }}
            className="mx-auto mt-10 max-w-xl text-center text-[1rem] leading-relaxed text-ink-soft md:text-[1.1rem]"
          >
            {sub}
          </motion.p>
        ) : null}
      </div>
    </section>
  );
}
