document.querySelectorAll('[data-year]').forEach((node)=>{node.textContent=new Date().getFullYear();});

const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('[data-carousel]').forEach((scroller)=>{
  const track=scroller.querySelector('.carousel-track');
  if(!track||reduceMotion)return;
  [...track.children].forEach((item)=>{const clone=item.cloneNode(true);clone.setAttribute('aria-hidden','true');clone.querySelectorAll('img').forEach((img)=>img.alt='');track.append(clone);});
  const speed=Number(scroller.dataset.speed||42);
  let resumeAt=0,last=performance.now(),initialized=false;
  const pause=()=>{resumeAt=performance.now()+3500;};
  ['pointerdown','pointerup','pointercancel','touchstart','touchend','wheel','keydown'].forEach((event)=>scroller.addEventListener(event,pause,{passive:true}));
  const tick=(now)=>{const half=track.scrollWidth/2;if(half>0&&!initialized){scroller.scrollLeft=half;initialized=true;}if(now>=resumeAt&&half>0)scroller.scrollLeft-=speed*(now-last)/1000;if(scroller.scrollLeft<=0)scroller.scrollLeft+=half;last=now;requestAnimationFrame(tick);};
  requestAnimationFrame(tick);
  document.addEventListener('visibilitychange',()=>{last=performance.now();});
});
