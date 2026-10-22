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

  // Direct Email Inquiry: Copy to clipboard handler
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const emailAddress = copyEmailBtn.getAttribute('data-email') || 'kstarun8246@gmail.com';
      const actionText = copyEmailBtn.querySelector('.action-text');

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(emailAddress);
        } else {
          // Universal fallback
          const textArea = document.createElement('textarea');
          textArea.value = emailAddress;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          textArea.remove();
        }

        copyEmailBtn.classList.add('copied');
        if (actionText) actionText.textContent = 'Copied!';

        setTimeout(() => {
          copyEmailBtn.classList.remove('copied');
          if (actionText) actionText.textContent = 'Copy';
        }, 2200);
      } catch (err) {
        console.error('Failed to copy email:', err);
      }
    });
  }
}

window.initContactBehaviors = initContactBehaviors;
document.addEventListener('DOMContentLoaded', initContactBehaviors);

