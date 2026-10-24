/**
 * Tarun.K Portfolio - Modern Top-to-Bottom Page Transition & Content Swap
 * Light-grey overlay slides down, displays destination heading, then lifts upward.
 */

document.addEventListener('DOMContentLoaded', () => {
  const introScreen = document.getElementById('welcomeIntroScreen');
  const skipBtn = document.getElementById('introSkipBtn');
  const progressBar = document.getElementById('introProgressBar');
  const transitionOverlay = document.getElementById('pageTransitionOverlay') || document.getElementById('pageShiftWrapper');
  const transitionHeading = document.getElementById('transitionHeading');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- 1. Welcome Intro: "Welcome to my portfolio." ---
  if (introScreen) {
    const urlParams = new URLSearchParams(window.location.search);
    const forceIntro = urlParams.has('intro') || urlParams.has('replay');
    const hasSeenIntro = !forceIntro && sessionStorage.getItem('tarun_intro_seen');

    if (hasSeenIntro || prefersReducedMotion) {
      introScreen.classList.add('hide-intro');
      introScreen.style.display = 'none';
      document.body.classList.add('intro-complete');
    } else {
      if (progressBar) {
        setTimeout(() => { progressBar.style.width = '100%'; }, 50);
      }

      // Step 1: Reveal "Welcome to my portfolio." at 350ms (relaxed readable duration ~1.85s)
      setTimeout(() => {
        introScreen.classList.add('intro-active-1');
      }, 350);

      // Step 2: Reveal "TARUN.K" + "DESIGN. DEVELOP. DEPLOY." at 2200ms (held for ~2.0s)
      setTimeout(() => {
        introScreen.classList.remove('intro-active-1');
        introScreen.classList.add('intro-active-2');
      }, 2200);

      // Step 3: Smooth dissolve into homepage at 4200ms
      setTimeout(() => {
        finishIntro();
      }, 4200);

      // Absolute safety failsafe: ensure intro NEVER blocks the page under any circumstance
      setTimeout(() => {
        if (!introScreen.classList.contains('hide-intro')) {
          finishIntro();
        }
      }, 5400);

      // Skip handlers
      if (skipBtn) {
        skipBtn.addEventListener('click', (e) => {
          e.preventDefault();
          finishIntro();
        });
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !introScreen.classList.contains('hide-intro')) {
          finishIntro();
        }
      });
    }

    function finishIntro() {
      sessionStorage.setItem('tarun_intro_seen', 'true');
      introScreen.classList.add('intro-fade-out');
      setTimeout(() => {
        introScreen.classList.add('hide-intro');
        introScreen.style.display = 'none';
        document.body.classList.add('intro-complete');
      }, 700);
    }
  }

  // --- 2. Replay Intro Button ---
  const replayBtn = document.getElementById('replayIntroBtn');
  if (replayBtn) {
    replayBtn.addEventListener('click', (e) => {
      e.preventDefault();
      sessionStorage.removeItem('tarun_intro_seen');
      window.location.reload();
    });
  }

  // --- 3. Modern Top-to-Bottom Page Transition with Dynamic Heading Reveal ---
  let isNavigating = false;
  let shapeGridAnimationId = null;

  function getDestinationHeading(url) {
    const cleanPath = url.split(/[?#]/)[0].toLowerCase();
    const filename = cleanPath.split('/').pop() || 'index.html';

    if (!filename || filename === 'index.html' || filename === '') {
      return { text: 'HELLO.', isHome: true };
    } else if (filename.includes('project')) {
      return { text: 'PROJECTS.', isHome: false };
    } else if (filename.includes('expert')) {
      return { text: 'EXPERTISE.', isHome: false };
    } else if (filename.includes('contact')) {
      return { text: 'CONTACT.', isHome: false };
    } else if (filename.includes('about')) {
      return { text: 'ABOUT.', isHome: false };
    }

    const fallback = filename.replace(/\.html$/i, '').toUpperCase();
    return { text: fallback ? `${fallback}.` : 'HELLO.', isHome: false };
  }

  function updateNavActiveStates(targetUrl) {
    const targetPath = targetUrl.split(/[?#]/)[0].split('/').pop() || 'index.html';
    const isTargetHome = targetPath === 'index.html' || targetPath === '';

    document.querySelectorAll('.nav-link, .mobile-nav-item, .pill-nav__row, .pill-nav__item').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const linkPath = href.split(/[?#]/)[0].split('/').pop() || 'index.html';
      const isLinkHome = linkPath === 'index.html' || linkPath === '';

      if (linkPath === targetPath || (isTargetHome && isLinkHome)) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  function ensureOverlayLayers(overlay) {
    if (!overlay) return;
    if (!overlay.querySelector('.transition-layer-white')) {
      const whiteLayer = document.createElement('div');
      whiteLayer.className = 'transition-layer-white';
      whiteLayer.setAttribute('aria-hidden', 'true');
      overlay.prepend(whiteLayer);
    }
    const headingWrap = overlay.querySelector('.transition-heading-wrap');
    if (headingWrap && !overlay.querySelector('.transition-layer-main')) {
      const mainLayer = document.createElement('div');
      mainLayer.className = 'transition-layer-main';
      headingWrap.parentNode.insertBefore(mainLayer, headingWrap);
      mainLayer.appendChild(headingWrap);
    }
  }

  async function performSmoothPageShift(targetUrl, pushHistory = true) {
    if (isNavigating) return;
    isNavigating = true;

    const overlay = document.getElementById('pageTransitionOverlay') || document.getElementById('pageShiftWrapper');
    const heading = document.getElementById('transitionHeading');
    ensureOverlayLayers(overlay);

    // If reduced motion is preferred or overlay missing, perform instant content swap without animation delays
    if (!overlay || prefersReducedMotion) {
      try {
        const res = await fetch(targetUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const htmlText = await res.text();
        const parser = new DOMParser();
        const newDoc = parser.parseFromString(htmlText, 'text/html');

        const currentPageContent = document.getElementById('pageContent');
        const newPageContent = newDoc.getElementById('pageContent');
        if (currentPageContent && newPageContent) {
          currentPageContent.innerHTML = newPageContent.innerHTML;
        }

        const currentHeader = document.querySelector('header');
        const newHeader = newDoc.querySelector('header');
        if (currentHeader && newHeader) {
          currentHeader.innerHTML = newHeader.innerHTML;
        }

        if (newDoc.title) document.title = newDoc.title;
        document.body.className = newDoc.body.className;

        updateNavActiveStates(targetUrl);
        if (pushHistory) history.pushState({ url: targetUrl }, '', targetUrl);
        window.scrollTo(0, 0);
        initializePageBehaviors();
      } catch (err) {
        window.location.href = targetUrl;
      } finally {
        isNavigating = false;
      }
      return;
    }

    try {
      // 1. Concurrent HTML fetch in background
      const fetchPromise = fetch(targetUrl).then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      });

      // 2. Configure destination heading
      const headingInfo = getDestinationHeading(targetUrl);
      if (heading) {
        heading.textContent = headingInfo.text;
      }

      // Reset overlay state
      overlay.classList.remove('slide-up', 'heading-visible', 'heading-exit', 'no-transition');
      overlay.classList.add('is-active', 'slide-down');

      // 3. Trigger signature blur-scale fade entrance as overlay slides down
      setTimeout(() => {
        if (isNavigating) {
          overlay.classList.add('heading-visible');
        }
      }, 140);

      // 4. Wait for white overlay to completely cover screen (460ms) and for HTML fetch to complete
      const [htmlText] = await Promise.all([
        fetchPromise,
        new Promise(r => setTimeout(r, 460))
      ]);

      const parser = new DOMParser();
      const newDoc = parser.parseFromString(htmlText, 'text/html');

      // 5. Swap DOM behind the white curtain
      const currentPageContent = document.getElementById('pageContent');
      const newPageContent = newDoc.getElementById('pageContent');
      if (currentPageContent && newPageContent) {
        currentPageContent.innerHTML = newPageContent.innerHTML;
      } else {
        const currentMain = document.querySelector('main');
        const newMain = newDoc.querySelector('main');
        if (currentMain && newMain) {
          currentMain.innerHTML = newMain.innerHTML;
          if (newMain.id) currentMain.id = newMain.id;
        }
      }

      // Update Header so brand accents, logo colors & active links match
      const currentHeader = document.querySelector('header');
      const newHeader = newDoc.querySelector('header');
      if (currentHeader && newHeader) {
        currentHeader.innerHTML = newHeader.innerHTML;
      }

      // Update page title
      if (newDoc.title) {
        document.title = newDoc.title;
      }

      // Update body theme classes
      document.body.className = newDoc.body.className;

      // Update active navigation state
      updateNavActiveStates(targetUrl);

      // Update browser history URL
      if (pushHistory) {
        history.pushState({ url: targetUrl }, '', targetUrl);
      }
      window.scrollTo(0, 0);

      // Re-initialize dynamic page behaviors
      initializePageBehaviors();

      // 6. Hold while destination heading is prominently displayed (~320ms)
      await new Promise(r => setTimeout(r, 320));

      // 7. Animate heading out and animate white overlay UPWARD to reveal destination page (~460ms)
      overlay.classList.add('heading-exit');
      overlay.classList.remove('slide-down');
      overlay.classList.add('slide-up');

      // 8. After overlay has animated upward off screen, finalize and unlock navigation
      setTimeout(() => {
        overlay.classList.remove('is-active', 'slide-up', 'heading-visible', 'heading-exit');
        isNavigating = false;
      }, 460);

    } catch (err) {
      console.warn('Navigation fallback due to fetch error:', err);
      window.location.href = targetUrl;
    }
  }

  // Intercept navigation clicks
  function attachLinkInterceptors() {
    const internalLinks = document.querySelectorAll('a[href$=".html"], a[href^="./"], a[href^="/"], a.nav-link, a.brand-logo, a.btn');
    internalLinks.forEach(link => {
      link.removeEventListener('click', handleLinkClick);
      link.addEventListener('click', handleLinkClick);
    });
  }

  function handleLinkClick(e) {
    const href = this.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#') || this.getAttribute('target') === '_blank' || href.endsWith('.pdf')) {
      return;
    }

    const targetBase = href.split(/[?#]/)[0].replace(/^\.\//, '');
    const currentBase = (window.location.pathname.split('/').pop() || 'index.html').replace(/^\.\//, '');
    if (targetBase === currentBase && targetBase !== '') {
      return; // Already on this page
    }

    e.preventDefault();

    // Hide desktop hover pill on click
    if (typeof window.__resetDesktopPill === 'function') {
      window.__resetDesktopPill();
    }
    const desktopPill = document.querySelector('.nav-hover-pill');
    if (desktopPill) desktopPill.style.opacity = '0';

    // Close PillNav if open
    const pillNav = document.getElementById('pillNav');
    const pillToggle = document.getElementById('pillNavToggle');
    if (pillNav) pillNav.removeAttribute('data-open');
    if (pillToggle) pillToggle.setAttribute('aria-expanded', 'false');

    // Close legacy mobile nav if open
    const mobileNav = document.getElementById('mobileNavOverlay');
    const mobileToggle = document.getElementById('mobileToggle');
    if (mobileNav && mobileNav.classList.contains('active')) {
      mobileNav.classList.remove('active');
      if (mobileToggle) {
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
      document.body.style.overflow = '';
    }

    performSmoothPageShift(href, true);
  }

  attachLinkInterceptors();

  // Handle browser Back / Forward buttons
  window.addEventListener('popstate', () => {
    const targetUrl = window.location.pathname.split('/').pop() || 'index.html';
    performSmoothPageShift(targetUrl, false);
  });

  // --- 4. PillNav Menu Navigation (React Bits PillNav) ---
  function bindMobileMenu() {
    const pillNav = document.getElementById('pillNav');
    const pillToggle = document.getElementById('pillNavToggle');

    function closePillMenu() {
      if (pillNav) {
        pillNav.removeAttribute('data-open');
      }
      if (pillToggle) {
        pillToggle.setAttribute('aria-expanded', 'false');
      }
    }

    if (pillToggle && pillNav) {
      pillToggle.onclick = (e) => {
        e.stopPropagation();
        const isOpen = pillNav.hasAttribute('data-open');
        if (isOpen) {
          pillNav.removeAttribute('data-open');
          pillToggle.setAttribute('aria-expanded', 'false');
        } else {
          pillNav.setAttribute('data-open', '');
          pillToggle.setAttribute('aria-expanded', 'true');
        }
      };

      pillNav.querySelectorAll('.pill-nav__row').forEach(row => {
        row.addEventListener('click', closePillMenu);
      });

      document.addEventListener('click', (e) => {
        if (!pillNav.contains(e.target)) {
          closePillMenu();
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          closePillMenu();
        }
      });
    }

    // Mobile Toggle and Overlay Sheet
    const mobToggle = document.getElementById('mobileToggle');
    const mobNav = document.getElementById('mobileNavOverlay');
    if (mobToggle && mobNav) {
      function closeMobileNav() {
        mobNav.classList.remove('active');
        mobToggle.classList.remove('active');
        mobToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }

      mobToggle.onclick = (e) => {
        e.stopPropagation();
        const isOpen = mobNav.classList.toggle('active');
        mobToggle.classList.toggle('active');
        mobToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        document.body.style.overflow = isOpen ? 'hidden' : '';
      };

      mobNav.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', closeMobileNav);
      });

      mobNav.onclick = (e) => {
        if (e.target === mobNav) closeMobileNav();
      };

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileNav();
      });
    }
  }

  bindMobileMenu();

  // --- 5. React Bits Pill Nav: Authentic Continuous Dual-Spring & Clipped Ink Engine ---
  let desktopPillCleanup = null;

  function initDesktopHoverPill() {
    if (desktopPillCleanup) {
      desktopPillCleanup();
      desktopPillCleanup = null;
    }

    const nav = document.querySelector('.site-nav-desktop-wrap .pill-nav--desktop');
    if (!nav) return;

    const track = nav.querySelector('.pill-nav__track');
    const glideEl = nav.querySelector('.pill-nav__glide');
    const ink = nav.querySelector('.pill-nav__ink');
    const slotElements = Array.from(nav.querySelectorAll('.pill-nav__slot'));
    const items = Array.from(nav.querySelectorAll('.pill-nav__item'));
    const mark = nav.querySelector('.pill-nav__mark');
    const logoLink = nav.querySelector('.pill-nav__logo-link');

    if (!track || !slotElements.length) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

    const getActiveIndex = () => {
      const activeItem = nav.querySelector('.pill-nav__item.active, .pill-nav__item[aria-current="page"]');
      if (!activeItem) return 0;
      const idx = items.indexOf(activeItem);
      return idx >= 0 ? idx : 0;
    };

    // Physics parameters from React Bits PillNav
    const bounce = 0.3;
    const stretch = 0.5;
    const zeta = 1 - 0.55 * bounce;
    const base = 520;

    const state = {
      x0: 0,
      x1: 0,
      v0: 0,
      v1: 0,
      alpha: 1,
      pop: 1,
      press: 1,
      pressVelocity: 0,
      hover: -1,
      focus: false,
      sliding: false,
      pressing: false,
      waiting: false
    };

    const rects = [];
    let trackWidth = 0;
    let trackHeight = 0;
    let raf = 0;
    let last = 0;

    const measure = () => {
      trackWidth = track.offsetWidth;
      trackHeight = track.offsetHeight;
      slotElements.forEach((slot, index) => {
        rects[index] = { left: slot.offsetLeft, width: slot.offsetWidth };
      });
    };

    const glideIndex = () => {
      if (state.hover >= 0) return state.hover;
      return getActiveIndex();
    };

    const sync = () => {
      const target = glideIndex();
      slotElements.forEach((slot, index) => {
        const isCurrent = target === index;
        slot.toggleAttribute('data-lit', isCurrent);
      });
      nav.toggleAttribute('data-focus', state.focus && state.hover >= 0);
    };

    const render = () => {
      const width = Math.max(0, state.x1 - state.x0);
      const scale = state.press * state.pop;
      const target = rects[glideIndex()];
      const squash = target ? 1 - clamp((width / Math.max(target.width, 1) - 1) * 0.3, 0, 0.14) : 1;

      if (glideEl) {
        glideEl.style.width = `${width}px`;
        glideEl.style.transform = `translate3d(${state.x0}px, 0, 0) scale(${scale}, ${scale * squash})`;
        glideEl.style.opacity = `${state.alpha}`;
      }

      if (ink) {
        const half = (width * scale) / 2;
        const center = (state.x0 + state.x1) / 2;
        const inset = (trackHeight * (1 - scale * squash)) / 2;
        ink.style.clipPath = `inset(${inset}px ${trackWidth - center - half}px ${inset}px ${center - half}px round ${trackHeight / 2}px)`;
        ink.style.opacity = `${state.alpha}`;
      }
    };

    const tick = (now) => {
      raf = 0;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;

      const index = glideIndex();
      const target = rects[index];
      let busy = false;

      if (target && !state.waiting) {
        const t0 = target.left;
        const t1 = target.left + target.width;

        if (reduce) {
          state.x0 = t0;
          state.x1 = t1;
          state.v0 = 0;
          state.v1 = 0;
        } else {
          const direction = Math.sign((t0 + t1) / 2 - (state.x0 + state.x1) / 2);
          const lead = base * (1 + 0.9 * stretch);
          const trail = base * (1 - 0.5 * stretch);
          const k0 = direction < 0 ? lead : direction > 0 ? trail : base;
          const k1 = direction > 0 ? lead : direction < 0 ? trail : base;
          const steps = Math.ceil(dt / (1 / 240));
          const h = dt / steps;
          for (let i = 0; i < steps; i++) {
            state.v0 += (-k0 * (state.x0 - t0) - 2 * zeta * Math.sqrt(k0) * state.v0) * h;
            state.x0 += state.v0 * h;
            state.v1 += (-k1 * (state.x1 - t1) - 2 * zeta * Math.sqrt(k1) * state.v1) * h;
            state.x1 += state.v1 * h;
          }
        }

        busy =
          Math.abs(state.x0 - t0) > 0.05 ||
          Math.abs(state.x1 - t1) > 0.05 ||
          Math.abs(state.v0) > 0.5 ||
          Math.abs(state.v1) > 0.5;
        if (!busy) state.sliding = false;
      }

      state.pop += (1 - state.pop) * (reduce ? 1 : 1 - Math.exp(-dt / 0.09));
      if (Math.abs(1 - state.pop) > 0.001) busy = true;

      const pressTarget = state.pressing ? 0.95 : 1;
      if (reduce) {
        state.press = pressTarget;
        state.pressVelocity = 0;
      } else {
        state.pressVelocity += (-700 * (state.press - pressTarget) - 30 * state.pressVelocity) * dt;
        state.press += state.pressVelocity * dt;
      }
      if (Math.abs(state.press - pressTarget) > 0.0005 || Math.abs(state.pressVelocity) > 0.01) busy = true;

      render();
      if (busy) raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    };

    const enter = (index, event) => {
      if (event && event.pointerType === 'touch') return;
      if (window.innerWidth <= 768) return;
      measure();
      state.hover = index;
      state.focus = false;
      state.sliding = true;
      sync();
      wake();
    };

    const leave = (event) => {
      if (event && event.pointerType === 'touch') return;
      if (state.focus) return;
      state.hover = -1;
      state.sliding = true;
      sync();
      wake();
    };

    const focus = (index, event) => {
      const target = event?.target;
      const visible = target instanceof Element && target.matches(':focus-visible');
      state.focus = visible;
      state.hover = visible ? index : state.hover;
      sync();
      wake();
    };

    const blur = () => {
      if (!state.focus) return;
      state.focus = false;
      state.hover = -1;
      state.sliding = true;
      sync();
      wake();
    };

    const press = (event) => {
      if (event && event.button > 0) return;
      if (event && event.pointerType === 'touch') return;
      state.pressing = true;
      wake();
    };

    const release = () => {
      if (!state.pressing) return;
      state.pressing = false;
      wake();
    };

    // Spin animation on logo mark (360 degrees)
    const spin = (event) => {
      if (!mark || (event && event.pointerType === 'touch') || mark.getAnimations().length) return;
      if (reduce) return;
      mark.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], {
        duration: 900,
        easing: 'cubic-bezier(0.65, 0, 0.25, 1)'
      });
    };

    if (logoLink) {
      logoLink.addEventListener('pointerenter', spin);
    }

    slotElements.forEach((slot, idx) => {
      slot.addEventListener('pointerenter', (e) => enter(idx, e));
      slot.addEventListener('mouseenter', (e) => enter(idx, e));
      slot.addEventListener('pointerdown', press);
      const link = slot.querySelector('.pill-nav__item');
      if (link) {
        link.addEventListener('focus', (e) => focus(idx, e));
        link.addEventListener('blur', blur);
      }
    });

    track.addEventListener('pointerleave', leave);
    track.addEventListener('mouseleave', leave);

    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);

    const onResize = () => {
      measure();
      render();
      wake();
    };
    window.addEventListener('resize', onResize);

    const ro = new ResizeObserver(() => {
      measure();
      render();
      wake();
    });
    ro.observe(track);

    const initializePosition = () => {
      measure();
      const target = rects[glideIndex()];
      if (target && target.width > 0) {
        state.x0 = target.left;
        state.x1 = target.left + target.width;
        state.alpha = 1;
        render();
      }
      sync();
    };

    initializePosition();
    setTimeout(initializePosition, 50);
    setTimeout(initializePosition, 250);
    document.fonts?.ready?.then(initializePosition).catch(() => {});

    window.__resetDesktopPill = () => {
      state.hover = -1;
      sync();
    };

    desktopPillCleanup = () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      if (logoLink) logoLink.removeEventListener('pointerenter', spin);
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
      window.removeEventListener('resize', onResize);
      track.removeEventListener('pointerleave', leave);
      track.removeEventListener('mouseleave', leave);
      slotElements.forEach((slot, idx) => {
        slot.removeEventListener('pointerenter', (e) => enter(idx, e));
        slot.removeEventListener('mouseenter', (e) => enter(idx, e));
        slot.removeEventListener('pointerdown', press);
      });
    };
  }

  initDesktopHoverPill();

  // --- 6. Page-Specific Dynamic Re-initialization ---
  function initializePageBehaviors() {
    attachLinkInterceptors();
    bindMobileMenu();
    initDesktopHoverPill();

    // Initialize ShapeGrid if on home page
    const canvas = document.getElementById('shapegrid-canvas');
    if (canvas) {
      initShapeGrid(canvas);
    } else if (shapeGridAnimationId) {
      cancelAnimationFrame(shapeGridAnimationId);
      shapeGridAnimationId = null;
    }

    // Initialize Project Modal & Filters if on projects page
    if (typeof window.initProjectBehaviors === 'function') {
      window.initProjectBehaviors();
    }

    // Initialize Contact form if on contact page
    if (typeof window.initContactBehaviors === 'function') {
      window.initContactBehaviors();
    }
  }

  // --- 6. ShapeGrid Canvas Animation (From Reference Website) ---
  function initShapeGrid(canvas) {
    if (shapeGridAnimationId) {
      cancelAnimationFrame(shapeGridAnimationId);
      shapeGridAnimationId = null;
    }

    const ctx = canvas.getContext('2d');
    let gridOffset = 0;
    const speed = 0.35;
    let squareSize = window.innerWidth < 768 ? 50 : 75;
    const borderColor = 'rgba(255, 255, 255, 0.055)';

    function resize() {
      if (!canvas || !canvas.parentElement) return;
      const dpr = window.devicePixelRatio || 1;
      squareSize = window.innerWidth < 768 ? 50 : 75;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    window.addEventListener('resize', resize);
    resize();

    function animate() {
      if (!document.getElementById('shapegrid-canvas')) {
        shapeGridAnimationId = null;
        return; // Halt animation loop if canvas is no longer on screen
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      gridOffset += speed;
      if (gridOffset >= squareSize) gridOffset = 0;

      const cols = Math.ceil(window.innerWidth / squareSize) + 2;
      const rows = Math.ceil(window.innerHeight / squareSize) + 2;

      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 1;

      for (let i = -1; i < cols; i++) {
        for (let j = -1; j < rows; j++) {
          const x = i * squareSize + gridOffset;
          const y = j * squareSize;
          ctx.strokeRect(x, y, squareSize, squareSize);
        }
      }

      // Radial Vignette
      const gradient = ctx.createRadialGradient(
        window.innerWidth / 2, window.innerHeight / 2, 0,
        window.innerWidth / 2, window.innerHeight / 2, Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2) / 2
      );
      gradient.addColorStop(0, 'rgba(4, 5, 8, 0.2)');
      gradient.addColorStop(1, 'rgba(4, 5, 8, 0.85)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      shapeGridAnimationId = requestAnimationFrame(animate);
    }

    animate();
  }

  // Initial execution of ShapeGrid if canvas present on initial load
  const homeCanvas = document.getElementById('shapegrid-canvas');
  if (homeCanvas) {
    initShapeGrid(homeCanvas);
  }
});
