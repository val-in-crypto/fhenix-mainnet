/**
 * H1 scramble-decode. Same behaviour as fhenix.io today, with one
 * change: the word cycle ends and locks on "(mainnet)".
 *
 *   Each privacy word alternates with (mainnet); the final (mainnet) stays locked.
 *
 * After settling, letters react to pointer hover or touch, then restore mainnet.
 */
const SCRAMBLE = "!^*()_+=-{}[]|:;<>?,.~`abcdefghijklmnopqrstuvwxyz";
const STATIC = new Set(["(", ")", "*"]);

const rand = () => SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)];

export function createDecoder(el, options = {}) {
  const words = options.words ?? ["(confid*ntial)", "(mainnet)", "(pr*vate)", "(mainnet)", "(encrypt*d)", "(mainnet)", "(sh*elded)", "(mainnet)"];
  const charDelay = options.charDelay ?? 50; // ms per revealed character
  const hold = options.hold ?? 2000; // ms a word stays before the next decode
  const onWord = options.onWord ?? (() => {});
  const allowHover = options.hover ?? true;

  let index = 0;
  let target = words[0];
  let reveal = 0;
  let locked = false;
  let paused = false;
  let hoverIdx = null;
  let hoverTimer = null;
  let resumeTimer = null;
  let stepTimer = null;

  function render(word, upTo, hover = null) {
    el.closest('.h1')?.classList.toggle('h1--mainnet', word === '(mainnet)');
    let html = "";
    for (let i = 0; i < word.length; i++) {
      const ch = word[i];
      if (ch === "(" || ch === ")") {
        html += `<span class="h1__char h1__paren" data-i="${i}">${ch}</span>`;
      } else if (ch === "*") {
        html += `<span class="h1__char h1__char--star" data-i="${i}">${ch}</span>`;
      } else if (i === hover || i >= upTo) {
        html += `<span class="h1__char" data-i="${i}">${escape(rand())}</span>`;
      } else {
        html += `<span class="h1__char" data-i="${i}">${escape(ch)}</span>`;
      }
    }
    el.innerHTML = html;
  }

  const escape = (c) => (c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === "&" ? "&amp;" : c);

  // Keep the pending step when motion is paused or the tab is hidden.
  function schedule(action, delay) {
    stepTimer = setTimeout(function resume() {
      if (options.isPaused?.()) {
        stepTimer = setTimeout(resume, 100);
        return;
      }
      action();
    }, delay);
  }

  function step() {
    if (paused) return;
    if (reveal <= target.length) {
      render(target, reveal);
      reveal++;
      schedule(step, charDelay);
      return;
    }
    render(target, target.length);
    onWord(target, index, index === words.length - 1);
    if (index === words.length - 1) {
      locked = true;
      return;
    }
    schedule(() => {
      if (paused) return;
      index++;
      target = words[index];
      reveal = 0;
      step();
    }, hold);
  }

  function start() {
    render(target, 0);
    step();
  }

  function finish() {
    clearTimeout(stepTimer);
    stopHover();
    index = words.length - 1;
    target = words[index];
    locked = true;
    render(target, target.length);
  }

  // Keep character nodes stable while interacting so replacing the text
  // does not repeatedly trigger pointer enter/leave events.
  function stopHover() {
    clearInterval(hoverTimer);
    clearTimeout(resumeTimer);
    hoverTimer = null;
    resumeTimer = null;
    if (hoverIdx !== null) {
      const span = el.querySelector(`[data-i="${hoverIdx}"]`);
      if (span) span.textContent = target[hoverIdx];
    }
    hoverIdx = null;
  }

  function startHover(event) {
    if (!locked || options.isPaused?.()) return;
    const span = event.target.closest("[data-i]");
    if (!span || !el.contains(span)) return;
    const i = Number(span.dataset.i);
    if (STATIC.has(target[i])) return stopHover();
    if (hoverIdx === i) return;
    stopHover();
    hoverIdx = i;
    const tick = () => {
      if (options.isPaused?.()) return stopHover();
      // Only mutate the touched character; the final word stays intact.
      span.textContent = rand();
    };
    tick();
    hoverTimer = setInterval(tick, 80);
    if (event.pointerType === "touch") {
      resumeTimer = setTimeout(stopHover, 650);
    }
  }

  if (allowHover) {
    el.addEventListener("pointerover", event => {
      if (event.pointerType !== "touch") startHover(event);
    });
    el.addEventListener("pointermove", event => {
      if (event.pointerType !== "touch") startHover(event);
    });
    el.addEventListener("pointerdown", startHover);
    el.addEventListener("pointerleave", stopHover);
    el.addEventListener("pointercancel", stopHover);
  }

  return { start, finish, get locked() { return locked; } };
}
