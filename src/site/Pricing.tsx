import { PLANS } from "@/lib/content";
import { cn } from "@/lib/cn";
import { Check } from "lucide-react";
import { useBooking } from "./bookingContext";
import { EnrollButton, Eyebrow, FadeUp, HOUSE, RevealLines, Star } from "./ui/primitives";

export function Pricing() {
  const booking = useBooking();
  return (
    <section id="pricing" aria-label="Pricing" className="bg-paper-2 py-28 md:py-40">
      <div className="mx-auto max-w-[1320px] px-5 md:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow plain color={HOUSE.ravenclaw.deep} className="justify-center">
            Pricing
          </Eyebrow>
          <RevealLines
            as="h2"
            className="display mt-6 text-[clamp(2.4rem,5.4vw,4.8rem)]"
            lines={["Two plans,", <em key="hi" className="text-gold">one goal: your score.</em>]}
          />
          <FadeUp delay={0.15}>
            <p className="mx-auto mt-6 max-w-lg text-[1rem] leading-relaxed text-ink-soft">
              Pick how much hands-on guidance you want. Both plans are built around a target score we put in writing.
            </p>
          </FadeUp>
        </div>

        <div className="mx-auto mt-16 grid max-w-[1060px] gap-6 md:mt-20 md:grid-cols-2 md:gap-8">
          {PLANS.map((plan, i) => {
            const premium = plan.id === "premium";
            return (
              <FadeUp key={plan.id} delay={0.1 + i * 0.12} className="flex">
                <article
                  className={cn(
                    "relative flex w-full flex-col overflow-hidden rounded-[28px] p-7 md:p-10",
                    premium
                      ? "bg-night text-paper shadow-[0_40px_90px_-30px_rgb(11_19_27/0.8)] ring-1 ring-gold-2/40"
                      : "border border-ink/10 bg-card shadow-[0_30px_70px_-40px_rgb(22_33_43/0.35)]",
                  )}
                >
                  {premium ? (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0"
                      style={{ background: "radial-gradient(70% 45% at 100% 0%, rgb(212 169 94 / 0.22), transparent 70%)" }}
                    />
                  ) : null}

                  <div className="relative flex flex-1 flex-col">
                    <p
                      className={cn(
                        "inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.68rem] font-semibold tracking-[0.16em] uppercase",
                        premium ? "bg-gold-2 text-ink" : "bg-ravenclaw-wash text-ravenclaw",
                      )}
                    >
                      <Star size={9} />
                      {plan.badge}
                    </p>

                    <h3 className="display mt-7 text-[2.6rem] md:text-[3rem]">{plan.name}</h3>
                    <p className={cn("mt-3 max-w-sm text-[0.98rem] leading-relaxed", premium ? "text-paper/65" : "text-ink-soft")}>
                      {plan.blurb}
                    </p>

                    <p className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className={cn("display text-[3.6rem] tnum md:text-[4.2rem]", premium && "text-gold-2")}>{plan.price}</span>
                      <span className={cn("text-[0.95rem]", premium ? "text-paper/60" : "text-ink-soft")}>so’m / month</span>
                    </p>

                    <ul className={cn("mt-8 flex-1 space-y-4 border-t pt-8", premium ? "border-paper/15" : "border-ink/10")}>
                      {plan.includes.map((f) => (
                        <li key={f.title} className="flex gap-3.5">
                          <span
                            aria-hidden="true"
                            className={cn(
                              "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full",
                              premium ? "bg-gold-2/20 text-gold-2" : "bg-slytherin-wash text-slytherin",
                            )}
                          >
                            <Check size={14} strokeWidth={2.2} />
                          </span>
                          <span>
                            <span className="block text-[1rem] leading-snug font-medium">{f.title}</span>
                            {"note" in f ? (
                              <span className={cn("mt-0.5 block text-[0.88rem] leading-snug", premium ? "text-paper/55" : "text-ink-soft")}>
                                {f.note}
                              </span>
                            ) : null}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <EnrollButton
                      source={`pricing-${plan.id}`}
                      variant={premium ? "paper" : "ink"}
                      className="mt-10 w-full"
                    >
                      Book a session
                    </EnrollButton>
                  </div>
                </article>
              </FadeUp>
            );
          })}
        </div>

        <FadeUp delay={0.2} className="mt-10 text-center">
          <p className="text-[0.95rem] text-ink-soft">
            Not sure which fits?{" "}
            <button
              type="button"
              onClick={() => booking.open("pricing-help")}
              className="link-draw pb-0.5 font-medium text-ink"
            >
              Book a session and we’ll help you choose.
            </button>
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
