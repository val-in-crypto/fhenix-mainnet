# Active homepage: Figma brand implementation

The homepage now follows Figma frame `440:1012`. See [DESIGN_HANDOFF.md](DESIGN_HANDOFF.md) for implementation and review notes. The editorial concept below is archived as `homepage-editorial.html`.

# Current homepage — editorial direction

The homepage at `/` is the October 8 editorial redesign: oversized readable typography, neutral surfaces, Fhenix cyan, a pixel motif and an interactive public/confidential balance demo.

- Run: `npm run dev` (Vite uses `PORT` when provided; otherwise 5173).
- Build: `npm run build`.
- Entry files: `index.html`, `src/styles/editorial.css`, `src/js/editorial.js`.
- Existing local brand fonts and images are reused. No external runtime or animation library is required by the new entry.
- Previous homepage: `homepage-v1.html`, with its original style and script modules retained.
- See `DESIGN_HANDOFF.md` for launch dependencies and scope.

---

## Previous prototype documentation

# Fhenix mainnet homepage

Prototype of the fhenix.io homepage for the Oct 21 mainnet makeover. Vite + vanilla JS + GSAP.

- Hero: Figma *All designs Fhenix* → "Hero section" (node 440:1012, variant 1.2). Motion script in `PLAN.md`.
- Sections 2–11 follow the "Fhenix Homepage Design Plan" doc (Oct 8) and the marketing brief of Oct 6.
- Shareable build: https://claude.ai/artifact/VUPXyhedoWnHAif131NRDh (private until shared from its Share menu).

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/
```

## Structure

- `index.html` — the whole page. Hero elements the entrance animates carry `data-anim`; everything below the hero reveals on scroll with `data-reveal`; section labels decode with `data-scramble`; every CTA carries `data-event` (pushed to `window.dataLayer`).
- `src/styles/` — `tokens.css` (colours, type, layout), `hero.css` (1440 stage, nav, buttons, hero), `dollar.css` (right panel), `sections.css` (live strip → footer, plus their mobile rules), `mobile.css` (hero < 1024px).
- `src/js/timeline.js` — hero "Decrypt" entrance. On phones the H1 decrypts once to `(mainnet)` and never cycles.
- `src/js/sections.js` — scroll reveals, label decode, live-strip counters, the dual-mode wallet demo (self-running until touched), dice and hunt teasers, mobile sticky CTA, genesis slot, analytics stub.
- `src/js/decode-text.js`, `typewriter.js`, `dollar-panel.js`, `stage.js`, `motion.js` — unchanged hero modules.

## Content still to land (placeholders in the page)

- Wallet URL and name (Product) — hero and dual-mode CTAs point to the on-page demo.
- Five partner dApps: logos, one-liners, links (BD, by Oct 14) — cards read "Partner · TBC".
- Game links, gifs, builder handles (Community) — dice and hunt are CSS teasers.
- Quantum-safe sentence (Research).
- Snag quest widget and shop hero items (Community, Rads).
- Genesis block is built and hidden; preview with `?genesis` or `#genesis` in the URL.

## Publishing the artifact again

Build with a relative base, then regenerate the artifact page (inlines CSS + JS, strips the document skeleton) and publish `fhenix-mainnet-homepage.html` with `dist/assets/*` and `dist/fonts/*` as files:

```bash
npx vite build --base=./
```
