import { FACULTY, type FacultyHouse, type FacultyMember } from "@/lib/content";
import { cn } from "@/lib/cn";
import { Eyebrow, FadeUp, HOUSE, RevealLines } from "./ui/primitives";

type Teacher = FacultyMember & { name: string };

const TEACHERS = FACULTY.filter((t): t is Teacher => Boolean(t.name));
const FOUNDERS = TEACHERS.filter((t) => t.founder);
const MENTORS = TEACHERS.filter((t) => !t.founder);

const SHIELD = "M4 4 H60 V38 C60 57 46 69 32 76 C18 69 4 57 4 38 Z";

const CARD_WASH: Record<FacultyHouse, string> = {
  gryffindor: "bg-gryffindor-wash",
  slytherin: "bg-slytherin-wash",
  ravenclaw: "bg-ravenclaw-wash",
  hufflepuff: "bg-hufflepuff-wash",
};

/** A house shield with the teacher's initial, in place of a portrait. */
function Crest({ name, houseId }: { name: string; houseId: FacultyHouse }) {
  const h = HOUSE[houseId];
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

const CHIP_TONES = [
  "bg-hufflepuff-wash text-hufflepuff",
  "bg-ravenclaw-wash text-ravenclaw",
  "bg-gryffindor-wash text-gryffindor",
] as const;

function TeacherCard({ t, index }: { t: Teacher; index: number }) {
  const h = HOUSE[t.house];
  const highlights = (t.highlights ?? []).slice(0, CHIP_TONES.length);
  const meta = [t.role, t.school].filter(Boolean).join(" · ");
  return (
    <FadeUp delay={0.1 + index * 0.1} className="h-full">
      <article className={cn("relative h-full overflow-hidden rounded-[22px] border border-ink/10 p-6 shadow-[0_30px_60px_-40px_rgb(22_33_43/0.35)] md:p-8", CARD_WASH[t.house])}>
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5" style={{ backgroundColor: h.fill }} />
        <div className="flex items-center gap-5">
          <Crest name={t.name} houseId={t.house} />
          <div className="min-w-0">
            <h3 className="font-serif text-[2rem] leading-none font-light tracking-[-0.03em] md:text-[2.4rem]">{t.name}</h3>
            {meta ? <p className="mt-2 text-[0.9rem] text-ink-soft">{meta}</p> : null}
          </div>
        </div>
        {highlights.length ? (
          <dl className="mt-7 grid gap-2" style={{ gridTemplateColumns: `repeat(${highlights.length}, minmax(0, 1fr))` }}>
            {highlights.map((c, i) => (
              <div key={c.label} className={cn("flex flex-col-reverse gap-1.5 rounded-2xl px-2 py-3.5 text-center", CHIP_TONES[i])}>
                <dt className="text-[0.7rem] leading-tight text-ink-soft">{c.label}</dt>
                <dd className="display text-[1.9rem] tnum md:text-[2.2rem]">{c.value}</dd>
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
      <div className="mx-auto max-w-[1320px] px-5 md:px-10">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Eyebrow color={HOUSE.slytherin.deep}>The teachers</Eyebrow>
            <RevealLines
              as="h2"
              className="display mt-6 text-[clamp(2.4rem,5vw,4.6rem)]"
              lines={["The other side", <em key="hi" className="text-slytherin">of the desk.</em>]}
            />
          </div>
          <FadeUp delay={0.15} className="md:col-span-4 md:col-start-9">
            <p className="max-w-md text-[1rem] leading-relaxed text-ink-soft">
              Small evening groups on Tashkent time. The person across from you reads every mock and stays until the
              score moves.
            </p>
          </FadeUp>
        </div>
        <div className="mt-14 flex flex-col gap-5 md:mt-20">
          <div className="mx-auto grid w-full max-w-4xl gap-5 md:grid-cols-2">
            {FOUNDERS.map((t, i) => (
              <TeacherCard key={t.id} t={t} index={i} />
            ))}
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {MENTORS.map((t, i) => (
              <TeacherCard key={t.id} t={t} index={FOUNDERS.length + i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
