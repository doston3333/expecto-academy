import { useMotionPreferenceControl } from "@/hooks/motionPreference";
import { EMAIL, NAV_LINKS, TELEGRAM_HANDLE, TELEGRAM_URL } from "@/lib/content";
import { cn } from "@/lib/cn";
import { HouseRibbon } from "./ui/primitives";

function MotionSwitch() {
  const control = useMotionPreferenceControl();
  if (!control) return null;
  const { enabled, setOverride } = control;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => setOverride(!enabled)}
      className="inline-flex min-h-11 items-center gap-3 text-[0.78rem] text-paper/50 transition-colors hover:text-paper/80"
    >
      Page animation
      <span aria-hidden="true" className={cn("relative h-[18px] w-8 rounded-full border transition-colors duration-300", enabled ? "border-gold-2/60 bg-gold/30" : "border-paper/25")}>
        <span className={cn("absolute top-1/2 size-3 -translate-y-1/2 rounded-full transition-[left,background-color] duration-300", enabled ? "left-[15px] bg-gold-2" : "left-[2px] bg-paper/50")} />
      </span>
    </button>
  );
}

export function Footer() {
  return (
    <footer data-theme="dark" className="relative overflow-hidden bg-night text-paper">
      <HouseRibbon tone="bright" className="h-[3px] opacity-80" />
      <div className="mx-auto max-w-[1320px] px-5 md:px-10">
        <div className="grid gap-12 py-16 md:grid-cols-12 md:py-20">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="" className="h-9 w-auto" />
              <p className="font-serif text-[1.35rem] tracking-[-0.02em]">
                Expecto <span className="italic text-paper/60">Academy</span>
              </p>
            </div>
            <p className="mt-5 max-w-sm text-[0.9rem] leading-relaxed text-paper/60">
              An English-language Digital SAT school for students across Uzbekistan. A higher score means
              lower tuition.
            </p>
          </div>
          <div className="md:col-span-3">
            <p className="text-[0.68rem] tracking-[0.2em] text-gold-2 uppercase">Explore</p>
            <ul className="mt-5 space-y-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="link-draw inline-flex min-h-10 items-center text-[0.92rem] text-paper/75 hover:text-paper">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-4">
            <p className="text-[0.68rem] tracking-[0.2em] text-gold-2 uppercase">Contact</p>
            <ul className="mt-5 space-y-1 text-[0.92rem]">
              <li>
                <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="link-draw inline-flex min-h-10 items-center text-paper/75 hover:text-paper">
                  Telegram — {TELEGRAM_HANDLE}
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`} className="link-draw inline-flex min-h-10 items-center text-paper/75 hover:text-paper">
                  {EMAIL}
                </a>
              </li>
              <li className="inline-flex min-h-10 items-center text-paper/50">Tashkent, Uzbekistan</li>
            </ul>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="relative select-none">
        <p className="text-center font-serif text-[clamp(5rem,24vw,22rem)] leading-[0.8] font-light tracking-[-0.05em] text-transparent italic [-webkit-text-stroke:1px_rgb(236_228_211/0.16)]">
          Expecto
        </p>
        <p className="mt-8 text-center font-serif text-[0.95rem] tracking-[0.08em] text-gold-2/80 italic md:mt-10">Per numerum, sedes.</p>
      </div>

      <div className="mx-auto flex max-w-[1320px] flex-col items-center justify-between gap-2 px-5 py-8 text-[0.78rem] text-paper/45 md:flex-row md:px-10">
        <p>The scholarship school.</p>
        <MotionSwitch />
        <p>© {new Date().getFullYear()} Expecto Academy</p>
      </div>
    </footer>
  );
}
