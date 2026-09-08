import { ERROR_LOG, GAUNTLET, SCHOLARSHIP_ROWS, TELEGRAM_MESSAGES, TRAP_NOTES } from "@/lib/content";
import { getHouse, HOUSES, onHouseType } from "@/lib/houses";
import { cn } from "@/lib/cn";
import {
  AlarmClock,
  Check,
  Flag,
  Highlighter,
  PenLine,
  Send,
  ShieldCheck,
  Strikethrough,
} from "lucide-react";
import {
  motion,
  useMotionTemplate,
  useTransform,
  type MotionValue,
} from "motion/react";
import type { ReactNode } from "react";

/* Scrub atoms --------------------------------------------------------
   Every scene receives `t`: a 0..1 MotionValue that runs while the
   scene owns the window. Static/reduced renders pass a constant 1. */

interface SceneProps {
  t: MotionValue<number>;
}

type Range = [number, number];

function GrowX({
  t,
  range,
  className,
  style,
}: {
  t: MotionValue<number>;
  range: Range;
  className?: string;
  style?: React.CSSProperties;
}) {
  const scaleX = useTransform(t, range, [0, 1], { clamp: true });
  return <motion.span aria-hidden="true" style={{ scaleX, ...style }} className={cn("block origin-left", className)} />;
}

function Pop({
  t,
  at,
  className,
  children,
}: {
  t: MotionValue<number>;
  at: number;
  className?: string;
  children: ReactNode;
}) {
  const opacity = useTransform(t, [at, at + 0.05], [0, 1], { clamp: true });
  const scale = useTransform(t, [at, at + 0.07], [0.55, 1], { clamp: true });
  return (
    <motion.span style={{ opacity, scale }} className={cn("inline-flex", className)}>
      {children}
    </motion.span>
  );
}

function SlideUp({
  t,
  at,
  span = 0.1,
  className,
  children,
}: {
  t: MotionValue<number>;
  at: number;
  span?: number;
  className?: string;
  children: ReactNode;
}) {
  const y = useTransform(t, [at, at + span], ["112%", "0%"], { clamp: true });
  return (
    <span className={cn("block overflow-hidden", className)}>
      <motion.span style={{ y }} className="block">
        {children}
      </motion.span>
    </span>
  );
}

function SceneShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("absolute inset-0 flex flex-col overflow-hidden bg-cream", className)}>
      {children}
    </div>
  );
}

function SceneTopBar({ left, center, right }: { left: string; center?: ReactNode; right?: string }) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-2 border-b border-forest/10 px-3 py-2 sm:gap-3 sm:px-5 sm:py-2.5">
      <span className="min-w-0 truncate text-[0.58rem] font-medium tracking-[0.08em] text-moss uppercase sm:text-[0.66rem]">
        {left}
      </span>
      {center ? <span className="shrink-0">{center}</span> : null}
      {right ? (
        <span className="hidden min-w-0 truncate text-[0.6rem] font-medium tracking-[0.08em] text-moss uppercase sm:block sm:text-[0.66rem]">
          {right}
        </span>
      ) : null}
    </div>
  );
}

function SceneStatusBar({ children }: { children: ReactNode }) {
  return (
    <div className="mt-auto flex shrink-0 items-start justify-between gap-2 border-t border-forest/10 px-3 py-2 text-[0.58rem] leading-snug text-muted sm:items-center sm:gap-3 sm:px-5 sm:py-2.5 sm:text-[0.66rem]">
      {children}
    </div>
  );
}

function ChoiceRow({
  letter,
  text,
  selected,
  struck,
}: {
  letter: string;
  text: string;
  selected?: boolean;
  struck?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border px-2 py-1.5 sm:gap-2.5 sm:px-2.5 sm:py-2",
        selected ? "border-forest bg-forest/6" : "border-forest/12",
      )}
    >
      <span
        className={cn(
          "grid size-4 shrink-0 place-items-center rounded-full border text-[0.55rem] font-semibold sm:size-5 sm:text-[0.6rem]",
          selected ? "border-forest bg-forest text-cream" : "border-forest/30 text-moss",
        )}
      >
        {letter}
      </span>
      <span
        className={cn(
          "text-[0.62rem] leading-snug text-forest-deep sm:text-[0.7rem]",
          struck && "line-through opacity-45",
        )}
      >
        {text}
      </span>
    </div>
  );
}

