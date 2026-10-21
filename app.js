/**
 * Tarun.K Portfolio - Interactive Experience & Logic
 * Vanilla JavaScript (ES6+), zero external runtime dependencies.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Project Data Store for Quick-View & Interactive Modals ---
  const projectsData = {
    quantiva: {
      id: 'quantiva',
      title: 'Quantiva Dashboard UI',
      category: 'Analytics & Dashboards',
      status: 'Production Prototype',
      tech: ['HTML5', 'CSS3', 'Vanilla JavaScript'],
      description: 'A powerful analytics dashboard designed for startup CEOs to easily track post-launch metrics, product performance, and company statistics. Features high-velocity telemetry, churn tracking, interactive KPI stat cards, and zero-framework runtime efficiency.',
      image: 'assets/images/quantiva-preview.jpg',
      repoUrl: 'https://github.com/tarunk8060/Project-CRM-protype-',
      highlights: [
        'Live KPI metric cards with growth differentials & trend indicators',
        'Custom SVG data visualization without heavy charting libraries',
        'Intuitive dark-mode interface optimized for executive decision-making',
        'Fully responsive modular layout adhering to modern CSS Grid standards'
      ]
    },
    fundora: {
      id: 'fundora',
      title: 'Fundora Landing Page',
      category: 'Marketplace & Launchpad',
      status: 'Production Live Ready',
      tech: ['Custom CSS', 'JavaScript'],
      description: 'A dedicated launchpad platform and marketplace where exciting new startup products are introduced to the world. Built with refined typography, bespoke glassmorphic cards, an interactive discovery drawer, and friction-free browsing mechanics.',
      image: 'assets/images/fundora-preview.jpg',
      repoUrl: 'https://github.com/tarunk8060/project-d-start-Up-',
      highlights: [
        'Curated startup showcase featuring real-time community upvotes',
        'Interactive sliding drawer for cart & product discovery',
        'Bespoke fluid typography with custom glow accents and micro-states',
        'Accessible, lightweight Vanilla JavaScript interactions'
      ]
    }
  };

  // --- 2. Navbar Scroll Behavior ---
  const siteNav = document.getElementById('siteNav');
  const handleScroll = () => {
    if (window.scrollY > 30) {
      siteNav.classList.add('scrolled');
    } else {
      siteNav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // --- 3. Active Nav Links & Smooth Scrolling ---
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          // Close mobile menu if open
          closeMobileMenu();
          
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // Highlight active section on scroll
  const sections = document.querySelectorAll('section[id]');
  const observeActiveSection = () => {
    const scrollPos = window.scrollY + 140;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav-link').forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else if (link.getAttribute('href').startsWith('#')) {
            link.classList.remove('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', observeActiveSection, { passive: true });

  // --- 4. Mobile Menu Toggle ---
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileBackdrop = document.getElementById('mobileBackdrop');

  const openMobileMenu = () => {
    mobileToggle.classList.add('active');
    mobileToggle.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    if (!mobileMenu.classList.contains('active')) return;
    mobileToggle.classList.remove('active');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('active');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', closeMobileMenu);
  }

  // --- 5. Project Category Filtering ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const countBadge = document.querySelector('.count-highlight');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');
      let visibleCount = 0;

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (countBadge) {
        countBadge.textContent = `${visibleCount} project${visibleCount === 1 ? '' : 's'}`;
      }
    });
  });

  // --- 6. Quick View Project Modal ---
  const modalOverlay = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalImg = document.getElementById('modalImg');
  const modalCategory = document.getElementById('modalCategory');
  const modalStatus = document.getElementById('modalStatus');
  const modalTechStack = document.getElementById('modalTechStack');
  const modalFeatureList = document.getElementById('modalFeatureList');
  const modalRepoLink = document.getElementById('modalRepoLink');
  const modalCopyLink = document.getElementById('modalCopyLink');

  let lastActiveElement = null;

  const openProjectModal = (projectId) => {
    const data = projectsData[projectId];
    if (!data) return;

    lastActiveElement = document.activeElement;

    // Populate modal fields
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.description;
    modalImg.src = data.image;
    modalImg.alt = `${data.title} preview screenshot`;
    modalCategory.textContent = data.category;
    modalStatus.textContent = data.status;
    modalRepoLink.href = data.repoUrl;

    // Populate tech stack
    modalTechStack.innerHTML = '';
    data.tech.forEach(t => {
      const span = document.createElement('span');
      span.className = 'tech-pill';
      span.textContent = t;
      modalTechStack.appendChild(span);
    });

    // Populate feature highlights
    modalFeatureList.innerHTML = '';
    data.highlights.forEach(h => {
      const li = document.createElement('li');
      li.className = 'modal-feature-item';
      li.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${h}</span>
      `;
      modalFeatureList.appendChild(li);
    });

    // Store active repo URL on copy button
    modalCopyLink.setAttribute('data-copy-url', data.repoUrl);

    // Show modal
    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus close button
    setTimeout(() => {
      modalCloseBtn.focus();
    }, 100);
  };

  const closeProjectModal = () => {
    if (!modalOverlay.classList.contains('active')) return;
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastActiveElement) {
      lastActiveElement.focus();
    }
  };

  // Attach quick-view triggers
  document.querySelectorAll('[data-quickview]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-quickview');
      openProjectModal(projectId);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeProjectModal();
      }
    });
  }

  // --- 7. Copy to Clipboard with Toast Notification ---
  const toast = document.getElementById('toastNotice');
  const toastText = document.getElementById('toastText');
  let toastTimer = null;

  const showToast = (message) => {
    if (!toast) return;
    toastText.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  };

  if (modalCopyLink) {
    modalCopyLink.addEventListener('click', () => {
      const url = modalCopyLink.getAttribute('data-copy-url');
      if (url && navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
          showToast('Repository link copied to clipboard!');
        }).catch(() => {
          showToast(`Repo URL: ${url}`);
        });
      } else if (url) {
        showToast(`Repo URL: ${url}`);
      }
    });
  }

  // --- 8. Keyboard Accessibility (ESC key) ---
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modalOverlay && modalOverlay.classList.contains('active')) {
        closeProjectModal();
      }
      if (mobileMenu && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    }
  });

  // --- 9. Scroll Reveal Animations (IntersectionObserver) ---
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // --- 10. Back to Top Button ---
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- 11. Optional Contact Trigger Alert ---
  document.querySelectorAll('[data-contact-trigger]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // If href is mailto, allow default or provide smooth feedback
      const href = btn.getAttribute('href');
      if (!href || href === '#contact') {
        e.preventDefault();
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  console.log('⚡ Tarun.K Portfolio Showcase initialized successfully.');
});
