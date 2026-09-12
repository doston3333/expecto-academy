import { useMemo, useState, type ReactNode } from "react";
import {
  MotionPreferenceContext,
  useOsReduced,
  type MotionPreference,
} from "./motionPreference";

/**
 * One motion switch for the whole page — OS preference by default, with an
 * explicit footer toggle that wins over it. `usePrefersReducedMotion` reads
 * this context, so every cinematic scene degrades to its settled frame.
 */
export function MotionPreferenceProvider({ children }: { children: ReactNode }) {
  const osReduced = useOsReduced();
  const [override, setOverride] = useState<boolean | null>(null);

  const value = useMemo<MotionPreference>(
    () => ({ enabled: override === null ? !osReduced : override, override, setOverride }),
    [override, osReduced],
  );

  return (
    <MotionPreferenceContext.Provider value={value}>
      {children}
    </MotionPreferenceContext.Provider>
  );
}
