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
