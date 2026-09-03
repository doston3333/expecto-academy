import type { HouseId } from "@/lib/houses";
import { motion, useTransform, type MotionValue } from "motion/react";

interface HouseSigilProps {
  house: HouseId;
  /** 0..1 — the stroke draws itself as t rises. Pass a constant 1 for static. */
  t: MotionValue<number>;
  className?: string;
}

/** Original geometric line marks. Stroke-drawn on scroll. Not anyone's IP. */
const SIGIL_PATHS: Record<HouseId, string[]> = {
  aurelion: [
    // phoenix — rising winged chevrons
    "M12 21 C10 16 8 13 5 10 C9 11 11 12 12 14 C13 12 15 11 19 10 C16 13 14 16 12 21 Z",
    "M12 14 L12 5 M12 5 L9 8 M12 5 L15 8",
  ],
  veridian: [
    // serpent — coiled S with head
    "M7 18 C14 18 17 15 17 12 C17 9 14 7 11 7 C8 7 6 8.5 6 10.5 C6 12 8 13 10 13",
    "M6 10.5 L4.5 9 M6 10.5 L8.5 10",
  ],
  noctis: [
    // raven — wing arcs over an eye
    "M3 13 C7 8 17 8 21 13 C17 11 15 12 12 15 C9 12 7 11 3 13 Z",
    "M12 15 L12 19 M10 18 L14 18",
  ],
  amberfell: [
    // badger — striped shield head
    "M6 4 L18 4 L18 12 C18 17 14 20 12 20 C10 20 6 17 6 12 Z",
    "M10 6 L10 14 M14 6 L14 14",
  ],
};

export function HouseSigil({ house, t, className }: HouseSigilProps) {
  const draw = useTransform(t, [0, 1], [0, 1], { clamp: true });
  const paths = SIGIL_PATHS[house];
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      {paths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke="currentColor"
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          style={{ pathLength: draw }}
        />
      ))}
    </svg>
  );
}
