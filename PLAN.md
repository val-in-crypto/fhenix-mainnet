# Fhenix Mainnet Hero — Implementation Plan

Source of truth: Figma frame `Hero section` (node 435:915) in *All designs Fhenix*.
Motion reference: current home page https://www.fhenix.io/ (Webflow + GSAP 3.15).

---

## 1. Brand read (what the design is saying)

The whole hero is one metaphor: **encrypted → decrypted**.

| Element in Figma | What it represents | Motion idea that follows from it |
|---|---|---|
| H1 `(k4#?p(n>39-2)` in grey parentheses | A ciphertext that still has to resolve | Scramble-decode, letter by letter, ending on **(mainnet)** |
| ASCII-art textures (cyan field + right panel) | Encrypted data at rest | Slow data-flow shimmer, never static |
| The real $100 bill in a vertical window | Decrypted, usable value | Resolves from ASCII into the photo; hover reveals more |
| Black 10px corner handles on the white H1 plate | A "selected" object, like a Figma/terminal selection | Plate draws itself in, handles pop last |
| Pixel-cluster icons (4×4px squares) on buttons | Pixels / bits | Squares pop in one at a time |
| Frosted glass bars on the left | Redacted / blurred rows | Wipe in from the left |
| Geist Mono captions | Terminal output | Typed word by word with a block cursor |

**Tokens (from Figma, no variables published so these are literal):**

- Cyan field `#00DDDE` · Ink `#001623` · Deep teal `#00314E` · White · USDC blue `#2775CA`
- Overlay gradients: teal `#24F5DD` / `#75FFED`, blue `#244BF5`, red `#F52428` (overlay blend on ASCII)
- Grey parens: `rgba(0,49,78,0.08)` · Logo strip opacity 25%
- Type: **Geist Mono** Bold 120 / -4.8px tracking (H1), Bold 14 uppercase (nav), Regular 18 & 16 (captions). **Clash Grotesk** Medium 32 / -0.28px (subtitle), Semibold 20 (CTAs), Medium 18 (header button)
- Layout: 1440 frame, 80px side padding, 64px nav, 746px hero, 125px logo strip (full-bleed 1920)

---

## 2. Stack recommendation

**Vite + plain HTML/CSS/ES-module JS + GSAP 3.13+ (ScrambleText, SplitText, ScrollTrigger — all free since 3.13).**

Why:
- The live site already runs on GSAP, so the team knows it and the code can later be pasted into a Webflow embed with almost no change.
- No framework overhead for a hero that is 90% motion and 10% markup.
- Pixel control over the layered blend modes (hard-light / overlay) the design relies on.

Alternative if the new site is going React: Next.js + GSAP (same animation code wrapped in `useGSAP`). The motion modules below are written framework-agnostic so either works.

Fonts: Clash Grotesk via Fontshare (free commercial licence), Geist Mono via Google Fonts (OFL). Both self-hosted as WOFF2 for LCP.

---

## 3. Motion script — "Decrypt" (one GSAP master timeline, ~2.0s, then ambient loops)

Easing family: `power3.out` for entrances, `expo.out` for the plate, `none` for marquee and data-flow. Everything animates **transform / opacity / clip-path only**.

| t (s) | Element | Animation |
|---|---|---|
| 0.00 | Nav logo `(fhenix*)` | Scramble-decode 0.4s |
| 0.05 | Nav links | Fade + 8px rise, 40ms stagger |
| 0.15 | "What is FHE" button | Slides down from above the bar, pixel icon squares pop 1→4 |
| 0.20 | Subtitle "Onchain privacy…" | **Word-by-word typing**: each word fades + rises 12px, 55ms stagger, Clash Grotesk |
| 0.45 | White H1 plate | `scaleX 0→1` from the left (expo.out 0.6s), then 4 corner handles pop (back.out, 30ms stagger) |
| 0.70 | H1 | Scramble starts (see §4) |
| 0.90 | "Join fUSD waitlist" | Clip-reveal left→right 0.4s, pixel icon pops |
| 1.00 | "Become Partners" | Same, 0.1s later |
| 1.10 | Navy "Live on…" card | Slides in from the right 24px + fade; text **typed word by word** in Geist Mono with blinking `▮` cursor, cursor stops after last word |
| 1.25 | Frosted glass bars | `clip-path inset(0 100% 0 0) → inset(0)` 0.5s, 80ms stagger |
| 1.40 | Bottom-left card | Navy shadow plate drops in, white card slides 13px right onto it, caption typed word by word |
| 0.30 → 1.60 | Dollar panel (right) | Decode sequence (see §5), runs in parallel |
| 1.70 | Logo strip | Fade in, marquee already moving so it never "starts" |

