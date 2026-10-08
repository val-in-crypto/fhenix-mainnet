import { reducedMotion } from "./motion.js";

/**
 * Everything below the hero: scroll reveals, section-label decode,
 * live-strip counters, the dual-mode wallet demo, the two game teasers,
 * the mobile sticky CTA, the hidden genesis slot and the analytics stub.
 */
const SCRAMBLE = "!^*()_+=-{}[]|:;<>?,.~`abcdefghijklmnopqrstuvwxyz0123456789#";
const rand = () => SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)];
const HEX = "0123456789abcdef";
const hex = () => HEX[Math.floor(Math.random() * HEX.length)];

const qa = (s, root = document) => [...root.querySelectorAll(s)];

/* ---------- section labels decode as they enter ---------- */
function scrambleIn(el, charDelay = 38) {
  const text = el.dataset.text ?? (el.dataset.text = el.textContent);
  const n = text.length;
  let reveal = 0;
  const tick = () => {
    if (document.documentElement.classList.contains("motion-paused")) return;
    let out = "";
    for (let i = 0; i < n; i++) out += i < reveal ? text[i] : text[i] === " " ? " " : rand();
    el.textContent = out;
    if (reveal++ <= n) setTimeout(tick, charDelay);
  };
  tick();
}

/* ---------- corner markers ---------- */
function corners() {
  qa("[data-corners]").forEach((el) => {
    ["tl", "tr", "bl", "br"].forEach((p) => {
      const i = document.createElement("i");
      i.className = `corner corner--${p}`;
      i.setAttribute("aria-hidden", "true");
      el.appendChild(i);
    });
  });
}

/* ---------- scroll reveal ---------- */
function reveals() {
  const items = qa("[data-reveal]");
  const finish = (el) => {
    el.classList.add("is-in");
    qa("[data-scramble]", el).forEach((s) => (reducedMotion ? (s.textContent = s.dataset.text ?? s.textContent) : scrambleIn(s)));
  };
  if (reducedMotion || !("IntersectionObserver" in window)) {
    items.forEach(finish);
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const siblings = qa(":scope > [data-reveal]", el.parentElement);
        el.style.transitionDelay = `${Math.max(0, siblings.indexOf(el)) * 70}ms`;
        finish(el);
        io.unobserve(el);
      });
    },
    { rootMargin: "0px 0px -4% 0px", threshold: 0.01 }
  );
  items.forEach((i) => io.observe(i));
}

/* ---------- live strip counters ---------- */
function counters() {
  const els = qa("[data-count]");
  if (!els.length) return;
  const run = (el) => {
    const to = Number(el.dataset.count);
    if (reducedMotion) return (el.textContent = to);
    const t0 = performance.now();
    const dur = 900;
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(
    (en) => en.forEach((e) => e.isIntersecting && (run(e.target), io.unobserve(e.target))),
    { threshold: 0.5 }
  );
  els.forEach((el) => io.observe(el));
}

/* ---------- dual-mode wallet demo ---------- */
function wallet() {
  const root = document.querySelector("[data-wallet]");
  if (!root) return;
  const opts = qa(".wallet__opt", root);
  const bal = root.querySelector("[data-balance]");
  const amt = root.querySelector("[data-amount]");
  const note = root.querySelector("[data-note]");
  const BAL = "1,506.88";
  const AMT = "475.56";
  const mask = (s) => s.replace(/[0-9]/g, hex);

  let mode = "public";
  let timer = null;
  let auto = null;
  let touched = false;

  const set = (m) => {
    mode = m;
    root.dataset.mode = m;
    opts.forEach((o) => {
      const on = o.dataset.mode === m;
      o.classList.toggle("is-on", on);
      o.setAttribute("aria-selected", String(on));
    });
    clearInterval(timer);
    if (m === "confidential") {
      const tick = () => {
    if (document.documentElement.classList.contains("motion-paused")) return;
        bal.textContent = mask(BAL);
        amt.textContent = `- ${mask(AMT)}`;
      };
      tick();
      if (!reducedMotion) timer = setInterval(tick, 90);
      note.innerHTML = "Confidential mode — balances encrypted onchain with <b>FHE</b>.";
    } else {
      bal.textContent = BAL;
      amt.textContent = `- ${AMT}`;
      note.innerHTML = "Public mode — balances visible onchain, like any <b>ERC-20</b>.";
    }
  };

  const stopAuto = () => {
    touched = true;
    clearInterval(auto);
    auto = null;
  };

  opts.forEach((o) =>
    o.addEventListener("click", () => {
      stopAuto();
      set(o.dataset.mode);
    })
  );

  qa("[data-wallet-try]").forEach((b) =>
    b.addEventListener("click", (e) => {
      e.preventDefault();
      stopAuto();
      set(mode === "public" ? "confidential" : "public");
      root.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
    })
  );

  // self-running demo until someone touches it
  if (!reducedMotion) {
    const io = new IntersectionObserver(
      (en) => {
        if (en[0].isIntersecting && !touched && !auto) {
          auto = setInterval(() => set(mode === "public" ? "confidential" : "public"), 3200);
        } else if (!en[0].isIntersecting) {
          clearInterval(auto);
          auto = null;
        }
      },
      { threshold: 0.5 }
    );
    io.observe(root);
  }

  set("public");
}

/* ---------- game teasers ---------- */
const FACES = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };

