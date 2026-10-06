import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  EMPTY_FORM,
  ENGLISH_LEVELS,
  GRADES,
  BookingUnavailableError,
  formatPhone,
  normalizePhone,
  normalizeTelegram,
  submitBooking,
  validateAbout,
  validateContact,
  type BookingErrors,
  type BookingForm,
} from "@/lib/booking";
import { TELEGRAM_HANDLE, TELEGRAM_URL } from "@/lib/content";
import { cn } from "@/lib/cn";
import { useLenis } from "lenis/react";
import { ArrowLeft, LoaderCircle, Phone, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type RefObject,
  type ReactNode,
} from "react";
import { BookingContext, type BookingApi } from "./bookingContext";
import { DrawPath, EASE, HouseRibbon, Star, TelegramMark, house } from "./ui/primitives";

/* ---------------------------------------------------------------- */
/* Context                                                           */
/* ---------------------------------------------------------------- */

type Status = "idle" | "sending" | "error" | "done";

const STEPS = ["About you", "How to reach you"] as const;

const PROMISES = [
  { title: "Tell us about you", body: "A minute, two short steps." },
  { title: "We reach out", body: "By call or Telegram — whichever you pick." },
  { title: "Find your fit", body: "Your level, your target score, the right class." },
] as const;

/* ---------------------------------------------------------------- */
/* Provider + dialog                                                 */
/* ---------------------------------------------------------------- */

export function BookingProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [source, setSource] = useState("cta");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeTimer = useRef(0);
  const lenis = useLenis();

  const open = useCallback((from = "cta") => {
    window.clearTimeout(closeTimer.current);
    setSource(from);
    if (dialogRef.current?.open) setVisible(true); // reopened while it was still closing
    setMounted(true);
  }, []);

  // Open natively once the <dialog> exists, then flip to the visible state a frame later so the CSS transition runs.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!mounted || !dialog || dialog.open) return;
    dialog.showModal();
    document.documentElement.dataset.bookingOpen = "";
    lenis?.stop();
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [mounted, lenis]);

  const close = useCallback(() => {
    setVisible(false);
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      dialogRef.current?.close();
      delete document.documentElement.dataset.bookingOpen;
      lenis?.start();
      setMounted(false);
    }, 420);
  }, [lenis]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const api = useMemo<BookingApi>(() => ({ open }), [open]);

  return (
    <BookingContext.Provider value={api}>
      {children}
      {mounted ? <BookingDialog dialogRef={dialogRef} visible={visible} source={source} onClose={close} /> : null}
    </BookingContext.Provider>
  );
}

