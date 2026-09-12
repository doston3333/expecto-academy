import { Logo } from "@/components/ui/Logo";
import { Stars } from "@/components/ui/Stars";
import { EMAIL, NAV_LINKS, TELEGRAM_URL } from "@/lib/content";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-hall text-cream">
      <Stars count={10} />
      <div
        className="relative h-[3px] bg-[linear-gradient(90deg,#8a6a28,#e8d08a,#c9a056,#e8d08a,#8a6a28)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-[1240px] gap-12 px-5 py-16 md:grid-cols-12 md:px-8">
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
      <div className="relative mx-auto max-w-[1240px] px-5 md:px-8">
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
      <div className="relative mx-auto flex max-w-[1240px] items-center justify-between px-5 py-6 md:px-8">
        <p className="text-xs text-cream/50">The scholarship school.</p>
        <p className="text-xs text-cream/50">© {new Date().getFullYear()} Expecto Academy</p>
      </div>
    </footer>
  );
}
