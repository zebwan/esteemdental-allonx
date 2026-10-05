# Esteem Dental — All-on-X landing page

A 1:1 structural rebuild of the **Dentistry X** Framer template
(`https://dentistry-x.framer.website/`), with only the palette and the content changed.
Template teardown lives in `~/Desktop/Dentistry X Teardown/`.

## Section order (conversion sequence)

1. **Hero** — full-bleed image, 3 gradient layers, 28px rounded bottom, pill tabs, glass stat card
2. **The problem** — card slider, 3 wide cards
3. **The solution** — statement with word-by-word reveal, then a 3-up row
   (info card with tags + CTA · captioned image · fanned photos), then a 4-stat strip
4. **Our process** — card slider, 5 step cards (The Esteem Difference)
5. **Proof** — numbered accordion + image with glass card
6. **Technology** — 2×2 tinted icon cards + heading (Dynamic Navigation)
7. **Journey** — big numbered rows, 01–07
8. **FAQ** — 9-question accordion
9. **CTA** — 3 image cards + centred statement + button
10. **Footer** — dark, 28px rounded top

## Template fidelity

Values taken from the live template, not estimated:

| | Template | Here |
|---|---|---|
| Breakpoints | 1200 / 810 | same |
| h1 / h2 / body | 80·64·38 / 48·40·29 / 16 | same |
| Letter-spacing | −0.02em | same |
| Container | 1180 (content 1140) | same |
| Section padding | 100px → 60px under 1200 | same |
| **Nav height** | **80 / 76 / 72** | same |
| **Hero height** | **900 / 834 / 755** | same |
| **Hero bottom radius** | **0 0 28px 28px** | same |
| **Pill tabs + nav CTA** | **hidden on phone** | same |
| Hero container padding | 186/20/80 · 140/20/60 · 250/20/40 | same |
| Service card | 392×560, radius 12, pad 28/24/30 | same |
| Case card | 610 wide | same |
| Track gap | 20px | same |
| Buttons | h48, radius 30, icon circle left | same |
| Footer | radius 28px 28px 0 0 | same |

On phone the header is logo + hamburger only, exactly as the template's "Phone Close"
variant — no pill tabs, no Book Now button.

## Motion

- reveal `opacity 0→1` + `translateY(100px)→0`, 0.1s stagger ladder
- `scale(0)→1` pop on icons
- nav fixed, hides on scroll down (`translateY(-100px)`), cream + `blur(12px)` once scrolled
- Lenis smooth scrolling (vendored at `js/lenis.min.js`, disabled under
  `prefers-reduced-motion`; anchors and the menu lock route through it)
- two card sliders (arrows + drag + scroll-snap)
- full-screen dark mobile overlay, matching the template's "Phone Open" variant
- menu toggle is a plain hamburger (no background or border) that draws itself
  into a smile with teeth when the overlay opens
- a soft top scrim on the hero: the template's 66° gradient darkens the bottom-left where
  the headline sits, but not the top where the nav does, so the logo needed its own cover
- word-by-word text reveal, opacity `.4→1`, offsets `start 1 → end .3`
- accordions, mobile menu, `prefers-reduced-motion` respected

## Brand

| | |
|---|---|
| Logos | the real files from esteemdentalclinic.com |
| Cream | `#f7f3ec` base, `#eae3d6` tint — sampled from their site |
| Primary | `#6f573f` brown (replaces the template's `#0452ff`) |
| Footer | `#33281f` espresso (replaces `#002156` navy) |
| Fonts | Geist + Geist Mono — the template's own |

## Clinic facts used (all verified from esteemdentalclinic.com)

| | |
|---|---|
| Address | 7G-8G, Jalan Atmosphere 7, The Atmosphere, 43300 Seri Kembangan, Selangor |
| Hours | Monday to Sunday, 9am–1pm and 2pm–5pm |
| Phone | +60 19 857 8829 · +60 3 8940 9393 |
| Email | info@esteemdentalclinic.com |
| Differentiator | "the only Megagen R2Gate implant centre in Malaysia" (their own claim, from their Services page) |
| Their All-on-4/6 line | "4-6 dental implants to be placed on a fully edentulous (no teeth at all) jaw" |

The four stats in the solution section come from these plus the deck (4–6 implants,
3 months healing). Nothing is invented — there are still no patient counts or success
rates anywhere, because neither source publishes any.

## Copy

Copy is written for search and conversion: the H1 names the service and the location
("All-on-X Dental Implants in Seri Kembangan"), the hero states the offer and the
R2Gate differentiator in two sentences, and the footer carries full NAP + hours.
Section headings are informative rather than decorative — "When Full-Arch Treatment May Be
Considered", "The Esteem Difference", "Why Digital Guided Surgery", "Dynamic Navigation",
"Your All-on-X Journey", "Questions Patients Often Ask". Eyebrows are plain labels
(The problem / What is All-on-X / Services / Guided surgery / Technology / Your journey /
FAQ). No invented or decorative headlines.

## Deliberate differences from the template

The template pins both carousel sections and scrubs them with the page scroll, which forces
the visitor to scroll through the whole carousel before reaching the next section. These are
ordinary sliders here — arrow buttons, pointer drag and scroll-snap — so the page is ~35%
shorter and nothing blocks the way down. Everything else follows the template.

## Content

Every word is from **All-On-X Landing Page.pdf**. Deliberately omitted:

- **Post-op instructions** (pp. 9–11) — aftercare for existing patients, not landing-page content
- **Clinical x-rays and before/after photos** (pp. 16–24) — clinical quality and patient consent

No statistics, prices, phone numbers or addresses appear anywhere, because the deck
contains none. All CTAs point at https://www.esteemdentalclinic.com/ — swap for the real
booking URL. The counter animation from the template is unused for the same reason: there
are no figures to count to.

Imagery is from Pexels (free licence, no attribution required). People are Asian and
30s–40s to match the clinic's patients. The treatment visuals are All-on-X specific
rather than generic dentistry:

| file | what it actually shows |
|---|---|
| `allonx-bridge.jpg` | a full-arch implant bridge on multi-unit abutments — the All-on-X prosthesis itself |
| `implant-model.jpg` | transparent jaw model with implant fixtures in place |
| `step-guided.jpg` | implant surgical kit during placement |
| `step-lab.jpg` | finishing a full-arch restoration on the lathe |
| `step-diagnose.jpg` / `step-plan.jpg` | intraoral scanner, CBCT on screen |
| `step-restore.jpg` | shade matching with a patient |

**Still missing, and worth asking the clinic for:** real before/after photos of their own
All-on-X cases, an OPG showing their implant positions, and a photo of the actual clinic
and team. No stock library has a genuine All-on-X patient case — that is clinical
photography a practice shoots itself, and it is the single biggest trust upgrade available
to this page.

## Mobile specifics

The CTA proof cards sit three-across on phones with the caption under the image
rather than stacked full-width — that block is 213px tall instead of ~1300px.

## Repo

`https://github.com/zebwan/esteemdental-allonx` — branch `main`. Pages is not enabled yet;
the site is a plain static build so Pages can serve `/` from `main` directly.

## Previewing

macOS blocks the preview server from reading `~/Desktop`, so serve a copy from elsewhere.
Use a threaded server — Python's plain `http.server` drops parallel requests and the page
loads without CSS/JS:

```bash
python3 -m http.server 9712 --bind 127.0.0.1 --directory "/path/to/copy" &
```
