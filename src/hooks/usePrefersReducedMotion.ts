import { useMotionEnabled } from "./motionPreference";

/**
 * True when the page should render settled, non-animated frames —
 * either the OS asks for reduced motion or the visitor switched the
 * page animation off in the footer.
 */
export function usePrefersReducedMotion() {
  return !useMotionEnabled();
}
