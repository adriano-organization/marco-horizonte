export function galleryMarkup(data, esc) {
  return `<div class="horizon-gallery" role="region" aria-roledescription="${esc(data.tipo)}" aria-label="${esc(data.titulo)}" tabindex="0">
    <div class="gallery-stage">${data.fotos.map((p,i)=>`<figure class="horizon-slide ${i===0?'is-active':''}" aria-hidden="${i!==0}"><div class="photo-window"><img src="${esc(p.src)}" alt="${esc(p.alt)}" loading="lazy" class="${p.recorte?'crop-instagram':''}"></div><figcaption>${esc(p.legenda)}</figcaption></figure>`).join('')}</div>
    <div class="gallery-controls"><div class="gallery-arrows"><button type="button" data-gallery="previous" aria-label="${esc(data.anterior)}">←</button><button type="button" data-gallery="next" aria-label="${esc(data.seguinte)}">→</button></div><span class="gallery-count" aria-live="off"></span><button class="gallery-pause" type="button" data-gallery="pause"></button></div><div class="gallery-progress" aria-hidden="true"><span></span></div><span class="sr-only gallery-announcement" aria-live="polite"></span></div>`;
}
export function initGallery(data) {
 const el=document.querySelector('.horizon-gallery');if(!el)return;
 const slides=[...el.querySelectorAll('.horizon-slide')], pause=el.querySelector('[data-gallery="pause"]'), progress=el.querySelector('.gallery-progress span');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');let index=0, timer, paused=reduce.matches, hovered=false, focused=false, visible=false, startX=null;
 const delay=Math.max(4000,Number(data.intervalo)||6000);
 function schedule(){clearTimeout(timer);progress.style.animation='none';if(paused||hovered||focused||!visible||document.hidden||reduce.matches)return;requestAnimationFrame(()=>{progress.style.animation=`galleryTimer ${delay}ms linear forwards`;});timer=setTimeout(()=>{show(index+1);schedule();},delay);}
 function label(){pause.textContent=paused?data.retomar:data.pausar;pause.setAttribute('aria-pressed',String(paused));}
 function show(next,manual=false){index=(next+slides.length)%slides.length;slides.forEach((slide,i)=>{slide.classList.toggle('is-active',i===index);slide.setAttribute('aria-hidden',String(i!==index));});el.querySelector('.gallery-count').textContent=`${String(index+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;if(manual){el.querySelector('.gallery-announcement').textContent=slides[index].querySelector('img').alt;schedule();}}
 el.querySelector('[data-gallery="previous"]').onclick=()=>show(index-1,true);el.querySelector('[data-gallery="next"]').onclick=()=>show(index+1,true);
 pause.onclick=()=>{paused=!paused;label();schedule();};
 el.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();show(index+(event.key==='ArrowRight'?1:-1),true);}});
 el.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'){hovered=true;schedule();}});el.addEventListener('pointerleave',()=>{hovered=false;schedule();});
 el.addEventListener('focusin',()=>{focused=true;schedule();});el.addEventListener('focusout',event=>{focused=el.contains(event.relatedTarget);schedule();});
 el.addEventListener('touchstart',event=>{startX=event.touches[0].clientX;},{passive:true});el.addEventListener('touchend',event=>{if(startX!==null&&Math.abs(event.changedTouches[0].clientX-startX)>50)show(index+(event.changedTouches[0].clientX<startX?1:-1),true);startX=null;},{passive:true});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{threshold:.25}).observe(el);
 document.addEventListener('visibilitychange',schedule);reduce.addEventListener('change',()=>{paused=reduce.matches;label();schedule();});show(0);label();
}
