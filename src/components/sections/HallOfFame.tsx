import gallery from "@/assets/hall-gallery.jpg";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useScroll, useMotionValueEvent } from "motion/react";
import { useEffect, useRef, useState } from "react";
import "./hall.css";
import { mountHall } from "./hallScene";

function FameScene({ walkRef }: { walkRef: React.RefObject<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let dispose: (() => void) | undefined;
    let cancelled = false;
    mountHall(canvas, walkRef).then(
      (teardown) => {
        if (cancelled) teardown();
        else dispose = teardown;
      },
      () => {
        if (!cancelled) setFailed(true);
      },
    );
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [walkRef]);

  return (
    <div className="fame-stage" data-nav-dark>
      {failed ? (
        <img
          className="fame-photo"
          src={gallery}
          alt="A wood-floored gallery. Framed Digital SAT scores line both walls. At the far end, Sarvar, 1550."
        />
      ) : (
        <canvas ref={canvasRef} aria-hidden="true" />
      )}
    </div>
  );
}

function HallIntro() {
  return (
    <div className="mx-auto max-w-[1240px] px-5 py-16 md:px-8 sm:py-24">
      <div data-reveal>
        <p className="text-[0.7rem] font-medium tracking-[0.16em] text-moss uppercase">
          The wall of fame
        </p>
        <h2 className="mt-4 max-w-xl text-3xl leading-[1.02] font-medium tracking-[-0.03em] text-forest-deep sm:text-5xl">
          Walk the length of it.
        </h2>
        <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-muted">
          Thirty-two Digital SAT reports along the walls. One score waiting at the end.
        </p>
      </div>
    </div>
  );
}

function HallWalk() {
  const pinRef = useRef<HTMLDivElement>(null);
  const walkRef = useRef(0);
  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    walkRef.current = value;
  });

  return (
    <section id="fame" aria-label="Wall of fame" className="bg-cream">
      <HallIntro />
      <div ref={pinRef} className="relative h-[240svh]">
        <div className="sticky top-0 h-svh">
          <FameScene walkRef={walkRef} />
        </div>
      </div>
    </section>
  );
}

function HallStill() {
  const walkRef = useRef(0);
  return (
    <section id="fame" aria-label="Wall of fame" className="bg-cream">
      <HallIntro />
      <div className="h-svh">
        <FameScene walkRef={walkRef} />
      </div>
    </section>
  );
}

export function HallOfFame() {
  const reduced = usePrefersReducedMotion();
  if (reduced) return <HallStill />;
  return <HallWalk />;
}
