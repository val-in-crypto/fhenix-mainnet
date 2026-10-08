import { gsap } from "./motion.js";

/**
 * Word-by-word reveal. Splits the element's text into <span class="word">
 * wrappers and returns a GSAP timeline that types them in order.
 * Pass { cursor: true } for a terminal block cursor that follows the
 * last typed word and blinks a few times once done.
 */
export function splitWords(el) {
  if (el.dataset.split) return [...el.querySelectorAll(".word")];
  const text = el.textContent.trim();
  el.textContent = "";
  const words = text.split(/\s+/).map((w, i, arr) => {
    const span = document.createElement("span");
    span.className = "word";
    span.textContent = w;
    el.appendChild(span);
    if (i < arr.length - 1) el.appendChild(document.createTextNode(" "));
    return span;
  });
  el.dataset.split = "1";
  return words;
}

export function typeWords(el, { stagger = 0.055, cursor = false, rise = 10 } = {}) {
  const words = splitWords(el);
  const tl = gsap.timeline();

  let cur = null;
  if (cursor) {
    cur = document.createElement("span");
    cur.className = "cursor";
    cur.setAttribute("aria-hidden", "true");
    el.appendChild(cur);
    gsap.set(cur, { autoAlpha: 0 });
    tl.set(cur, { autoAlpha: 1 }, 0);
  }

  tl.fromTo(
    words,
    { autoAlpha: 0, y: rise },
    { autoAlpha: 1, y: 0, duration: 0.35, ease: "power3.out", stagger },
    0
  );

  if (cur) {
    // keep the cursor at the end of the flow while typing, then blink out
    const typingEnd = stagger * (words.length - 1) + 0.35;
    tl.to(cur, { autoAlpha: 0, duration: 0.01, delay: 2.4, ease: "none" }, typingEnd);
  }

  return tl;
}

export function showWordsInstantly(el) {
  const words = splitWords(el);
  gsap.set(words, { autoAlpha: 1, y: 0 });
}
