import { gsap } from './motion.js';

export function initFusdAnimation() {
  const artwork = document.querySelector('.value__art--fusd');
  if (!artwork) return;
  const q = selector => artwork.querySelector(selector);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const coins = [];
  const starts = [];
  const ns = 'http://www.w3.org/2000/svg';
  // Deterministic positions keep the composition balanced between playbacks.
  for (let i = 0; i < 16; i++) {
    const coin = document.createElementNS(ns, 'g');
    coin.innerHTML = '<image href="/assets/fusd-figma/coin.svg" x="-28.5" y="-24.5" width="57" height="49"/>';
    q('.fusd-coins').append(coin);
    coins.push(coin);
    starts.push({ x: -690, y: 35 + (i * 79 % 320), rotation: (i * 47 % 110) - 55 });
  }
  const layers = [...artwork.querySelectorAll('.fusd-layer')];
  const blur = q('.fusd-blur');
  const cover = q('.fusd-cover');
  const announcement = q('.fusd-announcement');
  const caption = q('.fusd-caption');
  let visible = false;
  let timeline;

  function build() {
    timeline?.kill();
    gsap.set(coins, { x: i => starts[i].x, y: i => starts[i].y, rotation: i => starts[i].rotation, opacity: 1, scale: i => .72 + (i % 4) * .08, transformOrigin: '50% 50%' });
    gsap.set(layers, { opacity: 0, y: 0, scale: 1, transformOrigin: '50% 50%' });
    gsap.set([cover, announcement], { opacity: 0, y: 0 });
    gsap.set(caption, { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' });
    gsap.set(blur, { attr: { stdDeviation: 0 } });
    if (reduced.matches) {
      gsap.set(coins, { opacity: 0 });
      gsap.set(layers, { opacity: 1 });
      gsap.set([cover, announcement], { opacity: 1 });
      gsap.set(caption, { opacity: 0 });
      gsap.set(blur, { attr: { stdDeviation: 7.5 } });
      return;
    }
    timeline = gsap.timeline({ paused: true, repeat: -1, repeatDelay: .5 });
    // Measure the caption in SVG coordinates so the wipe follows the coins on mobile too.
    const artRect = artwork.getBoundingClientRect();
    const captionRect = caption.getBoundingClientRect();
    const unit = 800 / artRect.width;
    const left = (captionRect.left - artRect.left) * unit;
    const right = (captionRect.right - artRect.left) * unit;
    const middle = (captionRect.top - artRect.top + captionRect.height / 2) * unit;
    const spread = captionRect.height * unit / 2 + 12;
    const lane = i => middle + Math.sin(i * 2.39996) * spread;
    // A continuous stream: identical horizontal speed preserves the spacing.
    // No shared waypoint or hold that could collapse the coins into a cluster.
    const flightDuration = 4.2;
    const endX = 910;
    const flightWidth = endX - starts[0].x;
    coins.forEach((coin, i) => {
      const departure = i * .14;
      timeline.to(coin, { x: endX, duration: flightDuration, ease: 'none' }, departure);
      timeline.to(coin, { y: lane(i), duration: 2.2, ease: 'sine.inOut' }, departure);
      timeline.to(coin, {
        rotation: starts[i].rotation + (i % 2 ? 32 : -32),
        duration: flightDuration, ease: 'sine.inOut',
      }, departure);
      timeline.to(coin, { opacity: 0, duration: .25, ease: 'sine.out' }, departure + flightDuration - .25);
    });
    // The leading coin reveals the wipe edge as it crosses the caption.
    timeline.to(caption, {
      clipPath: 'inset(0% 0% 0% 100%)',
      duration: flightDuration * (right - left) / flightWidth,
      ease: 'none',
    }, flightDuration * (left - starts[0].x) / flightWidth);
    timeline.fromTo(layers[0], { scale: .3, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: 'power2.out' }, 6.4);
    timeline.fromTo(layers[1], { y: -90, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }, 7.3);
    timeline.fromTo(layers[2], { y: -105, opacity: 0 }, { y: 0, opacity: 1, duration: 1.4, ease: 'power3.out' }, 8.2);
    timeline.fromTo(cover, { y: -100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: 'power2.inOut' }, 9.8);
    timeline.to(blur, { attr: { stdDeviation: 7.5 }, duration: 1.2, ease: 'power2.inOut' }, 10.1);
    timeline.fromTo(announcement, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: 'power2.out' }, 11.0);
    // Readable final hold, then a soft reset to the drifting coin field.
    timeline.to([cover, announcement, ...layers], { opacity: 0, duration: .8 }, 14.9);
    timeline.set(blur, { attr: { stdDeviation: 0 } }, 15.7);
    timeline.set(coins, { x: i => starts[i].x, y: i => starts[i].y, rotation: i => starts[i].rotation, scale: i => .72 + (i % 4) * .08 }, 15.7);
    timeline.to(coins, { opacity: 1, duration: .7 }, 15.7);
    timeline.set(caption, { opacity: 0, clipPath: 'inset(0% 0% 0% 0%)' }, 15.7);
    timeline.to(caption, { opacity: 1, duration: .7 }, 15.7);
    timeline.timeScale(1.25);
    sync();
  }
  function sync() {
    if (!timeline || reduced.matches) return;
    timeline.paused(!visible || document.hidden || document.documentElement.classList.contains('motion-paused'));
  }
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: .2 }).observe(artwork);
  new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', build);
  new ResizeObserver(build).observe(artwork);
  build();
}
