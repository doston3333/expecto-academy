import { CanopyChapter } from "@/components/cinema/CanopyChapter";
import { CurtainChapter } from "@/components/cinema/CurtainChapter";
import { DeskClearing } from "@/components/cinema/DeskClearing";
import { FilmOverture } from "@/components/cinema/FilmOverture";
import { HorizonChapter } from "@/components/cinema/HorizonChapter";
import { WordsChapter } from "@/components/cinema/WordsChapter";
import { ActFilm } from "@/components/film/ActFilm";
import { ChapterRail } from "@/components/film/ChapterRail";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SkipLink } from "@/components/layout/SkipLink";
import { Closer } from "@/components/sections/Closer";
import { Faq } from "@/components/sections/FaqSection";
import { Hero } from "@/components/sections/Hero";
import { Letters } from "@/components/sections/Letters";
import { Method } from "@/components/sections/Method";
import { Oath } from "@/components/sections/Oath";
import { Tuition } from "@/components/sections/Tuition";
import { Universities } from "@/components/sections/Universities";
import { useAllowSmoothScroll, useWideDesktop } from "@/hooks/useMedia";
import { MotionPreferenceProvider } from "@/hooks/useMotionPreference";
import { usePageCinema } from "@/hooks/usePageCinema";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { WandSparks } from "@/components/ui/WandSparks";
import { FOREST } from "@/lib/palette";
import { ReactLenis } from "lenis/react";
import { useRef, type ReactNode } from "react";

function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const allowSmooth = useAllowSmoothScroll();
  // Native touch scroll on phones. ?qa=1 also disables smoothing for captures.
  if (reduced || !allowSmooth || new URLSearchParams(window.location.search).has("qa")) {
    return children;
  }
  return (
    <ReactLenis root options={{ lerp: 0.06, duration: 1.3, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}

function Page() {
  const reduced = usePrefersReducedMotion();
  const showRail = useWideDesktop();
  const pageRef = useRef<HTMLDivElement>(null);
  usePageCinema(pageRef, !reduced);
  return (
    <SmoothScroll>
      <div ref={pageRef} className="xc-page" data-cinema={reduced ? "off" : "on"}>
        <SkipLink />
        <ScrollProgress />
        <WandSparks />
        <Navbar />
        {reduced || !showRail ? null : <ChapterRail />}
        <main id="main">
          <Hero />
          <FilmOverture />
          <ActFilm />
          <CurtainChapter
            numeral="Chapter II · the method"
            line="The test doesn't change. Your score can."
            tint={FOREST}
            leftKicker="What you're up against"
            rightKicker="What moves"
            left="doesn't change."
            right="Your score can."
            leftFoot="Same test. Same traps."
            rightFoot="Twelve weeks of Tuesdays."
          />
          <Method />
          <Oath />
          <DeskClearing />
          <Universities />
          <WordsChapter />
          <Letters />
          <HorizonChapter numeral="Chapter V · tuition" line="Do the math." />
          <Tuition />
          <Faq />
          <CanopyChapter />
          <Closer />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}

export default function App() {
  return (
    <MotionPreferenceProvider>
      <Page />
    </MotionPreferenceProvider>
  );
}
