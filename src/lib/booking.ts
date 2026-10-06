export const GRADES = ["9", "10", "11", "12", "Graduated"] as const;

export const ENGLISH_LEVELS = [
  { id: "beginner", label: "Beginner", hint: "A1–A2" },
  { id: "intermediate", label: "Intermediate", hint: "B1–B2" },
  { id: "advanced", label: "Advanced", hint: "C1–C2" },
  { id: "unsure", label: "Not sure", hint: "We'll check" },
] as const;

export type Grade = (typeof GRADES)[number];
export type EnglishLevel = (typeof ENGLISH_LEVELS)[number]["id"];
export type ContactPreference = "call" | "telegram";

export interface BookingForm {
  name: string;
  school: string;
  grade: Grade | "";
  level: EnglishLevel | "";
  preference: ContactPreference;
  telegram: string;
  /** Local digits only, without the +998 country code. */
  phone: string;
}

export type BookingErrors = Partial<Record<keyof BookingForm, string>>;

export const EMPTY_FORM: BookingForm = {
  name: "",
  school: "",
  grade: "",
  level: "",
  preference: "telegram",
  telegram: "",
  phone: "",
};

/** Pull a bare username out of "@name", "t.me/name" or "https://t.me/name". */
export function normalizeTelegram(raw: string) {
  return raw
    .trim()
    .replace(/^(https?:\/\/)?(www\.)?(t\.me|telegram\.me)\//i, "")
    .replace(/^@+/, "")
    .replace(/[/?#].*$/, "");
}

/** Reduce anything typed or pasted to the 9 local digits of an Uzbek number. */
export function normalizePhone(raw: string) {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("998") && digits.length > 9) digits = digits.slice(3);
  return digits.slice(0, 9);
}

/** 901234567 → "90 123 45 67". */
export function formatPhone(digits: string) {
  const parts = [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 7), digits.slice(7, 9)];
  return parts.filter(Boolean).join(" ");
}

export function validateAbout(form: BookingForm): BookingErrors {
  const errors: BookingErrors = {};
  if (form.name.trim().length < 2) errors.name = "Tell us your name.";
  if (form.school.trim().length < 2) errors.school = "Which school are you at?";
  if (!form.grade) errors.grade = "Pick your grade.";
  if (!form.level) errors.level = "Pick the closest level.";
  return errors;
}

export function validateContact(form: BookingForm): BookingErrors {
  const errors: BookingErrors = {};
  if (form.phone.length !== 9) errors.phone = "Enter your 9-digit number, like 90 123 45 67.";
  const handle = normalizeTelegram(form.telegram);
  if (handle ? !/^[A-Za-z][A-Za-z0-9_]{4,31}$/.test(handle) : form.preference === "telegram") {
    errors.telegram = handle
      ? "Usernames are 5–32 letters, numbers or underscores."
      : "Add your Telegram username so we can write to you.";
  }
  return errors;
}

export interface BookingPayload {
  name: string;
  school: string;
  grade: string;
  englishLevel: string;
  contactPreference: ContactPreference;
  telegram: string;
  phone: string;
  source: string;
  submittedAt: string;
  page: string;
}

export class BookingUnavailableError extends Error {}

/**
 * Where leads go. Any endpoint that accepts a JSON POST works (Formspree, a Google Apps
 * Script, your own server). Set VITE_LEAD_ENDPOINT at build time.
 */
const ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT as string | undefined;

export async function submitBooking(form: BookingForm, source: string, signal?: AbortSignal) {
  const handle = normalizeTelegram(form.telegram);
  const payload: BookingPayload = {
    name: form.name.trim(),
    school: form.school.trim(),
    grade: form.grade,
    englishLevel: ENGLISH_LEVELS.find((l) => l.id === form.level)?.label ?? form.level,
    contactPreference: form.preference,
    telegram: handle ? `@${handle}` : "",
    phone: `+998 ${formatPhone(form.phone)}`,
    source,
    submittedAt: new Date().toISOString(),
    page: window.location.href,
  };

  if (!ENDPOINT) {
    // Never pretend a lead was saved in production; in dev, let the flow be tested end to end.
    if (import.meta.env.DEV) {
      console.info("[booking] VITE_LEAD_ENDPOINT is not set — simulated submit:", payload);
      await new Promise((resolve) => window.setTimeout(resolve, 900));
      return;
    }
    throw new BookingUnavailableError("No lead endpoint configured");
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
    signal,
  });
  if (!res.ok) throw new Error(`Booking request failed (${res.status})`);
}
