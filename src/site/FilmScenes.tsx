import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { ERROR_LOG, GAUNTLET, SCHOLARSHIP_ROWS, TELEGRAM_MESSAGES, TRAP_NOTES } from "@/lib/content";
import { cn } from "@/lib/cn";
import { motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { Counter, DrawPath, EASE } from "./ui/primitives";

function useIn() {
  const reduced = usePrefersReducedMotion();
  return (delay = 0, y = 14) =>
    ({
      initial: reduced ? false : { opacity: 0, y },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.8, ease: EASE, delay },
    }) as const;
}

function Bar({ w, delay, className }: { w: string; delay: number; className?: string }) {
  const reduced = usePrefersReducedMotion();
  return (
    <motion.span
      className={cn("block h-[7px] origin-left rounded-full bg-ink/10", className)}
      style={{ width: w }}
      initial={reduced ? false : { scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    />
  );
}

function Note({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("hand text-[1.3rem] leading-none text-gold", className)}>{children}</span>;
}

/* 01 — the diagnostic --------------------------------------------------- */

function useTimer(startSeconds: number) {
  const reduced = usePrefersReducedMotion();
  const [s, setS] = useState(startSeconds);
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setS((v) => Math.max(0, v - 1)), 1000);
    return () => window.clearInterval(id);
  }, [reduced]);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export function SceneDiagnostic() {
  const fx = useIn();
  const timer = useTimer(24 * 60 + 16);
  return (
    <div className="flex h-full flex-col p-5 md:p-8">
      <motion.div {...fx(0)} className="flex items-center justify-between gap-3 text-[0.68rem] font-medium tracking-[0.12em] text-ink-soft uppercase">
        <span className="truncate">Section 1 · Reading and Writing</span>
        <span className="rounded-full border border-ink/15 bg-paper px-3 py-1 text-[0.74rem] tracking-normal text-ink tnum">{timer}</span>
        <span className="hidden sm:inline">Module 1 of 2</span>
      </motion.div>
      <div className="mt-6 grid flex-1 gap-6 md:mt-8 md:grid-cols-[1.25fr_1fr] md:gap-10">
        <div className="space-y-3.5">
          <motion.p {...fx(0.1)} className="text-[0.7rem] tracking-[0.1em] text-ink-faint uppercase">
            Passage · adapted from a 2021 essay
          </motion.p>
          {["100%", "94%", "98%", "88%", "96%", "62%"].map((w, i) => (
            <Bar key={i} w={w} delay={0.2 + i * 0.08} />
          ))}
          <div className="pt-3">
            {["92%", "97%", "54%"].map((w, i) => (
              <Bar key={i} w={w} delay={0.75 + i * 0.08} className="mb-3.5" />
            ))}
          </div>
        </div>
        <motion.div {...fx(0.35)} className="hidden md:block">
          <p className="text-[0.7rem] tracking-[0.1em] text-ink-faint uppercase">Question 7 of 27</p>
          <div className="mt-4 grid grid-cols-9 gap-1.5">
            {Array.from({ length: 27 }, (_, i) => (
              <motion.span
                key={i}
                className={cn(
                  "aspect-square rounded-[5px] border",
                  i < 6 ? "border-ink bg-ink" : i === 6 ? "border-gold bg-gold-3" : "border-ink/12",
                )}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: EASE, delay: 0.45 + i * 0.02 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
      <motion.div {...fx(1.2)} className="mt-4 flex items-center gap-2 self-end">
        <Note>scored the same night</Note>
        <svg width="34" height="18" viewBox="0 0 34 18" className="text-gold" aria-hidden="true">
          <DrawPath play delay={1.4} duration={0.5} d="M2 9 C 12 4, 22 14, 32 8 M26 3 L32 8 L26 13" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </motion.div>
    </div>
  );
}

/* 02 — the trap ---------------------------------------------------------- */

export function SceneTrap() {
  const fx = useIn();
  const letters = ["A", "B", "C", "D"] as const;
  const noteFor = (l: string) => TRAP_NOTES.find((n) => n.choice === l);
  return (
    <div className="grid h-full gap-6 p-5 md:grid-cols-[1.15fr_1fr] md:gap-8 md:p-8">
      <div>
        <motion.p {...fx(0)} className="text-[0.7rem] tracking-[0.1em] text-ink-faint uppercase">
          Question 7 of 27
        </motion.p>
        <motion.p {...fx(0.08)} className="mt-3 font-serif text-[1.25rem] leading-snug md:text-[1.45rem]">
          Which choice best states the main purpose of the text?
        </motion.p>
        <ul className="mt-5 space-y-2.5 md:mt-7">
          {letters.map((l, i) => {
            const note = noteFor(l);
            const wrong = note && note.choice === "B";
            const right = note && note.choice === "D";
            return (
              <motion.li
                key={l}
                {...fx(0.2 + i * 0.07)}
                className={cn(
                  "relative flex items-center gap-3 rounded-2xl border px-3.5 py-2.5",
                  right ? "border-gold/50 bg-gold-3/40" : "border-ink/10 bg-paper/60",
                )}
              >
                <span className="relative grid size-7 shrink-0 place-items-center rounded-full border border-ink/20 text-[0.78rem] font-semibold">
                  {l}
                  {right ? (
                    <svg viewBox="0 0 40 40" className="boil absolute -inset-2 size-11 text-gold" aria-hidden="true">
                      <DrawPath play delay={1.25} duration={0.7} d="M20 3 C 32 3, 38 12, 37 21 C 36 32, 26 38, 18 37 C 8 36, 2 28, 3 18 C 4 9, 12 4, 23 5" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  ) : null}
                </span>
                <span className="flex-1 space-y-1.5">
                  <span className="block h-[6px] rounded-full bg-ink/10" style={{ width: `${[78, 88, 70, 84][i]}%` }} />
                  <span className="block h-[6px] rounded-full bg-ink/10" style={{ width: `${[40, 52, 34, 58][i]}%` }} />
                </span>
                {wrong ? (
                  <svg viewBox="0 0 300 20" preserveAspectRatio="none" className="boil pointer-events-none absolute top-1/2 right-32 left-2 h-5 -translate-y-1/2 text-clay" aria-hidden="true">
                    <DrawPath play delay={0.8} duration={0.5} d="M4 12 C 80 6, 180 14, 296 7" stroke="currentColor" strokeWidth="2.4" />
                  </svg>
                ) : null}
                {note ? (
                  <motion.span
                    {...fx(wrong ? 1 : 1.5, 6)}
                    className={cn("hand shrink-0 text-[1.15rem] leading-none", wrong ? "text-clay" : "text-gold")}
                  >
                    {note.verdict}
                  </motion.span>
                ) : null}
              </motion.li>
            );
          })}
        </ul>
      </div>
      <div className="hidden flex-col justify-center gap-3 md:flex">
        {TRAP_NOTES.map((note, i) => (
          <motion.div
            key={note.choice}
            {...fx(1.1 + i * 0.4, 18)}
            className={cn(
              "rounded-2xl border p-4",
              note.choice === "D" ? "border-ink bg-ink text-paper" : "border-ink/10 bg-paper",
            )}
          >
            <p className={cn("text-[0.68rem] font-semibold tracking-[0.14em] uppercase", note.choice === "D" ? "text-gold-2" : "text-clay")}>
              {note.choice} · {note.verdict}
            </p>
            <p className={cn("mt-2 text-[0.88rem] leading-relaxed", note.choice === "D" ? "text-paper/85" : "text-ink-soft")}>{note.note}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* 03 — the error log ---------------------------------------------------- */

export function SceneErrorLog() {
  const fx = useIn();
  const reduced = usePrefersReducedMotion();
  const max = Math.max(...ERROR_LOG.map((r) => r.assigned));
  return (
    <div className="flex h-full flex-col p-5 md:p-8">
      <motion.div {...fx(0)} className="flex items-end justify-between">
        <p className="text-[0.7rem] tracking-[0.1em] text-ink-faint uppercase">Missed · Assigned tonight</p>
        <Note className="-rotate-2">your misses, your homework</Note>
      </motion.div>
      <ul className="mt-5 flex flex-1 flex-col justify-center divide-y divide-ink/8 md:mt-6">
        {ERROR_LOG.map((row, i) => (
          <motion.li key={row.type} {...fx(0.12 + i * 0.1)} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 py-3 md:grid-cols-[1.3fr_auto_1fr] md:py-3.5">
            <span className="text-[0.92rem] text-ink">{row.type}</span>
            <span className="flex gap-1" aria-label={`${row.misses} missed`}>
              {Array.from({ length: row.misses }, (_, k) => (
                <motion.span
                  key={k}
                  className="size-2 rounded-full bg-clay"
                  initial={reduced ? false : { scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.35, ease: EASE, delay: 0.35 + i * 0.1 + k * 0.05 }}
                />
              ))}
            </span>
            <span className="col-span-2 flex items-center gap-3 md:col-span-1">
              <span className="relative h-[6px] flex-1 overflow-hidden rounded-full bg-ink/8">
                <motion.span
                  className="absolute inset-y-0 left-0 origin-left rounded-full bg-ink"
                  style={{ width: `${(row.assigned / max) * 100}%` }}
                  initial={reduced ? false : { scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, ease: EASE, delay: 0.55 + i * 0.1 }}
                />
              </span>
              <span className="w-16 text-right text-[0.78rem] text-ink-soft tnum">{row.assigned} drills</span>
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/* 04 — the gauntlet ----------------------------------------------------- */

export function SceneGauntlet() {
  const fx = useIn();
  return (
    <div className="relative flex h-full flex-col justify-center p-5 md:p-8">
      <svg viewBox="0 0 600 120" preserveAspectRatio="none" className="boil pointer-events-none absolute inset-x-8 top-[10%] h-[22%] text-gold" aria-hidden="true">
        <DrawPath play delay={1} duration={1.2} d="M40 100 C 150 90, 200 70, 300 62 S 470 30, 560 12" stroke="currentColor" strokeWidth="2" />
      </svg>
      <div className="relative mt-10 grid grid-cols-3 gap-2.5 md:gap-4">
        {GAUNTLET.map((mock, i) => (
          <motion.div
            key={mock.label}
            {...fx(0.15 + i * 0.18, 30)}
            className={cn(
              "rounded-2xl border p-3 md:p-5",
              i === GAUNTLET.length - 1 ? "border-ink bg-ink text-paper" : "border-ink/10 bg-paper",
            )}
            style={{ marginTop: `${(GAUNTLET.length - 1 - i) * 18}px` }}
          >
            <div className="flex items-center justify-between">
              <p className="text-[0.62rem] font-semibold tracking-[0.14em] uppercase md:text-[0.68rem]">{mock.label}</p>
              {mock.done ? (
                <svg width="16" height="16" viewBox="0 0 16 16" aria-label="done" className={i === GAUNTLET.length - 1 ? "text-gold-2" : "text-gold"}>
                  <DrawPath play delay={0.6 + i * 0.18} duration={0.4} d="M3 8.5 6.5 12 13 4" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              ) : null}
            </div>
            <p className={cn("mt-1 text-[0.66rem] md:text-[0.74rem]", i === GAUNTLET.length - 1 ? "text-paper/60" : "text-ink-faint")}>{mock.when}</p>
            <p className="display mt-4 text-[2rem] md:mt-6 md:text-[3.2rem]">{mock.score}</p>
          </motion.div>
        ))}
      </div>
      <motion.p {...fx(1.6)} className="mt-6 text-center">
        <Note>timed · adaptive · no pause button</Note>
      </motion.p>
    </div>
  );
}

/* 05 — the letter -------------------------------------------------------- */

export function SceneReport() {
  const fx = useIn();
  return (
    <div className="grid h-full gap-6 p-5 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-8 md:p-8">
      <div>
        <motion.p {...fx(0)} className="text-[0.7rem] tracking-[0.1em] text-ink-faint uppercase">Total score</motion.p>
        <p className="display mt-2 text-[5rem] text-ink md:text-[7.2rem]">
          <Counter from={1180} to={1480} duration={2} delay={0.2} play format={(n) => String(Math.round(n))} />
        </p>
        <motion.div {...fx(0.9)} className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-ink px-3 py-1 text-[0.74rem] font-medium text-paper">+300 from the diagnostic</span>
          <span className="rounded-full border border-gold/50 bg-gold-3/50 px-3 py-1 text-[0.74rem] font-medium text-ink">98th percentile</span>
        </motion.div>
      </div>
      <ul className="divide-y divide-ink/8 rounded-2xl border border-ink/10 bg-paper/70 px-4">
        {SCHOLARSHIP_ROWS.map((row, i) => (
          <motion.li key={row.school} {...fx(1 + i * 0.12, 10)} className="flex items-center justify-between gap-3 py-3">
            <span>
              <span className="block text-[0.88rem] text-ink">{row.school}</span>
              <span className="block text-[0.72rem] text-ink-faint">{row.band}</span>
            </span>
            <span className="flex items-center gap-2 text-[0.8rem] text-ink-soft tnum">
              {row.min}
              <svg width="15" height="15" viewBox="0 0 16 16" className="text-gold" aria-hidden="true">
                <DrawPath play delay={1.2 + i * 0.12} duration={0.4} d="M3 8.5 6.5 12 13 4" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/* 06 — enrolled ---------------------------------------------------------- */

export function SceneTelegram() {
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(reduced ? 99 : 0);
  useEffect(() => {
    if (reduced) return;
    const times = [250, 1200, 1900, 2900];
    const ids = times.map((t, i) => window.setTimeout(() => setStep(i + 1), t));
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [reduced]);
  const visible = [step >= 1, step >= 2, step >= 4];
  const typing = step === 3;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-ink/8 px-5 py-3.5 md:px-8">
        <span className="grid size-9 place-items-center rounded-full bg-ink">
          <img src="/logo.png" alt="" className="h-5 w-auto" />
        </span>
        <span>
          <span className="block text-[0.9rem] font-medium">Expecto Academy</span>
          <span className="block text-[0.7rem] text-ink-faint">{typing ? "typing…" : "online"}</span>
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-end gap-2.5 p-5 md:p-8">
        {TELEGRAM_MESSAGES.map((m, i) =>
          visible[i] ? (
            <motion.div
              key={i}
              initial={reduced ? false : { opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55, ease: EASE }}
              className={cn(
                "max-w-[82%] rounded-[20px] px-4 py-2.5 text-[0.9rem] leading-snug md:text-[0.95rem]",
                m.mine ? "self-end rounded-br-md bg-ink text-paper" : "self-start rounded-bl-md border border-ink/10 bg-paper text-ink",
              )}
              style={{ transformOrigin: m.mine ? "100% 100%" : "0% 100%" }}
            >
              {m.text}
              <span className={cn("ml-2 text-[0.66rem] tnum", m.mine ? "text-paper/50" : "text-ink-faint")}>{m.time}</span>
            </motion.div>
          ) : null,
        )}
        {typing ? (
          <div className="flex gap-1 self-start rounded-[20px] rounded-bl-md border border-ink/10 bg-paper px-4 py-3.5">
            <span className="typing-dot size-1.5 rounded-full bg-ink" />
            <span className="typing-dot size-1.5 rounded-full bg-ink" />
            <span className="typing-dot size-1.5 rounded-full bg-ink" />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export const SCENES = [SceneDiagnostic, SceneTrap, SceneErrorLog, SceneGauntlet, SceneReport, SceneTelegram] as const;
