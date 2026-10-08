const root = document.querySelector('.experience');
const balance = root.querySelector('[data-balance]');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let scrambleTimer;
let confidential = false;
const announce = root.querySelector('[data-mode-status]');
function setMode(mode) {
  confidential = mode === 'confidential';
  root.dataset.mode = mode;
  root.querySelectorAll('[data-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mode === mode)));
  clearInterval(scrambleTimer);
  balance.textContent = confidential ? '••••.••' : '1,506.88';
  if (confidential && !reduced.matches) {
    let frame = 0;
    scrambleTimer = setInterval(() => {
      balance.textContent = Array.from({length:7}, (_,i) => i===4 ? '.' : '01*#'[Math.floor(Math.random()*4)]).join('');
      if (++frame >= 9) { clearInterval(scrambleTimer); balance.textContent = '••••.••'; }
    }, 35);
  }
  root.querySelector('[data-transfer]').textContent = confidential ? '••••.•• USDC ↗' : '475.56 USDC ↗';
  root.querySelector('.account-status').textContent = confidential ? 'Confidential' : 'Visible';
  root.querySelector('[data-visibility]').textContent = confidential ? 'Balance hidden in this demo.' : 'Anyone can see this balance.';
  announce.textContent = confidential ? 'Confidential demo selected. Balance and transfer amount hidden.' : 'Public demo selected. Balance 1,506.88 USDC. Transfer 475.56 USDC.';
  document.querySelector('[data-switch-hero]').innerHTML = confidential ? 'Switch back to public <span>↗</span>' : 'Try confidential mode <span>↗</span>';
  if (confidential) {
    document.querySelector('.check-box').classList.add('done');
    document.querySelector('[data-check] small').textContent = 'Done — you explored both modes';
  }
  (window.dataLayer ||= []).push({event:'demo_mode_change', mode});
}
root.querySelectorAll('button[data-mode]').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
document.querySelector('[data-switch-hero]').addEventListener('click', () => setMode(confidential ? 'public' : 'confidential'));
document.querySelector('[data-check]').addEventListener('click', () => {
  document.getElementById('experience').scrollIntoView({behavior: reduced.matches ? 'instant' : 'smooth'});
  setMode('confidential');
});
const art = document.querySelector('.pixel-art');
for (let y=0;y<15;y++) for(let x=0;x<17;x++) {
  const cell=document.createElement('i');
  const dx=x-8, dy=y-7;
  cell.style.opacity = ((Math.abs(dx)<2 || Math.abs(dy)<2 || Math.abs(dx-dy)<2 || Math.abs(dx+dy)<2) && Math.abs(dx)+Math.abs(dy)<11) ? '1' : '0';
  art.append(cell);
}
const cipher=document.querySelector('.cipher-grid');
for(let i=0;i<189;i++) {const cell=document.createElement('i');cell.style.opacity=((i*13+7)%11)/10;cipher.append(cell);}
const menu=document.querySelector('.menu');
const nav=document.getElementById('navigation');
function closeMenu(){nav.classList.remove('is-open');menu.setAttribute('aria-expanded','false');menu.textContent='Menu +';menu.setAttribute('aria-label','Open navigation');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';nav.classList.toggle('is-open',open);menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'Close −':'Menu +';menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape' && menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
matchMedia('(min-width:1001px)').addEventListener('change', closeMenu);
const dialog=document.querySelector('dialog');
const content={
 trading:{title:'Keep your next move yours.',copy:'Confidential trading can protect order information from public view. This is a concept preview; partner applications and supported features will be announced through Fhenix’s official channels.'},
 payments:{title:'Value moves. Details stay yours.',copy:'Explore the idea of transferring value without publishing the amount to everyone. This is a concept preview, not a payment application. No funds are transferred here.'},
 games:{title:'What’s behind the question mark?',copy:'Roll a hidden die, then reveal it. This local demo illustrates hidden information; it is not an onchain game and makes no cryptographic fairness guarantee.'}
};
document.querySelectorAll('[data-preview]').forEach(button=>button.addEventListener('click',()=>{
 const key=button.dataset.preview;const entry=content[key];
 document.getElementById('dialog-title').textContent=entry.title;
 document.getElementById('dialog-copy').textContent=entry.copy;
 const interaction=document.getElementById('dialog-interaction');interaction.replaceChildren();
 if(key==='games'){
  let die=1+Math.floor(Math.random()*6), revealed=false;
  const game=document.createElement('div');game.className='dice-demo';
  const output=document.createElement('output');output.textContent='?';output.setAttribute('aria-label','Hidden die value');output.setAttribute('aria-live','polite');
  const action=document.createElement('button');action.className='button dark';action.textContent='Reveal the die ↗';
  action.addEventListener('click',()=>{if(revealed){die=1+Math.floor(Math.random()*6);output.textContent='?';output.setAttribute('aria-label','Hidden die value');action.textContent='Reveal the die ↗';}else{output.textContent=String(die);output.setAttribute('aria-label',`Die value: ${die}`);action.textContent='Roll again ↗';}revealed=!revealed;});
  game.append(output,action);interaction.append(game);
 }
 dialog.showModal();
 (window.dataLayer ||= []).push({event:'concept_preview_open',concept:key});
}));
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
