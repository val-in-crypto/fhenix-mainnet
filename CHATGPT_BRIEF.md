# Fhenix homepage makeover — context brief

Prepared 2026-10-08 for use as context in ChatGPT. Everything below is the current state of the fhenix.io homepage makeover for mainnet on 2026-10-21: what the live site does today, what the marketing brief asks for, the design plan, the working web prototype, and the Figma build.

## 1. Who and what

- Company: Fhenix, a confidential-computing layer for Ethereum built on fully homomorphic encryption (FHE). Core product is CoFHE, an FHE coprocessor for EVM chains.
- Owner of this work: Valeriia (brand and web designer, valeriia@fhenix.io).
- Live site: https://www.fhenix.io/ (Webflow, GSAP 3.15).
- Figma file: "All designs Fhenix", key `ofplcSMi5mjTUsnaKtYVVR`.
- Mainnet date: Oct 21, 2026 on Ethereum and Arbitrum, with five partner dApps live the same day.
- After launch: genesis NFT campaign in November, TGE targeted end of year, fUSD stablecoin in January 2027 (kept off the site for now).

## 2. Review of the live site (as of Oct 8)

Strengths
- Strong brand system: parenthesis logo, cyan asterisk, scramble-decode headline cycling (confid*ntial) → (pr*vate) → (encrypt*d) → (sh*elded), encrypted glyph strings as decoration, corner markers on dark blocks.
- Typography: Clash Grotesk (display), Geist (body), Geist Mono (labels). Inter Display also loads but is unused.
- Palette: cyan #00DDDE, ink #001623, deep teal #00314E, white, light grey; sections alternate white, grey and navy.
- Trust: 12 investor logos (Hack VC, Multicoin, Tandem, GSR, Amber, Collider, Bankless, HashKey, Metaplanet, Node Capital, Sora, Primitive), named academics on the team, an ACM CCS 2025 Distinguished Paper, three live testnets, a substantive FAQ.
- The dual-mode token toggle (balance pixelates in confidential mode) is the best visual on the page.

Weaknesses
- Page is about 11,400 px tall on desktop; FAQ and final CTA sit far below where most visitors stop.
- Team section ("Built by GOATs", ten large cards) comes second, before the product.
- Hero shows a blurred dollar-bill texture, not the product; both hero CTAs ("Join the waitlist", "Partner with us") go to Mailchimp pages off-site.
- Three separate email captures on one page with different destinations.
- "Mainnet coming soon" appears only as a small tag far down; the hero never says mainnet.
- On mobile the scramble can land on a random string, so the first screen reads as gibberish.
- Only H1 is visually hidden; the visible hero line is an H2.
- Copy bugs: "needcomposability", "nowrapper", "Do payments and portfolio management" repeating its heading, empty paragraphs in FAQ answers.
- Cookiebot, Google Tag Manager and Google Ads all load on a privacy brand's homepage.
- Key-event rate on organic traffic fell from 13% to 8% between January and April while traffic grew.

## 3. The marketing brief (dated Oct 6)

A 15-day makeover, not a rebuild. Retail audience for the next three months.

Goals
1. Say what Fhenix is in five seconds: your tokens get a confidential mode, and it is built to survive quantum computers. Target: 60%+ scroll past hero.
2. Send people to something live: dual-mode wallet, partner dApps, games. Target: clicks to product 25%+ of sessions.
3. Capture them before the NFT: quests, X follow, waitlist. Target: key-event rate back to 13%+.

