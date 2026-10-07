import { esc as escape, safeUrl } from './utils.js?v=20261007-4';

export function galleryMarkup(data, esc = escape) {
  if (!Array.isArray(data?.fotos) || !data.fotos.length) return '';
  const count = data.fotos.length;
  return `<div class="horizon-gallery" role="region" aria-roledescription="${esc(data.tipo)}" aria-label="${esc(data.titulo)}" tabindex="0">
    <div class="gallery-stage">${data.fotos.map((photo, index) => `<figure class="horizon-slide ${index === 0 ? 'is-active' : ''}" role="group" aria-label="${index + 1} / ${count}" aria-hidden="${index !== 0}"><div class="photo-window"><img src="${esc(safeUrl(photo.src))}" alt="${esc(photo.alt)}"${photo.srcset?` srcset="${esc(photo.srcset)}" sizes="${esc(photo.sizes||'100vw')}"`:""}${photo.width&&photo.height?` width="${esc(photo.width)}" height="${esc(photo.height)}"`:""} loading="lazy" decoding="async" class="${photo.recorte ? 'crop-instagram' : ''}"></div><figcaption>${esc(photo.legenda)}</figcaption></figure>`).join('')}</div>
    <div class="gallery-controls"><div class="gallery-arrows"><button type="button" data-gallery="previous" aria-label="${esc(data.anterior)}"${count < 2 ? ' disabled' : ''}>←</button><button type="button" data-gallery="next" aria-label="${esc(data.seguinte)}"${count < 2 ? ' disabled' : ''}>→</button></div><span class="gallery-count" aria-live="off"></span><div class="gallery-dots" role="group" aria-label="${esc(data.titulo)}">${data.fotos.map((photo, index) => `<button type="button" data-gallery-index="${index}" aria-label="${esc(`${index + 1} / ${count}: ${photo.alt || photo.legenda || data.titulo}`)}"${index === 0 ? ' aria-current="true"' : ''}><span></span></button>`).join('')}</div><button class="gallery-pause" type="button" data-gallery="pause"${count < 2 ? ' hidden' : ''}></button></div><div class="gallery-progress" aria-hidden="true"><span></span></div><span class="sr-only gallery-announcement" aria-live="polite" aria-atomic="true"></span></div>`;
}

const instances = new WeakMap();
export function initGallery(data) {
  const element = document.querySelector('.horizon-gallery');
  if (!element) return;
  instances.get(element)?.();
  const slides = [...element.querySelectorAll('.horizon-slide')];
  if (!slides.length) return;
  const pause = element.querySelector('[data-gallery="pause"]');
  const progress = element.querySelector('.gallery-progress span');
  const counter = element.querySelector('.gallery-count');
  const announcement = element.querySelector('.gallery-announcement');
  const dots = [...element.querySelectorAll('[data-gallery-index]')];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const events = new AbortController();
  const options = { signal: events.signal };
  let index = 0, timer, frame, paused = reducedMotion.matches, hovered = false, focused = false;
  let visible = !('IntersectionObserver' in globalThis), touchStart = null;
  const delay = Math.max(4000, Number(data.intervalo) || 6000);

  function schedule() {
    clearTimeout(timer);
    cancelAnimationFrame(frame);
    progress.style.animation = 'none';
    if (slides.length < 2 || paused || hovered || focused || !visible || document.hidden || reducedMotion.matches) return;
    frame = requestAnimationFrame(() => { progress.style.animation = `galleryTimer ${delay}ms linear forwards`; });
    timer = setTimeout(() => { show(index + 1); schedule(); }, delay);
  }
  function label() {
    pause.hidden = slides.length < 2 || reducedMotion.matches;
    pause.textContent = paused ? data.retomar : data.pausar;
    pause.setAttribute('aria-pressed', String(paused));
  }
  function show(next, manual = false) {
    index = ((next % slides.length) + slides.length) % slides.length;
    slides.forEach((slide, position) => {
      slide.classList.toggle('is-active', position === index);
      slide.setAttribute('aria-hidden', String(position !== index));
    });
    dots.forEach((dot, position) => {
      if (position === index) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    if (manual) {
      announcement.textContent = `${index + 1} / ${slides.length}. ${slides[index].querySelector('img').alt}`;
      schedule();
    }
  }

  element.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button || !element.contains(button)) return;
    if (button.hasAttribute('data-gallery-index')) show(Number(button.dataset.galleryIndex), true);
    else if (button.dataset.gallery === 'previous') show(index - 1, true);
    else if (button.dataset.gallery === 'next') show(index + 1, true);
    else if (button.dataset.gallery === 'pause') { paused = !paused; label(); schedule(); }
  }, options);
  element.addEventListener('keydown', event => {
    const next = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: slides.length - 1 }[event.key];
    if (next !== undefined) { event.preventDefault(); show(next, true); }
  }, options);
  element.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') { hovered = true; schedule(); } }, options);
  element.addEventListener('pointerleave', () => { hovered = false; schedule(); }, options);
  element.addEventListener('focusin', () => { focused = true; schedule(); }, options);
  element.addEventListener('focusout', event => { focused = element.contains(event.relatedTarget); schedule(); }, options);
  element.addEventListener('touchstart', event => {
    if (event.touches.length === 1) touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    else touchStart = null;
  }, { ...options, passive: true });
  element.addEventListener('touchend', event => {
    if (touchStart && event.changedTouches.length) {
      const dx = event.changedTouches[0].clientX - touchStart.x;
      const dy = event.changedTouches[0].clientY - touchStart.y;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) show(index + (dx < 0 ? 1 : -1), true);
    }
    touchStart = null;
  }, { ...options, passive: true });
  element.addEventListener('touchcancel', () => { touchStart = null; }, options);
  const observer = 'IntersectionObserver' in globalThis ? new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    schedule();
  }, { threshold: .25 }) : null;
  observer?.observe(element);
  document.addEventListener('visibilitychange', schedule, options);
  reducedMotion.addEventListener('change', () => { paused = reducedMotion.matches; label(); schedule(); }, options);
  instances.set(element, () => { events.abort(); observer?.disconnect(); clearTimeout(timer); cancelAnimationFrame(frame); });
  show(0); label(); schedule();
}
