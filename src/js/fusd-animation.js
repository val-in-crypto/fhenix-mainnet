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
  for (let i = 0; i < 32; i++) {
    const coin = document.createElementNS(ns, 'g');
    coin.innerHTML = '<ellipse rx="17" ry="10" fill="#8c9aa2" fill-opacity=".75" stroke="#dbe7eb" stroke-opacity=".55"/><text text-anchor="middle" dominant-baseline="central" fill="white" font-family="Arial, sans-serif" font-size="24" font-weight="700">$</text>';
    q('.fusd-coins').append(coin);
    coins.push(coin);
    starts.push({ x: 30 + (i * 137 % 710), y: 35 + (i * 79 % 320), rotation: (i * 47 % 150) - 75 });
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
    gsap.set(coins, { x: i => starts[i].x, y: i => starts[i].y, rotation: i => starts[i].rotation, opacity: 1, scale: 1, transformOrigin: '50% 50%' });
    gsap.set(layers, { opacity: 0, y: 0, scale: 1, transformOrigin: '50% 50%' });
    gsap.set([cover, announcement], { opacity: 0, y: 0 });
    gsap.set(caption, { opacity: 1 });
    gsap.set(blur, { attr: { stdDeviation: 0 } });
    if (reduced.matches) {
      gsap.set(coins, { opacity: 0 });
      gsap.set(layers, { opacity: 1 });
      gsap.set([cover, announcement], { opacity: 1 });
      gsap.set(caption, { opacity: 0 });
      gsap.set(blur, { attr: { stdDeviation: 6 } });
      return;
    }
    timeline = gsap.timeline({ paused: true, repeat: -1, repeatDelay: .5 });
    timeline.to(coins, {
      x: i => starts[i].x + Math.sin(i * 1.7) * 24,
      y: i => starts[i].y + Math.cos(i * 1.3) * 20,
      rotation: i => starts[i].rotation + 25,
      duration: 2, ease: 'sine.inOut', repeat: 1, yoyo: true,
    }, 0);
    // Loose coins gather, then flow into the foundation before the layers settle.
    timeline.to(coins, {
      x: i => 400 + Math.cos(i * 2.39996) * (70 + i * 3),
      y: i => 250 + Math.sin(i * 2.39996) * (45 + i * 2),
      rotation: i => starts[i].rotation + 180,
      duration: 1.8, ease: 'power2.inOut', stagger: .018,
    }, 3.7);
    timeline.to(caption, { opacity: 0, duration: .6 }, 5.7);
    timeline.to(coins, { x: 400, y: 335, scale: .1, opacity: 0, rotation: '+=100', duration: 1, stagger: .025, ease: 'power2.in' }, 5.8);
    timeline.fromTo(layers[0], { scale: .3, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: 'power2.out' }, 6.1);
    timeline.fromTo(layers[1], { y: -90, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }, 7.2);
    timeline.fromTo(layers[2], { y: -105, opacity: 0 }, { y: 0, opacity: 1, duration: 1.4, ease: 'power3.out' }, 8.2);
    timeline.fromTo(cover, { y: -100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: 'power2.inOut' }, 10.3);
    timeline.to(blur, { attr: { stdDeviation: 6 }, duration: 1.2, ease: 'power2.inOut' }, 10.6);
    timeline.fromTo(announcement, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: 'power2.out' }, 11.5);
    // Readable final hold, then a soft reset to the drifting coin field.
    timeline.to([cover, announcement, ...layers], { opacity: 0, duration: .8 }, 15.5);
    timeline.set(blur, { attr: { stdDeviation: 0 } }, 16.3);
    timeline.set(coins, { x: i => starts[i].x, y: i => starts[i].y, rotation: i => starts[i].rotation, scale: 1 }, 16.3);
    timeline.to(coins, { opacity: 1, duration: .7 }, 16.3);
    timeline.to(caption, { opacity: 1, duration: .7 }, 16.3);
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
  build();
}
