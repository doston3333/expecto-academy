import { PLANS } from "@/lib/content";
import { cn } from "@/lib/cn";
import { AnimatePresence, motion } from "motion/react";
import { useState, type MouseEvent } from "react";
import { EASE, EnrollButton, Eyebrow, FadeUp, HOUSE, RevealLines } from "./ui/primitives";

type Currency = "uzs" | "usd";

const PLAN_HOUSE = {
  apprentice: HOUSE.hufflepuff,
  scholar: HOUSE.gryffindor,
  headmaster: HOUSE.slytherin,
} as const;

function Check({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" className={cn("mt-[3px] shrink-0", className)}>
      <path d="M3 8.5 6.5 12 13 4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function spotlight(e: MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

function PlanCard({ plan, currency, index }: { plan: (typeof PLANS)[number]; currency: Currency; index: number }) {
  const dark = plan.featured;
  const price = currency === "uzs" ? plan.priceUzs : `$${plan.priceUsd}`;
  const unit = currency === "uzs" ? "UZS" : "USD";
  const alt = currency === "uzs" ? `≈ $${plan.priceUsd}` : `${plan.priceUzs} UZS`;

  return (
    <FadeUp delay={index * 0.12} className={cn("h-full", dark && "md:-mt-6")}>
      <article
        onMouseMove={spotlight}
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-[28px] border p-7 transition-transform duration-700 ease-[var(--ease-out-expo)] hover:-translate-y-1.5 md:p-9",
          dark ? "border-gold/40 bg-gryffindor-night text-paper shadow-[0_50px_100px_-40px_rgb(90_20_16/0.6)] md:pb-12" : "border-ink/10 bg-card text-ink",
        )}
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1.5"
          style={{ backgroundColor: dark ? PLAN_HOUSE[plan.id].bright : PLAN_HOUSE[plan.id].fill }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(420px circle at var(--mx, 50%) var(--my, 0%), ${dark ? "rgb(212 169 94 / 0.16)" : "rgb(168 118 46 / 0.08)"}, transparent 60%)`,
          }}
        />
        <div className="relative flex items-start justify-between gap-4">
          <h3 className="font-serif text-[1.75rem] leading-none font-light tracking-[-0.02em]">{plan.name}</h3>
          {plan.featured ? (
            <span className="rounded-full bg-gold-2 px-3 py-1 text-[0.62rem] font-semibold tracking-[0.14em] text-ink uppercase">Most popular</span>
          ) : null}
        </div>
        <p className={cn("relative mt-3 min-h-[3rem] text-[0.9rem] leading-relaxed", dark ? "text-paper/70" : "text-ink-soft")}>{plan.blurb}</p>

        <div className="relative mt-8 h-[5.4rem] overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={currency}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <p className="flex items-baseline gap-2">
                <span className="display text-[2.9rem] leading-none tnum md:text-[3.2rem]">{price}</span>
                <span className={cn("text-[0.85rem]", dark ? "text-paper/60" : "text-ink-soft")}>{unit}</span>
              </p>
              <p className={cn("mt-2 text-[0.8rem] tnum", dark ? "text-paper/55" : "text-ink-faint")}>{alt} · per cohort</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <ul className={cn("relative mt-8 flex-1 space-y-3 border-t pt-7", dark ? "border-paper/12" : "border-ink/10")}>
          {plan.includes.map((item) => (
            <li key={item} className={cn("flex gap-3 text-[0.9rem] leading-snug", dark ? "text-paper/88" : "text-ink-2")}>
              <Check className={dark ? "text-gold-2" : "text-gold"} />
              {item}
            </li>
          ))}
        </ul>

        <EnrollButton variant={dark ? "paper" : "ink"} className="relative mt-10 w-full">
          Enroll — {plan.name}
        </EnrollButton>
      </article>
    </FadeUp>
  );
}

export function Tuition() {
  const [currency, setCurrency] = useState<Currency>("uzs");
  return (
    <section id="pricing" aria-label="Tuition" className="bg-gryffindor-wash py-28 md:py-40">
      <div className="mx-auto max-w-[1320px] px-5 md:px-10">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Eyebrow color={HOUSE.gryffindor.deep}>Tuition</Eyebrow>
            <RevealLines
              as="h2"
              className="display mt-6 text-[clamp(2.4rem,5vw,4.6rem)]"
              lines={["Choose how much", <em key="hi" className="text-gryffindor">help you want.</em>]}
            />
          </div>
          <div className="flex flex-col gap-6 md:col-span-5 md:items-end">
            <FadeUp delay={0.15}>
              <p className="max-w-sm text-[0.95rem] leading-relaxed text-ink-soft md:text-right">
                Every plan starts with the diagnostic. The score pact applies from Scholar up.
              </p>
            </FadeUp>
            <div role="radiogroup" aria-label="Currency" className="inline-flex self-start rounded-full border border-ink/10 bg-card p-1 md:self-end">
              {(["uzs", "usd"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  role="radio"
                  aria-checked={currency === c}
                  onClick={() => setCurrency(c)}
                  className={cn("relative h-9 rounded-full px-5 text-[0.78rem] font-medium tracking-[0.1em] uppercase transition-colors duration-300", currency === c ? "text-paper" : "text-ink-soft hover:text-ink")}
                >
                  {currency === c ? (
                    <motion.span layoutId="currency-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ duration: 0.5, ease: EASE }} />
                  ) : null}
                  <span className="relative">{c}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 grid items-stretch gap-5 md:mt-24 md:grid-cols-3 md:gap-5">
          {PLANS.map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} currency={currency} index={i} />
          ))}
        </div>

        <FadeUp className="mt-10 flex flex-col gap-2 text-[0.82rem] leading-relaxed text-ink-soft md:flex-row md:justify-between md:gap-10">
          <p>The score pact: do the work, miss your agreed gain, and four more weeks are on us.</p>
          <p>Withdraw within 7 days of enrollment for a refund minus the diagnostic fee.</p>
        </FadeUp>
      </div>
    </section>
  );
}
