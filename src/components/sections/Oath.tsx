import { useCompactLayout } from "@/hooks/useMedia";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { OATH_RIDER, OATH_TERMS } from "@/lib/content";
import { easeCinematic } from "@/lib/motion";
import { getHouse, HOUSES } from "@/lib/houses";
import { CREAM } from "@/lib/palette";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

function WaxSeal({ t }: { t: MotionValue<number> }) {
  const aurelion = getHouse("aurelion");
  const scale = useTransform(t, [0.52, 0.68], [2.4, 1], { clamp: true });
  const rotate = useTransform(t, [0.52, 0.72], [-18, -6], { clamp: true });
  const opacity = useTransform(t, [0.52, 0.6], [0, 1], { clamp: true });
  return (
    <motion.div
      aria-hidden="true"
      style={{ scale, rotate, opacity }}
      className="absolute -right-3 -bottom-6 z-10 sm:-right-6 sm:-bottom-8"
    >
      <svg viewBox="0 0 96 96" className="size-20 drop-shadow-md sm:size-28">
        <circle cx="48" cy="48" r="44" fill={aurelion.hex} />
        <circle cx="48" cy="48" r="44" fill="none" stroke={aurelion.metal} strokeWidth="1.5" strokeDasharray="3 4" />
        <circle cx="48" cy="48" r="34" fill="none" stroke={aurelion.metal} strokeWidth="1" />
        <text
          x="48"
          y="44"
          textAnchor="middle"
          fill={aurelion.metal}
          fontSize="11"
          fontFamily="Cormorant Garamond, serif"
          fontStyle="italic"
          letterSpacing="2"
        >
          PACTUM
        </text>
        <text
          x="48"
          y="62"
          textAnchor="middle"
          fill={CREAM}
          fontSize="13"
          fontFamily="Instrument Sans, sans-serif"
          fontWeight="600"
          letterSpacing="3"
        >
          EA
        </text>
      </svg>
    </motion.div>
  );
}

function Charter({ t }: { t: MotionValue<number> }) {
  return (
    <div className="window-lift relative overflow-hidden rounded-[24px] border border-forest/12 bg-cream-2/50">
      <div className="flex h-[3px]" aria-hidden="true">
        {HOUSES.map((house) => (
          <span key={house.id} className="flex-1" style={{ backgroundColor: house.hex }} />
        ))}
      </div>
      <div className="border-b border-forest/10 px-5 py-5 sm:px-10 sm:py-7">
        <p className="text-[0.66rem] font-medium tracking-[0.2em] text-moss uppercase">
          Expecto Academy · Scholar and Headmaster's Circle
        </p>
        <h3 className="font-display mt-2 text-3xl tracking-[-0.01em] text-forest-deep italic sm:text-4xl">
          The score pact
        </h3>
      </div>
      <div className="px-5 py-6 sm:px-10 sm:py-8">
        {OATH_TERMS.map((item, i) => {
          const at = 0.04 + i * 0.1;
          return (
            <OathLine
              key={item.n}
              item={item}
              t={t}
              at={at}
              last={i === OATH_TERMS.length - 1}
              ink={HOUSES[i % HOUSES.length].ink}
            />
          );
        })}
        <div className="mt-8 flex items-end justify-between gap-6 pr-16 sm:pr-24">
          <div className="min-w-0">
            <OathSignature t={t} />
            <p className="mt-3 text-[0.62rem] tracking-[0.14em] text-muted uppercase">
              Sealed by the Headmaster · Tashkent
            </p>
          </div>
        </div>
      </div>
      <WaxSeal t={t} />
    </div>
  );
}

