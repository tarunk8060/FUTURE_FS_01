/**
 * Tarun.K Portfolio - Projects Page Interactivity
 * Filtering and Quick Architecture Modal Dialog
 */

function initProjectBehaviors() {
  const projectsData = {
    quantiva: {
      title: 'Quantiva Dashboard UI',
      category: 'Analytics & Dashboards',
      status: 'Live Prototype',
      tech: ['HTML5', 'CSS3', 'Vanilla JavaScript'],
      description: 'A powerful analytics dashboard designed for startup CEOs to easily track post-launch metrics, product performance, and company statistics.',
      image: 'assets/images/quantiva-preview.jpg',
      repoUrl: 'https://github.com/tarunk8060/Project-CRM-protype-',
      highlights: [
        'Post-launch founder telemetry with real-time MRR and customer acquisition graphs',
        'Custom SVG data visualization without heavy charting dependencies',
        'Intuitive dark-mode interface optimized for executive decision-making',
        'Responsive modular CSS Grid layout with zero framework overhead'
      ]
    },
    fundora: {
      title: 'Fundora Landing Page',
      category: 'Marketplace & Launchpad',
      status: 'Live Prototype',
      tech: ['Custom CSS', 'JavaScript'],
      description: 'A dedicated launchpad platform and marketplace where exciting new startup products are introduced to the world.',
      image: 'assets/images/fundora-preview.jpg',
      repoUrl: 'https://github.com/tarunk8060/project-d-start-Up-',
      highlights: [
        'Curated startup discovery directory with live community upvoting',
        'Interactive sliding drawer for cart and item management',
        'Bespoke fluid typography with custom glow accents and micro-states',
        'Lightweight Vanilla JavaScript event delegation'
      ]
    }
  };

  // --- Filtering ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const filterCount = document.getElementById('filterCount');

  filterBtns.forEach(btn => {
    btn.onclick = () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');
      let visible = 0;

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          visible++;
        } else {
          card.style.display = 'none';
        }
      });

      if (filterCount) {
        filterCount.textContent = visible;
      }
    };
  });

  // --- Architecture Modal Dialog ---
  const modalOverlay = document.getElementById('projectModal');
  const modalClose = document.getElementById('modalCloseBtn');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalCategory = document.getElementById('modalCategory');
  const modalStatus = document.getElementById('modalStatus');
  const modalTech = document.getElementById('modalTechStack');
  const modalHighlights = document.getElementById('modalHighlights');
  const modalRepoBtn = document.getElementById('modalRepoBtn');

  let previousActive = null;

  const openModal = (key) => {
    const data = projectsData[key];
    if (!data) return;

    previousActive = document.activeElement;

    modalTitle.textContent = data.title;
    modalDesc.textContent = data.description;
    modalImg.src = data.image;
    modalImg.alt = `${data.title} preview screenshot`;
    modalCategory.textContent = data.category;
    modalStatus.textContent = data.status;
    modalRepoBtn.href = data.repoUrl;

    modalTech.innerHTML = '';
    data.tech.forEach(t => {
      const span = document.createElement('span');
      span.className = 'tech-tag';
      span.textContent = t;
      modalTech.appendChild(span);
    });

    modalHighlights.innerHTML = '';
    data.highlights.forEach(h => {
      const li = document.createElement('li');
      li.className = 'card-spec-item';
      li.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${h}</span>
      `;
      modalHighlights.appendChild(li);
    });

    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      modalClose.focus();
    }, 50);
  };

  const closeModal = () => {
    if (!modalOverlay || !modalOverlay.classList.contains('active')) return;
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (previousActive) previousActive.focus();
  };

  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.onclick = () => {
      const key = btn.getAttribute('data-modal');
      openModal(key);
    };
  });

  if (modalClose) modalClose.onclick = closeModal;
  if (modalOverlay) {
    modalOverlay.onclick = (e) => {
      if (e.target === modalOverlay) closeModal();
    };
  }

  document.onkeydown = (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  };
}

window.initProjectBehaviors = initProjectBehaviors;
document.addEventListener('DOMContentLoaded', initProjectBehaviors);
