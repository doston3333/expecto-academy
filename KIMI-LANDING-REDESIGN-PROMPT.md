# Expecto Academy — full landing redesign (Kimi)

You are a principal product designer **and** a principal frontend engineer. You ship one cinematic marketing site, not a component kit with motion sprinkled on.

Your job: **throw away the current landing’s layout and motion architecture and rebuild the entire page** so that scrolling it feels like [spacefs.com](https://spacefs.com) — same *directing*, not the same skin.

Do this in the existing app at `expecto-academy/` (Vite + React 19 + TypeScript + Tailwind v4 + `motion` + Lenis). Treat current React sections as a **failed draft**. Keep the product facts and copy. Delete the SaaS skeleton.

---

## 0. First hour (non-negotiable)

1. Open **https://spacefs.com** on a large desktop. Scroll it slowly, twice, top to bottom. Then scroll it backwards. Note every sticky beat.
2. Open it on a phone-width viewport. Note what they *kill* vs *keep*.
3. Write a short internal memo (in a comment at the top of `App.tsx` or a `MOTION.md` you can delete later) answering:
   - What is the **one persistent stage** on Space? (the Finder/window chrome)
   - How does **scroll = playhead**? (sticky 400–800vh, `scrollYProgress` drives scene, scale, content)
   - How does type enter? (line masks, not opacity fades)
   - How dense is the product UI inside the window? (real files, real sizes, real sidebar — not four padded cards)
   - What do they **not** do? (no `whileInView` card farms, no spring-pop grids, no particles, no 3D globes, no count-up hero stats as the hero)
4. Only then touch Expecto.

If you skip this and “add more animations” to the current page, you have already failed.

---

## 1. What Space actually is (copy this grammar, not their brand)

**Steal**

- **One product window that never leaves the camera.** macOS-style chrome (traffic lights, title, sidebar) stays mounted. The *inside* of the window is the film. Scenes cut inside shared chrome.
- **Sticky scroll theater.** A section is `height: 400svh–800svh` (or two acts). Inner stage is `position: sticky; top: 0; min-height: 100svh`. `scrollYProgress` on that section is the director.
- **Hero already aims the camera.** Giant two-tone sans headline. Short body. One pill CTA. On the right: a **physical stack of overlapping plates** (rotated, layered, photographic or document-like — not metric tiles). A **slice of the product window peeks from below the fold** so the next act is already in frame.
- **Scene-locked copy.** Left column kicker / title / body are keyed to the current film beat. They wipe when the window cuts. They do not fade because a card entered the viewport.
- **Numbered method as typography, not a card grid.** Huge `01 / 02 / 03`, lots of air, one idea each.
- **Second theater or four how-it-works beats** still using the same window language (Space: Finder → editor/timeline → search palette → Finder with “infinite space”).
- **Closer is giant type**, 80–200px, the section *is* the headline. CTA is small under it.
- **FAQ is a type list.** No cards.
- **Nav is tiny.** Wordmark left. Pill “Menu” + pill primary CTA right. Menu is a small floating panel, not a marketing overlay.
- **Lenis** is the camera fluid. It is not the show.
- **Reduced motion:** skip the film, show the last honest frame (the report / the outcome). No half-playing stickies.

**Do not steal**

- Their black / white / gray palette
- Their “Space” wordmark, Finder replica as a filesystem product, “Book a call”
- Literal Apple marketing copy energy if it fights Expecto’s voice
- Glow, glassmorphism, starfields, particles, mesh gradients, aurora

**The test:** mute the page and scroll. You should still understand the product because the **window is acting**. If you only see headings sliding up, you built a template.

---

## 2. Why the current Expecto page failed (do not restore this)

The current site copied Space’s **cosmetics** (pills, 24px radius, 01–03 columns, a sticky SAT window) and kept a **Webflow SaaS outline**.

Guilty patterns — delete them:

- `whileInView` + `fadeUp` / `popUp` / spring scale on every section
- Hero = headline + four **flat house-color score cards**
- “Product theater” that **unmounts three sparse mocks** (4 cells / 4 MCQ rows / a 1480) with clip-path. Chrome is a decoration. Density is a landing-page mock, not a product.
- Houses as a **tab grid of colored buttons** + a detail card
- Testimonials as a **quote carousel**
- Pricing as **three pop-in cards**
- Final CTA as **sticky scale of two words** (Apple-meme, not a directed ending)
- Lenis lerp tweaks as a substitute for directing

Motion that is “on enter, once” is **not** cinematic scroll. Cinematic scroll is **scrubbed**. The user holds the playhead.

---

## 3. Product (immutable)

**Expecto Academy** — English-language Digital SAT school for Uzbekistan students who need **scholarship-ready scores**, not a vibe.

- CTA (every primary button): `https://t.me/expectoacademy`
- Email: `hello@expecto.academy`
- Next cohort: **8 September 2026** (countdown is real)
- Location: Tashkent time for live classes; students can be anywhere in Uzbekistan
- Exam: **Digital SAT / Bluebook only** (adaptive two-module). No paper SAT.
- Proof (use, don’t hero-spam): 1,200+ students sorted · **+210** average gain · 340+ scholarships · four houses
- Universities that matter: AKFA, Webster Tashkent, NewUU, INHA, Turin Polytechnic, Amity, TEAM, BMU, CAU, WIUT
- Score pact: Scholar + Headmaster’s Circle — miss the agreed gain after doing the work → **four extra weeks free** (not a cash refund)

**Houses** (HP *atmosphere*, original names — never Hogwarts, Gryffindor, Harry, Hogwarts houses, “sorting hat” as a Warner property):

| House     | Animal  | Track           | Weeks | Color   | Metal  | For                         |
|-----------|---------|-----------------|-------|---------|--------|-----------------------------|
| Aurelion  | Phoenix | Fast-Track      | 8     | `#7a1f1f` | gold   | deadline, this cycle        |
| Veridian  | Serpent | Math Intensive  | 10    | `#1b5c3e` | silver | Math wall, <700             |
| Noctis    | Raven   | Verbal Intensive| 10    | `#2c3d6b` | bronze | English L2, passages        |
| Amberfell | Badger  | Deep Mastery    | 16    | `#c9a227` | black  | rebuild from <1100          |

Amberfell plate sits on gold; copy ink `#7a6414`. Other houses reverse type to cream.

**Plans (UZS, dollar hint):**

- Apprentice — 2,900,000 UZS ≈ $230 — self-paced
- Scholar — 5,900,000 UZS ≈ $465 — **featured**, live house + mentor + pact
- Headmaster’s Circle — 9,900,000 UZS ≈ $780 — 1-on-1 + applications

**Voice:** calm, specific, a little severe. Boarding-school prospectus, not a startup. No “unlock your potential.” No exclamation points. English only.

Existing copy in `src/lib/content.ts` and `src/lib/houses.ts` is allowed. Tighten if a line is flabby. Do not invent fake stats or named students beyond the first-initial testimonials already in content.

---

## 4. Visual system (locked)

Light by default. Cream paper, forest ink.

```
cream        #f3eee3
cream-2      #e8e0d0
cream-3      #d9d0bc
forest       #143d2e
forest-deep  #0c241c
moss         #3d5c4c
sage         #c5d4c2
muted        #4a5c52
```

- **UI / headlines:** Instrument Sans (already installed)
- **House names only:** Cormorant Garamond italic
- Radius: pills `9999px`; frames `20–28px` (Space-like)
- Depth: one soft window shadow. **No** glow, **no** stacked shadows, **no** hardcoded hex in className — CSS variables
- WCAG AA, 44px targets, visible focus, skip link
- Mobile-first. The film must still work on a phone: shorter stickies, less chrome, never horizontal overflow

Two-tone hero like Space’s “Infinite space / on your computer”:

- Line 1: forest-deep, medium — `Master the SAT.`
- Line 2: moss, regular — `Earn the seat.`

You may recut those two lines only if you beat them. Default: keep.

---

## 5. The film you must direct (this is the redesign)

Expecto’s Finder is not Finder. It is **Bluebook + the scholarship report**. One persistent `SatWindow` (or a small family of chromes that **share a layout id / never visually unmount**).

### Act 0 — Nav + Hero (~100svh)

- Space nav language.
- Left: type. Right: overlapping **document plates** (score reports / Bluebook stills / house-colored pages that look like paper, with real typography: 1480 AKFA, 1520 NewUU, 1410 Webster, 1360 INHA). They fan with rotate. They can have **tiny scroll parallax** (x/rotate tied to hero progress). They are not four equal metric widgets.
- Bottom: SAT window **chrome peek** (title bar only or title + 40px of UI) that the next act will **grow into**. Hero scroll should dock that peek into the sticky stage (shared element / continuous y). This is how Space feels inevitable.

### Act 1 — The exam (sticky, ~500–700svh)

Scroll progress `0 → 1` is a playhead. Example beats (you may recut, you may not reduce to 3 sparse swaps):

1. **Diagnostic Bluebook** — dense. Timer, module 1 of 2, question number, passage or stem, four choices, selected state, annotate/strike UI, house-prediction chip. It must look like software a student could sit in, not a Dribbble card.
2. **The trap** — same question, mark scheme / why B is almost right. Highlight, not a new empty layout.
3. **Homework / error log** — list of missed types, house color accent, “spellwork tonight.”
4. **Gauntlet** — three exam row, under test-day rules.

Copy left (or above on mobile) is keyed to the beat. Giant faint scene index (`01`) can live behind type like Space’s quiet numbering.

**Camera on the window (scrubbed, not sprung):** scale 0.9→1, slight `rotateX`, y from the hero peek, maybe a 1px progress hairline on the chrome. `perspective` on the stage.

**Cuts inside the window:** clip / mask / shared-element. The traffic lights do not blink out.

### Act 2 — The letter (sticky, ~350–500svh) *or* continue Act 1

The window **becomes the artifact they actually want**:

- 1480, +300 from diagnostic, 98th percentile
- Then rows become **universities with scholarship bands** (AKFA full tuition, Webster presidential, NewUU 100% merit, INHA merit)
- Optional last beat: a **Telegram message** (“Sorted: Aurelion · class 8 Sep”) — still inside a device/window language, not a floating emoji

This is Space’s “Finder → NLE → Spotlight → Finder infinite” trick: **same rectangle, different world.**

### Act 3 — Method (not a card farm)

Space’s 01–03 columns: live house classes, 10+ mocks, named mentor. Typography and air. If you need more (adaptive homework, Bluebook UI, score pact), make them **supporting lines**, not six equal cards.

### Act 4 — Houses (must feel like sorting, not settings)

Do **not** ship four buttons + a detail panel as the main idea.

Better: a sticky or horizontal-pin sequence where each house is a **full plate** (color field, track, weeks, one sentence, outcome). Selecting/scrolling is the sort. Detail can still exist, but the first read is cinematic. House accents only here and on plates — never as a rainbow UI kit.

### Act 5 — Letters home

One strong story at a time. Quote is **masked type**, score `1180 → 1480` is a **scrub or a committed cut**, school + award as metadata. Not a Bootstrap carousel.

### Act 6 — Tuition

Three plans. Scholar is the only loud one (forest fill). This can be more conventional. Still: no pop-stagger-on-view as the personality.

### Act 7 — FAQ + closer + footer

FAQ: Space’s quiet accordion.

Closer: giant **Get Sorted / Earn the seat** (or one better line). Scroll can scale/mask it, but it must sit in a **designed ending**, not a leftover `h-[170svh]` gimmick. One pill: Enroll on Telegram. Real countdown to 8 Sep 2026.

Footer: product / contact / houses. Small.

---

## 6. Motion law

**Allowed**

- `useScroll` + `useTransform` / `useMotionTemplate` (Motion One / `motion/react`)
- Lenis on `html` (`lerp` ~0.05–0.08, duration ~1.2–1.4)
- Line masks (`overflow: hidden` + `y: 110% → 0`) on headlines, often **also** tied to progress
- Clip-path / mask wipes **keyed to scene index**
- Shared layout / persistent chrome
- Button magnetism (already in `MagneticButton.tsx`)
- `prefers-reduced-motion: reduce` → no Lenis, no stickies that trap, final frames only

**Forbidden**

- `whileInView` as the primary system
- Spring pop on every card (`scale: 0.9, y: 72`)
- Three.js, R3F, Drei, canvases, splines, Unicorn Studio
- Ken Burns on stock photos, atlas stills, lifestyle photography as the product
- Particles, sparkles, snitches, torus knots, cursor blobs, confetti
- Navy/gold “AI slop”, glass glow, starfields, numbered 01–06 *feature card grids*
- Hero `+210` as a giant stat
- `any` in TypeScript
- Hardcoded hex in Tailwind classes (`text-[#09321f]`)
- Tokens in `localStorage`
- Editing anything outside `expecto-academy/`
- Copying Space’s Finder contents (their BRAW filenames, “14_nyc-soho”, etc.)

Easing: cinematic (`cubic-bezier(0.76, 0, 0.24, 1)` or Space-like `0.22, 0.68, 0.35, 1`) for **scroll-tied** motion. Springs only for **controls** (buttons, menu).

---

## 7. Engineering

- TypeScript strict, no `any`
- Keep `@/` alias, Tailwind v4 `@theme` tokens in `src/index.css`
- `npx tsc -b` must pass
- Vite already listens on IPv4 + IPv6 (`host: "::"`, port 5173). Do not break preview.
- Structure by acts if that’s cleaner (`src/components/film/ActExam.tsx`) — don’t preserve `Features.tsx` out of piety
- Content stays centralized in `src/lib/content.ts` / `houses.ts`
- No new heavy dependencies unless you can explain why `motion` + Lenis cannot do it. **GSAP ScrollTrigger is allowed** if you need a real timeline and you keep bundle honest. Do not add Three.js.

---

## 8. Definition of done

Mute the speakers. Scroll once on a 1440px desktop.

You pass only if:

1. There is a **persistent product window** whose interior tells the SAT → scholarship story.
2. **Scroll scrubs** that story (sticky acts, progress-linked cuts). Scrubbing backwards rewinds.
3. The hero **docks into** that window instead of ending, then a new section starting.
4. Headlines **unmask**; they do not fade.
5. A stranger can explain Expecto after the film and **before** reading pricing.
6. Cream/forest still looks like a prospectus, not a clone of spacefs.com’s black site.
7. Phone: no broken stickies, no horizontal scroll, CTA still Telegram.
8. Reduced motion is a static, complete page.
9. `npx tsc -b` is clean.

If you catch yourself writing `variants={fadeUp}` on a pricing card, stop. You are rebuilding the failure.
