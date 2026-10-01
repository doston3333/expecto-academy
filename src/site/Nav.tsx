import { NAV_LINKS, TELEGRAM_URL } from "@/lib/content";
import { cn } from "@/lib/cn";
import { useLenis } from "lenis/react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, type MouseEvent } from "react";
import { EASE, EASE_FILM, EnrollButton, house, HouseRibbon, TelegramMark } from "./ui/primitives";
import { INTRO_DELAY } from "./Intro";

const SECTION_IDS = NAV_LINKS.map((l) => l.href.slice(1));

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const lenis = useLenis();

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > 24);
      const probe = document.elementsFromPoint(window.innerWidth / 2, 40).find((el) => !el.closest("header"));
      setDark(Boolean(probe?.closest('[data-theme="dark"]')));
      const line = window.innerHeight * 0.4;
      let current: string | null = null;
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= line && r.bottom > line) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const go = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    const el = document.querySelector<HTMLElement>(href);
    if (!el) return;
    e.preventDefault();
    const offset = href === "#top" ? 0 : -72;
    const run = () => {
      if (lenis) lenis.scrollTo(el, { offset, duration: 1.6 });
      else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: "smooth" });
      history.replaceState(null, "", href);
    };
    if (open) {
      setOpen(false);
      window.setTimeout(run, 80);
    } else run();
  };

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5 md:pt-4"
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE, delay: INTRO_DELAY * 0.9 }}
      >
        <HouseRibbon className="absolute inset-x-0 top-0 h-[3px]" />
        <nav
          aria-label="Primary"
          className={cn(
            "mx-auto flex h-14 max-w-[1320px] items-center justify-between rounded-full pr-1.5 pl-4 transition-[background-color,box-shadow,color,backdrop-filter] duration-500 md:h-[3.75rem] md:pl-5",
            scrolled && !dark && "bg-paper/75 shadow-[0_1px_0_rgb(22_33_43/0.06),0_18px_40px_-24px_rgb(22_33_43/0.35)] backdrop-blur-xl",
            scrolled && dark && "bg-night-2/70 shadow-[0_1px_0_rgb(255_255_255/0.06)] backdrop-blur-xl",
            dark ? "text-paper" : "text-ink",
          )}
        >
          <a href="#top" onClick={(e) => go(e, "#top")} className="flex items-center gap-2.5" aria-label="Expecto Academy home">
            <img src="/logo.png" alt="" width={40} height={32} className="h-7 w-auto md:h-8" />
            <span className="font-serif text-[1.15rem] tracking-[-0.02em]">
              Expecto <span className="hidden italic opacity-60 min-[420px]:inline">Academy</span>
            </span>
          </a>
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => go(e, link.href)}
                  aria-current={active === link.href.slice(1) ? "location" : undefined}
                  className={cn(
                    "relative block rounded-full px-3.5 py-2 text-[0.86rem] transition-opacity duration-300 hover:opacity-100",
                    active === link.href.slice(1) ? "opacity-100" : "opacity-65",
                  )}
                >
                  {active === link.href.slice(1) ? (
                    <motion.span
                      layoutId="nav-active"
                      className={cn("absolute inset-0 rounded-full", dark ? "bg-paper/12" : "bg-ink/[0.07]")}
                      transition={{ duration: 0.5, ease: EASE }}
                    />
                  ) : null}
                  <span className="relative">{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-1.5">
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className={cn(
                "inline-flex h-11 items-center gap-2 rounded-full px-3.5 text-[0.84rem] font-semibold tracking-[-0.01em] transition-[background-color,box-shadow,color] duration-300 sm:h-12 sm:px-5 sm:text-[0.9rem]",
                dark
                  ? "bg-gold-2 text-ink shadow-[0_10px_28px_-10px_rgb(212_169_94/0.8)] hover:bg-gold-3"
                  : "bg-gryffindor text-paper shadow-[0_12px_28px_-10px_rgb(142_31_23/0.65)] hover:bg-gold",
              )}
            >
              <TelegramMark size={16} />
              <span className="sm:hidden">Enroll</span>
              <span className="hidden sm:inline">Enroll on Telegram</span>
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="grid size-11 place-items-center rounded-full lg:hidden"
            >
              <span className="flex w-5 flex-col gap-[5px]">
                <span className="h-px w-full bg-current" />
                <span className="h-px w-3/5 self-end bg-current" />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-ink px-6 pt-5 pb-10 text-paper"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.75, ease: EASE_FILM }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="flex items-center justify-between">
              <span className="font-serif text-lg">
                Expecto <span className="italic opacity-60">Academy</span>
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-11 place-items-center rounded-full border border-paper/20"
                aria-label="Close menu"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <path d="M1 1l12 12M13 1 1 13" stroke="currentColor" strokeWidth="1.3" />
                </svg>
              </button>
            </div>
            <ul className="mt-auto space-y-1">
              {NAV_LINKS.map((link, i) => (
                <li key={link.href} className="overflow-hidden">
                  <motion.a
                    href={link.href}
                    onClick={(e) => go(e, link.href)}
                    className="flex items-baseline gap-4 py-1 font-serif text-[2.6rem] leading-tight font-light tracking-[-0.03em]"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.25 + i * 0.05 }}
                  >
                    <span className="font-sans text-xs tracking-[0.2em] tnum" style={{ color: house(i).bright }}>0{i + 1}</span>
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
            <EnrollButton className="btn--paper mt-10 w-full min-h-14 text-[1.05rem]" />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
