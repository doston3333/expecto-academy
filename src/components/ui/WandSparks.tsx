import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useEffect, useState } from "react";

interface Spark {
  id: number;
  x: number;
  y: number;
  dx: number;
}

/** Golden wand-sparks that trail the cursor. Fine pointers only. */
export function WandSparks() {
  const reduced = usePrefersReducedMotion();
  const [sparks, setSparks] = useState<Spark[]>([]);

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let last = 0;
    let id = 0;
    const onMove = (event: PointerEvent) => {
      const now = performance.now();
      if (now - last < 55) return;
      last = now;
      const spark: Spark = {
        id: id++,
        x: event.clientX,
        y: event.clientY,
        dx: (Math.random() - 0.5) * 26,
      };
      setSparks((current) => [...current.slice(-22), spark]);
      window.setTimeout(() => {
        setSparks((current) => current.filter((item) => item.id !== spark.id));
      }, 800);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  if (reduced) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[80]">
      {sparks.map((spark) => (
        <span
          key={spark.id}
          className="absolute size-[3px] rounded-full bg-amberfell"
          style={
            {
              left: spark.x,
              top: spark.y,
              boxShadow: "0 0 6px 1px color-mix(in srgb, var(--color-amberfell) 65%, transparent)",
              "--spark-x": `${spark.dx}px`,
              animation: "spark-fade 0.75s ease-out forwards",
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
