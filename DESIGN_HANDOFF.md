# Fhenix homepage — Figma implementation

Source: https://www.figma.com/design/ofplcSMi5mjTUsnaKtYVVR/All-designs-Fhenix?node-id=440-1012

The active homepage now follows Home page new (440:1012). It retains the supplied cyan and navy palette, Clash Grotesk / Geist / Geist Mono typography, ASCII textures, dollar imagery, section sequence, token artwork, team portraits, investor marks and oversized footer wordmark.

## Motion
The hero follows the live website’s 50ms letter decode and 2s holds: (confid*ntial) → (pr*vate) → (encrypt*d) → (sh*elded) → (mainnet). It runs once and settles on mainnet. Hovering or touching a letter briefly scrambles that character, then restores it without restarting the sequence. The animation pauses when the tab is hidden or motion is paused. The dollar reveal, the editable Figma vector coin animation and slow bill movement, logo marquee, game teasers, section reveals and button feedback supplement the supplied static composition. Reduced-motion preferences are respected; a pause control is available. No motion tracks were authored in the supplied Figma frame.

## Review notes
- Desktop geometry follows the 1440px frame; mobile reflows into readable columns at 1023px and below.
- Backed By Leaders corrects the source typo Baked By Leaders.
- FAQ questions follow Figma. Answers are draft explanatory copy because the source only supplies collapsed questions.
- Waitlist, dApp, game and Snag integrations need final destinations. Placeholder actions open an explicit preview message and collect no data.
- Launch, partner and research copy remains as supplied for marketing review; internal placeholders are still present.
- Original exports were optimized to local WebP assets. This work did not edit the Figma file or deploy the production site.

## Local use
Run npm run dev and open http://127.0.0.1:5173/.
Run npm run build for a production bundle.

## Validation
Production build passed. Browser checks covered 1440px desktop, 390px mobile and 320px mobile widths, no horizontal page overflow, image loading, mobile/developer menus, waitlist preview and FAQ expansion.

## Files
index.html, src/styles/figma-home.css, src/js/figma-home.js and existing hero/section motion modules.
The rejected editorial version is preserved in homepage-editorial.html. homepage-v1.html preserves the earlier prototype.

The Your tokens. Two modes. illustration now uses editable artwork from Figma node 48:377. Original coin-mark, lighting and grid SVG assets live in public/assets/token-vector. CSS animates the privacy layer and labels in an 11-second cycle inspired by the live GIF; the Figma node itself has no saved motion tracks. No low-resolution GIF is rendered. Reduced-motion displays the static layered composition; the pause control freezes native animations.