function dice() {
  const dies = qa("[data-die]");
  const section = document.querySelector(".play");
  if (!dies.length || !section) return;
  const show = (d, n) => qa("i", d).forEach((p, i) => p.classList.toggle("on", FACES[n].includes(i)));
  const face = () => 1 + Math.floor(Math.random() * 6);
  dies.forEach((d) => show(d, face()));
  if (reducedMotion) return;

  const roll = () => {
    dies.forEach((d) => {
      d.classList.add("rolling");
      let k = 0;
      const iv = setInterval(() => {
        show(d, face());
        if (++k > 6) {
          clearInterval(iv);
          d.classList.remove("rolling");
        }
      }, 70);
    });
  };
  let rollTimer = null;
  let hiddenTimer = null;
  const hidden = dies.find((d) => d.classList.contains("die--hidden"));
  const io = new IntersectionObserver(
    (en) => {
      if (en[0].isIntersecting) {
        if (!rollTimer) rollTimer = setInterval(roll, 2800);
        if (hidden && !hiddenTimer) hiddenTimer = setInterval(() => show(hidden, face()), 140);
      } else {
        clearInterval(rollTimer);
        clearInterval(hiddenTimer);
        rollTimer = hiddenTimer = null;
      }
    },
    { threshold: 0.2 }
  );
  io.observe(section);
}

function hunt() {
  const el = document.querySelector("[data-hunt]");
  if (!el) return;
  const N = 36;
  const cells = Array.from({ length: N }, () => el.appendChild(document.createElement("i")));
  let target = Math.floor(Math.random() * N);
  let beat = 0;

  el.addEventListener("click", (e) => {
    const i = cells.indexOf(e.target);
    if (i < 0) return;
    if (i === target) {
      cells[i].classList.add("found");
      target = Math.floor(Math.random() * N);
      setTimeout(() => cells[i].classList.remove("found"), 1200);
    } else {
      cells[i].classList.add("miss");
      setTimeout(() => cells[i].classList.remove("miss"), 600);
    }
  });

  if (reducedMotion) return;
  const tick = () => {
    if (document.documentElement.classList.contains("motion-paused")) return;
    cells.forEach((c) => c.classList.remove("flicker", "pulse"));
    for (let k = 0; k < 5; k++) cells[Math.floor(Math.random() * N)].classList.add("flicker");
    if (++beat % 10 === 0) cells[target].classList.add("pulse");
  };
  let iv = null;
  const io = new IntersectionObserver(
    (en) => {
      if (en[0].isIntersecting) {
        if (!iv) iv = setInterval(tick, 260);
      } else {
        clearInterval(iv);
        iv = null;
      }
    },
    { threshold: 0.2 }
  );
  io.observe(el);
}

/* ---------- mobile sticky CTA ---------- */
function sticky() {
  const bar = document.querySelector("[data-sticky]");
  const hero = document.querySelector(".hero");
  if (!bar || !hero) return;
  const io = new IntersectionObserver((en) => bar.classList.toggle("is-visible", !en[0].isIntersecting), { threshold: 0 });
  io.observe(hero);
}

/* ---------- genesis slot preview: add ?genesis to the URL ---------- */
function genesis() {
  const slot = document.getElementById("genesis");
  if (slot && (new URLSearchParams(location.search).has("genesis") || location.hash === "#genesis")) slot.hidden = false;
}

/* ---------- analytics stub: every CTA carries data-event ---------- */
function events() {
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-event]");
    if (!t) return;
    (window.dataLayer = window.dataLayer || []).push({ event: t.dataset.event, label: t.textContent.trim() });
    if (import.meta.env.DEV) console.info("[event]", t.dataset.event, t.textContent.trim());
  });
}

export function initSections() {
  corners();
  reveals();
  counters();
  wallet();
  dice();
  hunt();
  sticky();
  genesis();
  events();
}