function OathLine({
  item,
  t,
  at,
  last,
  ink,
}: {
  item: (typeof OATH_TERMS)[number];
  t: MotionValue<number>;
  at: number;
  last: boolean;
  ink: string;
}) {
  const y = useTransform(t, [at, at + 0.1], ["115%", "0%"], { clamp: true });
  const rule = useTransform(t, [at + 0.06, at + 0.14], [0, 1], { clamp: true });
  return (
    <div className={last ? "" : "mb-4 sm:mb-6"}>
      <div className="flex items-baseline gap-4 sm:gap-6">
        <span
          className="font-display w-8 shrink-0 text-lg italic sm:text-xl"
          style={{ color: ink }}
        >
          {item.n}.
        </span>
        <span className="block overflow-hidden">
          <motion.span style={{ y }} className="block text-base leading-snug font-medium tracking-[-0.01em] text-forest-deep sm:text-lg">
            {item.term}
          </motion.span>
        </span>
      </div>
      <motion.span
        aria-hidden="true"
        style={{ scaleX: rule }}
        className="mt-4 block h-px w-full origin-left bg-forest/15"
      />
    </div>
  );
}

function OathSignature({ t }: { t: MotionValue<number> }) {
  const draw = useTransform(t, [0.38, 0.55], [0, 1], { clamp: true });
  return (
    <svg viewBox="0 0 220 48" className="h-10 w-48 text-forest sm:h-12 sm:w-56" aria-label="Headmaster's signature">
      <motion.path
        d="M8 36 C 30 8, 44 6, 50 24 C 54 36, 40 44, 52 40 C 70 34, 78 12, 92 18 C 104 23, 96 40, 110 36 C 128 30, 138 14, 152 20 C 162 24, 158 38, 172 34 C 188 29, 198 22, 212 26"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        pathLength={1}
        style={{ pathLength: draw }}
      />
    </svg>
  );
}

function OathMotion() {
  const compact = useCompactLayout();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const docY = useTransform(scrollYProgress, [0, 0.25], [90, 0], { clamp: true });
  const docScale = useTransform(scrollYProgress, [0, 0.25], [0.94, 1], { clamp: true });
  const headY = useTransform(scrollYProgress, [0, 0.2], ["110%", "0%"], { clamp: true });

  return (
    <section
      ref={ref}
      id="oath"
      aria-label="The score pact"
      className="relative h-[210svh] md:h-[300svh]"
    >
      <div className="cinema-stage sticky top-0 flex min-h-svh items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-[1240px] items-center gap-8 px-5 pt-24 pb-8 md:grid-cols-12 md:gap-10 md:px-8 md:py-16">
          <div className="md:col-span-4">
            <p className="text-[0.7rem] font-medium tracking-[0.16em] text-moss uppercase">
              Chapter IV · The oath
            </p>
            <span className="mt-4 block overflow-hidden">
              <motion.h2
                style={{ y: headY }}
                transition={{ ease: easeCinematic }}
                className="text-3xl leading-[1.05] font-medium tracking-[-0.03em] text-forest-deep sm:text-4xl"
              >
                We sign it in wax, not in asterisks.
              </motion.h2>
            </span>
            {compact ? null : (
              <p className="mt-4 max-w-sm text-[0.92rem] leading-relaxed text-muted">
                {OATH_RIDER}
              </p>
            )}
          </div>
          <motion.div style={{ y: docY, scale: docScale }} className="md:col-span-8">
            <Charter t={scrollYProgress} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function OathStatic() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const settled = useTransform(scrollYProgress, () => 1);
  return (
    <section ref={ref} id="oath" aria-label="The score pact" className="py-16 sm:py-28">
      <div className="mx-auto grid max-w-[1240px] items-center gap-10 px-5 md:grid-cols-12 md:px-8">
        <div className="md:col-span-4">
          <p className="text-[0.7rem] font-medium tracking-[0.16em] text-moss uppercase">
            Chapter IV · The oath
          </p>
          <h2 className="mt-4 text-3xl leading-[1.05] font-medium tracking-[-0.03em] text-forest-deep sm:text-4xl">
            We sign it in wax, not in asterisks.
          </h2>
          <p className="mt-4 max-w-sm text-[0.92rem] leading-relaxed text-muted">{OATH_RIDER}</p>
        </div>
        <div className="md:col-span-8">
          <Charter t={settled} />
        </div>
      </div>
    </section>
  );
}

export function Oath() {
  const reduced = usePrefersReducedMotion();
  return reduced ? <OathStatic /> : <OathMotion />;
}
