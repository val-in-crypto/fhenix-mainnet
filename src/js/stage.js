/**
 * Scales the 1440px design frame to the viewport (capped at 1.4×).
 * Below 1024px the CSS switches to the mobile layout and --s is 1.
 */
const FRAME = 1440;
const MAX = 1.4;
const MOBILE = 1024;

export function initStage() {
  const root = document.documentElement;
  const apply = () => {
    const w = window.innerWidth;
    const s = w < MOBILE ? 1 : Math.min(MAX, w / FRAME);
    root.style.setProperty("--s", s.toFixed(4));
  };
  apply();
  window.addEventListener("resize", apply, { passive: true });
}
