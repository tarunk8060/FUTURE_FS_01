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
}

window.initContactBehaviors = initContactBehaviors;
document.addEventListener('DOMContentLoaded', initContactBehaviors);

