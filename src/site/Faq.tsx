import { FAQS, TELEGRAM_URL } from "@/lib/content";
import { cn } from "@/lib/cn";
import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import { EASE, Eyebrow, FadeUp, house, HOUSE, RevealLines } from "./ui/primitives";

function Item({ q, a, open, onToggle, index }: { q: string; a: string; open: boolean; onToggle: () => void; index: number }) {
  const id = useId();
  return (
    <FadeUp as="li" delay={index * 0.04} y={12} className="border-b border-ink/10">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={onToggle}
          className="group flex w-full items-center gap-6 py-6 text-left md:py-7"
        >
          <span className="w-6 shrink-0 font-serif text-[0.9rem] tnum" style={{ color: house(index).deep }}>{String(index + 1).padStart(2, "0")}</span>
          <span className={cn("flex-1 font-serif text-[1.2rem] leading-snug font-light tracking-[-0.01em] transition-colors duration-300 md:text-[1.45rem]", open ? "text-ink" : "text-ink-2 group-hover:text-ink")}>
            {q}
          </span>
          <span
            className={cn("relative grid size-9 shrink-0 place-items-center rounded-full border transition-colors duration-500", open ? "text-paper" : "border-ink/15 text-ink")}
            style={
              open
                ? {
                    backgroundColor: house(index).fill,
                    borderColor: house(index).fill,
                    color: house(index).id === "hufflepuff" ? "var(--color-ink)" : undefined,
                  }
                : undefined
            }
            aria-hidden="true"
          >
            <span className="absolute h-px w-3 bg-current" />
            <motion.span className="absolute h-3 w-px bg-current" animate={{ rotate: open ? 90 : 0, opacity: open ? 0 : 1 }} transition={{ duration: 0.4, ease: EASE }} />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={id}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pr-14 pb-7 pl-12 text-[0.98rem] leading-relaxed text-ink-soft">{a}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </FadeUp>
  );
}

export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" aria-label="Common questions" className="bg-paper pb-28 md:pb-40">
      <div className="mx-auto grid max-w-[1320px] gap-12 border-t border-ink/10 px-5 pt-20 md:grid-cols-12 md:gap-10 md:px-10 md:pt-28">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-28">
            <Eyebrow color={HOUSE.slytherin.deep}>FAQ</Eyebrow>
            <RevealLines
              as="h2"
              className="display mt-6 text-[clamp(2.4rem,4.4vw,4rem)]"
              lines={["Questions we hear", <em key="hi" className="text-slytherin">every week.</em>]}
            />
            <FadeUp delay={0.2}>
              <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="link-draw mt-8 inline-flex items-center gap-2 pb-0.5 text-[0.92rem] text-ink">
                Telegram — @expectoacademy
              </a>
            </FadeUp>
          </div>
        </div>
        <ul className="border-t border-ink/10 md:col-span-8">
          {FAQS.map((f, i) => (
            <Item key={f.q} q={f.q} a={f.a} index={i} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
          ))}
        </ul>
      </div>
    </section>
  );
}
