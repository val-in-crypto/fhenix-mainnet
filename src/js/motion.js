import { gsap } from "gsap";

export const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const isTouch = window.matchMedia("(hover: none)").matches;

export { gsap };
