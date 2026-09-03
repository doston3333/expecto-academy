import { OwlPost } from "@/components/ui/OwlPost";
import { FAQS } from "@/lib/content";
import { HOUSES, onHouseType } from "@/lib/houses";
import { easeCinematic } from "@/lib/motion";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { useState } from "react";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" aria-label="Common questions" className="py-16 sm:py-28">
      <div className="mx-auto max-w-[880px] px-5 md:px-8">
        <p className="flex items-center gap-2 text-[0.7rem] font-medium tracking-[0.16em] text-moss uppercase">
          <OwlPost className="size-4.5" />
          Common questions
        </p>
        <h2 className="mt-4 text-3xl leading-[1.05] font-medium tracking-[-0.03em] text-forest-deep sm:text-5xl">
          Asked before you ask.
        </h2>
        <div className="mt-12 border-t border-forest/12">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            const house = HOUSES[i % HOUSES.length];
            return (
              <div key={faq.q} className="border-b border-forest/12">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="group flex min-h-11 w-full items-center justify-between gap-4 py-6 text-left sm:gap-6 sm:py-5"
                >
                  <span className="text-[1.05rem] font-medium tracking-[-0.02em] text-forest-deep transition-transform duration-200 group-hover:translate-x-1 sm:text-lg">
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: easeCinematic }}
                    className="grid size-11 shrink-0 place-items-center rounded-full border"
                    style={{
                      borderColor: isOpen ? house.hex : `${house.hex}66`,
                      backgroundColor: isOpen ? house.hex : "transparent",
                      color: isOpen ? onHouseType(house) : house.ink,
                    }}
                  >
                    <Plus className="size-4" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      id={`faq-panel-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.42, ease: easeCinematic }}
                      className="overflow-hidden pl-4"
                      style={{ borderLeft: `2px solid ${house.hex}` }}
                    >
                      <p className="max-w-2xl pb-6 text-[0.92rem] leading-relaxed text-muted">
                        {faq.a}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