Ground rules
- Keep: design system, fonts, colours, nav structure, existing components (re-skin, don't rebuild), backers block, FAQ component, footer, docs and SDK links moved under a Developer button.
- Change: hero copy, visual and CTAs; section order (product first, team later); every "coming soon" becomes live with a link; four new blocks (live strip, partner dApps, play, quests + swag) plus a mainnet status page linked from the footer.
- Don't: no fUSD, no yield talk, no token talk; no hard focus on builders; nothing that can't ship in 15 days; no "anonymous", no "FHE" in headlines.

Messaging, in order
1. Dual-mode: "Your tokens. Two modes." Hold a token publicly, switch it confidential in one click, switch back. Same wallet, same DeFi.
2. Quantum-safe: lattice-based maths, the family NIST picked for the post-quantum era. Most of crypto will have to migrate; this won't.
3. Live and fun: five partner dApps on day one, games you can't cheat at, quests that earn swag. Tone: plain, a bit playful, no promises.

Hero options
- A: "Your tokens. Two modes." + "Hold them public. Switch them confidential. Built on encryption that survives quantum computers. Live on Ethereum and Arbitrum." CTAs: Try the dual-mode wallet / Play encrypted games. (Design recommends A; it is the only option that meets goal 1 as written.)
- B: "Every asset gets a confidential mode." (institutional line, less playful)
- C: "Privacy that survives quantum." (dual-mode becomes the proof line)

Timeline: Oct 6–8 lock copy and order; Oct 9–13 design (mobile first); Oct 14–17 build and plug in content; Oct 18–20 QA; Oct 21 live. Nov 2–8 genesis NFT block switches on. Weekly: swap the featured game and partner. Dec: tokenomics page link in nav. Jan 2027: fUSD returns as its own block.

Open decisions named in the brief: which hero (Angie, design); wallet name and readiness (Product; demo if not ready); the five partner dApps, logos and links locked by Oct 14 (Guy I, BD); swag shop live by Oct 21 (Rads, Shivani); games embedded or linked out (design, dev); who signs off quantum-safe wording (Ravital).

Issues flagged in the brief: goal 1 and hero options B/C disagree; "no FHE in headlines" conflicts with the "What is FHE" nav button; the status page has no owner or timeline slot; the Snag quest widget is the heaviest dependency; typo "Be earle where early matters"; analytics events must land in the same GA property to keep the 8% baseline comparable.

## 4. Design plan (doc: https://claude.ai/artifact/Gd4sztRvqk8wjmUM6Ayk7P)

Principles
1. Show the thing working: every product claim is a live demo, a loop or a screenshot of mainnet.
2. One click to something live: every section ends in a button that does something on mainnet.
3. Retail words above the fold: no FHE, coprocessor or anonymous in headlines.
4. Reuse, re-skin, never rebuild: every block uses an existing Webflow component.
5. Mobile is the first screen: design at 375 px first.

New page architecture (12 → 11 blocks, target under 7,000 px)
| # | Block | Job | Primary click |
|---|---|---|---|
| 1 | Hero | Say what Fhenix is in five seconds | Try the dual-mode wallet |
| 2 | Live strip | Mainnet date, chains, 5 dApps, 20M+ testnet ops | scroll |
| 3 | Dual-mode wallet | Balance flips public → confidential | Try it |
| 4 | Partner dApps | Five things you can use today | Launch |
| 5 | Play | Games you can't cheat at | Play now |
| 6 | Quantum-safe | Lattice, NIST, nothing to migrate | Read the research |
| 7 | Quests + swag | Do, Post, Earn, Spend; Snag widget; shop | Start a quest |
| 8 | Genesis slot | Hidden on Oct 21, flips on in November | Join allowlist |
| 9 | Team + backers | Trust, below the product | none |
| 10 | FAQ | Retail questions | Follow on X |
| 11 | Final CTA + footer | Last capture, status page link | Start a quest / Follow on X |

Cut: the use-case grid (one line survives in FAQ) and the SDK block (becomes a Developer link in the header). Nav button "What is FHE" becomes "How it works".

Engagement loop: arrive from X or Kaito → get it in 5 seconds → try something live (wallet, dApp, game) → start a quest (X follow + wallet) → post and earn credits → spend in the swag shop → genesis allowlist in November. Visitors not ready to try follow on X and reach the allowlist that way.

CTA hierarchy: 1) Try the dual-mode wallet (hero, dual-mode block, mobile sticky bar); 2) Launch a dApp / Play now; 3) Start a quest (the capture); 4) Follow on X. Mailchimp waitlist removed; newsletter field only inside the hidden genesis slot; Partner with us moves to footer and Developer menu.

Analytics events: hero_scroll_past, cta_wallet_click, dapp_launch_click, game_play_click, quest_start, x_follow_click, genesis_join. All into the existing GTM container and GA property.

Brand rules: keep logo, fonts, palette, glyph strings, corner markers; drop Inter Display. Motion: the scramble-decode is the single motion signature (hero headline, section labels on enter, balance in the dual-mode loop). Product imagery replaces metaphor imagery above the fold. Mobile: 40 px headline, 16 px body, 12 px mono labels, cards stack, dApps become a horizontal snap scroller, scramble decrypts once and never cycles, sticky bottom bar with the primary CTA.

