import { useCompactLayout } from "@/hooks/useMedia";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { HOUSES } from "@/lib/houses";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

interface ChapterBreakProps {
  numeral: string;
  line: string;
  sub?: string;
  quad?: boolean;
  /** House hex — washes the whole chapter page in a faint house tint. */
  tint?: string;
}

/**
 * A chapter page: one giant masked line scrubbed by its own short sticky.
 * Reduced motion renders the settled page.
 */
export function ChapterBreak({ numeral, line, sub, quad = false, tint }: ChapterBreakProps) {
  const reduced = usePrefersReducedMotion();
  const compact = useCompactLayout();
  const pin = compact && !reduced;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: pin ? ["start start", "end end"] : ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0.12, 0.55], ["112%", "0%"], { clamp: true });
  const numeralOpacity = useTransform(scrollYProgress, [0.08, 0.42], [0, 1], { clamp: true });
  const ruleScale = useTransform(scrollYProgress, [0.4, 0.72], [0, 1], { clamp: true });
  const subOpacity = useTransform(scrollYProgress, [0.48, 0.78], [0, 1], { clamp: true });

  const content = (
    <div className="mx-auto flex min-h-[70svh] max-w-[1240px] flex-col items-center justify-center px-5 py-16 text-center md:min-h-[62svh] md:px-8 md:py-0">
      <motion.p
        style={reduced ? undefined : { opacity: numeralOpacity }}
        className="font-display text-[0.9rem] tracking-[0.3em] text-moss uppercase italic"
      >
        <span aria-hidden="true" style={tint ? { color: tint } : undefined}>
          ✦
        </span>{" "}
        {numeral}{" "}
        <span aria-hidden="true" style={tint ? { color: tint } : undefined}>
          ✦
        </span>
      </motion.p>
      <span className="mt-6 block overflow-hidden">
        <motion.h2
          style={reduced ? undefined : { y }}
          className="max-w-4xl text-[clamp(1.85rem,8.4vw,5rem)] leading-[1.08] font-medium tracking-[-0.035em] text-forest-deep sm:text-[clamp(2.2rem,6.5vw,5rem)] sm:leading-[1.02]"
        >
          {line}
        </motion.h2>
      </span>
      {quad ? (
        <motion.span
          aria-hidden="true"
          style={reduced ? undefined : { scaleX: ruleScale }}
          className="mt-8 flex h-1 w-28 origin-center overflow-hidden rounded-full"
        >
          {HOUSES.map((house) => (
            <span key={house.id} className="flex-1" style={{ backgroundColor: house.hex }} />
          ))}
        </motion.span>
      ) : (
        <motion.span
          aria-hidden="true"
          style={reduced ? undefined : { scaleX: ruleScale }}
          className="mt-8 block h-px w-24 origin-center bg-forest/30"
        />
      )}
      {sub ? (
        <motion.p
          style={reduced ? undefined : { opacity: subOpacity }}
          className="mt-6 max-w-md text-[0.9rem] leading-relaxed text-muted"
        >
          {sub}
        </motion.p>
      ) : null}
    </div>
  );

  if (reduced)
    return (
      <section
        aria-label={line}
        style={tint ? { backgroundColor: `${tint}0d` } : undefined}
      >
        {content}
      </section>
    );
  return (
    <section
      ref={ref}
      aria-label={line}
      className={pin ? "relative h-[120svh]" : undefined}
      style={tint ? { backgroundColor: `${tint}0d` } : undefined}
    >
      <div className={pin ? "cinema-stage sticky top-0 flex min-h-svh items-center overflow-hidden" : undefined}>
        {content}
      </div>
    </section>
  );
}
