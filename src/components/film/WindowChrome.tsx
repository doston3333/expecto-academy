import { AnimatePresence, motion, type MotionValue } from "motion/react";
import type { ReactNode } from "react";
import { easeCinematic } from "@/lib/motion";
import { HOUSES } from "@/lib/houses";

interface WindowChromeProps {
  breadcrumb: string;
  progress?: MotionValue<number>;
  children: ReactNode;
  className?: string;
}

/**
 * The one persistent stage. Traffic lights and frame never unmount;
 * only the interior and the breadcrumb change as the film cuts.
 */
export function WindowChrome({ breadcrumb, progress, children, className }: WindowChromeProps) {
  return (
    <div
      className={`window-lift overflow-hidden rounded-[20px] border border-forest/12 bg-cream sm:rounded-[24px] ${className ?? ""}`}
    >
      <div className="flex h-[3px]" aria-hidden="true">
        {HOUSES.map((house) => (
          <span key={house.id} className="flex-1" style={{ backgroundColor: house.hex }} />
        ))}
      </div>
      <div className="relative flex h-10 items-center gap-3 border-b border-forest/10 bg-cream-2/60 px-3.5 sm:h-11 sm:px-4">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full" style={{ backgroundColor: HOUSES[0].hex }} />
          <span className="size-2.5 rounded-full" style={{ backgroundColor: HOUSES[3].hex }} />
          <span className="size-2.5 rounded-full" style={{ backgroundColor: HOUSES[1].hex }} />
        </div>
        <div className="relative h-4 min-w-0 flex-1 overflow-hidden text-center">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.p
              key={breadcrumb}
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              exit={{ y: "-110%" }}
              transition={{ duration: 0.42, ease: easeCinematic }}
              className="truncate text-[0.68rem] font-medium tracking-[0.03em] text-moss sm:text-[0.72rem]"
            >
              {breadcrumb}
            </motion.p>
          </AnimatePresence>
        </div>
        <span className="hidden text-[0.62rem] font-medium tracking-[0.14em] text-forest/35 uppercase sm:block">
          Expecto
        </span>
        {progress ? (
          <motion.span
            aria-hidden="true"
            className="absolute right-0 bottom-0 left-0 h-px origin-left bg-forest/40"
            style={{ scaleX: progress }}
          />
        ) : null}
      </div>
      <div className="relative isolate min-h-[22.5rem] bg-cream h-[min(50svh,26rem)] sm:h-auto sm:min-h-0 sm:aspect-[16/10]">
        {children}
      </div>
    </div>
  );
}
