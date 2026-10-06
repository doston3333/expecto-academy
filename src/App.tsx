import { useAllowSmoothScroll } from "@/hooks/useMedia";
import { MotionPreferenceProvider } from "@/hooks/useMotionPreference";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { BookingProvider } from "@/site/Booking";
import { Closer } from "@/site/Closer";
import { Faq } from "@/site/Faq";
import { Film } from "@/site/Film";
import { Footer } from "@/site/Footer";
import { Hero } from "@/site/Hero";
import { Intro } from "@/site/Intro";
import { Method } from "@/site/Method";
import { Nav } from "@/site/Nav";
import { Pact } from "@/site/Pact";
import { Pricing } from "@/site/Pricing";
import { Proof } from "@/site/Proof";
import { Results } from "@/site/Results";
import { Statement } from "@/site/Statement";
import { Teachers } from "@/site/Teachers";
import { Worth } from "@/site/Worth";
import { BoilFilters } from "@/site/ui/primitives";
import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const allowSmooth = useAllowSmoothScroll();
  if (reduced || !allowSmooth || new URLSearchParams(window.location.search).has("qa")) {
    return children;
  }
  return (
    <ReactLenis root options={{ lerp: 0.085, smoothWheel: true, anchors: { offset: -72 } }}>
      {children}
    </ReactLenis>
  );
}

function Page() {
  return (
    <SmoothScroll>
      <BookingProvider>
        <div className="paper-grain">
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[110] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-paper">
            Skip to content
          </a>
          <BoilFilters />
          <Intro />
          <Nav />
          <main id="main">
            <Hero />
            <Proof />
            <Film />
            <Statement lead="The test doesn’t change." highlight="Your score can." eyebrow="Chapter II · the method" />
            <Method />
            <Teachers />
            <Pact />
            <Results />
            <Worth />
            <Pricing />
            <Faq />
            <Closer />
          </main>
          <Footer />
        </div>
      </BookingProvider>
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
