import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { TELEGRAM_URL } from "@/lib/content";
import { cn } from "@/lib/cn";
import { animate, motion, useInView, type Transition } from "motion/react";
import { useEffect, useId, useRef, useState, type ComponentProps, type CSSProperties, type ReactNode } from "react";

export const EASE = [0.16, 1, 0.3, 1] as const;
export const EASE_FILM = [0.76, 0, 0.24, 1] as const;

/** `deep` is for text on paper, `fill` for stripes and marks on paper, `bright` for night. */
export const HOUSE = {
  gryffindor: { id: "gryffindor", name: "Gryffindor", deep: "var(--color-gryffindor)", fill: "var(--color-gryffindor-fill)", bright: "var(--color-gryffindor-2)" },
  slytherin: { id: "slytherin", name: "Slytherin", deep: "var(--color-slytherin)", fill: "var(--color-slytherin-fill)", bright: "var(--color-slytherin-2)" },
  ravenclaw: { id: "ravenclaw", name: "Ravenclaw", deep: "var(--color-ravenclaw)", fill: "var(--color-ravenclaw-fill)", bright: "var(--color-ravenclaw-2)" },
  hufflepuff: { id: "hufflepuff", name: "Hufflepuff", deep: "var(--color-hufflepuff)", fill: "var(--color-hufflepuff-fill)", bright: "var(--color-hufflepuff-2)" },
} as const;

export const HOUSES = [HOUSE.gryffindor, HOUSE.slytherin, HOUSE.ravenclaw, HOUSE.hufflepuff] as const;

export function house(index: number) {
  return HOUSES[index % HOUSES.length];
}

/** An id safe to use inside an SVG `url(#…)` reference. */
export function useSvgId(prefix: string) {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
}

/** Hard-stop horizontal gradient through the four houses, for SVG strokes. Place inside `<defs>`. */
export function HouseGradient({ id, tone = "fill" }: { id: string; tone?: "fill" | "bright" }) {
  return (
    <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
      {HOUSES.flatMap((h, i) => [
        <stop key={`${h.id}-a`} offset={i / HOUSES.length} style={{ stopColor: h[tone] }} />,
        <stop key={`${h.id}-b`} offset={(i + 1) / HOUSES.length} style={{ stopColor: h[tone] }} />,
      ])}
    </linearGradient>
  );
}

/** Four house stripes side by side. */
export function HouseRibbon({ className, tone = "fill" }: { className?: string; tone?: "fill" | "bright" }) {
  return (
    <span aria-hidden="true" className={cn("flex h-1 overflow-hidden", className)}>
      {HOUSES.map((h) => (
        <span key={h.id} className="flex-1" style={{ backgroundColor: h[tone] }} />
      ))}
    </span>
  );
}

/**
 * Hand-drawn tremble. Two displacement filters whose noise seed steps at
 * ~8 fps — the "boil" of frame-by-frame line animation.
 */
export function BoilFilters() {
  const soft = useRef<SVGFETurbulenceElement>(null);
  const strong = useRef<SVGFETurbulenceElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let seed = 1;
    const id = window.setInterval(() => {
      seed = (seed % 6) + 1;
      soft.current?.setAttribute("seed", String(seed));
      strong.current?.setAttribute("seed", String(seed + 11));
    }, 125);
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <filter id="xa-boil" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence ref={soft} type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="1" />
        <feDisplacementMap in="SourceGraphic" scale="2.4" />
      </filter>
      <filter id="xa-boil-strong" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence ref={strong} type="fractalNoise" baseFrequency="0.028" numOctaves="2" seed="12" />
        <feDisplacementMap in="SourceGraphic" scale="4" />
      </filter>
    </svg>
  );
}

