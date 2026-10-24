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

    document.querySelectorAll('.nav-link, .mobile-nav-item, .pill-nav__row').forEach(link => {
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
      }, 120);

      // 4. Wait for overlay to completely cover screen (380ms) and for HTML fetch to complete
      const [htmlText] = await Promise.all([
        fetchPromise,
        new Promise(r => setTimeout(r, 380))
      ]);

      const parser = new DOMParser();
      const newDoc = parser.parseFromString(htmlText, 'text/html');

      // 5. Swap DOM behind the light-grey curtain
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

      // 6. Brief hold while destination heading is prominently displayed (~180ms)
      await new Promise(r => setTimeout(r, 180));

      // 7. Animate heading out and animate overlay UPWARD to reveal destination page (~360ms)
      overlay.classList.add('heading-exit');
      overlay.classList.remove('slide-down');
      overlay.classList.add('slide-up');

      // 8. After overlay has animated upward off screen, finalize and unlock navigation
      setTimeout(() => {
        overlay.classList.remove('is-active', 'slide-up', 'heading-visible', 'heading-exit');
        isNavigating = false;
      }, 360);

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

  // --- 5. Page-Specific Dynamic Re-initialization ---
  function initializePageBehaviors() {
    attachLinkInterceptors();
    bindMobileMenu();

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
