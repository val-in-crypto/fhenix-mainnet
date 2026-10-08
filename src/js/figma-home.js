import { gsap } from './motion.js';
import { initQuestJourney } from './quest-journey.js';

export function initFigmaHome() {
  initQuestJourney();
  // Scale the editable 720 × 708 Figma composition, preserving SVG geometry.
  const tokenScene = document.querySelector('[data-token-scene]');
  if (tokenScene) {
    const viewport = tokenScene.parentElement;
    const fit = () => tokenScene.style.setProperty('--token-scale', viewport.clientWidth / 720);
    new ResizeObserver(fit).observe(viewport);
    fit();
  }
  const quantumArtwork = document.querySelector('.quantum__visual');
  if (quantumArtwork) {
    const observer = new IntersectionObserver(([entry]) => {
      quantumArtwork.classList.toggle('is-animating', entry.isIntersecting);
    }, { threshold: 0.15 });
    observer.observe(quantumArtwork);
  }
  const developer = document.querySelector('.nav__link--menu');
  const menu = document.createElement('div');
  menu.className = 'developer-menu';
  menu.id = 'developer-resources';
  menu.hidden = true;
  menu.innerHTML = '<a href="https://cofhe-docs.fhenix.zone/">Documentation ↗</a><a href="https://github.com/FhenixProtocol">GitHub ↗</a><a href="#dapps">Explore dApps ↓</a>';
  developer.after(menu);
  developer.setAttribute('aria-controls',menu.id);
  developer.addEventListener('click',()=>{menu.hidden=!menu.hidden;developer.setAttribute('aria-expanded',String(!menu.hidden));});
  document.addEventListener('click',e=>{if(!menu.contains(e.target)&&!developer.contains(e.target)){menu.hidden=true;developer.setAttribute('aria-expanded','false');}});
  const mobile = document.createElement('button');
  mobile.className='mobile-toggle'; mobile.setAttribute('aria-label','Navigation menu'); mobile.textContent='Menu'; mobile.setAttribute('aria-expanded','false');
  document.querySelector('.nav__links').id='primary-links';
  mobile.setAttribute('aria-controls','primary-links');
  document.querySelector('.btn--nav').before(mobile);
  mobile.addEventListener('click',()=>{const open=document.querySelector('.nav__links').classList.toggle('is-open');mobile.setAttribute('aria-expanded',String(open));mobile.textContent=open?'Close':'Menu';});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.hidden=true;developer.setAttribute('aria-expanded','false');document.querySelector('.nav__links').classList.remove('is-open');mobile.setAttribute('aria-expanded','false');mobile.textContent='Menu';}});

  const dialog=document.querySelector('.preview-dialog');
  document.addEventListener('click',e=>{
    const link=e.target.closest('a');
    if(!link)return;
    if(link.hasAttribute('data-preview')||link.getAttribute('href')==='#'){
      e.preventDefault();
      const waitlist=link.dataset.preview==='waitlist';
      document.querySelector('#preview-title').textContent=waitlist?'Join the Fhenix waitlist':'Coming with mainnet';
      document.querySelector('#preview-copy').textContent=waitlist?'The waitlist connection is awaiting the final destination from the team. Follow Fhenix for launch updates.':'This design preview preserves the product entry points from Figma. Live dApp, game and quest destinations will be connected when supplied by the team.';
      dialog.showModal();
    }
  });
  document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  const pause=document.createElement('button');
  pause.className='motion-toggle';pause.textContent='Ⅱ';pause.setAttribute('aria-label','Pause animations');pause.setAttribute('aria-pressed','false');
  document.body.append(pause);
  pause.addEventListener('click',()=>{const paused=document.documentElement.classList.toggle('motion-paused');gsap.globalTimeline.paused(paused);pause.textContent=paused?'▶':'Ⅱ';pause.setAttribute('aria-pressed',String(paused));pause.setAttribute('aria-label',paused?'Resume animations':'Pause animations');});
}
