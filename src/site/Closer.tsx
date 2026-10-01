import { EMAIL, NEXT_COHORT, TELEGRAM_HANDLE } from "@/lib/content";
import { useEffect, useState } from "react";
import { Ocean } from "./ui/Ocean";
import { EnrollButton, Eyebrow, FadeUp, house, RevealLines } from "./ui/primitives";

function computeCountdown(target: Date) {
  const diff = target.getTime() - Date.now();
  const abs = Math.max(0, diff);
  return {
    passed: diff <= 0,
    parts: [
      { v: Math.floor(abs / 86_400_000), l: "days" },
      { v: Math.floor((abs / 3_600_000) % 24), l: "hours" },
      { v: Math.floor((abs / 60_000) % 60), l: "minutes" },
      { v: Math.floor((abs / 1000) % 60), l: "seconds" },
    ],
  };
}

function useCountdown(target: Date) {
  const [value, setValue] = useState(() => computeCountdown(target));
  useEffect(() => {
    const id = window.setInterval(() => setValue(computeCountdown(target)), 1000);
    return () => window.clearInterval(id);
  }, [target]);
  return value;
}

export function Closer() {
  const countdown = useCountdown(NEXT_COHORT);
  return (
    <section id="enroll" aria-label="Enroll" data-theme="dark" className="relative flex min-h-[112svh] flex-col overflow-hidden bg-night text-paper">
      <div className="absolute inset-0">
        <Ocean mode="night" horizon={0.7} lighthouse stars />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-[1320px] px-5 pt-32 text-center md:px-10 md:pt-[18svh]">
        <Eyebrow plain className="justify-center text-gold-2">
          The hall is lit. Take your seat.
        </Eyebrow>
        <RevealLines
          as="h2"
          className="display mx-auto mt-7 text-[clamp(3.4rem,11vw,10.5rem)] leading-[0.92]"
          stagger={0.14}
          lines={["Get Sorted.", <em key="hi" className="text-gold-2">Earn the seat.</em>]}
        />
        <FadeUp delay={0.3} className="mt-10 flex flex-col items-center">
          <p className="text-[0.7rem] font-medium tracking-[0.22em] text-paper/60 uppercase">Next cohort · 8 September 2026</p>
          {countdown.passed ? (
            <p className="mt-4 font-serif text-[1.25rem] font-light text-paper/90 italic md:text-[1.4rem]">
              This cohort has started — message us about the next one.
            </p>
          ) : (
            <div className="mt-5 flex gap-6 md:gap-10" aria-live="off">
              {countdown.parts.map((p, i) => (
                <div key={p.l} className="flex flex-col items-center">
                  <p className="display text-[2.6rem] tnum md:text-[3.2rem]">{String(p.v).padStart(2, "0")}</p>
                  <span aria-hidden="true" className="mt-2 h-[2px] w-6 rounded-full" style={{ backgroundColor: house(i).bright }} />
                  <p className="mt-2 text-[0.62rem] tracking-[0.2em] text-paper/50 uppercase">{p.l}</p>
                </div>
              ))}
            </div>
          )}
        </FadeUp>
        <FadeUp delay={0.45} className="mt-12 flex flex-col items-center gap-4">
          <EnrollButton variant="paper" className="min-h-16 px-10 text-[1.12rem] shadow-[0_20px_50px_-16px_rgb(212_169_94/0.9)]" />
          <p className="text-[0.82rem] text-paper/55">Opens Telegram · {TELEGRAM_HANDLE}</p>
          <a href={`mailto:${EMAIL}`} className="link-draw pb-0.5 text-[0.88rem] text-paper/60 hover:text-paper">
            {EMAIL}
          </a>
        </FadeUp>
      </div>
    </section>
  );
}