function BookingDialog({
  dialogRef,
  visible,
  source,
  onClose,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  visible: boolean;
  source: string;
  onClose: () => void;
}) {
  const reduced = usePrefersReducedMotion();
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState<BookingForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [trap, setTrap] = useState("");
  const inflight = useRef<AbortController | null>(null);
  const finePointer = useMemo(() => window.matchMedia("(pointer: fine)").matches, []);

  useEffect(() => () => inflight.current?.abort(), []);

  const set = <K extends keyof BookingForm>(key: K, value: BookingForm[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  };

  const focusFirstInvalid = (found: BookingErrors) => {
    const name = (Object.keys(found) as (keyof BookingForm)[])[0];
    if (!name) return;
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(`[name="${name}"]`)?.focus());
  };

  const next = () => {
    const found = validateAbout(form);
    setErrors(found);
    if (Object.keys(found).length) return focusFirstInvalid(found);
    setStep(1);
  };

  const send = async () => {
    const found = validateContact(form);
    setErrors(found);
    if (Object.keys(found).length) return focusFirstInvalid(found);
    if (trap) return setStatus("done"); // a bot filled the hidden field — look successful, send nothing
    setStatus("sending");
    inflight.current = new AbortController();
    try {
      await submitBooking(form, source, inflight.current.signal);
      setStatus("done");
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      if (!(err instanceof BookingUnavailableError)) console.error(err);
      setStatus("error");
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending" || status === "done") return;
    if (step === 0) next();
    else void send();
  };

  const done = status === "done";
  const firstName = form.name.trim().split(/\s+/)[0];
  const handle = normalizeTelegram(form.telegram);

  return (
    <dialog
      ref={dialogRef}
      className="booking"
      data-state={visible ? "open" : "closed"}
      aria-labelledby="booking-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <div
        className="booking-wrap"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="booking-shell" data-lenis-prevent>
          {/* ---- Left: the invitation ---- */}
          <aside data-theme="dark" className="booking-aside relative flex flex-col overflow-hidden bg-night text-paper">
            <HouseRibbon tone="bright" className="absolute inset-x-0 top-0 h-[3px]" />
            <div className="booking-aside-glow" aria-hidden="true" />
            <div className="relative flex flex-1 flex-col px-6 pt-6 pb-5 md:p-10">
              <p className="eyebrow text-gold-2">
                <Star size={10} /> Expecto Academy
              </p>
              <h2 id="booking-title" className="display mt-5 text-[clamp(2rem,5.6vw,3.4rem)] md:mt-8 md:text-[clamp(2.4rem,3.6vw,3.4rem)]">
                Book your <em className="text-gold-2">session.</em>
              </h2>
              <p className="mt-4 hidden max-w-[22rem] text-[0.95rem] leading-relaxed text-paper/65 md:block">
                Share a few details and we’ll get back to you as soon as we can — by call or Telegram, your choice.
              </p>

              <ol className="mt-auto hidden space-y-5 pt-10 md:block">
                {PROMISES.map((p, i) => (
                  <li key={p.title} className="flex gap-4">
                    <span
                      className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border text-[0.72rem] font-semibold tnum"
                      style={{ borderColor: house(i).bright, color: house(i).bright }}
                    >
                      {i + 1}
                    </span>
                    <span>
                      <span className="block text-[0.95rem] font-medium">{p.title}</span>
                      <span className="block text-[0.85rem] text-paper/55">{p.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          {/* ---- Right: the form ---- */}
          <section className="booking-main relative flex min-h-0 flex-col bg-card text-ink">
            <div className="flex items-center justify-between gap-4 px-6 pt-5 md:px-10 md:pt-7">
              {done ? (
                <span className="eyebrow eyebrow--plain">Request received</span>
              ) : (
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <span className="eyebrow eyebrow--plain shrink-0 tnum">
                    Step {step + 1} / {STEPS.length}
                  </span>
                  <span className="flex h-[3px] max-w-[9rem] flex-1 gap-1" aria-hidden="true">
                    {STEPS.map((s, i) => (
                      <span key={s} className="relative flex-1 overflow-hidden rounded-full bg-ink/10">
                        <span
                          className="absolute inset-0 origin-left rounded-full transition-transform duration-700 ease-[var(--ease-out-expo)]"
                          style={{ backgroundColor: house(i === 0 ? 0 : 1).fill, transform: `scaleX(${i <= step ? 1 : 0})` }}
                        />
                      </span>
                    ))}
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="-mr-2 grid size-11 shrink-0 place-items-center rounded-full text-ink-soft transition-colors duration-300 hover:bg-ink/[0.07] hover:text-ink"
              >
                <X size={18} strokeWidth={1.6} />
              </button>
            </div>

            <div className="booking-scroll min-h-0 flex-1 overflow-y-auto px-6 pt-4 pb-6 md:px-10 md:pb-9">
              <AnimatePresence mode="wait" initial={false}>
                {done ? (
                  <motion.div
                    key="done"
                    initial={reduced ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: EASE }}
                    className="flex min-h-[22rem] flex-col justify-center py-6"
                  >
                    <svg width="64" height="64" viewBox="0 0 64 64" className="text-slytherin" aria-hidden="true">
                      <DrawPath play d="M32 4a28 28 0 1 0 .01 0Z" stroke="currentColor" strokeWidth="2" duration={0.9} />
                      <DrawPath play delay={0.55} d="M19 33.5 28 42 45 23" stroke="currentColor" strokeWidth="3.2" duration={0.55} />
                    </svg>
                    <h3 className="display mt-7 text-[clamp(2.1rem,4.6vw,2.9rem)]">
                      You’re in, <em className="text-gryffindor">{firstName}.</em>
                    </h3>
                    <p className="mt-4 max-w-[26rem] text-[1rem] leading-relaxed text-ink-soft">
                      {form.preference === "call" ? (
                        <>
                          We’ll call you on <span className="font-medium text-ink tnum">+998 {formatPhone(form.phone)}</span> as soon as we can.
                        </>
                      ) : (
                        <>
                          We’ll message you on <span className="font-medium text-ink">@{handle}</span> as soon as we can.
                        </>
                      )}
                    </p>
                    <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
                      <button type="button" onClick={onClose} className="btn btn--ink px-8">
                        <span>Back to the site</span>
                      </button>
                      <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="link-draw pb-0.5 text-[0.9rem] text-ink-soft hover:text-ink">
                        Follow {TELEGRAM_HANDLE}
                      </a>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key={step}
                    ref={formRef}
                    noValidate
                    onSubmit={onSubmit}
                    initial={reduced ? false : { opacity: 0, x: step === 0 ? -16 : 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reduced ? undefined : { opacity: 0, x: step === 0 ? -16 : 16 }}
                    transition={{ duration: 0.38, ease: EASE }}
                    className="flex flex-col gap-6"
                  >
                    <div>
                      <h3 className="display text-[1.9rem] md:text-[2.15rem]">
                        {step === 0 ? (
                          <>
                            A little about <em className="text-gryffindor">you</em>
                          </>
                        ) : (
                          <>
                            How should we <em className="text-gryffindor">reach you?</em>
                          </>
                        )}
                      </h3>
                    </div>

                    {step === 0 ? (
                      <>
                        <Field id="name" label="Your name" error={errors.name}>
                          <input
                            className="field"
                            name="name"
                            value={form.name}
                            onChange={(e) => set("name", e.target.value)}
                            autoComplete="name"
                            autoFocus={finePointer}
                            placeholder="Full name"
                            aria-invalid={Boolean(errors.name)}
                            aria-describedby={errors.name ? "err-name" : undefined}
                          />
                        </Field>
                        <Field id="school" label="School" error={errors.school}>
                          <input
                            className="field"
                            name="school"
                            value={form.school}
                            onChange={(e) => set("school", e.target.value)}
                            autoComplete="organization"
                            placeholder="e.g. School No. 110, Tashkent"
                            aria-invalid={Boolean(errors.school)}
                            aria-describedby={errors.school ? "err-school" : undefined}
                          />
                        </Field>
                        <Choices
                          legend="Grade"
                          name="grade"
                          error={errors.grade}
                          value={form.grade}
                          onChange={(v) => set("grade", v)}
                          options={GRADES.map((g) => ({ value: g, label: g }))}
                        />
                        <Choices
                          legend="English level"
                          name="level"
                          error={errors.level}
                          value={form.level}
                          onChange={(v) => set("level", v)}
                          options={ENGLISH_LEVELS.map((l) => ({ value: l.id, label: l.label, hint: l.hint }))}
                        />
                      </>
                    ) : (
                      <>
                        <fieldset className="min-w-0">
                          <legend className="field-label">Which is easier for you?</legend>
                          <div className="mt-2 grid grid-cols-2 gap-3">
                            {(
                              [
                                { id: "telegram", label: "Write on Telegram", icon: <TelegramMark size={18} /> },
                                { id: "call", label: "Call me", icon: <Phone size={18} strokeWidth={1.7} /> },
                              ] as const
                            ).map((o) => (
                              <label key={o.id} className="block">
                                <input
                                  type="radio"
                                  name="preference"
                                  className="peer sr-only"
                                  checked={form.preference === o.id}
                                  onChange={() => set("preference", o.id)}
                                />
                                <span className="pref-card">
                                  {o.icon}
                                  <span>{o.label}</span>
                                </span>
                              </label>
                            ))}
                          </div>
                        </fieldset>

                        <Field id="phone" label="Phone number" error={errors.phone}>
                          <div className="field-group">
                            <span className="field-prefix tnum">+998</span>
                            <input
                              className="field field--bare tnum"
                              name="phone"
                              type="tel"
                              inputMode="tel"
                              autoComplete="tel-national"
                              placeholder="90 123 45 67"
                              value={formatPhone(form.phone)}
                              onChange={(e) => set("phone", normalizePhone(e.target.value))}
                              aria-invalid={Boolean(errors.phone)}
                              aria-describedby={errors.phone ? "err-phone" : undefined}
                            />
                          </div>
                        </Field>

                        <Field
                          id="telegram"
                          label="Telegram username"
                          note={form.preference === "call" ? "Optional" : undefined}
                          error={errors.telegram}
                        >
                          <div className="field-group">
                            <span className="field-prefix">@</span>
                            <input
                              className="field field--bare"
                              name="telegram"
                              autoCapitalize="none"
                              autoCorrect="off"
                              spellCheck={false}
                              placeholder="username"
                              value={form.telegram.replace(/^@+/, "")}
                              onChange={(e) => set("telegram", normalizeTelegram(e.target.value))}
                              aria-invalid={Boolean(errors.telegram)}
                              aria-describedby={errors.telegram ? "err-telegram" : undefined}
                            />
                          </div>
                        </Field>

                        {/* Honeypot: invisible to people, tempting to bots. */}
                        <input
                          type="text"
                          name="website"
                          tabIndex={-1}
                          autoComplete="off"
                          aria-hidden="true"
                          value={trap}
                          onChange={(e) => setTrap(e.target.value)}
                          className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
                        />
                      </>
                    )}

                    {status === "error" ? (
                      <p role="alert" className="rounded-2xl border border-gryffindor/25 bg-gryffindor-wash px-4 py-3 text-[0.9rem] leading-relaxed text-gryffindor">
                        We couldn’t send that just now. Please try again, or message us directly on{" "}
                        <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-2">
                          Telegram {TELEGRAM_HANDLE}
                        </a>
                        .
                      </p>
                    ) : null}

                    <div className="mt-1 flex items-center gap-3">
                      {step === 1 ? (
                        <button
                          type="button"
                          onClick={() => {
                            setStatus("idle");
                            setStep(0);
                          }}
                          aria-label="Back"
                          className="grid size-14 shrink-0 place-items-center rounded-full border border-ink/20 text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-paper"
                        >
                          <ArrowLeft size={18} strokeWidth={1.7} />
                        </button>
                      ) : null}
                      <button type="submit" disabled={status === "sending"} className="btn btn--ink flex-1 disabled:opacity-80">
                        {status === "sending" ? (
                          <>
                            <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />
                            <span>Sending…</span>
                          </>
                        ) : (
                          <span>{step === 0 ? "Continue" : "Book my session"}</span>
                        )}
                      </button>
                    </div>
                    {step === 1 ? (
                      <p className="-mt-2 text-center text-[0.78rem] text-ink-faint">
                        We only use your details to get in touch about your session.
                      </p>
                    ) : null}
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </div>
    </dialog>
  );
}

/* ---------------------------------------------------------------- */
/* Form pieces                                                       */
/* ---------------------------------------------------------------- */

function Field({ id, label, note, error, children }: { id: string; label: string; note?: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="field-label">
        {label}
        {note ? <span className="ml-2 font-normal tracking-normal text-ink-faint normal-case">{note}</span> : null}
      </span>
      <span className="mt-2 block">{children}</span>
      {error ? (
        <span id={`err-${id}`} className="mt-1.5 block text-[0.8rem] text-gryffindor">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function Choices<T extends string>({
  legend,
  name,
  value,
  onChange,
  options,
  error,
}: {
  legend: string;
  name: string;
  value: T | "";
  onChange: (value: T) => void;
  options: { value: T; label: string; hint?: string }[];
  error?: string;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="field-label">{legend}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o, i) => (
          <label key={o.value}>
            <input
              type="radio"
              name={name}
              value={o.value}
              className="peer sr-only"
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              aria-invalid={Boolean(error)}
              data-first={i === 0 || undefined}
            />
            <span className={cn("chip", o.hint && "chip--stack")}>
              <span>{o.label}</span>
              {o.hint ? <span className="chip-hint">{o.hint}</span> : null}
            </span>
          </label>
        ))}
      </div>
      {error ? <span className="mt-1.5 block text-[0.8rem] text-gryffindor">{error}</span> : null}
    </fieldset>
  );
}
