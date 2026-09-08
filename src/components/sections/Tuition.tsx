import { MagneticButton } from "@/components/ui/MagneticButton";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { PLANS, TELEGRAM_URL } from "@/lib/content";
import { HOUSES, onHouseType } from "@/lib/houses";
import { cn } from "@/lib/cn";
import { Check } from "lucide-react";
import { motion, useMotionValue, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

function PlanCard({
  plan,
  progress,
  index,
}: {
  plan: (typeof PLANS)[number];
  progress: MotionValue<number>;
  index: number;
}) {
  const y = useTransform(progress, [index * 0.12, 0.5 + index * 0.12], [36, 0], { clamp: true });

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-medium tracking-[-0.02em]">{plan.name}</h3>
          <p className={cn("mt-1 text-[0.82rem] leading-snug", plan.featured ? "text-cream/85" : "text-muted")}>
            {plan.blurb}
          </p>
        </div>
        {plan.featured ? (
          <span
            className="shrink-0 rounded-full px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.1em] uppercase"
            style={{ backgroundColor: HOUSES[3].hex, color: onHouseType(HOUSES[3]) }}
          >
            The oath
          </span>
        ) : null}
      </div>
      <div className="mt-6 flex items-baseline gap-2">
        <span className="text-[1.9rem] leading-none font-semibold tracking-[-0.03em] tabular-nums">
          {plan.priceUzs}
        </span>
        <span className={cn("text-sm", plan.featured ? "text-cream/80" : "text-muted")}>UZS</span>
      </div>
      <p className={cn("mt-1 text-[0.78rem]", plan.featured ? "text-cream/80" : "text-muted")}>
        ≈ ${plan.priceUsd} · per cohort
      </p>
      <ul className="mt-6 space-y-2.5">
        {plan.includes.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-[0.85rem] leading-snug">
            <Check className={cn("mt-0.5 size-3.5 shrink-0", plan.featured ? "text-cream" : "text-forest")} />
            <span className={plan.featured ? "text-cream/90" : "text-forest-deep/85"}>{item}</span>
          </li>
        ))}
      </ul>
      <MagneticButton
        href={TELEGRAM_URL}
        external
        variant={plan.featured ? "invert" : "ghost"}
        className="mt-8 w-full min-w-0"
      >
        Enroll — {plan.name}
      </MagneticButton>
    </>
  );

  const classes = cn(
    "flex flex-col rounded-[24px] border p-7 transition-[border-color,filter] duration-300 sm:p-8",
    plan.featured
      ? "border-forest bg-forest text-cream window-lift hover:brightness-110"
      : "border-forest/12 bg-cream text-forest-deep hover:border-forest/30",
  );

  return (
    <motion.div
      style={{
        y,
        ...(plan.featured
          ? {}
          : {
              borderTopColor: HOUSES[index % HOUSES.length].hex,
              borderTopWidth: "3px",
            }),
      }}
      className={classes}
    >
      {body}
    </motion.div>
  );
}

export function Tuition() {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.95", "start 0.35"] });
  const staticProgress = useMotionValue(1);
  const progress = reduced ? staticProgress : scrollYProgress;

  return (
    <section ref={ref} id="pricing" aria-label="Tuition" className="py-16 sm:py-28">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.7rem] font-medium tracking-[0.16em] text-moss uppercase">Tuition</p>
            <h2 className="mt-4 max-w-xl text-3xl leading-[1.05] font-medium tracking-[-0.03em] text-forest-deep sm:text-5xl">
              Pay for the score, not the theatre.
            </h2>
          </div>
          <p className="max-w-xs text-[0.85rem] leading-relaxed text-muted">
            Every plan starts with the diagnostic. The pact lives on Scholar and
            above.
          </p>
        </div>
        <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-3 lg:gap-5">
          {PLANS.map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} index={i} progress={progress} />
          ))}
        </div>
        <p className="mt-8 text-[0.78rem] text-muted">
          Score pact: miss the agreed gain after doing the work, and four extra weeks of
          classes are on us. Withdraw within 7 days of enrollment for a refund minus the diagnostic
          fee.
        </p>
      </div>
    </section>
  );
}