const PASSAGE_LINES = [
  "Urban forests are often celebrated for their shade, yet their",
  "quietest work happens below the pavement. In a 2019 study of",
  "street maples, ecologist Lena Ortiz found that roots of trees",
  "planted in contiguous soil trenches grew twice as deep as those",
  "confined to individual pits — and their canopies, in turn, were",
  "fuller. The trees, Ortiz argues, do not merely share space; they",
  "negotiate it, trading sugars through fungal networks that link",
  "one root system to the next.",
];

/* Scene 1 — the diagnostic ------------------------------------------ */

function ExamTimer({ t }: { t: MotionValue<number> }) {
  const total = useTransform(t, [0.25, 0.98], [1456, 1082], { clamp: true });
  const minutes = useTransform(total, (s) => String(Math.floor(s / 60)).padStart(2, "0"));
  const seconds = useTransform(total, (s) => String(Math.floor(s % 60)).padStart(2, "0"));
  const clock = useMotionTemplate`${minutes}:${seconds}`;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-forest/15 bg-cream-2/70 px-2.5 py-0.5 text-[0.62rem] font-semibold text-forest-deep tabular-nums sm:text-[0.68rem]">
      <AlarmClock className="size-3" />
      <motion.span>{clock}</motion.span>
    </span>
  );
}

export function SceneDiagnostic({ t }: SceneProps) {
  const veridian = getHouse("veridian");
  const dotsScale = useTransform(t, [0.3, 0.95], [7 / 27, 12 / 27], { clamp: true });
  const highlight = useTransform(t, [0.15, 0.42], [0, 1], { clamp: true });
  const selectRing = useTransform(t, [0.3, 0.4], [0, 1], { clamp: true });

  return (
    <SceneShell>
      <SceneTopBar
        left="Section 1 · Reading and Writing"
        center={<ExamTimer t={t} />}
        right="Module 1 of 2"
      />
      <div className="grid min-h-0 flex-1 grid-cols-1 sm:grid-cols-2">
        <div className="hidden flex-col border-r border-forest/10 px-5 py-4 sm:flex">
          <p className="text-[0.6rem] font-medium tracking-[0.1em] text-muted uppercase">
            Passage · adapted from a 2021 essay
          </p>
          <div className="mt-2.5 space-y-[0.42rem]">
            {PASSAGE_LINES.map((line, i) => (
              <p key={i} className="text-[0.68rem] leading-[1.15] text-forest-deep/85">
                {i === 5 ? (
                  <>
                    The trees, Ortiz argues, do not merely{" "}
                    <span className="relative inline-block">
                      share space
                      <motion.span
                        aria-hidden="true"
                        className="absolute inset-x-0 -inset-y-0.5 -z-10 origin-left rounded-sm bg-amberfell/35"
                        style={{ scaleX: highlight }}
                      />
                    </span>
                    ; they
                  </>
                ) : (
                  line
                )}
              </p>
            ))}
          </div>
        </div>
        <div className="flex min-h-0 flex-col px-3 py-3 sm:px-5 sm:py-4">
          <div className="flex items-center justify-between">
            <p className="text-[0.62rem] font-semibold text-forest-deep sm:text-[0.68rem]">
              Question 7 <span className="font-normal text-muted">of 27</span>
            </p>
            <div className="flex items-center gap-2 text-moss">
              <PenLine className="size-3 sm:size-3.5" aria-label="Annotate" />
              <Highlighter className="size-3 sm:size-3.5" aria-label="Highlight" />
              <Strikethrough className="size-3 sm:size-3.5" aria-label="Strike a choice" />
              <Flag className="size-3 sm:size-3.5" aria-label="Flag for review" />
            </div>
          </div>
          <p className="mt-2 text-[0.66rem] leading-snug text-forest-deep sm:text-[0.74rem]">
            Which choice best states the main purpose of the text?
          </p>
          <div className="relative mt-2 space-y-1.5 sm:mt-2.5 sm:space-y-2">
            <ChoiceRow letter="A" text="To argue that cities should plant more maples" struck />
            <div className="relative">
              <ChoiceRow
                letter="B"
                text="To prove that fungal networks cause deeper root growth"
                selected
              />
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-1 rounded-xl border-2 border-forest/50"
                style={{ opacity: selectRing }}
              />
            </div>
            <ChoiceRow letter="C" text="To introduce Ortiz's method of soil analysis" struck />
            <ChoiceRow
              letter="D"
              text="To present findings that reframe how urban trees cooperate"
            />
          </div>
        </div>
      </div>
      <SceneStatusBar>
        <div className="relative min-w-0 flex-1 overflow-hidden" aria-hidden="true">
          <div className="flex items-center gap-[3px]">
            {Array.from({ length: 27 }, (_, i) => (
              <span key={i} className="size-[5px] rounded-[1px] bg-forest/15 sm:size-[6px]" />
            ))}
          </div>
          <motion.div
            className="absolute inset-0 flex origin-left items-center gap-[3px] overflow-hidden"
            style={{ scaleX: dotsScale }}
          >
            {Array.from({ length: 27 }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "size-[5px] shrink-0 rounded-[1px] bg-forest/60 sm:size-[6px]",
                  i === 6 && "bg-forest ring-1 ring-forest ring-offset-1 ring-offset-cream",
                )}
              />
            ))}
          </motion.div>
        </div>
        <span
          className="hidden items-center gap-1.5 rounded-full px-2 py-0.5 text-[0.58rem] font-medium sm:inline-flex"
          style={{ backgroundColor: `${veridian.hex}1f`, color: veridian.ink }}
        >
          Prediction · Math wall
        </span>
        <span className="shrink-0 font-medium text-forest-deep">Back · Next</span>
      </SceneStatusBar>
    </SceneShell>
  );
}

