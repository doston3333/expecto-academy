import { FACULTY, type FacultyMember } from "@/lib/content";
import { cn } from "@/lib/cn";
import { Eyebrow, FadeUp, house, HOUSE, RevealLines } from "./ui/primitives";

const TEACHERS = FACULTY.filter((t): t is FacultyMember & { name: string } => Boolean(t.name));

const SHIELD = "M4 4 H60 V38 C60 57 46 69 32 76 C18 69 4 57 4 38 Z";

/** A house shield with the teacher's initial, in place of a portrait. */
function Crest({ name, index }: { name: string; index: number }) {
  const h = house(index + 1);
  return (
    <svg viewBox="0 0 64 80" className="h-20 w-16 shrink-0 drop-shadow-[0_10px_14px_rgb(22_33_43/0.22)] md:h-24 md:w-[4.8rem]" aria-hidden="true">
      <path d={SHIELD} style={{ fill: h.deep }} />
      <path d="M9 9 H55 V38 C55 53 44 63 32 69 C20 63 9 53 9 38 Z" fill="none" className="stroke-gold-2" strokeWidth="1.2" />
      <text x="32" y="46" textAnchor="middle" className="fill-gold-3 font-serif" fontSize="30" fontStyle="italic">
        {name.charAt(0)}
      </text>
    </svg>
  );
}

const SCORE_CHIPS = [
  { key: "total", label: "SAT total", tone: "bg-hufflepuff-wash text-hufflepuff" },
  { key: "rw", label: "Reading & Writing", tone: "bg-ravenclaw-wash text-ravenclaw" },
  { key: "math", label: "Math", tone: "bg-gryffindor-wash text-gryffindor" },
] as const;

function TeacherCard({ t, index }: { t: FacultyMember & { name: string }; index: number }) {
  const h = house(index + 1);
  return (
    <FadeUp delay={0.1 + index * 0.1}>
      <article className="relative overflow-hidden rounded-[22px] border border-ink/10 bg-card p-6 shadow-[0_30px_60px_-40px_rgb(22_33_43/0.35)] md:p-8">
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5" style={{ backgroundColor: h.fill }} />
        <div className="flex items-center gap-5">
          <Crest name={t.name} index={index} />
          <div>
            <h3 className="font-serif text-[2rem] leading-none font-light tracking-[-0.03em] md:text-[2.4rem]">{t.name}</h3>
            {t.role ? <p className="mt-2 text-[0.9rem] text-ink-soft">{t.role}</p> : null}
          </div>
        </div>
        {t.sat ? (
          <dl className="mt-7 grid grid-cols-3 gap-2">
            {SCORE_CHIPS.map((chip) => (
              <div key={chip.key} className={cn("flex flex-col-reverse gap-1.5 rounded-2xl px-2 py-3.5 text-center", chip.tone)}>
                <dt className="text-[0.7rem] leading-tight text-ink-soft">{chip.label}</dt>
                <dd className="display text-[1.9rem] tnum md:text-[2.2rem]">{t.sat?.[chip.key]}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        {t.bio ? <p className="mt-6 text-[0.95rem] leading-relaxed text-ink-soft">{t.bio}</p> : null}
      </article>
    </FadeUp>
  );
}

export function Teachers() {
  if (TEACHERS.length === 0) return null;
  return (
    <section id="teachers" aria-label="Teachers" className="bg-paper py-28 md:py-40">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-5 md:grid-cols-12 md:gap-10 md:px-10">
        <div className="md:col-span-5">
          <Eyebrow color={HOUSE.slytherin.deep}>The teachers</Eyebrow>
          <RevealLines
            as="h2"
            className="display mt-6 text-[clamp(2.4rem,5vw,4.6rem)]"
            lines={["The other side", <em key="hi" className="text-slytherin">of the desk.</em>]}
          />
          <FadeUp delay={0.15}>
            <p className="mt-6 max-w-md text-[1rem] leading-relaxed text-ink-soft">
              Small evening groups on Tashkent time. The person across from you reads every mock and stays until the
              score moves.
            </p>
          </FadeUp>
        </div>
        <div className={cn("grid content-start gap-5 md:col-span-6 md:col-start-7", TEACHERS.length > 1 && "lg:grid-cols-2")}>
          {TEACHERS.map((t, i) => (
            <TeacherCard key={t.id} t={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