/** Lines rising out of a mask, one after another. */
export function RevealLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.09,
  as = "span",
  immediate = false,
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  immediate?: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const show = immediate || inView;
  const Tag = as;

  return (
    <Tag ref={ref as never} className={className}>
      {lines.map((line, i) => (
        <span key={i} className={cn("block overflow-hidden pb-[0.08em] -mb-[0.08em]", lineClassName)}>
          <motion.span
            className="block will-change-transform"
            initial={reduced ? false : { y: "108%", rotate: 2.5 }}
            animate={show ? { y: "0%", rotate: 0 } : undefined}
            transition={{ duration: 1.15, ease: EASE, delay: delay + i * stagger }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Soft fade-up for supporting copy and blocks. */
export function FadeUp({
  children,
  className,
  delay = 0,
  y = 26,
  immediate = false,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  immediate?: boolean;
  as?: "div" | "p" | "li" | "span";
}) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const show = immediate || inView;
  const Tag = motion[as];
  return (
    <Tag
      ref={ref as never}
      className={className}
      initial={reduced ? false : { opacity: 0, y, filter: "blur(6px)" }}
      animate={show ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
      transition={{ duration: 1.1, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
}

/** An SVG stroke that draws itself once it scrolls into view. */
export function DrawPath({
  delay = 0,
  duration = 1.4,
  play,
  transition,
  ...rest
}: ComponentProps<typeof motion.path> & {
  delay?: number;
  duration?: number;
  play?: boolean;
  transition?: Transition;
}) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<SVGPathElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const show = play ?? inView;
  return (
    <motion.path
      ref={ref}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={reduced ? false : { pathLength: 0, opacity: 0 }}
      animate={show ? { pathLength: 1, opacity: 1 } : undefined}
      transition={
        transition ?? {
          pathLength: { duration, ease: [0.65, 0, 0.35, 1], delay },
          opacity: { duration: 0.01, delay },
        }
      }
      {...rest}
    />
  );
}

/** Number that counts up the first time it is seen. */
export function Counter({
  to,
  from = 0,
  duration = 2.2,
  delay = 0,
  format = (n: number) => Math.round(n).toLocaleString("en-US"),
  className,
  play,
}: {
  to: number;
  from?: number;
  duration?: number;
  delay?: number;
  format?: (n: number) => string;
  className?: string;
  play?: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const show = play ?? inView;
  const [value, setValue] = useState(reduced ? to : from);

  useEffect(() => {
    if (reduced || !show) return;
    const controls = animate(from, to, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: setValue,
    });
    return () => controls.stop();
  }, [show, reduced, from, to, duration, delay]);

  return (
    <span ref={ref} className={cn("tnum", className)}>
      {format(reduced ? to : value)}
    </span>
  );
}

function Arrow() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M1 6h9.5M6.5 2 10.5 6l-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TelegramMark({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21.94 4.19c.23-.95-.64-1.7-1.55-1.32L2.3 10.2c-.97.4-.9 1.8.1 2.1l4.7 1.47 1.8 5.73c.26.82 1.3 1.07 1.9.46l2.6-2.64 4.86 3.58c.8.59 1.94.16 2.16-.82l3.52-15.89ZM8.4 13.16l9.3-5.74c.17-.1.35.12.22.27l-7.5 8.08-.3 3.3-1.72-5.91Z" />
    </svg>
  );
}

export function Button({
  href,
  children,
  variant = "ink",
  external,
  arrow = true,
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: "ink" | "ghost" | "paper" | "line-light";
  external?: boolean;
  arrow?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn("btn", `btn--${variant}`, arrow && "pr-2.5", className)}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      <span>{children}</span>
      {arrow ? (
        <span className="btn-arrow">
          <Arrow />
        </span>
      ) : null}
    </a>
  );
}

export function EnrollButton({
  variant = "ink",
  className,
  children = "Enroll on Telegram",
}: {
  variant?: "ink" | "ghost" | "paper" | "line-light";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <a
      href={TELEGRAM_URL}
      target="_blank"
      rel="noreferrer"
      className={cn("btn pr-2.5", `btn--${variant}`, className)}
    >
      <TelegramMark />
      <span>{children}</span>
      <span className="btn-arrow">
        <Arrow />
      </span>
    </a>
  );
}

/** The logo's eight-point star, as a glyph. */
export function Star({ className, size = 14, style }: { className?: string; size?: number; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className} style={style}>
      <path
        d="M12 0 13.6 9.2 20.5 3.5 14.8 10.4 24 12 14.8 13.6 20.5 20.5 13.6 14.8 12 24 10.4 14.8 3.5 20.5 9.2 13.6 0 12 9.2 10.4 3.5 3.5 10.4 9.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Eyebrow({
  children,
  className,
  plain,
  color,
}: {
  children: ReactNode;
  className?: string;
  plain?: boolean;
  color?: string;
}) {
  return (
    <p className={cn("eyebrow", plain && "eyebrow--plain", className)} style={color ? { color } : undefined}>
      {children}
    </p>
  );
}
