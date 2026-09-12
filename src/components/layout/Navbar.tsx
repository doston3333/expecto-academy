import { Logo } from "@/components/ui/Logo";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useDesktopNav } from "@/hooks/useMedia";
import { useOverDark } from "@/hooks/useOverDark";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { EMAIL, NAV_LINKS, TELEGRAM_URL } from "@/lib/content";
import { cn } from "@/lib/cn";
import { easeSpace, smoothScrollToY } from "@/lib/motion";
import { useLenis } from "lenis/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";

/** Keeps anchored sections clear of the fixed bar — mirrors `scroll-padding-top`. */
const NAV_OFFSET = 88;

const DRAWER_NUMERALS = ["I", "II", "III", "IV", "V"] as const;

function useScrolled(): boolean {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return scrolled;
}

/** Scroll-spy over the anchored sections — same grammar as the chapter rail. */
function useActiveLink(): number {
  const [active, setActive] = useState(-1);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + window.innerHeight * 0.35;
      let idx = -1;
      for (let i = 0; i < NAV_LINKS.length; i += 1) {
        const el = document.querySelector(NAV_LINKS[i].href);
        if (el && el.getBoundingClientRect().top + window.scrollY <= y) idx = i;
      }
      setActive(idx);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // Layout shifts (e.g. the animation switch) move every anchor — recompute.
    const observer = "ResizeObserver" in window ? new ResizeObserver(onScroll) : undefined;
    observer?.observe(document.body);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      observer?.disconnect();
    };
  }, []);
  return active;
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled();
  const active = useActiveLink();
  const dark = useOverDark();
  const desktop = useDesktopNav();
  const reduced = usePrefersReducedMotion();
  const lenis = useLenis();
  const panelRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Growing into the desktop bar dismisses the drawer.
  if (desktop && open) setOpen(false);

  // Lock the page while the drawer is open; pause Lenis so it can't fight the lock.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      lenis?.stop();
      closeRef.current?.focus();
    } else {
      lenis?.start();
    }
    return () => {
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [open, lenis]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /** Quick eased jump to a section — Lenis on fine pointers, rAF tween elsewhere. */
  const goTo = (href: string) => {
    const el = document.querySelector<HTMLElement>(href);
    if (!el) return;
    history.replaceState(null, "", href);
    const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET);
    if (reduced) {
      window.scrollTo(0, top);
    } else if (lenis) {
      lenis.scrollTo(top, {
        duration: Math.min(1.05, 0.55 + Math.abs(top - window.scrollY) * 0.00003),
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
      });
    } else {
      smoothScrollToY(top);
    }
  };

  const onNavClick = (event: ReactMouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    if (!open) {
      goTo(href);
      return;
    }
    // Closing the drawer first lets the page start moving as the panel exits.
    setOpen(false);
    document.body.style.overflow = "";
    lenis?.start();
    window.setTimeout(() => goTo(href), 160);
  };

  const closeDrawer = (restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) menuRef.current?.focus();
  };

  /** Keep Tab cycling inside the open drawer. */
  const trapTab = (event: React.KeyboardEvent) => {
    if (event.key !== "Tab" || !panelRef.current) return;
    const items = panelRef.current.querySelectorAll<HTMLElement>(
      "a[href], button:not([disabled])",
    );
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      last.focus();
      event.preventDefault();
    } else if (!event.shiftKey && document.activeElement === last) {
      first.focus();
      event.preventDefault();
    }
  };

  const drawerItem: Variants = {
    open: { opacity: 1, x: 0, transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] } },
    closed: {
      opacity: 0,
      x: reduced ? 0 : 28,
      transition: { duration: reduced ? 0 : 0.18, ease: [0.5, 0, 0.75, 0] },
    },
  };

  return (
    <>
      <div
        className={cn(
          "site-nav-backdrop",
          scrolled && "site-nav-backdrop--compact",
          dark && "site-nav-backdrop--dark",
        )}
        aria-hidden="true"
      />
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)]",
          dark && "site-nav--dark",
        )}
      >
        <div
          className={cn(
            "relative z-[60] mx-auto flex w-full max-w-[1240px] items-center justify-between px-5 transition-[height] duration-500 ease-[cubic-bezier(0.22,0.68,0.35,1)] md:px-8",
            scrolled ? "h-16" : "h-[4.5rem]",
          )}
        >
          <a
            href="#top"
            aria-label="Expecto Academy home"
            className="group relative z-10 flex min-h-11 items-center gap-2.5"
            onClick={(event) => onNavClick(event, "#top")}
          >
            <Logo className="h-10 transition-transform duration-500 ease-out group-hover:scale-105 sm:h-11" />
            <span
              className={cn(
                "text-[0.95rem] font-medium tracking-[-0.02em] transition-colors duration-500",
                dark ? "text-cream" : "text-forest-deep",
              )}
            >
              Expecto
            </span>
          </a>

          <nav
            aria-label="Primary"
            className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 lg:flex"
          >
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={i === active ? "true" : undefined}
                onClick={(event) => onNavClick(event, link.href)}
                className={cn(
                  "relative inline-flex min-h-11 items-center rounded-full px-4 text-[0.84rem] font-medium tracking-[0.01em] transition-colors duration-300",
                  dark
                    ? i === active
                      ? "text-cream"
                      : "text-cream/60 hover:text-cream"
                    : i === active
                      ? "text-forest-deep"
                      : "text-forest/55 hover:text-forest-deep",
                )}
              >
                {i === active ? (
                  reduced ? (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-0 rounded-full border",
                        dark ? "border-cream/15 bg-cream/10" : "border-forest/10 bg-forest/[0.07]",
                      )}
                    />
                  ) : (
                    <motion.span
                      aria-hidden="true"
                      layoutId="nav-active-pill"
                      className={cn(
                        "absolute inset-0 rounded-full border",
                        dark ? "border-cream/15 bg-cream/10" : "border-forest/10 bg-forest/[0.07]",
                      )}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )
                ) : null}
                <span className="relative">{link.label}</span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              ref={menuRef}
              type="button"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-forest/10 bg-cream px-4 text-sm font-medium text-forest-deep transition-colors duration-200 hover:border-forest/25 lg:hidden"
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
              Menu
            </button>
            <MagneticButton
              href={TELEGRAM_URL}
              external
              className="min-w-0 px-3.5 max-[360px]:hidden sm:px-4"
            >
              Get Sorted
            </MagneticButton>
          </div>
        </div>
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 h-px transition-[opacity,background-color] duration-500",
            dark ? "bg-cream/15" : "bg-forest/10",
            scrolled ? "opacity-100" : "opacity-0",
          )}
        />

        <AnimatePresence>
          {open ? (
            <motion.div
              className="fixed inset-0 z-[60]"
              initial="closed"
              animate="open"
              exit="closed"
            >
              <motion.button
                type="button"
                className="absolute inset-0 bg-forest-deep/35"
                aria-label="Close menu"
                tabIndex={-1}
                onClick={() => closeDrawer()}
                variants={{ open: { opacity: 1 }, closed: { opacity: 0 } }}
                transition={{ duration: reduced ? 0 : 0.3 }}
              />
              <motion.aside
                ref={panelRef}
                id="site-menu"
                role="dialog"
                aria-modal="true"
                aria-label="Site menu"
                onKeyDown={trapTab}
                variants={{
                  open: {
                    x: "0%",
                    transition: {
                      duration: reduced ? 0 : 0.5,
                      ease: easeSpace,
                      staggerChildren: 0.05,
                      delayChildren: reduced ? 0 : 0.14,
                    },
                  },
                  closed: {
                    x: "110%",
                    transition: {
                      duration: reduced ? 0 : 0.34,
                      ease: [0.55, 0.06, 0.35, 0.95],
                      staggerChildren: 0.025,
                      staggerDirection: -1,
                    },
                  },
                }}
                className="absolute inset-y-0 right-0 flex w-[min(21rem,88vw)] flex-col border-l border-forest/10 bg-cream pt-[env(safe-area-inset-top)] shadow-[-30px_0_60px_-20px_rgb(28_74_54/0.25)]"
              >
                <motion.div
                  variants={drawerItem}
                  className="flex h-[4.5rem] shrink-0 items-center justify-between border-b border-forest/10 px-6"
                >
                  <span className="font-display text-[1.15rem] text-forest-deep italic">
                    Contents
                  </span>
                  <button
                    ref={closeRef}
                    type="button"
                    aria-label="Close menu"
                    onClick={() => closeDrawer()}
                    className="flex size-11 items-center justify-center rounded-full border border-forest/10 text-forest-deep transition-colors duration-200 hover:bg-forest/5"
                  >
                    <X className="size-5" />
                  </button>
                </motion.div>

                <nav aria-label="Sections" className="flex-1 overflow-y-auto px-6">
                  <ul className="flex flex-col">
                    {NAV_LINKS.map((link, i) => (
                      <motion.li key={link.href} variants={drawerItem}>
                        <a
                          href={link.href}
                          aria-current={i === active ? "true" : undefined}
                          onClick={(event) => onNavClick(event, link.href)}
                          className="group flex min-h-14 items-center gap-4 border-b border-forest/10"
                        >
                          <span
                            aria-hidden="true"
                            className="font-display w-6 shrink-0 text-sm text-forest/35 italic"
                          >
                            {DRAWER_NUMERALS[i]}
                          </span>
                          <span className="font-display text-[1.65rem] leading-tight tracking-[-0.01em] text-forest-deep transition-transform duration-300 ease-out group-hover:translate-x-1">
                            {link.label}
                          </span>
                          <span className="ml-auto flex items-center gap-2">
                            {i === active ? (
                              <span
                                aria-hidden="true"
                                className="size-1.5 rounded-full bg-amberfell"
                              />
                            ) : null}
                            <ArrowUpRight
                              aria-hidden="true"
                              className="size-4 text-forest/25 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-forest"
                            />
                          </span>
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                </nav>

                <motion.div
                  variants={drawerItem}
                  className="shrink-0 border-t border-forest/10 px-6 pt-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
                >
                  <MagneticButton
                    href={TELEGRAM_URL}
                    external
                    className="w-full min-w-0"
                    onClick={() => setOpen(false)}
                  >
                    Get Sorted
                  </MagneticButton>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="mt-3.5 flex min-h-11 items-center justify-center text-[0.8rem] font-medium tracking-[0.02em] text-forest/55 transition-colors duration-200 hover:text-forest"
                  >
                    or write — {EMAIL}
                  </a>
                </motion.div>
              </motion.aside>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>
    </>
  );
}
