(() => {
  const library = window.Motion;
  if (!library?.animate || !library?.scroll || !library?.inView) return;

  const { animate, stagger, inView, hover, scroll } = library;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const root = document.documentElement;
  const ease = [0.16, 1, 0.3, 1];
  const storageKey = 'hp-motion-study-enabled';
  let preferred = true;
  try { preferred = sessionStorage.getItem(storageKey) !== 'false'; } catch {}
  let enabled = false;
  let replayIntro = () => {};
  let dispose = () => {};

  const toolbar = document.createElement('aside');
  toolbar.className = 'motion-study';
  toolbar.setAttribute('aria-label', 'Motion prototype bekijken');
  toolbar.innerHTML = '<div class="motion-study__name"><strong>MOTION STUDY / 01</strong><small>Alleen lokaal · Testproducten</small></div><button type="button" data-study-replay>Herhaal intro</button><button type="button" data-study-toggle aria-pressed="false">Motion aan</button><span class="motion-study__status" role="status" aria-live="polite"></span>';
  document.body.append(toolbar);
  const toggle = toolbar.querySelector('[data-study-toggle]');
  const replay = toolbar.querySelector('[data-study-replay]');
  const status = toolbar.querySelector('[role="status"]');

  function activate() {
    const cleanups = [];
    const styles = new Map();
    const animations = new Set();
    const introAnimations = new Set();
    let live = true;

    function remember(node) {
      if (!styles.has(node)) styles.set(node, node.getAttribute('style'));
      return node;
    }
    function play(target, values, options = {}) {
      const nodes = target instanceof Element ? [target] : Array.from(target);
      if (!nodes.length) return null;
      nodes.forEach(remember);
      const controls = animate(nodes, values, { duration: .65, ease, ...options });
      animations.add(controls);
      Promise.resolve(controls).then(() => animations.delete(controls));
      return controls;
    }
    function listen(node, event, handler, options) {
      node.addEventListener(event, handler, options);
      cleanups.push(() => node.removeEventListener(event, handler, options));
    }
    function stop(control) {
      control?.stop();
      animations.delete(control);
    }

    dispose = () => {
      live = false;
      cleanups.reverse().forEach(cleanup => cleanup());
      animations.forEach(animation => animation.cancel());
      styles.forEach((style, node) => {
        if (style === null) node.removeAttribute('style');
        else node.setAttribute('style', style);
      });
      replayIntro = () => {};
    };

    const hero = document.querySelector('[data-hero]');
    if (hero) {
      const title = hero.querySelector('h1');
      const original = title.innerHTML;
      const oldLabel = title.getAttribute('aria-label');
      title.setAttribute('aria-label', title.innerText.replace(/\s+/g, ' ').trim());
      const textNodes = [];
      const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) textNodes.push(walker.currentNode);
      textNodes.forEach(node => {
        const fragment = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(word => {
          if (!word.trim()) { fragment.append(document.createTextNode(word)); return; }
          const window = document.createElement('span');
          window.className = 'motion-word-window';
          window.setAttribute('aria-hidden', 'true');
          const inner = document.createElement('span');
          inner.className = 'motion-word';
          inner.textContent = word;
          window.append(inner);
          fragment.append(window);
        });
        node.replaceWith(fragment);
      });
      cleanups.push(() => {
        title.innerHTML = original;
        if (oldLabel === null) title.removeAttribute('aria-label');
        else title.setAttribute('aria-label', oldLabel);
      });
      replayIntro = () => {
        introAnimations.forEach(stop);
        introAnimations.clear();
        const words = title.querySelectorAll('.motion-word');
        introAnimations.add(play(words, { y: ['112%', '0%'], opacity: [0, 1], rotate: [2, 0] }, { duration: 1.05, delay: stagger(.085) }));
        introAnimations.add(play(hero.querySelector('.hero__content > p'), { y: [16, 0], opacity: [0, 1] }, { delay: .42, duration: .8 }));
        introAnimations.add(play(hero.querySelector('.hero__actions'), { y: [14, 0], opacity: [0, 1] }, { delay: .58, duration: .75 }));
        introAnimations.add(play(hero.querySelectorAll('.hero__top, .hero__bottom'), { opacity: [0, 1] }, { delay: .25, duration: .9 }));
      };
      replayIntro();
      if (finePointer.matches && innerWidth >= 900) {
        const visual = remember(hero.querySelector('.hero__visual'));
        cleanups.push(scroll(progress => {
          visual.style.transform = `translateY(${progress * 70}px) scale(${1.035 + progress * .035})`;
        }, { target: hero, offset: ['start start', 'end start'] }));
      }
    }

    const progress = document.createElement('div');
    progress.className = 'motion-read-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.append(progress);
    cleanups.push(() => progress.remove());
    cleanups.push(scroll(value => { progress.style.transform = `scaleX(${value})`; }));

    document.querySelectorAll('.reveal, .product-card, .engineering__copy, .engineering__stage').forEach(node => {
      if (node.closest('[data-hero]')) return;
      const index = node.classList.contains('product-card') ? [...node.parentElement.children].filter(n => n.classList.contains('product-card')).indexOf(node) : 0;
      remember(node);
      cleanups.push(inView(node, () => {
        play(node, { opacity: [0, 1], y: [28, 0] }, { duration: .8, delay: Math.max(index, 0) * .055 });
      }, { amount: .12 }));
    });

    if (finePointer.matches) {
      document.querySelectorAll('.product-card').forEach(card => {
        const photo = card.querySelector('.product-card__photo');
        const view = card.querySelector('.product-card__view');
        if (!photo) return;
        let movement;
        let hoverControl;
        cleanups.push(hover(card, () => {
          hoverControl = play(photo, { scale: 1.055 }, { type: 'spring', duration: .65, bounce: .12 });
          if (view) play(view, { rotate: 45, scale: 1.08 }, { duration: .4 });
          return () => {
            stop(movement);
            stop(hoverControl);
            play(photo, { x: 0, y: 0, scale: 1 }, { type: 'spring', duration: .65, bounce: .08 });
            if (view) play(view, { rotate: 0, scale: 1 }, { duration: .4 });
          };
        }));
        listen(card, 'pointermove', event => {
          if (event.pointerType === 'touch') return;
          const bounds = card.getBoundingClientRect();
          stop(movement);
          movement = play(photo, {
            x: ((event.clientX - bounds.left) / bounds.width - .5) * 9,
            y: ((event.clientY - bounds.top) / bounds.height - .5) * 7
          }, { duration: .3 });
        });
      });
      document.querySelectorAll('.button, .circle-link, .construction-toggle').forEach(button => {
        cleanups.push(hover(button, () => {
          play(button, { y: -2 }, { type: 'spring', duration: .4, bounce: .12 });
          return () => play(button, { y: 0 }, { duration: .3 });
        }));
      });
    }

    document.querySelectorAll('[data-engineering]').forEach(section => {
      const panelSpecs = [
        ['.diagram-panel--left', -52, -24, -13],
        ['.diagram-panel--right', 52, -24, 13],
        ['.diagram-panel--collar', 0, -45, 0],
        ['.diagram-panel--body', 0, 22, 0]
      ];
      const guides = section.querySelector('.diagram-guides');
      const panels = panelSpecs.map(([selector, x, y, rotate]) => ({ node: section.querySelector(selector), x, y, rotate }));
      const seam = section.querySelector('.diagram-seam');
      let panelAnimations = [];
      let seamAnimation;
      const expanded = () => section.classList.contains('is-expanded');

      function showPanels(open, duration = .85) {
        panelAnimations.forEach(stop);
        panelAnimations = panels.map(({node, x, y, rotate}, index) => play(node, {
          x: open ? x : 0, y: open ? y : 0, rotate: open ? rotate : 0
        }, { type: 'spring', duration, bounce: .12, delay: index * .025 }));
        play(guides, { opacity: open ? .9 : 0 }, { duration: .45 });
      }
      function drawSeam() {
        stop(seamAnimation);
        seamAnimation = play(seam, { pathLength: [0, 1], opacity: [.3, 1] }, { duration: 1.4 });
      }
      showPanels(expanded(), .001);
      cleanups.push(inView(section.querySelector('.garment-diagram'), () => {
        play(section.querySelectorAll('.hotspot'), { opacity: [0, 1], scale: [.7, 1] }, { delay: stagger(.12, { startDelay: .2 }), type: 'spring', duration: .7, bounce: .2 });
        drawSeam();
      }, { amount: .3 }));
      listen(document, 'click', event => {
        const expandButton = event.target.closest('[data-construction-toggle]');
        if (expandButton && section.contains(expandButton)) { showPanels(expanded()); if (expanded()) drawSeam(); }
        const feature = event.target.closest('[data-feature]');
        if (feature && section.contains(feature)) {
          const copy = section.querySelector('.engineering-feature.is-active .engineering-feature__body');
          if (copy) play(copy, { opacity: [0, 1], y: [7, 0] }, { duration: .45 });
          if (feature.dataset.feature === '1') drawSeam();
        }
      });
    });

    document.querySelectorAll('dialog').forEach(dialog => {
      const observer = new MutationObserver(() => {
        if (!dialog.open || !live) return;
        const side = dialog.classList.contains('cart-dialog') || dialog.classList.contains('menu-dialog');
        play(dialog, side ? { x: [50, 0], opacity: [.5, 1] } : { y: [-16, 0], opacity: [0, 1] }, { duration: .45 });
      });
      observer.observe(dialog, { attributes: true, attributeFilter: ['open'] });
      cleanups.push(() => observer.disconnect());
    });

    document.querySelectorAll('[data-cart-count]').forEach(count => {
      let previous = count.textContent;
      const observer = new MutationObserver(() => {
        if (count.textContent === previous || !live) return;
        previous = count.textContent;
        play(count, { scale: [1, 1.3, 1] }, { duration: .45 });
      });
      observer.observe(count, { childList: true, characterData: true, subtree: true });
      cleanups.push(() => observer.disconnect());
    });
  }

  function update(announce = false) {
    dispose();
    dispose = () => {};
    enabled = preferred && !reduced.matches;
    root.dataset.motionStudy = enabled ? 'on' : 'off';
    try {
      if (enabled) activate();
    } catch (error) {
      dispose();
      enabled = false;
      root.dataset.motionStudy = 'off';
      console.error('Motion prototype could not initialize:', error);
    }
    toggle.setAttribute('aria-pressed', String(enabled));
    toggle.textContent = reduced.matches ? 'Rustige weergave' : enabled ? 'Motion aan' : 'Motion uit';
    toggle.disabled = reduced.matches;
    replay.disabled = !enabled;
    replay.textContent = document.querySelector('[data-hero]') ? 'Herhaal intro' : 'Naar intro';
    if (announce) status.textContent = reduced.matches ? 'Je voorkeur voor minder beweging wordt gevolgd.' : enabled ? 'Motion prototype aan.' : 'Oorspronkelijke beweging van v1.02.';
    window.HPMotionStudy = { version: '13.2.0', enabled, reduced: reduced.matches };
  }
  toggle.addEventListener('click', () => {
    preferred = !preferred;
    try { sessionStorage.setItem(storageKey, String(preferred)); } catch {}
    update(true);
  });
  replay.addEventListener('click', () => {
    if (!document.querySelector('[data-hero]')) { location.href = '/'; return; }
    window.scrollTo({ top: 0, behavior: 'instant' });
    replayIntro();
    status.textContent = 'Intro opnieuw gestart.';
  });
  reduced.addEventListener('change', () => update(true));
  update();
})();