/* Scene 2 — the trap -------------------------------------------------- */

export function SceneTrap({ t }: SceneProps) {
  const dTint = useTransform(t, [0.55, 0.75], [0, 1], { clamp: true });
  return (
    <SceneShell>
      <SceneTopBar
        left="Review · Question 7"
        center={
          <span className="rounded-full bg-aurelion/10 px-2.5 py-0.5 text-[0.62rem] font-semibold text-aurelion sm:text-[0.68rem]">
            Mark scheme
          </span>
        }
        right="Missed · −1"
      />
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden px-3 py-3 sm:gap-2.5 sm:px-5 sm:py-4">
        <p className="text-[0.66rem] leading-snug text-forest-deep sm:text-[0.74rem]">
          <span className="font-semibold">Question 7.</span> Main purpose of the text — your answer
          and the examiner's note.
        </p>
        {TRAP_NOTES.map((note, ni) => {
          const isCorrect = note.verdict === "Correct";
          return (
            <div
              key={note.choice}
              className={cn(
                "relative overflow-hidden rounded-xl border px-3 py-2 sm:px-3.5 sm:py-2.5",
                isCorrect ? "border-forest/25" : "border-aurelion/30 bg-aurelion/6",
              )}
            >
              {isCorrect ? (
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-0 origin-left bg-forest/8"
                  style={{ scaleX: dTint }}
                />
              ) : null}
              <div className="relative flex items-center gap-2">
                <span
                  className={cn(
                    "grid size-4 place-items-center rounded-full text-[0.55rem] font-semibold text-cream sm:size-5 sm:text-[0.6rem]",
                    isCorrect ? "bg-forest" : "bg-aurelion",
                  )}
                >
                  {note.choice}
                </span>
                <span
                  className={cn(
                    "text-[0.62rem] font-semibold tracking-[0.06em] uppercase sm:text-[0.66rem]",
                    isCorrect ? "text-forest" : "text-aurelion",
                  )}
                >
                  {note.verdict}
                </span>
                {isCorrect ? (
                  <Pop t={t} at={0.78} className="ml-auto text-forest">
                    <Check className="size-3.5" />
                  </Pop>
                ) : null}
              </div>
              <SlideUp t={t} at={0.42 + ni * 0.12} className="relative mt-1.5">
                <p className="text-[0.62rem] leading-snug text-forest-deep/85 sm:text-[0.7rem]">
                  {note.note}
                </p>
              </SlideUp>
            </div>
          );
        })}
        <div className="rounded-xl border border-forest/12 bg-cream-2/50 px-3 py-2 sm:px-3.5 sm:py-2.5">
          <p className="text-[0.6rem] font-medium tracking-[0.1em] text-moss uppercase sm:text-[0.62rem]">
            Coach note
          </p>
          <SlideUp t={t} at={0.7} className="mt-1">
            <p className="text-[0.62rem] leading-snug text-forest-deep/85 sm:text-[0.7rem]">
              Traps of this shape cost you 4 questions on the diagnostic. Tonight's spellwork:
              twelve "main purpose" stems, timed at 75 seconds each.
            </p>
          </SlideUp>
        </div>
      </div>
      <SceneStatusBar>
        <span className="min-w-0">Rule: the correct choice never claims more than the passage does.</span>
        <span className="hidden shrink-0 font-medium text-forest-deep sm:inline">Next miss →</span>
      </SceneStatusBar>
    </SceneShell>
  );
}

