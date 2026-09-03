import { motion, useScroll, useSpring } from "motion/react";

/** A quad-color reading progress hairline across the top of the page. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.6 });

  return (
    <motion.span
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left"
      style={{
        scaleX,
        background:
          "linear-gradient(90deg, var(--color-aurelion), var(--color-veridian), var(--color-noctis), var(--color-amberfell))",
      }}
    />
  );
}
