import type { CSSProperties } from "react";

interface EmbersProps {
  color: string;
  count?: number;
  opacity?: number;
  className?: string;
}

const MOTES = [
  { left: "8%", bottom: "12%", size: 3, duration: 15, delay: 0, x: 18 },
  { left: "22%", bottom: "30%", size: 2, duration: 19, delay: 3.2, x: -12 },
  { left: "38%", bottom: "8%", size: 3, duration: 13, delay: 6.1, x: 10 },
  { left: "55%", bottom: "22%", size: 2, duration: 17, delay: 1.4, x: -16 },
  { left: "68%", bottom: "10%", size: 3, duration: 21, delay: 8.3, x: 14 },
  { left: "80%", bottom: "28%", size: 2, duration: 14, delay: 4.7, x: -10 },
  { left: "90%", bottom: "14%", size: 3, duration: 18, delay: 10.2, x: 12 },
  { left: "47%", bottom: "34%", size: 2, duration: 16, delay: 12.6, x: -18 },
] as const;

/** Candle-dust motes drifting upward. Pure CSS; reduced motion hides them. */
export function Embers({ color, count = 6, opacity = 0.45, className }: EmbersProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
    >
      {MOTES.slice(0, count).map((mote, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={
            {
              left: mote.left,
              bottom: mote.bottom,
              width: mote.size,
              height: mote.size,
              backgroundColor: color,
              "--ember-x": `${mote.x}px`,
              "--ember-opacity": opacity,
              animation: `ember-drift ${mote.duration}s linear ${mote.delay}s infinite`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
