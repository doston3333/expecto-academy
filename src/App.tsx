import { ActFilm } from "@/components/film/ActFilm";
import { ChapterRail } from "@/components/film/ChapterRail";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SkipLink } from "@/components/layout/SkipLink";
import { ChapterBreak } from "@/components/sections/ChapterBreak";
import { Closer } from "@/components/sections/Closer";
import { Faq } from "@/components/sections/FaqSection";
import { Hero } from "@/components/sections/Hero";
import { Letters } from "@/components/sections/Letters";
import { Method } from "@/components/sections/Method";
import { Oath } from "@/components/sections/Oath";
import { Tuition } from "@/components/sections/Tuition";
import { Universities } from "@/components/sections/Universities";
import { useAllowSmoothScroll, useWideDesktop } from "@/hooks/useMedia";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { WandSparks } from "@/components/ui/WandSparks";
import { FOREST } from "@/lib/palette";
import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

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

export default function App() {
  const reduced = usePrefersReducedMotion();
  const showRail = useWideDesktop();
  return (
    <SmoothScroll>
      <SkipLink />
      <ScrollProgress />
      <WandSparks />
      <Navbar />
      {reduced || !showRail ? null : <ChapterRail />}
      <main id="main">
        <Hero />
        <ActFilm />
        <ChapterBreak
          numeral="Chapter II · the method"
          line="The test doesn't change. Your score can."
          tint={FOREST}
        />
        <Method />
        <Oath />
        <Universities />
        <Letters />
        <ChapterBreak
          numeral="Chapter V · tuition"
          line="Do the math."
        />
        <Tuition />
        <Faq />
        <Closer />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
