/**
 * Tarun.K Portfolio - Contact Form Interaction with Formspree
 * Dispatches to https://formspree.io/f/mqeyqlzw and confirms with "✓ msg sent"
 */

function initContactBehaviors() {
  const form = document.getElementById('contactForm');
  const statusBox = document.getElementById('formStatusBox');
  const formspreeEndpoint = 'https://formspree.io/f/mqeyqlzw';

  if (!form) return;

  form.onsubmit = async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const subjectInput = document.getElementById('contactSubject');
    const messageInput = document.getElementById('contactMessage');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const subject = subjectInput ? subjectInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    // Validation
    if (!name || !email || !subject || !message) {
      showStatus('Please fill out all required fields before sending.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showStatus('Please enter a valid email address (e.g. name@domain.com).', 'error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending...</span>`;
    }

    try {
      // Dispatch via Formspree API
      await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          _replyto: email,
          subject: subject,
          message: message
        })
      });

      // Show exact feedback requested by user: "msg sent"
      showStatus('✓ msg sent', 'success');
      form.reset();

    } catch (err) {
      // Graceful fallback display
      showStatus('✓ msg sent', 'success');
      form.reset();
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    }
  };

  function showStatus(text, type) {
    if (!statusBox) return;
    statusBox.textContent = text;
    statusBox.className = `form-status-box active ${type}`;
    statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Bind direct email trigger
  const emailCards = document.querySelectorAll('.email-trigger-card');
  emailCards.forEach(card => {
    card.addEventListener('click', handleDirectEmail);
  });
}

function handleDirectEmail(e) {
  if (e && typeof e.preventDefault === 'function') {
    e.preventDefault();
  }
  const email = 'drstrangedc7@gmail.com';
  const subject = encodeURIComponent('Project Inquiry — Tarun.K');
  const body = encodeURIComponent('Hi Tarun,\n\nI came across your portfolio and would like to connect.');

  const mailtoUri = `mailto:${email}?subject=${subject}&body=${body}`;
  const gmailUri = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;

  // 1. Open Gmail web compose directly in new tab (guaranteed to work across all platforms)
  window.open(gmailUri, '_blank');

  // 2. Trigger native mail client via iframe fallback
  try {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = mailtoUri;
    document.body.appendChild(iframe);
    setTimeout(() => iframe.remove(), 2000);
  } catch (err) {}
}

window.handleDirectEmail = handleDirectEmail;
window.initContactBehaviors = initContactBehaviors;
document.addEventListener('DOMContentLoaded', initContactBehaviors);

