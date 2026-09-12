import { createContext, useContext, useEffect, useState } from "react";

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

export interface MotionPreference {
  /** True while the page may animate — OS allows it and the visitor hasn't opted out. */
  enabled: boolean;
  /** The visitor's explicit choice, or null while following the OS setting. */
  override: boolean | null;
  setOverride: (value: boolean | null) => void;
}

export const MotionPreferenceContext = createContext<MotionPreference | null>(null);

export function useOsReduced(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia(REDUCED_QUERY).matches,
  );
  useEffect(() => {
    const media = window.matchMedia(REDUCED_QUERY);
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return reduced;
}

/** Motion on/off — context-aware, falls back to the OS setting outside a provider. */
export function useMotionEnabled(): boolean {
  const context = useContext(MotionPreferenceContext);
  const osReduced = useOsReduced();
  if (context) return context.enabled;
  return !osReduced;
}

export function useMotionPreferenceControl() {
  return useContext(MotionPreferenceContext);
}
