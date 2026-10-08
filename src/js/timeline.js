import { gsap, reducedMotion } from "./motion.js";
import { createDecoder } from "./decode-text.js";
import { typeWords, showWordsInstantly } from "./typewriter.js";

const q = (s) => document.querySelector(s);
const qa = (s) => [...document.querySelectorAll(s)];

/**
 * Master "Decrypt" entrance timeline for the hero (Figma 440:1012).
 * Match the live homepage word sequence and timing, then lock on mainnet.
 */
export function buildTimeline({ dollar } = {}) {
  const decodeEl = q("[data-decode]");
  const handles = qa(".plate__handle");

  const decoder = createDecoder(decodeEl, {
    words: ["(confid*ntial)", "(pr*vate)", "(encrypt*d)", "(sh*elded)", "(mainnet)"],
    charDelay: 50,
    hold: 2000,
    hover: !reducedMotion,
    isPaused: () => document.hidden || document.documentElement.classList.contains("motion-paused"),
    onWord() {
      gsap.fromTo(handles, { scale: 1 }, { scale: 1.3, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.inOut", stagger: 0.02 });
    },
  });

  if (reducedMotion) {
    document.documentElement.classList.add("reduced-motion");
    qa("[data-type='words']").forEach(showWordsInstantly);
    decoder.finish();
    dollar?.finish?.();
    return null;
  }

  gsap.set(qa("[data-anim]"), { visibility: "visible" });
  gsap.set(".h1", { autoAlpha: 0 });

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  if (import.meta.env.DEV) window.__hero = tl;

  // ---- NAV ----
  tl.from(".nav__logo", { autoAlpha: 0, y: -6, duration: 0.5 }, 0.0);
  tl.from(qa("[data-anim='nav-link']"), { autoAlpha: 0, y: 8, duration: 0.45, stagger: 0.04 }, 0.05);
  tl.fromTo(".btn--nav", { opacity: 0 }, { opacity: 1, duration: 0.55, clearProps: "transform" }, 0.15);
  tl.from(".btn--nav .pix rect", { scale: 0, transformOrigin: "50% 50%", duration: 0.25, stagger: 0.04, ease: "back.out(3)" }, 0.45);

  // ---- SUBTITLE: word by word ----
  tl.add(typeWords(q(".subtitle"), { stagger: 0.045 }), 0.2);

  // ---- H1 handles + decode ----
  tl.from(handles, { scale: 0, transformOrigin: "50% 50%", duration: 0.3, stagger: 0.03, ease: "back.out(3)" }, 0.55);
  tl.set(".h1", { autoAlpha: 1 }, 0.7);
  tl.call(() => decoder.start(), null, 0.7);

  // ---- TAGLINE ----
  tl.add(typeWords(q(".tagline"), { stagger: 0.09, rise: 14 }), 0.95);

  // ---- CTAs ----
  qa("[data-anim='cta']").forEach((btn, i) => {
    const t = 1.15 + i * 0.1;
    tl.fromTo(btn, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.45, ease: "power4.out" }, t);
    tl.from(btn.querySelectorAll(".pix rect"), { scale: 0, transformOrigin: "50% 50%", duration: 0.25, stagger: 0.04, ease: "back.out(3)" }, t + 0.25);
  });

  // ---- CAPTION ----
  tl.add(typeWords(q(".caption"), { stagger: 0.05, rise: 6 }), 1.45);

  // ---- DOLLAR PANEL (parallel) ----
  if (dollar?.entrance) tl.add(dollar.entrance(), 0.3);

  // ---- LIVE STRIP ----
  tl.from(".live", { autoAlpha: 0, y: 12, duration: 0.6 }, 1.6);

  return tl;
}
