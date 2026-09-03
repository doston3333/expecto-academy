import type { MotionValue } from "motion/react";
import { motionValue, useTransform } from "motion/react";

/** Constant 1 — pass to scenes when rendering their final (static) frame. */
export const FINAL_T = motionValue(1);

export const easeSpace = [0.22, 0.68, 0.35, 1] as const;
export const easeCinematic = [0.76, 0, 0.24, 1] as const;

/** Fraction of one beat-segment that a scene wipe occupies. */
export const WIPE = 0.42;

/**
 * Incoming scene covers the previous from below.
 * Transform-only — the phone wipe. Desktop keeps the clip-path diagonal.
 */
export function useCoverY(
  progress: MotionValue<number>,
  index: number,
  count: number,
): MotionValue<string> {
  const start = index / count;
  const end = start + WIPE / count;
  return useTransform(progress, [start, end], ["100%", "0%"], { clamp: true });
}

/** Keep the live beat, the one being covered, and the one about to enter. */
export function inMountWindow(current: number, index: number, radius = 1): boolean {
  return index >= current - radius && index <= current + radius;
}

export function beatCount<T>(beats: readonly T[]): number {
  return beats.length;
}

/** Index of the active beat for a 0..1 playhead. */
export function beatIndex(progress: number, count: number): number {
  return Math.min(count - 1, Math.max(0, Math.floor(progress * count)));
}

/** Local 0..1 progress inside one beat segment. */
export function useSegment(
  progress: MotionValue<number>,
  index: number,
  count: number,
): MotionValue<number> {
  const start = index / count;
  const end = (index + 1) / count;
  return useTransform(progress, [start, end], [0, 1], { clamp: true });
}

/** Camera settle at the head of an act: the window rises out of the hero peek. */
export function useDock(progress: MotionValue<number>, span = 0.09) {
  const scale = useTransform(progress, [0, span], [0.92, 1], { clamp: true });
  const y = useTransform(progress, [0, span], [120, 0], { clamp: true });
  const rotateX = useTransform(progress, [0, span], [5, 0], { clamp: true });
  return { scale, y, rotateX };
}

/**
 * Local 0..1 playtime inside a scene, starting once its wipe has finished
 * covering the previous scene. This is what animates *inside* the window.
 */
export function useSceneTime(
  progress: MotionValue<number>,
  index: number,
  count: number,
): MotionValue<number> {
  const wipeEnd = index / count + (index === 0 ? 0.04 : WIPE / count);
  const segEnd = (index + 1) / count;
  return useTransform(progress, [wipeEnd, segEnd], [0, 1], { clamp: true });
}

/** Rack focus: a scene dims and settles back while the next wipe covers it. */
export function useRack(progress: MotionValue<number>, index: number, count: number) {
  const isLast = index === count - 1;
  const start = isLast ? 0.99 : (index + 1) / count;
  const end = isLast ? 1 : start + WIPE / count;
  const scale = useTransform(progress, [start, end], [1, isLast ? 1 : 0.965], { clamp: true });
  const opacity = useTransform(progress, [start, end], [1, isLast ? 1 : 0.4], { clamp: true });
  return { scale, opacity };
}
