import { esc as escape, safeUrl, loadScript } from './utils.js?v=20261007-4';

let viewerLibraries;
function libraries() {
  viewerLibraries ||= Promise.all([
    import('https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs'),
    window.St ? Promise.resolve() : loadScript('https://cdn.jsdelivr.net/npm/page-flip@2.0.7/dist/js/page-flip.browser.js')
  ]).catch(error => { viewerLibraries = null; throw error; });
  return viewerLibraries;
}

export async function openViewer(flyer, texts, icon) {
  if (!flyer || document.querySelector('.viewer[open]')) return;
  const ui = texts.ui;
  const localUrl = flyer.blob instanceof Blob ? URL.createObjectURL(flyer.blob) : null;
  const pdfUrl = localUrl || safeUrl(flyer.caminho);
  const opener = document.activeElement;
  const previousOverflow = document.body.style.overflow;
  const dialog = document.createElement('dialog');
  dialog.className = 'viewer';
  dialog.setAttribute('aria-labelledby', 'viewer-title');
  dialog.innerHTML = `<header class="viewer-head"><div><h2 id="viewer-title">${escape(flyer.titulo)}</h2><small>${escape(flyer.exemplo ? ui.demo : `${ui.validade} ${flyer.inicio || ''} ${ui.ate} ${flyer.fim || ''}`)}</small></div><div class="viewer-tools"><button type="button" class="icon-btn" data-action="out" aria-label="${escape(ui.zoomOut)}">−</button><button type="button" class="viewer-zoom" data-action="reset" aria-label="${escape(ui.zoomReset || 'Repor zoom')}">100%</button><button type="button" class="icon-btn" data-action="in" aria-label="${escape(ui.zoomIn)}">+</button><button type="button" class="btn outline" data-action="full" aria-pressed="false">${escape(ui.full)}</button><a class="btn outline" href="${escape(pdfUrl)}" download="${escape(flyer.nomeFicheiro || 'marco-horizonte-folheto.pdf')}">${escape(ui.download)}</a><button type="button" class="icon-btn" data-action="close" aria-label="${escape(ui.fechar)}">${icon('close')}</button></div></header><div class="viewer-stage" aria-busy="true"><div class="book-scale"><div id="book"></div></div><p class="loading" role="status">${escape(ui.carregar)}</p></div><footer class="viewer-bottom"><div class="page-controls"><button type="button" class="icon-btn" data-action="prev" aria-label="${escape(ui.anterior)}" disabled>‹</button><span id="page-counter" aria-live="polite" aria-atomic="true"></span><button type="button" class="icon-btn" data-action="next" aria-label="${escape(ui.seguinte)}" disabled>›</button></div><span>${escape(ui.pdfAjuda)}</span><a class="text-link" style="margin:0" href="${escape(pdfUrl)}" target="_blank" rel="noopener noreferrer">${escape(ui.pdfAcessivel)}</a><span id="viewer-status" class="sr-only" role="status" aria-live="polite"></span></footer>`;
  document.body.append(dialog);
  dialog.showModal();
  document.body.style.overflow = 'hidden';
  const stage = dialog.querySelector('.viewer-stage');
  const scale = dialog.querySelector('.book-scale');
  const book = dialog.querySelector('#book');
  const action = name => dialog.querySelector(`[data-action="${name}"]`);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const renderTasks = new Set();
  const pageUrls = new Set();
  const pageRequests = new Map();
  let flip, pdf, loadingTask, zoom = 1, cancelled = false;

  function clean() {
    cancelled = true;
    for (const task of renderTasks) task.cancel();
    flip?.destroy();
    if (pdf) pdf.destroy().catch(() => {});
    else loadingTask?.destroy().catch(() => {});
    for (const url of pageUrls) URL.revokeObjectURL(url);
    if (localUrl) URL.revokeObjectURL(localUrl);
    dialog.remove();
    document.body.style.overflow = previousOverflow;
    if (opener?.isConnected) opener.focus({ preventScroll: true });
  }
  dialog.addEventListener('close', clean, { once: true });
  action('close').onclick = () => dialog.close();
  action('close').focus({ preventScroll: true });
  action('full').onclick = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (dialog.requestFullscreen) await dialog.requestFullscreen();
      else throw new Error('Fullscreen unavailable');
    } catch { dialog.querySelector('#viewer-status').textContent = ui.fullErro; }
  };
  dialog.addEventListener('fullscreenchange', () => action('full').setAttribute('aria-pressed', String(document.fullscreenElement === dialog)));

  function changeZoom(delta, reset = false) {
    zoom = reset ? 1 : Math.min(2, Math.max(1, Number((zoom + delta).toFixed(2))));
    scale.style.zoom = zoom;
    action('reset').textContent = `${Math.round(zoom * 100)}%`;
    action('out').disabled = zoom <= 1;
    action('in').disabled = zoom >= 2;
  }
  action('in').onclick = () => changeZoom(.25);
  action('out').onclick = () => changeZoom(-.25);
  action('reset').onclick = () => changeZoom(0, true);
  changeZoom(0);

  function navigate(next) {
    if (!flip || action(next ? 'next' : 'prev').disabled) return;
    if (reducedMotion.matches) next ? flip.turnToNextPage() : flip.turnToPrevPage();
    else next ? flip.flipNext() : flip.flipPrev();
  }
  action('next').onclick = () => navigate(true);
  action('prev').onclick = () => navigate(false);
  dialog.addEventListener('keydown', event => {
    if (event.ctrlKey || event.metaKey || event.altKey || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
    if (['ArrowRight', 'PageDown', 'ArrowLeft', 'PageUp'].includes(event.key)) {
      event.preventDefault();
      navigate(['ArrowRight', 'PageDown'].includes(event.key));
    } else if (event.key === '+' || event.key === '=') { event.preventDefault(); changeZoom(.25); }
    else if (event.key === '-') { event.preventDefault(); changeZoom(-.25); }
    else if (event.key === '0') { event.preventDefault(); changeZoom(0, true); }
    else if (flip && (event.key === 'Home' || event.key === 'End')) {
      event.preventDefault();
      flip.turnToPage(event.key === 'Home' ? 0 : pdf.numPages - 1);
    }
  });

  try {
    if (pdfUrl === '#') throw new Error('Missing PDF');
    const [pdfjs] = await libraries();
    if (cancelled) return;
    pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs';
    loadingTask = pdfjs.getDocument(pdfUrl);
    pdf = await loadingTask.promise;
    if (cancelled) { await pdf.destroy(); return; }
    const firstPage = await pdf.getPage(1);
    const firstViewport = firstPage.getViewport({ scale: 1 });
    const ratio = firstViewport.height / firstViewport.width;
    const horizontal = ratio < 1;
    const availableWidth = Math.max(160, stage.clientWidth - 30);
    const availableHeight = Math.max(160, stage.clientHeight - 40);
    const pageWidth = Math.max(120, Math.min(horizontal ? 1200 : 430, availableWidth, availableHeight / ratio));
    if (horizontal) scale.style.width = `${pageWidth}px`;

    const wrappers = Array.from({ length: pdf.numPages }, (_, index) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'pdf-page';
      wrapper.setAttribute('role', 'img');
      wrapper.setAttribute('aria-label', `${ui.pagina} ${index + 1}`);
      wrapper.setAttribute('aria-busy', 'true');
      wrapper.innerHTML = `<p class="loading">${escape(ui.carregar)} ${index + 1} / ${pdf.numPages}</p>`;
      book.append(wrapper);
      return wrapper;
    });

    function renderPage(number) {
      if (number < 1 || number > pdf.numPages || cancelled) return Promise.resolve();
      if (pageRequests.has(number)) return pageRequests.get(number);
      const request = (async () => {
        const page = number === 1 ? firstPage : await pdf.getPage(number);
        if (cancelled) return;
        const initial = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: Math.min(1.8, 1300 / initial.width) });
        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        canvas.setAttribute('aria-hidden', 'true');
        const task = page.render({ canvasContext: canvas.getContext('2d', { alpha: false }), viewport });
        renderTasks.add(task);
        try { await task.promise; } finally { renderTasks.delete(task); }
        if (cancelled) return;
        // PageFlip clones HTML while turning. An image preserves its pixels in a clone.
        const snapshot = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        if (cancelled) return;
        if (!snapshot) throw new Error('PDF page image unavailable');
        const url = URL.createObjectURL(snapshot);
        pageUrls.add(url);
        const image = document.createElement('img');
        image.src = url;
        image.alt = '';
        image.setAttribute('aria-hidden', 'true');
        image.style.cssText = 'display:block;width:100%;height:100%;object-fit:contain';
        await image.decode();
        if (cancelled) return;
        wrappers[number - 1].replaceChildren(image);
        wrappers[number - 1].setAttribute('aria-busy', 'false');
        page.cleanup();
      })();
      pageRequests.set(number, request);
      return request;
    }

    await renderPage(1);
    if (cancelled) return;
    dialog.querySelector('.viewer-stage > .loading')?.remove();
    stage.setAttribute('aria-busy', 'false');
    flip = new window.St.PageFlip(book, {
      width: pageWidth, height: pageWidth * ratio, size: horizontal ? 'fixed' : 'stretch',
      minWidth: 120, maxWidth: horizontal ? pageWidth : 480, minHeight: 120,
      maxHeight: Math.max(680, pageWidth * ratio), showCover: false, usePortrait: true,
      autoSize: true, flippingTime: reducedMotion.matches ? 1 : 650,
      drawShadow: !reducedMotion.matches, maxShadowOpacity: .2, mobileScrollSupport: true, swipeDistance: 25
    });

    const update = () => {
      if (cancelled) return;
      const current = flip.getCurrentPageIndex();
      const spread = flip.getOrientation() === 'landscape' ? 2 : 1;
      const end = Math.min(pdf.numPages, current + spread);
      dialog.querySelector('#page-counter').textContent = `${ui.pagina} ${current + 1}${end > current + 1 ? `–${end}` : ''} ${ui.de} ${pdf.numPages}`;
      action('prev').disabled = current === 0;
      action('next').disabled = end >= pdf.numPages;
      // Render the visible spread and neighbouring pages, so long PDFs open promptly.
      for (let number = Math.max(1, current); number <= Math.min(pdf.numPages, end + 2); number++) {
        renderPage(number).catch(() => {
          if (cancelled) return;
          wrappers[number - 1].innerHTML = `<p class="viewer-error">${escape(ui.pdfErro)}</p>`;
          wrappers[number - 1].setAttribute('aria-busy', 'false');
          dialog.querySelector('#viewer-status').textContent = ui.pdfErro;
        });
      }
    };
    flip.on('flip', update);
    flip.on('changeOrientation', update);
    flip.loadFromHTML(book.querySelectorAll('.pdf-page'));
    update();
  } catch {
    if (cancelled) return;
    stage.setAttribute('aria-busy', 'false');
    stage.innerHTML = `<p class="viewer-error" role="alert">${escape(ui.pdfErro)}</p>`;
  }
}
