import { PROOF, UNIVERSITY_INDEX } from "@/lib/content";
import { Counter, DrawPath, FadeUp, house, Star } from "./ui/primitives";

interface Stat {
  prefix: string;
  value: number;
  suffix: string;
  label: string;
}

const STATS: Stat[] = PROOF.split(" · ").map((part) => {
  const match = /^(\+?)([\d,]+)(\+?)\s+(.*)$/.exec(part);
  if (!match) return { prefix: "", value: 0, suffix: "", label: part };
  return { prefix: match[1], value: Number(match[2].replace(/,/g, "")), suffix: match[3], label: match[4] };
});

const MARKS = [
  "M6 18 C 60 8, 130 22, 196 10",
  "M8 14 C 50 22, 120 4, 194 16",
  "M4 16 C 70 6, 140 20, 198 12",
];

export function Proof() {
  const schools = UNIVERSITY_INDEX.map((u) => u.school);
  return (
    <section aria-label="Results so far" className="relative bg-paper pt-24 pb-20 md:pt-36 md:pb-28">
      <div className="mx-auto max-w-[1320px] px-5 md:px-10">
        <div className="grid gap-14 md:grid-cols-3 md:gap-8">
          {STATS.map((stat, i) => (
            <FadeUp key={stat.label} delay={i * 0.12} className="relative">
              <p className="display text-[clamp(4rem,9vw,8.4rem)]" style={{ color: house(i).deep }}>
                <span className="text-gold">{stat.prefix}</span>
                <Counter to={stat.value} duration={2.4} delay={0.15 + i * 0.12} />
                <span className="text-gold">{stat.suffix}</span>
              </p>
              <svg viewBox="0 0 200 28" className="boil mt-1 h-5 w-44" style={{ color: house(i).fill }} aria-hidden="true">
                <DrawPath d={MARKS[i % MARKS.length]} stroke="currentColor" strokeWidth="3.2" delay={0.6 + i * 0.15} />
              </svg>
              <p className="mt-4 text-[0.82rem] font-medium tracking-[0.18em] text-ink-soft uppercase">{stat.label}</p>
            </FadeUp>
          ))}
        </div>
      </div>

      <div className="mt-24 md:mt-32">
        <FadeUp className="mx-auto mb-8 max-w-[1320px] px-5 md:px-10">
          <p className="eyebrow">340+ scholarships won at these institutions so far</p>
        </FadeUp>
        <div className="marquee-host fade-x overflow-hidden border-y border-ink/10 py-7 md:py-9">
          <div className="marquee" style={{ ["--marquee-duration" as string]: "70s" }}>
            {[0, 1].map((copy) => (
              <ul key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
                {schools.map((school, i) => (
                  <li key={school} className="flex items-center">
                    <span className="px-8 font-serif text-[1.7rem] font-light tracking-[-0.02em] whitespace-nowrap text-ink/80 italic md:px-12 md:text-[2.3rem]">
                      {school}
                    </span>
                    <Star size={12} style={{ color: house(i).fill }} />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
