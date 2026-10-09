(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const header = $('.site-header');
  const menuToggle = $('#menuToggle');
  const mobileNav = $('#mobileNav');

  const closeMenu = () => {
    if (!menuToggle || !mobileNav) return;
    mobileNav.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const willOpen = mobileNav.hidden;
      mobileNav.hidden = !willOpen;
      menuToggle.setAttribute('aria-expanded', String(willOpen));
    });
    $$('a', mobileNav).forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 24);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const year = $('#currentYear');
  if (year) year.textContent = String(new Date().getFullYear());

  const form = $('#contactForm');
  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const data = Object.fromEntries(new FormData(form).entries());
      const submit = $('#submitBtn');
      const status = $('#formStatus');
      if (data.website) return;

      submit.disabled = true;
      submit.innerHTML = 'Preparing your enquiry <span aria-hidden="true">…</span>';
      status.className = 'form-status';
      status.textContent = 'Preparing a secure enquiry…';

      let sent = false;
      try {
        const response = await fetch('/api/inquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          sent = true;
          status.textContent = 'Thank you. Your enquiry has been received. We will respond through the email address you provided.';
          status.className = 'form-status success';
          form.reset();
        } else if (response.status !== 503) {
          const parsed = await response.json().catch(() => ({}));
          throw new Error(parsed.error || 'The form could not be sent. Please use the email option below.');
        }
      } catch (error) {
        status.className = 'form-status error';
        status.textContent = `${error?.message || 'The enquiry could not be sent.'} You can contact us by email instead.`;
      }

      if (!sent && status.className !== 'form-status error') {
        status.className = 'form-status';
        status.innerHTML = 'The direct enquiry service is being activated. Please use the email option below to contact us today.';
      }

      if (!sent) {
        const subject = `DUNIZ consultation enquiry — ${String(data.focus || 'Business advisory')}`;
        const body = [
          `Name: ${data.name}`,
          `Email: ${data.email}`,
          `Organization: ${data.company || 'Not specified'}`,
          `Advisory focus: ${data.focus}`,
          '',
          `Business challenge:\n${data.message}`
        ].join('\n');

        const mailto = `mailto:anupam@duniz.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        let emailLink = $('#emailFallback');
        if (!emailLink) {
          emailLink = document.createElement('a');
          emailLink.id = 'emailFallback';
          emailLink.className = 'text-link';
          emailLink.textContent = 'Open an email with your enquiry →';
          status.after(emailLink);
        }
        emailLink.href = mailto;
        emailLink.hidden = false;
      } else {
        $('#emailFallback')?.setAttribute('hidden', '');
      }

      submit.disabled = false;
      submit.innerHTML = 'Send Confidential Enquiry <span aria-hidden="true">→</span>';
    });
  }
})();