Decisions still open as of Oct 8 (last day of the lock window): hero A/B/C; wallet name and readiness; five partner dApps by Oct 14; swag shop readiness; games embedded vs linked (design recommends link out for Oct 21, embed Liar's Dice in November); quantum-safe sentence from Research; nav label change; status page owner; fix the brief typo.

## 5. Web prototype (built Oct 8)

- Shareable page: https://claude.ai/artifact/VUPXyhedoWnHAif131NRDh (private until shared).
- Source: local folder "mainnet landing page". Vite + vanilla JS + GSAP 3.15. `npm run dev` for local, `npx vite build --base=./` for the shareable build.
- Fonts self-hosted: Clash Grotesk Medium and Semibold, Geist variable, Geist Mono variable.
- Hero follows Figma frame "Hero section" node 440:1012 (variant 1.2): corner handles, scramble headline that locks on "(mainnet)", 40 px line "Your tokens. Two modes.", decrypting dollar panel. Copy is brief option A. Nav button is "How it works".
- Live strip replaces the logo marquee with four stats and animated counters.
- Dual-mode wallet is a working demo: toggle flips the balance between public and encrypted (hex-scrambled, cyan glow); it runs itself until touched.
- Partner dApps: five cards tagged "Partner · TBC" plus "Your dApp here".
- Play: Liar's Dice (rolling dice, one hidden die) and FHE Hunt (clickable encrypted board), plus community-game chips.
- Quantum-safe: three lines, research link, the press-button animation from the live site.
- Quests + swag: Do / Post / Earn / Spend strip, a marked slot for the Snag widget, three real shop products.
- Genesis slot built and hidden; preview with `?genesis` or `#genesis` in the URL.
- Team (10 people, photos from the live site), backers (12 logos), retail FAQ (6 questions), final CTA, footer with mainnet status link.
- Every CTA carries a `data-event` pushed to `window.dataLayer`. Section labels decode on scroll. Mobile sticky "Try the dual-mode wallet" bar appears once the hero scrolls away.
- Verified: desktop renders all sections with no console errors; at 375 px there is no horizontal scroll.
- Placeholders still to land: wallet URL and name (Product), five dApps with logos and links (BD), game links and gifs and builder handles (Community), quantum sentence (Research), Snag widget and shop hero items (Community, Rads).

## 6. Figma build (Oct 8)

- Frame "Home — Mainnet (Oct 21)", node 446:131, on the "All designs" page, placed to the right of existing designs. Link: https://www.figma.com/design/ofplcSMi5mjTUsnaKtYVVR/All-designs-Fhenix?node-id=446-131
- 1440 px auto-layout page, about 9,400 px tall, all twelve blocks in order, fully editable layers (about 430 nodes, no flattened screenshots).
- Hero is a clone of the 1.2 frame with the new copy; encrypted-texture and dollar-bill imagery untouched.
- Local components in section "Components — Home mainnet" (node 450:377): Button set 447:163 (Primary, Light, Ghost, GhostLight, Small; Label text property), dApp card 448:181 (Number, Title, Body), Step 448:423 (icon swap + Title, Body), Product 448:490, Person 448:517 (Name, Role, Bio, photo override), Backer cell 448:601, FAQ row 449:357 (Closed/Open; Question, Answer).
- Team photos uploaded and set to black and white; investor logos, shop products, chain logos and the animation still reuse images already in the file.
- Caveat: Clash Grotesk could not be loaded through the Figma plugin API in this file, so new display text uses Geist SemiBold and Geist Medium. Swap the font family to Clash Grotesk in Figma. Interactions (wallet toggle, dice, hunt) are static art in Figma.

## 7. Facts and numbers worth keeping straight

- Mainnet: Oct 21, 2026, Ethereum + Arbitrum. CoFHE testnets: Ethereum Sepolia, Arbitrum Sepolia, Base Sepolia.
- Funding: over $22M total; $15M Series A led by Hack VC; $7M seed from Multicoin and Collider; strategic investment from Tandem (Offchain Labs) and BIPROGY.
- Research: ACM CCS 2025 Distinguished Paper, threshold FHE decryption at 64,319 decryptions per second and 8.48 ms latency (research figures, not production).
- Integration: one Solidity import, `@fhenixprotocol/cofhe-contracts/FHE.sol`, plus the `@cofhe/sdk` client library. Docs at cofhe-docs.fhenix.zone.
- Shop: fheswagshop.fhenix.io.

## 8. How to use this with ChatGPT

Paste this file as context, then ask for what you need: copy variants for a block, a QA checklist for Oct 18–20, a social post plan for launch week, or a review of the open decisions. Keep the brief's rules in mind: no FHE in headlines, no fUSD or token talk, retail voice, everything must link to something live.
