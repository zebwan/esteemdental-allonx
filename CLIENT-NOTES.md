# Esteem All-on-X landing page — notes for the client

Two parts: what we changed on the SEO side and why, and what we still need from
Esteem to finish the page.

---

## 1. The message to send

> Hi Doc, the All-on-X landing page is ready for your review:
> https://zebwan.github.io/esteemdental-allonx/v2/
>
> One thing worth flagging. The draft page you sent us had a heading that didn't
> mention "dental implants" or the clinic's location anywhere, which is the single
> biggest thing Google reads. We've fixed that. A few things we still need from
> your side are listed below — the booking link is the one that blocks go-live.

---

## 2. What we changed, and why it matters

### The heading was doing no work

The draft headline was **"Considering All-on-X? Know what matters."**

It reads well, but as a search signal it is nearly empty:

- it says *All-on-X* but never says **dental implants** — almost nobody searches the
  bare brand term, they search "dental implant", "full mouth implants", "fixed teeth"
- it has **no location at all** — no Seri Kembangan, no Selangor, not even Malaysia

For a single-clinic page the location is the whole game. It's the difference between
competing with every implant clinic in the country and competing with the handful
around The Atmosphere.

The keyword line the draft *did* have — "ALL-ON-X DENTAL IMPLANTS IN MALAYSIA" — was
sitting in ordinary body markup. On screen it looked like a heading; to Google it
carried no weight at all. The right words were on the page, in the wrong place.

**Now:** the page heading reads *Considering All-on-X? Know what matters.* with
**Full-arch dental implants in Seri Kembangan, Selangor** on a second line inside the
same heading. Treatment, plain-language term and location, all in the one element
Google weighs most.

The page title has been changed the same way — it now names Seri Kembangan, which
the draft's did not.

### The draft page was 10.9 MB

Every photo and the video were pasted into the page file itself rather than loaded
as separate files. That meant:

- nothing could be cached, so a returning visitor downloads all of it again
- nothing could load later — the four "load this image later" instructions in the
  draft did nothing, because the image was already inside the file
- phones got the same full-size images as desktops
- the page could not start drawing until all 10.9 MB had been read

**Now: 2.1 MB**, loaded as normal separate files, with images below the first screen
loading only when scrolled to.

### Four fifths of the content was invisible to Google

In the draft, the treatment stages and the explainer sections were behind tabs, and
only the first panel of each was actually in the page. The other stages existed only
inside the page's scripts, which Google does not reliably read.

**Now:** all five treatment stages and all four explainer sections are real page
content. That's roughly 400 extra words of indexable copy, and the heading count went
from 6 sub-headings to 12.

### Every section has its own address

The page address carries no `.html` on the end — it is `/all-on-x/`, not
`/all-on-x/index.html`. Cleaner to share, and it means the page can be moved or
rebuilt later without the link breaking.

Each section is also separately linkable, and the links are written in plain words
rather than internal shorthand:

| Section | Link |
|---|---|
| Who may benefit? | `/all-on-x/#who-may-benefit` |
| How All-on-X works | `/all-on-x/#how-all-on-x-works` |
| Real patients | `/all-on-x/#real-patients` |
| Planning & treatment | `/all-on-x/#planning-and-treatment` |
| Questions to ask | `/all-on-x/#questions-to-ask` |
| Discuss your options | `/all-on-x/#discuss-your-options` |

On the preview those are the same links under
`https://zebwan.github.io/esteemdental-allonx/v2/` — for example
`https://zebwan.github.io/esteemdental-allonx/v2/#questions-to-ask`.

Two uses for this. Esteem can send a patient straight to the part that answers their
question — a WhatsApp reply can link to the questions section rather than the whole
page. And Google sometimes lists these as "jump to" links under a search result,
which takes up more of the page and reads as more useful.

### Housekeeping

Also in place now, none of which the client needs to do anything about: the clinic's
address, both phone numbers, email and opening hours are published in the machine
format Google reads for local results; the eight FAQs are marked up as questions;
social share cards; the correct Malaysian English language tag; and every image
declares its size so nothing jumps around while the page loads.

Worth being straight about one thing: Google has limited FAQ rich results to
government and health authority sites since 2023, so those questions are unlikely to
show as dropdowns in search. The markup is still correct and still helps Google
understand the page — just don't expect the visual result.

---

## 3. What we need from Esteem

### Blocks go-live

1. **The booking link.** Every button on the page currently points at the main site's
   contact page as a stand-in. Where should enquiries actually go — a form, WhatsApp,
   a phone number, a booking system?
2. **The page address.** Will this sit on the main domain (e.g.
   `esteemdentalclinic.com/all-on-x/`) or on its own? This decides the canonical tag
   and how the page passes authority from the main site.
3. **Clinical sign-off on the copy**, in particular the answer about risks. We have
   written it conservatively and it should be read by a dentist before it is public.

### Would materially improve the page

4. **A larger export of the All-on-X video.** The file we were given is 412 × 224
   pixels, which is roughly a quarter of a phone screen. It can only be shown small.
   At 1280 wide or better it could carry the top of the page.
5. **Photography we can lead with.** Of the fifteen images supplied, exactly one — the
   zirconia bridge on cream — works at the top of the page. The rest are intra-oral
   clinical shots, which belong inside the page rather than as the first thing a
   nervous patient sees. What would help: the clinic interior, the team at work, and
   patients who look like the people Esteem wants to attract.
6. **More consented before-and-after cases**, ideally of younger patients. We have two
   and one of them is the same case twice. This is the most persuasive content on a
   page like this and we are thin on it.
7. **Named clinicians with their qualifications.** Google weighs author credentials
   heavily on health pages, and patients do too. Who performs All-on-X at Esteem, and
   what are their implant qualifications?
8. **Treatment time and what's included.** We can say it takes "several months"
   because that is defensible, but a range the clinic is comfortable standing behind
   is far more useful to someone deciding.

### Worth discussing

9. **Pricing.** Cost is the first question a patient asks and the page cannot answer
   it. Even "from RM X" or "financing available" would qualify enquiries. We should
   check what the Malaysian Dental Council's advertising guidelines allow before
   putting a number on a public page — happy to look into that if Esteem wants it.
10. **Tracking.** Nothing is installed yet. We should add Google Analytics and
    click tracking on the phone, WhatsApp and booking buttons, otherwise there is no
    way to tell whether the page is working.
11. **The Google Business Profile.** For "dental implants near me" searches the
    profile often matters more than the page. Worth a look at whether Esteem's is
    complete and getting reviews.
12. **Where the traffic comes from.** A landing page with no links into it ranks for
    very little. At minimum it should be linked from the main site's services menu.

---

## 4. What stays as is

The draft's section order has been kept — who may benefit, how All-on-X works, real
patients, planning and treatment, questions to ask — because that order is sound. The
visual design is ours.

Nothing on the page states a fact the clinic has not published. Address, phone
numbers, email and opening hours are taken from esteemdentalclinic.com. Anything we
could not verify was left out rather than guessed.
