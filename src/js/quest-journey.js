/** The quest line follows reading position, so scrolling back reverses the motion. */
export function initQuestJourney() {
  const journey = document.querySelector('.quest-journey');
  if (!journey) return;
  const steps = [...journey.querySelectorAll('.step')];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  const update = () => {
    frame = 0;
    if (document.documentElement.classList.contains('motion-paused') && !reduced.matches) return;
    const box = journey.getBoundingClientRect();
    const first = steps[0].offsetTop + steps[0].offsetHeight / 2;
    const last = steps.at(-1).offsetTop + steps.at(-1).offsetHeight / 2;
    const position = Math.max(first, Math.min(last, innerHeight * .56 - box.top));
    journey.style.setProperty('--journey-start', `${first}px`);
    journey.style.setProperty('--journey-length', `${last - first}px`);
    journey.style.setProperty('--journey-progress', `${position - first}px`);
    steps.forEach((step, index) => {
      const center = step.offsetTop + step.offsetHeight / 2;
      const distance = Math.abs(position - center) / step.offsetHeight;
      step.classList.toggle('is-current', distance < .5);
      step.classList.toggle('is-passed', position >= center);
      step.style.setProperty('--step-opacity', reduced.matches ? 1 : Math.max(.35, 1 - distance * .55));
      step.style.setProperty('--step-shift', reduced.matches ? '0px' : `${Math.min(12, distance * 9)}px`);
      step.dataset.step = String(index + 1).padStart(2, '0');
    });
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  reduced.addEventListener('change', schedule);
  new ResizeObserver(schedule).observe(journey);
  new MutationObserver(schedule).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  update();
}