**Reduced motion** (`prefers-reduced-motion: reduce`): everything rendered in final state, H1 shows `(mainnet)` immediately, marquee static, no hover scramble.

---

## 4. H1 — decode to "mainnet"

Reuses the exact behaviour of the live site (I pulled its script) with one change: the cycle **ends and locks** on `(mainnet)`.

- Word list: `(confid*ntial)` → `(pr*vate)` → `(encrypt*d)` → **`(mainnet)`** then stop.  
  Default timing: 50ms per character reveal, 1.6s hold per word, so "mainnet" lands at ~6s after load. (Live site uses 2s hold and loops forever.)
- Parentheses stay grey `rgba(0,49,78,.08)`; the `*` accent stays Fhenix cyan on the intermediate words; "mainnet" has no star so it reads as the clean, final plaintext.
- Scramble charset identical to live site: `!^*()_+=-{}[]|:;<>?,.~\`a-z` so it looks like the `k4#?p(n>39-2` frame in Figma mid-way.
- **After lock, hovering a letter re-scrambles only that letter** (keeps the interactive charm of the current site). Mouse-out restores "mainnet" after 250ms. Disabled on touch.
- Accessibility: real `<h1>` with `aria-label="Fhenix mainnet"`; the span-per-character layer is `aria-hidden`. Width is fixed with `ch` units so the plate never jumps between words.
- Subtle: the four corner handles do a 1px "breathe" (scale 1→1.15) in sync with each new word landing — the selection box reacting to its content.

---

## 5. Dollar panel — the signature piece

Built as a **native vertical column** (not a rotated horizontal composition) so it lays out and clips correctly. Only the bill image is rotated 90°.

Layers, bottom to top:
1. ASCII texture (`62b7e.png` → WebP) — the ASCII bill, hard-light, 90% opacity
2. Flat `#24A9F5` overlay-blend fill
3. Moving gradient overlay (teal/blue/red bands) — **ambient data-flow**: translates along the column over 14s, repeat, linear
4. Bill window (mask) with the real `$100` photo, rotated, `object-fit: cover`
5. USDC coin badge (SVG, 50% opacity, blue circle) — gentle 6s float

**Entrance ("decrypt the bill"), 0.30 → 1.60s:**
- Window mask starts `inset(50% 0 50% 0)` and opens vertically to its final 36%–61% band.
- Inside the window the ASCII bill (a second copy, aligned) crossfades to the photo while a 2px scan line sweeps top→bottom. Reads as "the data in this window just got decrypted".
- Panel itself eases in with `x: 40 → 0`, slight blur 4px → 0.

**Ambient (loops):**
- Gradient data-flow (layer 3) never stops.
- On scroll the panel drifts with a 0.12 parallax factor (ScrollTrigger scrub) and the window grows slightly, echoing the live site's `maxWidth 1440 → 1200` scrub.

