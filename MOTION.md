# Internal memo — what Space does, and what we copy (delete anytime)

Source: https://spacefs.com, desktop scroll-through (forward and back), plus phone-width pass.

## The one persistent stage
A single macOS-style window (traffic lights, title bar, sidebar) that **never unmounts**.
It is the camera. The whole product story is told by cutting the *inside* of that window
while the chrome stays put: Finder folder → video editor timeline → Spotlight palette →
Finder again ("infinite space available"). Same rectangle, different world.

## How scroll = playhead
- Sections are `height: 400–800svh`; the stage inside is `position: sticky; top: 0; min-height: 100svh`.
- `scrollYProgress` of the tall section drives *everything*: window scale/rotate/y, scene cuts
  (clip/mask wipes, not fades), copy swaps, progress hairlines.
- Scrolling backwards rewinds the film. Nothing is "on enter, once". No `whileInView` as a system.
- Hero already contains the first frame: the window peeks from below the fold and the next
  act grows out of that peek, so the page feels like one continuous shot, not sections.

## How type enters
Line masks: `overflow: hidden` wrappers, `y: 110% → 0`. Keyed to the film beat — copy wipes
when the window cuts. Headlines never fade in because a card scrolled into view.

## Density inside the window
Real software: a real sidebar (Favorites / Locations), a real file list (15 items, real file
sizes, breadcrumb `Space › 2026 › 06 › 14_nyc-soho`, status bar). The editor scene has clip
lists, timecode, zoom ruler. **Not four padded cards.** The window must look like something
a person could sit in.

## What they do NOT do
- No `whileInView` card farms, no spring-pop grids.
- No particles, no 3D globes, no glassmorphism, no glow.
- No giant count-up stats as the hero.
- Nav is tiny: wordmark left, pill "Menu" + pill primary CTA right; menu is a small floating panel.
- FAQ is a type list/accordion, closer is giant type with one small pill under it.
- Lenis is only camera fluid (lerp ~0.05–0.08); it is not the show.

## Translation to Expecto
- Persistent stage = **Bluebook window + scholarship report** (Expecto's "Finder").
- Act 1 film beats inside one window: diagnostic exam → the trap (mark scheme) → error log /
  spellwork → gauntlet → 1480 report → university scholarship rows → Telegram sort message.
- Hero right side = fanned document plates (score reports on paper), not metric tiles.
- Cream/forest prospectus palette; Space's grammar, not their skin.
- Reduced motion: no Lenis, no sticky traps; show the final honest frame (the report).

---

## Implemented: the cinema chapter layer (current state)

On top of the per-section `useScroll` scenes, the page now has one global
scroll driver — `src/hooks/usePageCinema.ts`. One rAF loop smooths
`window.scrollY` (exp-decay ~75ms), reads layout once per frame, and writes
CSS custom properties. Scenery is pure CSS keyed to those vars — no React
re-render per frame, everything reversible.

**Vars written per element**

- `[data-chapter]` (the six inter-section transitions): `--xc-chapter` plus
  per-scene vars (`--xc-iris*`, `--xc-curtain`, `--xc-panorama`, `--xc-release`,
  `--xc-words-*`, `--xc-clock-*`, `--xc-horizon`, `--xc-panel-0..6`,
  `--xc-scene-title`, …) computed in `paintChapter`.
- `[data-scene]` (every major section): `--xc-enter` (0→1 entrance),
  `--xc-travel` (-1→1 while crossing the viewport) and
  `data-scene-visible` — offscreen scenery pauses its CSS animations.
- `[data-reveal]` / `[data-stagger]` children: monotonic `--xc-reveal`
  (never un-reveals), staggered by `--i`. Focus inside a hidden element
  forces it visible.

Inside the film, each beat's wipe carries a house-colored glow along its
slanted clip edge (`drop-shadow` on a wrapper around the clipped scene).

**Chapter scenes** (`src/components/cinema/`): `FilmOverture` (page
condenses into the seal card → Chapter I title), `CurtainChapter` (split
sentence panels part — vertical seam on phones), `DeskClearing`
(panorama opens, task papers scatter off), `WordsChapter` (three giant
lines converge into the owl-post card), `HorizonChapter` (week dial
recedes, cream dome rises over the tint), `CanopyChapter` (seven
house-edged panels lift to reveal the lit hall — hands off to Closer,
same `--color-hall`).

**Adaptive chrome**: `useOverDark` flips the navbar + chapter rail to cream
ink whenever a `[data-nav-dark]` region (the lit hall, the footer) sits
under the bar. The canopy's `data-peek` flag gates its dark surface so the
flip lands only once the panels actually expose the hall; a MutationObserver
on that flag keeps the theme in step with the rAF paint.

**Kill switch**: `MotionPreferenceProvider` + `usePrefersReducedMotion`
merge OS preference with the footer "Page animation" switch. When off,
`data-cinema="off"` hides `.xc-art` entirely, settles all copy, drops the
runway spacers, pauses every decorative animation, and Lenis never mounts —
the page is an honest document.

**File map**: `src/cinema.css` is imported once from `index.css`; every
`.xc-*` rule lives there. Chapter markup is `data-chapter` + `.xc-chapter-stage`
+ `.xc-art` (scenery, aria-hidden) + `.xc-scene-copy` (the real heading).
