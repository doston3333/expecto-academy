import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";
import { motion, useMotionValue, useSpring } from "motion/react";
import type { ReactNode } from "react";

interface MagneticButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "solid" | "ghost" | "invert";
  external?: boolean;
  onClick?: () => void;
}

export function MagneticButton({
  href,
  children,
  className,
  variant = "solid",
  external = false,
  onClick,
}: MagneticButtonProps) {
  const reduced = usePrefersReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 240, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 240, damping: 18, mass: 0.4 });

  const styles = {
    solid: "bg-forest text-cream hover:bg-forest-soft",
    ghost:
      "border border-forest/10 bg-cream/70 text-forest-deep hover:border-forest/25 hover:bg-cream",
    invert: "bg-cream text-forest-deep hover:bg-cream-2",
  } as const;

  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      onClick={onClick}
      className={cn(
        "group relative inline-flex h-11 min-w-[9.5rem] items-center justify-center overflow-hidden rounded-full px-5 text-sm font-medium transition-colors duration-200",
        styles[variant],
        className,
      )}
      style={reduced ? undefined : { x: springX, y: springY }}
      whileHover={reduced ? undefined : { scale: 1.03 }}
      whileTap={reduced ? undefined : { scale: 0.95 }}
      onMouseMove={(event) => {
        if (reduced) return;
        const rect = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - rect.left - rect.width / 2) * 0.22);
        y.set((event.clientY - rect.top - rect.height / 2) * 0.22);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
      />
      <span className="relative">{children}</span>
    </motion.a>
  );
}