**Interaction (desktop):**
- Moving the pointer over the ASCII parts of the panel reveals the real bill through a 120px-tall horizontal "reveal window" that follows the cursor (same mechanic as the live site's `.image-reveal / clip-path inset`, rotated to vertical). Leaving snaps the window back to the fixed band.
- Mobile: panel becomes a full-width horizontal strip under the H1 (bill un-rotated), entrance plays, hover disabled, an automatic slow sweep replaces it.

---

## 6. Logo marquee

- Row: Arbitrum · Ethereum · Base, duplicated once, 25% opacity, 45px tall, ~255px pitch (from Figma positions).
- GSAP `x -= setWidth` with modulo wrap (same technique as live site) — seamless, no jump. Speed ~40px/s (≈ 20s per set). Pauses to 0.3× on hover, not a hard stop.
- Edge fade via `mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)`.
- Full-bleed 1920 like the design, top shadow `0 -1px 1px #f2f2f2`.
- Logos: Figma exports are PNG. I will ask for SVG sources; PNG fallback is fine at 25% opacity.

---

## 7. Layout, responsiveness, performance

- Desktop 1440 built to Figma coordinates with a CSS grid inside an 1280 content column; ≥1920 the cyan field and logo strip stay full-bleed.
- 1024–1439: everything scales via `clamp()`, H1 `clamp(64px, 8.3vw, 120px)`, dollar panel narrows to 200px.
- <1024: single column — subtitle, H1 plate (H1 wraps `(main` / `net)` is **not** allowed; font shrinks instead), CTAs stacked, dollar strip, caption cards, marquee.
- Assets: `f4a3a.png` from Figma is **11 MB (2522×4096)** — must be exported as AVIF/WebP ≤ 300 KB and lazy-loaded; bill JPEG → WebP ~60 KB; textures `loading="lazy"`, text is the LCP.
- Only `transform`/`opacity`/`clip-path` animate; `will-change` set in JS right before the timeline and removed after.
- GSAP loaded as an ES module, tree-shaken (~35 KB gz with the three plugins).

---

## 8. File structure

```
mainnet landing page/
  index.html
  package.json  (vite, gsap)
  public/
    fonts/              ClashGrotesk-*.woff2, GeistMono-*.woff2
    assets/             ascii-field.avif, ascii-bill.webp, bill-100.webp, logos/*.svg|png, fhenix-logo.svg, usdc.svg
  src/
    styles/tokens.css   colours, type scale, spacing
    styles/base.css     reset, fonts, layout grid
    styles/hero.css     hero section, plate, cards, buttons, glass bars
    styles/dollar.css   panel layers + blend modes
    styles/marquee.css
    js/main.js          boots timeline, reduced-motion switch
    js/decode-text.js   H1 scramble → lock on "mainnet", hover re-scramble
    js/typewriter.js    word-by-word reveal + cursor (SplitText)
    js/dollar-panel.js  decode entrance, data-flow loop, pointer reveal, scroll scrub
    js/marquee.js       seamless loop
    js/timeline.js      master GSAP timeline with the §3 schedule
PLAN.md
```

---

## 9. Build phases

**Status (2026-10-07): phases 1–6 implemented.** See `README.md` for how to run and where each module lives.

1. **Scaffold & static fidelity** — Vite project, tokens, fonts, assets optimised, hero built pixel-to-Figma (compared against the Figma render at 1440). No motion yet.
2. **H1 decode** — word cycle → lock on mainnet, plate draw, handles, hover re-scramble.
3. **Dollar panel** — layers, decode entrance, data-flow, pointer reveal, scroll scrub.
4. **Master timeline** — all other elements enter per §3, word-by-word typing for the three text blocks.
5. **Logo marquee.**
6. **Responsive, reduced-motion, performance, cross-browser (Chrome/Safari/Firefox) QA**, screen recording of the final sequence.

Each phase ends with a preview you can open in the browser pane.

---

## 10. Decisions I will take unless you say otherwise

- Words before "mainnet": `confidential → private → encrypted`. (Tell me if you want fewer so mainnet lands sooner.)
- Keep the cyan `*` accent on the intermediate words, none on "mainnet".
- Stack: Vite + vanilla + GSAP, structured so it can be dropped into Webflow or a React app later.
- "Become Partners" and "Join fUSD waitlist" point to the same Mailchimp links as the live site until you give new ones.
- Logo marquee uses Figma PNGs until SVGs are provided.
