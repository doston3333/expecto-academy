import portrait01 from "@/assets/faculty/01.jpg";
import portrait02 from "@/assets/faculty/02.jpg";
import portrait03 from "@/assets/faculty/03.jpg";
import { useCompactLayout } from "@/hooks/useMedia";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { FACULTY } from "@/lib/content";
import { HOUSES } from "@/lib/houses";
import { easeCinematic } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const PORTRAITS = [
  { src: portrait01, position: "center 18%" },
  { src: portrait02, position: "center 46%" },
  { src: portrait03, position: "center 42%" },
] as const;

const LIFTS = ["md:mt-0", "md:mt-12", "md:mt-5"] as const;

export function Faculty() {
  const compact = useCompactLayout();
  const reduced = usePrefersReducedMotion();
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const member = FACULTY[active] ?? FACULTY[0];
  const house = HOUSES[active % HOUSES.length];

  useEffect(() => {
    if (!compact) return;
    const root = scrollerRef.current;
    if (!root) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-faculty-card]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!best) return;
        const index = Number((best.target as HTMLElement).dataset.index);
        if (!Number.isNaN(index)) setActive(index);
      },
      { root, threshold: [0.55, 0.8] },
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [compact]);

  return (
    <section id="faculty" aria-label="Faculty" className="py-16 sm:py-28" data-scene>
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-5 md:grid-cols-12" data-reveal>
          <div className="md:col-span-7">
            <p className="text-[0.7rem] font-medium tracking-[0.16em] text-moss uppercase">
              The faculty
            </p>
            <h2 className="mt-3 max-w-xl text-3xl leading-[1.02] font-medium tracking-[-0.03em] text-forest-deep sm:mt-4 sm:text-5xl">
              The other side of the desk.
            </h2>
          </div>
          <div className="md:col-span-4 md:col-start-9 md:row-span-2 md:self-center md:text-right">
            <div className="overflow-hidden">
              {reduced ? (
                <p
                  aria-hidden="true"
                  className="font-display text-[3.25rem] leading-none italic sm:text-[6.5rem]"
                  style={{ color: house.hex }}
                >
                  {member.id}
                </p>
              ) : (
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.p
                    key={member.id}
                    aria-hidden="true"
                    initial={{ y: "70%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-70%", opacity: 0 }}
                    transition={{ duration: 0.45, ease: easeCinematic }}
                    className="font-display text-[3.25rem] leading-none italic sm:text-[6.5rem]"
                    style={{ color: house.hex }}
                  >
                    {member.id}
                  </motion.p>
                </AnimatePresence>
              )}
            </div>
          </div>
          <p className="col-span-2 mt-5 max-w-md text-[0.95rem] leading-relaxed text-muted md:col-span-7">
            Small evening groups on Tashkent time. The person across from you reads every mock and
            stays until the score moves.
          </p>
        </div>
      </div>

      <div className="relative mt-8 bg-forest-deep py-8 sm:mt-16 sm:py-12 md:py-14">
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--color-amberfell)_14%,var(--color-amberfell)_86%,transparent)]"
        />
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,var(--color-amberfell)_14%,var(--color-amberfell)_86%,transparent)] opacity-80"
        />

        <ul
          ref={scrollerRef}
          data-stagger
          className="group/row relative z-[1] mx-auto flex max-w-[1240px] snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-5 pb-2 [scrollbar-width:none] md:grid md:grid-cols-3 md:items-start md:gap-7 md:overflow-visible md:px-8 md:pb-0 lg:gap-10 [&::-webkit-scrollbar]:hidden"
        >
          {FACULTY.map((person, index) => {
            const portrait = PORTRAITS[index];
            if (!portrait) return null;
            const accent = HOUSES[index % HOUSES.length];
            const selected = index === active;
            return (
              <li
                key={person.id}
                data-faculty-card
                data-index={index}
                className={cn("w-[min(78vw,22rem)] shrink-0 snap-start md:w-auto", LIFTS[index])}
                onMouseEnter={() => {
                  if (!compact) setActive(index);
                }}
              >
                <figure className="group transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:group-hover/row:opacity-55 md:hover:opacity-100 md:focus-within:opacity-100">
                  <div className="bg-cream p-2.5 shadow-[0_28px_50px_-24px_rgb(8_24_18/0.85)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:md:group-hover:-translate-y-2 sm:p-3">
                    <div className="relative aspect-[3/4] overflow-hidden bg-forest-deep">
                      <img
                        src={portrait.src}
                        alt={
                          person.name
                            ? `Portrait of ${person.name}${person.role ? `, ${person.role}` : ""}`
                            : `Expecto Academy faculty portrait ${person.id}`
                        }
                        width={900}
                        height={1200}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 size-full object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:md:group-hover:scale-[1.045]"
                        style={{ objectPosition: portrait.position }}
                      />
                      <span className="absolute bottom-3 left-3 bg-cream/95 px-2 py-0.5 font-display text-[1.05rem] leading-none text-forest-deep italic">
                        {person.id}
                      </span>
                    </div>
                    <span
                      aria-hidden="true"
                      className="mt-2.5 block h-[3px] transition-opacity duration-500"
                      style={{ backgroundColor: accent.hex, opacity: selected ? 1 : 0.35 }}
                    />
                  </div>
                  {person.name || person.role || person.bio ? (
                    <figcaption className="max-w-sm px-1 pt-4">
                      {person.name ? (
                        <p className="font-display text-[1.85rem] leading-none text-cream italic">
                          {person.name}
                        </p>
                      ) : null}
                      {person.role ? (
                        <p className="mt-2 text-[0.68rem] font-medium tracking-[0.14em] text-sage uppercase">
                          {person.role}
                        </p>
                      ) : null}
                      {person.bio ? (
                        <p className="mt-3 text-[0.9rem] leading-relaxed text-cream/75">{person.bio}</p>
                      ) : null}
                    </figcaption>
                  ) : null}
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
