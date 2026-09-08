import { Logo } from "@/components/ui/Logo";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { NAV_LINKS, TELEGRAM_URL } from "@/lib/content";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div className="site-nav-backdrop" aria-hidden="true" />
      <header className="fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)]">
        <div className="relative z-[60] mx-auto flex h-[4.5rem] w-full max-w-[1240px] items-center justify-between px-5 md:px-8">
          <a
            href="#top"
            aria-label="Expecto Academy home"
            className="group relative z-10 flex min-h-11 items-center gap-2.5"
          >
            <Logo className="h-10 transition-transform duration-500 ease-out group-hover:scale-105 sm:h-11" />
            <span className="text-[0.95rem] font-medium tracking-[-0.02em] text-forest-deep">
              Expecto
            </span>
          </a>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-forest/10 bg-cream px-4 text-sm font-medium text-forest-deep sm:bg-cream/80 sm:backdrop-blur-md"
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

        <AnimatePresence>
          {open ? (
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <button
                type="button"
                className="absolute inset-0 bg-forest/20"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              />
              <motion.nav
                id="site-menu"
                aria-label="Primary"
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.32, ease: [0.22, 0.68, 0.35, 1] }}
                className="absolute top-[calc(5rem+env(safe-area-inset-top))] right-5 left-5 mx-auto max-w-sm rounded-[24px] border border-forest/10 bg-cream p-6 window-lift md:right-8 md:left-auto md:w-[22rem]"
              >
                <div className="flex flex-col">
                  {NAV_LINKS.map((link, i) => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 + i * 0.05, duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                      className="flex min-h-11 items-center text-[1.05rem] tracking-[-0.02em] text-forest-deep transition-transform duration-200 hover:translate-x-1 hover:text-forest"
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </motion.a>
                  ))}
                  <MagneticButton
                    href={TELEGRAM_URL}
                    external
                    className="mt-4 w-full min-w-0"
                    onClick={() => setOpen(false)}
                  >
                    Get Sorted
                  </MagneticButton>
                </div>
              </motion.nav>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>
    </>
  );
}
