import { METHOD_PILLARS, METHOD_SUPPORT } from "@/lib/content";
import { DrawPath, Eyebrow, FadeUp, house, HOUSE, RevealLines, Star } from "./ui/primitives";

function EveningIcon() {
  return (
    <>
      <DrawPath d="M92 8 C 80 11, 76 27, 86 35 C 94 41, 106 37, 110 29 C 98 33, 88 23, 92 8 Z" className="text-(--accent)" stroke="currentColor" strokeWidth="1.8" />
      <DrawPath d="M37 40 a7 7 0 1 1 -14 0 a7 7 0 1 1 14 0" stroke="currentColor" strokeWidth="1.6" delay={0.3} duration={0.8} />
      <DrawPath d="M59 36 a7 7 0 1 1 -14 0 a7 7 0 1 1 14 0" stroke="currentColor" strokeWidth="1.6" delay={0.45} duration={0.8} />
      <DrawPath d="M81 40 a7 7 0 1 1 -14 0 a7 7 0 1 1 14 0" stroke="currentColor" strokeWidth="1.6" delay={0.6} duration={0.8} />
      <DrawPath d="M18 64 C 20 52, 40 52, 42 64 M40 62 C 42 48, 62 48, 64 62 M62 64 C 64 52, 84 52, 86 64" stroke="currentColor" strokeWidth="1.6" delay={0.8} />
      <DrawPath d="M8 67 C 40 65, 80 68, 112 66" stroke="currentColor" strokeWidth="1.6" delay={1.1} />
    </>
  );
}

function MocksIcon() {
  return (
    <>
      <DrawPath d="M44 8 L90 13 L85 70 L40 65 Z" stroke="currentColor" strokeWidth="1.4" opacity={0.5} />
      <DrawPath d="M28 14 L74 14 L74 72 L28 72 Z" stroke="currentColor" strokeWidth="1.6" delay={0.25} />
      <DrawPath d="M36 26 H64 M36 34 H60 M36 42 H66 M36 50 H52" stroke="currentColor" strokeWidth="1.4" delay={0.6} />
      <DrawPath d="M38 60 l5 5 l11 -12" className="text-(--accent)" stroke="currentColor" strokeWidth="2" delay={1.1} duration={0.6} />
      <DrawPath d="M96 36 v18 M88 45 h16" className="text-(--accent)" stroke="currentColor" strokeWidth="2" delay={1.3} duration={0.5} />
    </>
  );
}

function MentorIcon() {
  return (
    <>
      <DrawPath d="M18 10 H66 L78 22 V72 H18 Z M66 10 V22 H78" stroke="currentColor" strokeWidth="1.6" />
      <DrawPath d="M28 30 H60 M28 38 H56" stroke="currentColor" strokeWidth="1.4" delay={0.4} />
      <DrawPath d="M28 54 l6 6 l12 -14" className="text-(--accent)" stroke="currentColor" strokeWidth="2" delay={0.8} duration={0.6} />
      <DrawPath d="M68 70 L102 34 L110 41 L76 76 L66 78 Z M96 40 L104 47" stroke="currentColor" strokeWidth="1.6" delay={1} />
    </>
  );
}

const ICONS = [EveningIcon, MocksIcon, MentorIcon];

export function Method() {
  return (
    <section id="method" aria-label="The method" className="bg-ravenclaw-wash pt-24 pb-28 md:pt-32 md:pb-40">
      <div className="mx-auto max-w-[1320px] px-5 md:px-10">
        <div className="max-w-3xl">
          <Eyebrow color={HOUSE.ravenclaw.deep}>The method</Eyebrow>
          <RevealLines
            as="h2"
            className="display mt-6 text-[clamp(2.4rem,5.4vw,5rem)]"
            lines={["Three things that", <em key="hi" className="text-ravenclaw">move a score.</em>]}
          />
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-[28px] border border-ink/10 bg-ink/10 md:mt-24 md:grid-cols-3">
          {METHOD_PILLARS.map((pillar, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <FadeUp key={pillar.n} delay={i * 0.12} className="group relative flex flex-col bg-card p-7 transition-colors duration-700 hover:bg-white md:p-10">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 origin-top transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-y-[2]"
                  style={{ backgroundColor: house(i).fill }}
                />
                <div className="flex items-start justify-between">
                  <span className="font-serif text-[0.95rem] tnum" style={{ color: house(i).deep }}>{pillar.n}</span>
                  <svg viewBox="0 0 120 80" style={{ ["--accent" as string]: house(i).fill }} className="boil h-24 w-36 text-ink transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-1 md:h-32 md:w-48" aria-hidden="true">
                    <Icon />
                  </svg>
                </div>
                <div className="pt-12 md:pt-24">
                  <h3 className="font-serif text-[1.9rem] leading-[1.08] font-light tracking-[-0.03em] md:text-[2.3rem]">{pillar.title}</h3>
                  <p className="mt-4 max-w-sm text-[0.96rem] leading-relaxed text-ink-soft">{pillar.body}</p>
                </div>
              </FadeUp>
            );
          })}
        </div>

        <ul className="mt-10 grid gap-4 md:mt-12 md:grid-cols-3 md:gap-8">
          {METHOD_SUPPORT.map((line, i) => (
            <FadeUp as="li" key={line} delay={0.1 + i * 0.08} className="flex items-start gap-3 text-[0.9rem] leading-relaxed text-ink-soft">
              <Star className="mt-1 shrink-0" size={12} style={{ color: house(i + 1).fill }} />
              {line}
            </FadeUp>
          ))}
        </ul>
      </div>
    </section>
  );
}
