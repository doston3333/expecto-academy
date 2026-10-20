import { Ocean } from "./ui/Ocean";
import { EnrollButton, Eyebrow, FadeUp, RevealLines } from "./ui/primitives";

export function Closer() {
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
          <p className="text-[0.7rem] font-medium tracking-[0.22em] text-paper/60 uppercase">Next cohort</p>
          <p className="display mt-3 text-[2.6rem] md:text-[3.2rem]">October 2026</p>
        </FadeUp>
        <FadeUp delay={0.45} className="mt-12 flex flex-col items-center gap-4">
          <EnrollButton source="closer" variant="paper" className="min-h-16 px-10 text-[1.12rem] shadow-[0_20px_50px_-16px_rgb(212_169_94/0.9)]" />
          <p className="text-[0.82rem] text-paper/55">Takes a minute · we’ll get back to you fast</p>
        </FadeUp>
      </div>
    </section>
  );
}
