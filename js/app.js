/* js/app.js
   Requires anime.js included in the page <head>.
   Handles starfield, background object motion, parallax, UI interactions.
*/

// tiny helpers
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const rand = (a,b) => a + Math.random()*(b-a);

// ---------- starfield canvas ----------
(function starfield(){
  const canvas = document.getElementById('stars');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let W=canvas.width=innerWidth, H=canvas.height=innerHeight;
  window.addEventListener('resize', ()=>{ W=canvas.width=innerWidth; H=canvas.height=innerHeight; });

  const stars = [];
  for(let i=0;i<420;i++){
    stars.push({x:Math.random()*W, y:Math.random()*H, r:rand(0.3,1.6), tw:rand(1.5,4), a:rand(0.2,1)});
  }

  function frame(t){
    ctx.clearRect(0,0,W,H);
    for(const s of stars){
      const alpha = s.a * (0.5 + 0.5*Math.sin(t/s.tw + s.x*0.001));
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill();
      // slow drift
      s.y += 0.02;
      if(s.y > H) s.y = 0;
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

// ---------- floating background objects using anime.js ----------
(function bgObjects(){
  const svg = document.getElementById('bg-objects');
  if(!svg) return;
  svg.setAttribute('viewBox','0 0 100 100');
  svg.style.position='fixed'; svg.style.inset=0;
  // create a few groups (rocket, planet, star) using basic shapes
  function make(type,x,y,scale){
    const g = document.createElementNS('http://www.w3.org/2000/svg','g');
    g.setAttribute('transform',`translate(${x},${y}) scale(${scale})`);
    g.setAttribute('opacity','0.12');
    if(type==='rocket'){
      g.innerHTML = `<path d="M2 2 L6 2 L8 6 L6 10 L2 10 L0 6 Z" fill="#ff88ff"/>`;
    } else if(type==='planet'){
      g.innerHTML = `<circle cx="6" cy="6" r="5" fill="#00f0ff"/>`;
    } else {
      g.innerHTML = `<circle cx="3" cy="3" r="1.2" fill="#fff"/>`;
    }
    svg.appendChild(g);
    return g;
  }
  const things = [ make('rocket',10,20,1.8), make('planet',78,30,2.2), make('star',48,70,1.0), make('rocket',20,78,1.2) ];
  things.forEach((el,i)=>{
    anime({
      targets: el,
      translateX: [{value: '+=' + rand(2,8), duration: rand(8000,12000)}, {value: '-=' + rand(2,8), duration: rand(8000,12000)}],
      translateY: [{value: '+=' + rand(2,8), duration: rand(8000,12000)}, {value: '-=' + rand(2,8), duration: rand(8000,12000)}],
      rotate: rand(-10,10),
      easing: 'easeInOutSine',
      direction: 'alternate',
      loop: true,
    });
  });
})();

// ---------- floating widgets entrance ----------
(function entrance(){
  const nodes = $$('.card, .project-card, .quick, .member, .extra');
  anime.timeline().add({
    targets: nodes,
    translateY: [18,0],
    opacity: [0,1],
    delay: anime.stagger(60),
    duration: 700,
    easing: 'easeOutCubic'
  });
})();

// ---------- parallax based on mouse ----------
(function parallax(){
  const neb = document.getElementById('nebula');
  const objs = document.getElementById('bg-objects');
  const stars = document.getElementById('stars');
  document.addEventListener('mousemove', (e)=>{
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    if(neb) neb.style.transform = `translate(${x*6}px, ${y*6}px)`;
    if(objs) objs.style.transform = `translate(${x*10}px, ${y*10}px)`;
    if(stars) stars.style.transform = `translate(${x*2}px, ${y*2}px)`;
  }, {passive:true});
})();

// ---------- hover tips (delegated) ----------
(function hoverTips(){
  document.body.addEventListener('mouseover', (ev)=>{
    const el = ev.target.closest('[data-tip]');
    if(!el) return;
    let tip = document.createElement('div');
    tip.className = 'hover-tip';
    tip.style.position = 'fixed';
    tip.style.left = (ev.pageX + 12) + 'px';
    tip.style.top = (ev.pageY + 8) + 'px';
    tip.style.padding = '8px 12px';
    tip.style.borderRadius = '8px';
    tip.style.background = 'linear-gradient(90deg,#00f0ff,#ff00c8)';
    tip.style.color = '#07121a';
    tip.style.fontWeight = '700';
    tip.style.zIndex = '9999';
    tip.innerText = el.dataset.tip;
    document.body.appendChild(tip);
    function remove(){ tip.remove(); el.removeEventListener('mouseleave', remove); document.removeEventListener('mousemove', move); }
    function move(e){ tip.style.left = (e.pageX + 12) + 'px'; tip.style.top = (e.pageY + 8) + 'px'; }
    el.addEventListener('mouseleave', remove, {once:true});
    document.addEventListener('mousemove', move);
  });
})();

// ---------- theme toggle ----------
(function themeToggle(){
  const toggle = document.getElementById('theme-toggle');
  if(!toggle) return;
  toggle.addEventListener('click', ()=>{
    document.documentElement.classList.toggle('alt-theme');
    anime({
      targets: '.brand-title',
      scale: [1,1.06,1],
      duration: 500,
      easing: 'easeOutCubic'
    });
  });
})();

