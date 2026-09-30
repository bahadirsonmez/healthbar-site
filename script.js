document.querySelectorAll('[data-year]').forEach((node)=>{node.textContent=new Date().getFullYear();});

const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('[data-carousel]').forEach((scroller)=>{
  const track=scroller.querySelector('.carousel-track');
  if(!track||reduceMotion)return;
  [...track.children].forEach((item)=>{const clone=item.cloneNode(true);clone.setAttribute('aria-hidden','true');clone.querySelectorAll('img').forEach((img)=>img.alt='');track.append(clone);});
  const speed=Number(scroller.dataset.speed||55);
  let resumeAt=0,last=performance.now();
  const pause=()=>{resumeAt=performance.now()+3500;};
  ['pointerdown','pointerup','pointercancel','touchstart','touchend','wheel','keydown'].forEach((event)=>scroller.addEventListener(event,pause,{passive:true}));
  const tick=(now)=>{const half=track.scrollWidth/2;if(now>=resumeAt&&half>0)scroller.scrollLeft+=speed*(now-last)/1000;if(scroller.scrollLeft>=half)scroller.scrollLeft-=half;last=now;requestAnimationFrame(tick);};
  requestAnimationFrame(tick);
  document.addEventListener('visibilitychange',()=>{last=performance.now();});
});

// ---- Header, menu overlay and scroll reveals (Handsome Frank-style motion) ----
document.documentElement.classList.add('js');
(()=>{
  const header=document.querySelector('header.nav');
  const toggle=document.querySelector('[data-nav-toggle]');
  const nav=document.querySelector('[data-nav]');
  if(header){
    const dark=[...document.querySelectorAll('.hero, .watch, footer')];
    const update=()=>{const y=40;const over=dark.some(el=>{const r=el.getBoundingClientRect();return r.top<=y&&r.bottom>=y;});header.classList.toggle('on-light',!over);};
    update();window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);
  }
  if(toggle&&nav){
    const set=open=>{nav.classList.toggle('open',open);header.classList.toggle('nav-open',open);document.body.classList.toggle('nav-locked',open);toggle.setAttribute('aria-expanded',String(open));};
    toggle.addEventListener('click',()=>set(!nav.classList.contains('open')));
    nav.addEventListener('click',e=>{if(e.target.closest('a'))set(false);});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')set(false);});
  }
  const targets=document.querySelectorAll('.section-title, .steps article, .promo, .showcase, .ai > *, .anywhere > *, .medical, .support > *, .prose > *, .faq > *');
  targets.forEach(el=>{el.setAttribute('data-reveal','');const i=[...el.parentElement.children].indexOf(el);el.style.setProperty('--d',Math.min(i,3)*0.08+'s');});
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:0,rootMargin:'0px 0px -4% 0px'});
    targets.forEach(el=>io.observe(el));
  }else targets.forEach(el=>el.classList.add('in'));
})();
