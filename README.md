# Esteem Dental Clinic — All-on-X landing page

```
index.html   a chooser, so both versions can be opened side by side
v1/          the build before the brand guide — kept for reference only
v2/          the current build, on the brand guide   <- review this one
```

**v1** uses Geist, the earlier cream/brown palette, licensed stock photography
and a dark hero with white text over a photo.
**v2** is v1 rebuilt on the Esteem Brand Guide with the clinic's own imagery, a
light hero and a real-patients section. Everything described below is v2.

A single-page landing site for Esteem Dental Clinic's All-on-X full-arch implant
treatment. Layout and motion come from the Dentistry X Framer template; the
palette, typography, logo and imagery come from the client's Brand Guide and
their own photography.

## Brand

Taken from **Latest Brand Guide.pdf**.

| | |
|---|---|
| Grounds | `#f8f4eb` page · `#f3eeea` / `#eeebe6` alt sections · `#f8f4ee` / `#f5efe6` cards |
| Supplement | `#d4c1b1` · `#c2b19c` |
| Text & headings | `#865543` headings and actions · `#8b5640` CTA band · `#7e5f4c` body · `#977465` small labels · `#866042` |
| Headline face | **Prata** |
| Body face | **Inter** (Montserrat is the guide's alternate) |

`--line: #e6ddd2` is the one derived value — the guide has no hairline colour,
so it sits between `#eeebe6` and `#d4c1b1`.

### Tan Angleton

The guide lists **Tan Angleton** as a headline face alongside Prata. It is a
commercial TAN Type Foundry font, not on Google Fonts, and the copy in the PDF
is a subset embed that cannot be redistributed. Headlines therefore use **Prata**,
which the guide also lists for headlines. If the clinic holds a Tan Angleton web
licence, drop the webfont into `assets/fonts/`, add the `@font-face`, and change
the `h1,h2,h3,h4` and `.about-statement` / `.cta-statement` font stacks.

### Logo

Set as live text, not an image, to the guide's spec: `esteem` in lowercase Prata
with `.149em` tracking, a hairline rule beneath, then `DENTAL CLINIC` in Inter
caps at `.446em`, sized 40:11. It recolours for the cream header and the brown
mobile overlay without needing two files. The favicon is the brand `e` in
`#865543` on transparent.

### Language

The guide's DO/DON'T list is observed: no "specialist", "specialized", "expert",
"experienced", "focus" or "lead" anywhere in the copy.

## Imagery

Every photograph is the clinic's own, from `Images.zip`:

| file | used for |
|---|---|
| `hero.jpg` | hero panel — zirconia full-arch bridge |
| `prob-1/2/3.jpg` | the three problem cards: missing teeth, loose dentures, failing teeth |
| `allonx.mp4` | solution section, muted autoplay loop |
| `fan-fixture.webp`, `fan-sameday.jpg`, `fan-healing.jpg` | the fanned trio |
| `case-1.jpg`, `case-2.jpg` | **real patient before/after, treated at the clinic** |
| `step-1…5` | the five process cards: 3D scan, planned positions, placement, fixed teeth, final bridge |

Large PNGs were re-encoded to JPEG (8.5 MB → 2.0 MB).

## Sections

The running order and the copy follow the client's own concept page
(`Esteem_All_on_X_Landing_Page.html`); the design, components and motion are ours.

1. **Hero** — "Considering All-on-X? Know what matters."
2. **Suitability** — three numbered cards: missing teeth, loose dentures, failing teeth
3. **All-on-X explained** — a four-tab explainer (the complete picture / the implant /
   the replacement teeth / the meaning of "X") plus four benefit cards
4. **Real patients** — carousel of the clinic's consented before/after cases, with a counter
5. **Your journey** — five-stage tabs from 3D planning to the final teeth
6. **Questions** — eight Q&A, including an explicit answer on risks
7. **CTA band** — the clinic's address, both phone numbers, email and hours

Their concept used plain tab swaps; ours crossfade, reveal on scroll, and the
overview tab plays the clinic's own All-on-X animation.

## Deliberate differences from the template

- **The hero is light.** The template puts white text over a darkened photo. The
  brand is cream, and the client's clinical photography should not be tinted or
  darkened, so the headline sits beside the image instead of on top of it.
- **Tabs and a carousel instead of long stacks**, so the page stays short and
  nothing has to be scrolled through to reach the next section.
- Motion, breakpoints, spacing rhythm and component structure still follow the
  template.

## Motion

Reveal (`opacity` + `translateY(100px)`, 0.1s stagger ladder), scale-in icons,
hide-on-scroll nav, word-by-word text reveal, two card sliders (arrows, pointer
drag, proximity snap), full-screen mobile overlay with a hamburger that draws
into a smile, and Lenis smooth scrolling. `prefers-reduced-motion` is respected.

## Notes for whoever picks this up

- Preview from a copy outside `~/Desktop` (macOS blocks the server there) and use
  a threaded HTTP server, or CSS and JS fail silently on this image-heavy page.
- In an embedded preview pane, `requestAnimationFrame` is frozen, so anything
  using `behavior: 'smooth'` — including the slider arrows — looks broken when it
  is not. Test those with `behavior: 'auto'` or in a real browser.
- CTAs point at `esteemdentalclinic.com/find-us` pending a real booking URL.
