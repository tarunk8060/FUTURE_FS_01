/**
 * Tarun.K Portfolio - Buttery Smooth Multi-Layer Top-Down Page Shift & Content Swap
 * Layers: Gray -> White -> Black cascading from top with zero browser reload flicker.
 */

document.addEventListener('DOMContentLoaded', () => {
  const introScreen = document.getElementById('welcomeIntroScreen');
  const skipBtn = document.getElementById('introSkipBtn');
  const progressBar = document.getElementById('introProgressBar');
  const shiftWrapper = document.getElementById('pageShiftWrapper');

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

  // --- 3. Seamless Multi-Layer Top-Down Staggered Page Shift (Zero Jitter / Flash) ---
  // --- 3. Seamless Multi-Layer Top-Down Staggered Page Shift (Zero Jitter / Flash) ---
  let isNavigating = false;
  let shapeGridAnimationId = null;

  async function performSmoothPageShift(targetUrl) {
    if (isNavigating || !shiftWrapper) return;
    isNavigating = true;

    try {
      // 1. Fetch new HTML in background concurrently
      const fetchPromise = fetch(targetUrl).then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      });

      // 2. Cascade layers DOWN from top (Gray -> White -> Black)
      shiftWrapper.classList.remove('shifting-out', 'no-transition');
      shiftWrapper.classList.add('shifting-in');

      // 3. Wait for black layer to cover screen completely (0.14s delay + 0.45s duration = 0.59s)
      const [htmlText] = await Promise.all([
        fetchPromise,
        new Promise(r => setTimeout(r, 600))
      ]);

      const parser = new DOMParser();
      const newDoc = parser.parseFromString(htmlText, 'text/html');

      // 4. Swap Page Content behind the black curtain
      const currentPageContent = document.getElementById('pageContent');
      const newPageContent = newDoc.getElementById('pageContent');
      if (currentPageContent && newPageContent) {
        currentPageContent.innerHTML = newPageContent.innerHTML;
      } else {
        // Fallback to main if pageContent is not present
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

      // Update body theme class (page-home, page-projects, page-expertise, page-contact)
      document.body.className = newDoc.body.className;

      // Update active navigation state
      const targetPath = targetUrl.split('/').pop() || 'index.html';
      document.querySelectorAll('.nav-link, .mobile-nav-item').forEach(link => {
        const href = link.getAttribute('href');
        if (href === targetPath || (targetPath === '' && href === 'index.html')) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        } else {
          link.classList.remove('active');
          link.removeAttribute('aria-current');
        }
      });

      // Update browser history URL
      history.pushState({ url: targetUrl }, '', targetUrl);
      window.scrollTo(0, 0);

      // Re-initialize page-specific behaviors (projects modal/filters, contact form, ShapeGrid, mobile toggle)
      initializePageBehaviors();

      // Brief paint pause while curtain is completely closed
      await new Promise(r => setTimeout(r, 50));

      // 5. Cascade layers DOWN and OUT (revealing new page with zero shift!)
      shiftWrapper.classList.remove('shifting-in');
      shiftWrapper.classList.add('shifting-out');

      // 6. Reset layers back to top silently without reverse animation
      setTimeout(() => {
        shiftWrapper.classList.add('no-transition');
        shiftWrapper.classList.remove('shifting-out');
        void shiftWrapper.offsetHeight; // force reflow
        requestAnimationFrame(() => {
          shiftWrapper.classList.remove('no-transition');
          isNavigating = false;
        });
      }, 650);

    } catch (err) {
      console.warn('Fallback standard navigation due to fetch error:', err);
      window.location.href = targetUrl;
    }
  }

  // Intercept navigation clicks
  function attachLinkInterceptors() {
    const internalLinks = document.querySelectorAll('a[href$=".html"], a[href^="./"], a[href^="/"]');
    internalLinks.forEach(link => {
      link.removeEventListener('click', handleLinkClick);
      link.addEventListener('click', handleLinkClick);
    });
  }

  function handleLinkClick(e) {
    const href = this.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('#') || this.getAttribute('target') === '_blank') {
      return;
    }

    const targetBase = href.split('#')[0].replace(/^\.\//, '');
    const currentBase = (window.location.pathname.split('/').pop() || 'index.html').replace(/^\.\//, '');
    if (targetBase === currentBase && targetBase !== '') {
      return; // Already on this page
    }

    e.preventDefault();

    // Close mobile menu if open
    const mobileNav = document.getElementById('mobileNavOverlay');
    const mobileToggle = document.getElementById('mobileToggle');
    if (mobileNav && mobileNav.classList.contains('active')) {
      mobileNav.classList.remove('active');
      if (mobileToggle) mobileToggle.classList.remove('active');
      document.body.style.overflow = '';
    }

    performSmoothPageShift(href);
  }

  attachLinkInterceptors();

  // Handle browser Back / Forward buttons
  window.addEventListener('popstate', () => {
    const targetUrl = window.location.pathname.split('/').pop() || 'index.html';
    performSmoothPageShift(targetUrl);
  });

  // --- 4. Mobile Menu Navigation & "Turns into X" Animation ---
  function bindMobileMenu() {
    const mobToggle = document.getElementById('mobileToggle');
    const mobNav = document.getElementById('mobileNavOverlay');

    function closeMenu() {
      if (mobNav) mobNav.classList.remove('active');
      if (mobToggle) {
        mobToggle.classList.remove('active');
        mobToggle.setAttribute('aria-expanded', 'false');
      }
      document.body.style.overflow = '';
    }

    if (mobToggle && mobNav) {
      mobToggle.onclick = (e) => {
        e.stopPropagation();
        const isOpen = mobNav.classList.toggle('active');
        mobToggle.classList.toggle('active');
        mobToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        document.body.style.overflow = isOpen ? 'hidden' : '';
      };

      mobNav.onclick = (e) => {
        if (e.target === mobNav) {
          closeMenu();
        }
      };
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
