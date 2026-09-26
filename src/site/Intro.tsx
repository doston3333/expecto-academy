import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { EASE, EASE_FILM, HouseRibbon } from "./ui/primitives";

/** Seconds until the curtain has lifted enough for the hero to begin. */
export const INTRO_DELAY = 1.35;

/** A short title card — the mark resolves, the house ribbon draws, the paper lifts. */
export function Intro() {
  const reduced = usePrefersReducedMotion();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setDone(true), 2600);
    return () => window.clearTimeout(id);
  }, []);

  if (reduced || done) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-0 z-[100] grid place-items-center bg-ink"
      initial={{ clipPath: "inset(0 0 0% 0)" }}
      animate={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 1.1, ease: EASE_FILM, delay: 1.05 }}
    >
      <div className="flex flex-col items-center">
        <motion.img
          src="/logo.png"
          alt=""
          className="h-20 w-auto md:h-24"
          initial={{ opacity: 0, scale: 0.86, filter: "blur(12px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: EASE }}
        />
        <motion.span
          className="mt-6 block w-40 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: EASE_FILM, delay: 0.2 }}
        >
          <HouseRibbon tone="bright" className="h-[2px]" />
        </motion.span>
        <motion.span
          className="mt-4 font-serif text-sm tracking-[0.3em] text-paper/70 uppercase"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.35 }}
        >
          Expecto Academy
        </motion.span>
      </div>
    </motion.div>
  );
}
