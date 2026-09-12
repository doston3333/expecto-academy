import { Logo } from "@/components/ui/Logo";
import { Stars } from "@/components/ui/Stars";
import { useMotionPreferenceControl } from "@/hooks/motionPreference";
import { EMAIL, NAV_LINKS, TELEGRAM_URL } from "@/lib/content";

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
      className="group inline-flex min-h-11 items-center gap-3 text-xs text-cream/50 transition-colors hover:text-cream/80"
    >
      Page animation
      <span
        aria-hidden="true"
        className={`relative h-[18px] w-8 rounded-full border transition-colors duration-300 ${
          enabled ? "border-sage/60 bg-forest" : "border-cream/25 bg-cream/10"
        }`}
      >
        <span
          className={`absolute top-1/2 size-3 -translate-y-1/2 rounded-full transition-[left,background-color] duration-300 ${
            enabled ? "left-[16px] bg-sage" : "left-[3px] bg-cream/50"
          }`}
        />
      </span>
    </button>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-hall text-cream" data-scene data-nav-dark>
      <Stars count={10} />
      <div
        className="relative h-[3px] bg-[linear-gradient(90deg,#8a6a28,#e8d08a,#c9a056,#e8d08a,#8a6a28)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-[1240px] gap-12 px-5 py-16 md:grid-cols-12 md:px-8" data-stagger>
        <div className="md:col-span-5">
          <p className="text-lg font-medium tracking-[-0.03em]">Expecto Academy</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/65">
            An English-language Digital SAT school for students across Uzbekistan. A higher score
            means lower tuition.
          </p>
        </div>
        <div className="md:col-span-3">
          <p className="text-[0.72rem] tracking-[0.14em] text-sage uppercase">Explore</p>
          <ul className="mt-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="inline-flex min-h-11 items-center text-sm text-cream/75 transition-transform duration-200 hover:translate-x-1 hover:text-cream"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-4">
          <p className="text-[0.72rem] tracking-[0.14em] text-sage uppercase">Contact</p>
          <ul className="mt-4 space-y-1 text-sm">
            <li>
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center text-cream/75 transition-transform duration-200 hover:translate-x-1 hover:text-cream"
              >
                Telegram — @expectoacademy
              </a>
            </li>
            <li>
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex min-h-11 items-center text-cream/75 transition-transform duration-200 hover:translate-x-1 hover:text-cream"
              >
                {EMAIL}
              </a>
            </li>
            <li className="text-cream/55">Tashkent, Uzbekistan</li>
          </ul>
        </div>
      </div>
      <div className="relative mx-auto max-w-[1240px] px-5 md:px-8" data-reveal>
        <div className="flex justify-center pb-6">
          <Logo className="h-16 sm:h-20" />
        </div>
        <p
          aria-hidden="true"
          className="font-display text-center text-[clamp(4rem,16vw,12rem)] leading-none italic text-cream/8 select-none"
        >
          Expecto
        </p>
        <p className="font-display mt-3 text-center text-sm tracking-[0.08em] text-sage/80 italic">
          Per numerum, sedes.
        </p>
      </div>
      <div className="relative mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-5 py-6 md:px-8">
        <p className="text-xs text-cream/50">The scholarship school.</p>
        <MotionSwitch />
        <p className="text-xs text-cream/50">© {new Date().getFullYear()} Expecto Academy</p>
      </div>
    </footer>
  );
}
