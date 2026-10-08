import { gsap, isTouch, reducedMotion } from "./motion.js";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Dollar panel: decode entrance, ambient data-flow, pointer reveal,
 * scroll parallax. Coordinates follow the Figma composition: a
 * 1238×618 canvas rotated -90°, so "u" (0…1238, left→right in the
 * unrotated canvas) runs bottom→top on screen.
 */
const WINDOW = { left: 35.47, right: 38.26, bottom: 4.66 }; // final clip-path insets (%)
const CANVAS_W = 1238;

export function initDollar() {
  const panel = document.querySelector(".dollar");
  const win = panel.querySelector(".dollar__window");
  const billAscii = panel.querySelector(".dollar__bill-ascii");
  const scan = panel.querySelector(".dollar__scan");
  const flow = panel.querySelector(".dollar__flow");
  const coin = panel.querySelector(".dollar__coin");
  const reveal = panel.querySelector(".dollar__reveal");
  const hero = document.querySelector(".hero");
  const stage = document.querySelector(".hero__stage");

  const finalClip = `inset(0 ${WINDOW.right}% ${WINDOW.bottom}% ${WINDOW.left}%)`;

  function ambient() {
    // data-flow: the gradient bands drift along the column, forever
    gsap.fromTo(flow, { xPercent: -12 }, { xPercent: 12, duration: 14, ease: "sine.inOut", yoyo: true, repeat: -1 });
    // coin floats
    gsap.to(coin, { x: 10, duration: 6, ease: "sine.inOut", yoyo: true, repeat: -1 });
  }

  function entrance() {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: ambient });
    tl.fromTo(panel, { x: 40, autoAlpha: 0, filter: "blur(4px)" }, { x: 0, autoAlpha: 1, filter: "blur(0px)", duration: 0.9 }, 0);
    // window opens vertically from its centre
    tl.fromTo(win, { clipPath: `inset(0 49.5% ${WINDOW.bottom}% 49.5%)` }, { clipPath: finalClip, duration: 1.0, ease: "expo.out" }, 0.25);
    // inside: ASCII bill → real bill, scan line sweeps across the window
    tl.fromTo(billAscii, { opacity: 1 }, { opacity: 0, duration: 0.9, ease: "power2.inOut" }, 0.45);
    tl.fromTo(
      scan,
      { left: `${WINDOW.left}%`, opacity: 1 },
      { left: `${100 - WINDOW.right}%`, duration: 1.0, ease: "power2.inOut" },
      0.4
    );
    tl.to(scan, { opacity: 0, duration: 0.25 }, 1.3);
    tl.fromTo(coin, { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.7, ease: "back.out(2)" }, 0.8);
    return tl;
  }

  function finish() {
    gsap.set(panel, { autoAlpha: 1 });
    gsap.set(win, { clipPath: finalClip });
    gsap.set(billAscii, { opacity: 0 });
    gsap.set(coin, { autoAlpha: 1 });
  }

  // ---- scroll parallax ----
  if (!reducedMotion) gsap.matchMedia().add("(min-width: 1024px)", () => { gsap.to(panel, {
    y: -70,
    ease: "none",
    scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6 },
  }); });

  // ---- pointer reveal (desktop) ----
  if (!isTouch) {
    let active = false;
    const HALF = 60; // reveal window = 120px tall on screen
    hero.addEventListener("pointermove", (e) => {
      if (window.innerWidth < 1024) return; // mobile layout: strip, no reveal
      const rect = stage.getBoundingClientRect();
      const s = rect.width / 1440; // current zoom
      const x = (e.clientX - rect.left) / s;
      const y = (e.clientY - rect.top) / s;
      const inside = x >= 1196 && y >= 0 && y <= 746;
      if (!inside) {
        if (active) {
          active = false;
          gsap.to(reveal, { autoAlpha: 0, duration: 0.3, overwrite: true });
        }
        return;
      }
      // screen y → canvas u (panel top is at -382 in stage coords)
      const u = CANVAS_W - (y + 382);
      const left = Math.max(0, ((u - HALF) / CANVAS_W) * 100);
      const right = Math.max(0, 100 - ((u + HALF) / CANVAS_W) * 100);
      if (!active) {
        active = true;
        gsap.set(reveal, { clipPath: `inset(0 ${right}% ${WINDOW.bottom}% ${left}%)` });
        gsap.to(reveal, { autoAlpha: 1, duration: 0.25, overwrite: true });
      } else {
        gsap.to(reveal, { clipPath: `inset(0 ${right}% ${WINDOW.bottom}% ${left}%)`, duration: 0.2, ease: "power2.out", overwrite: "auto" });
      }
    });
    hero.addEventListener("pointerleave", () => {
      active = false;
      gsap.to(reveal, { autoAlpha: 0, duration: 0.3, overwrite: true });
    });
  }

  return { entrance, finish };
}