/* Scene 3 — error log / spellwork ------------------------------------ */

export function SceneErrorLog({ t }: SceneProps) {
  const total = ERROR_LOG.reduce((sum, row) => sum + row.assigned, 0);
  return (
    <SceneShell>
      <SceneTopBar left="Error log · Week 3" right={`Spellwork tonight · ${total} items`} />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 py-2 sm:px-5 sm:py-3">
        <div className="grid shrink-0 grid-cols-[minmax(0,1fr)_2.1rem_auto] items-center gap-x-2 border-b border-forest/10 py-1.5 text-[0.54rem] font-medium tracking-[0.1em] text-muted uppercase sm:grid-cols-[1fr_auto_auto] sm:gap-x-4 sm:text-[0.6rem]">
          <span>Question type</span>
          <span className="text-right sm:text-left">Miss</span>
          <span>Assigned</span>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">
          {ERROR_LOG.map((row, i) => {
            const house = getHouse(row.houseId);
            const at = 0.08 + i * 0.14;
            return (
              <div
                key={row.type}
                className="grid grid-cols-[minmax(0,1fr)_2.1rem_auto] items-center gap-x-2 border-b border-forest/8 py-[0.45rem] sm:grid-cols-[1fr_auto_auto] sm:gap-x-4 sm:py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-[0.64rem] font-medium text-forest-deep sm:text-[0.74rem]">
                    {row.type}
                  </p>
                  <div className="mt-1 h-[3px] w-full max-w-40 overflow-hidden rounded-full bg-forest/8">
                    <GrowX
                      t={t}
                      range={[at + 0.04, at + 0.16]}
                      className="h-full rounded-full"
                      style={{ backgroundColor: house.hex, width: `${(row.misses / 5) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-right text-[0.66rem] font-semibold text-forest-deep tabular-nums sm:text-[0.76rem]">
                  ×{row.misses}
                </span>
                <span
                  className="shrink-0 rounded-full px-2 py-0.5 text-[0.56rem] font-semibold whitespace-nowrap tabular-nums sm:text-[0.62rem]"
                  style={{ backgroundColor: `${house.hex}1f`, color: house.ink }}
                >
                  {row.assigned}
                  <span className="hidden sm:inline"> tonight</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <SceneStatusBar>
        <span className="min-w-0">Built from your last two mocks</span>
        <span className="shrink-0 font-medium text-forest-deep">Due 21:00</span>
      </SceneStatusBar>
    </SceneShell>
  );
}

/* Scene 4 — the gauntlet ---------------------------------------------- */

export function SceneGauntlet({ t }: SceneProps) {
  return (
    <SceneShell>
      <SceneTopBar left="Gauntlet week" right="Test-day rules · 09:00 sharp" />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 py-2 sm:px-5 sm:py-3">
        <div className="flex shrink-0 flex-wrap gap-1.5">
          {["Bluebook only", "Full adaptive", "No pause", "Phone in the hall"].map((rule, i) => (
            <Pop key={rule} t={t} at={0.05 + i * 0.05}>
              <span className="rounded-full border border-forest/15 px-2 py-0.5 text-[0.54rem] font-medium tracking-[0.06em] text-moss uppercase whitespace-nowrap sm:px-2.5 sm:text-[0.6rem]">
                {rule}
              </span>
            </Pop>
          ))}
        </div>
        <div className="mt-2 min-h-0 flex-1 space-y-1.5 overflow-hidden sm:mt-3 sm:space-y-2">
          {GAUNTLET.map((mock, i) => {
            const at = 0.12 + i * 0.14;
            const house = HOUSES[i % HOUSES.length];
            return (
              <div
                key={mock.label}
                className="flex items-center gap-2.5 rounded-xl border border-forest/12 px-2.5 py-2 sm:gap-4 sm:px-4 sm:py-2.5"
              >
                <span className="shrink-0 text-[0.6rem] font-semibold tracking-[0.08em] text-muted uppercase tabular-nums">
                  0{i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-[0.68rem] font-semibold text-forest-deep sm:text-[0.78rem]">
                      {mock.label}
                    </p>
                    <span className="shrink-0 text-[0.78rem] font-semibold text-forest-deep tabular-nums sm:text-[0.9rem]">
                      {mock.score}
                    </span>
                  </div>
                  <p className="truncate text-[0.58rem] text-muted sm:text-[0.64rem]">{mock.when}</p>
                  <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-forest/8">
                    <GrowX
                      t={t}
                      range={[at, at + 0.16]}
                      className="h-full rounded-full"
                      style={{
                        width: `${(Number(mock.score) / 1600) * 100}%`,
                        backgroundColor: house.hex,
                      }}
                    />
                  </div>
                </div>
                <Pop t={t} at={at + 0.16} className="shrink-0">
                  <span
                    className="grid size-5 place-items-center rounded-full"
                    style={{
                      backgroundColor: house.hex,
                      color: onHouseType(house),
                    }}
                  >
                    <Check className="size-3" />
                  </span>
                </Pop>
              </div>
            );
          })}
        </div>
      </div>
      <SceneStatusBar>
        <span className="min-w-0">Average 1443 · 1450 cleared on the third sitting</span>
        <span className="shrink-0 font-medium text-forest-deep">November</span>
      </SceneStatusBar>
    </SceneShell>
  );
}

/* Scene 5 — the letter (score report) ---------------------------------- */

function ScoreCount({ t }: { t: MotionValue<number> }) {
  const value = useTransform(t, [0.05, 0.55], [1180, 1480], { clamp: true });
  const rounded = useTransform(value, (v) => String(Math.round(v)));
  return (
    <motion.span className="text-[2.6rem] leading-none font-semibold tracking-[-0.04em] text-forest-deep tabular-nums sm:text-[4.2rem]">
      {rounded}
    </motion.span>
  );
}

export function SceneReport({ t }: SceneProps) {
  const arc = useTransform(t, [0.2, 0.7], [0, 0.98], { clamp: true });
  return (
    <SceneShell>
      <SceneTopBar
        left="Official score report · Digital SAT"
        center={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-forest px-2.5 py-0.5 text-[0.6rem] font-semibold text-cream sm:text-[0.64rem]">
            <ShieldCheck className="size-3" />
            <svg viewBox="0 0 24 24" className="size-3" aria-hidden="true">
              <motion.circle
                cx="12"
                cy="12"
                r="9"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                pathLength={1}
                style={{ pathLength: arc, rotate: -90, transformOrigin: "center" }}
              />
            </svg>
            <span className="sm:hidden">98th</span>
            <span className="hidden sm:inline">98th percentile</span>
          </span>
        }
        right="14 Aug 2026"
      />
      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden sm:grid-cols-[1.1fr_1fr]">
        <div className="flex items-center gap-4 border-b border-forest/10 px-3 py-2 sm:flex-col sm:items-start sm:justify-center sm:gap-0 sm:border-r sm:border-b-0 sm:px-6 sm:py-4">
          <div className="flex items-baseline gap-2 sm:gap-3">
            <ScoreCount t={t} />
            <Pop t={t} at={0.55}>
              <span className="rounded-full bg-forest/8 px-2 py-0.5 text-[0.62rem] font-semibold text-forest sm:text-[0.7rem]">
                +300
              </span>
            </Pop>
          </div>
          <div className="sm:mt-2">
            <p className="text-[0.62rem] text-muted sm:text-[0.68rem]">from an 1180 diagnostic</p>
            <div className="mt-2 hidden space-y-1.5 sm:block">
              {[
                { label: "Reading & Writing", score: 730 },
                { label: "Math", score: 750 },
              ].map((s, i) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className="w-28 text-[0.62rem] text-muted">{s.label}</span>
                  <div className="h-1 w-24 overflow-hidden rounded-full bg-forest/8">
                    <GrowX
                      t={t}
                      range={[0.3 + i * 0.1, 0.5 + i * 0.1]}
                      className="h-full rounded-full bg-forest"
                      style={{ width: `${(s.score / 800) * 100}%` }}
                    />
                  </div>
                  <span className="text-[0.62rem] font-semibold text-forest-deep tabular-nums">
                    {s.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex min-h-0 flex-col justify-center px-3 py-1 sm:px-5 sm:py-1.5">
          <p className="pb-0.5 text-[0.56rem] font-medium tracking-[0.12em] text-muted uppercase sm:text-[0.6rem]">
            Where this number funds a seat
          </p>
          {SCHOLARSHIP_ROWS.map((row, i) => {
            const house = HOUSES[i % HOUSES.length];
            return (
              <SlideUp key={row.school} t={t} at={0.18 + i * 0.08} span={0.08}>
                <div className="flex items-center justify-between gap-2 border-b border-forest/8 py-[3px] last:border-b-0">
                  <p className="min-w-0 truncate text-[0.66rem] font-medium text-forest-deep sm:text-[0.72rem]">
                    {row.school}
                    <span className="ml-1.5 font-normal text-muted tabular-nums">{row.min}</span>
                  </p>
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 text-[0.56rem] font-semibold sm:text-[0.6rem]"
                    style={{
                      backgroundColor: house.hex,
                      color: onHouseType(house),
                    }}
                  >
                    {row.band}
                  </span>
                </div>
              </SlideUp>
            );
          })}
        </div>
      </div>
      <SceneStatusBar>
        <span className="min-w-0 truncate">Report #EA-2214 · counselor + student</span>
        <span className="shrink-0 font-medium text-forest-deep">Share →</span>
      </SceneStatusBar>
    </SceneShell>
  );
}

/* Scene 6 — the enrollment message ------------------------------------- */

export function SceneTelegram({ t }: SceneProps) {
  const aurelion = getHouse("aurelion");
  return (
    <SceneShell>
      <div className="flex items-center gap-2.5 border-b border-forest/10 px-3 py-2 sm:px-5 sm:py-2.5">
        <span
          className="grid size-6 place-items-center rounded-full text-[0.6rem] font-semibold text-cream sm:size-7"
          style={{ backgroundColor: aurelion.hex }}
        >
          E
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.68rem] font-semibold text-forest-deep sm:text-[0.74rem]">
            Expecto Academy
          </p>
          <p className="text-[0.56rem] text-muted sm:text-[0.6rem]">
            Mentors online · Tashkent time
          </p>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-end gap-2 px-3 py-3 sm:gap-2.5 sm:px-5 sm:py-4">
        {TELEGRAM_MESSAGES.map((msg, i) => (
          <TelegramBubble key={i} msg={msg} t={t} at={0.08 + i * 0.24} ink={aurelion.ink} />
        ))}
      </div>
      <div className="flex items-center gap-2 border-t border-forest/10 px-3 py-2 sm:px-5 sm:py-2.5">
        <span className="flex-1 rounded-full border border-forest/12 bg-cream px-3 py-1.5 text-[0.6rem] text-muted sm:text-[0.66rem]">
          Message Expecto…
        </span>
        <span className="grid size-7 place-items-center rounded-full bg-forest text-cream sm:size-8">
          <Send className="size-3 sm:size-3.5" />
        </span>
      </div>
    </SceneShell>
  );
}

function TelegramBubble({
  msg,
  t,
  at,
  ink,
}: {
  msg: (typeof TELEGRAM_MESSAGES)[number];
  t: MotionValue<number>;
  at: number;
  ink: string;
}) {
  const opacity = useTransform(t, [at, at + 0.08], [0, 1], { clamp: true });
  const y = useTransform(t, [at, at + 0.08], [14, 0], { clamp: true });
  return (
    <motion.div
      style={{ opacity, y }}
      className={cn("flex", msg.mine ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[82%] rounded-2xl px-3 py-2 sm:max-w-[70%] sm:px-3.5 sm:py-2.5",
          msg.mine
            ? "rounded-br-md bg-forest text-cream"
            : "rounded-bl-md border border-forest/12 bg-cream-2/70 text-forest-deep",
        )}
      >
        {!msg.mine ? (
          <p className="text-[0.54rem] font-semibold tracking-[0.08em] uppercase" style={{ color: ink }}>
            {msg.from}
          </p>
        ) : null}
        <p className="text-[0.64rem] leading-snug sm:text-[0.72rem]">{msg.text}</p>
        <p
          className={cn(
            "mt-0.5 text-right text-[0.52rem] tabular-nums",
            msg.mine ? "text-cream/60" : "text-muted",
          )}
        >
          {msg.time}
        </p>
      </div>
    </motion.div>
  );
}
