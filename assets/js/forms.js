/* ============================================================
   forms.js — FAQ accordion, contact validation, newsletter
   ============================================================ */
(function () {
  'use strict';

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (other) {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-a').style.maxHeight = '0px';
          other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('open', !isOpen);
      q.setAttribute('aria-expanded', String(!isOpen));
      a.style.maxHeight = !isOpen ? a.scrollHeight + 'px' : '0px';
    });
  });

  /* ---------- Validation helpers ---------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE_RE = /^[+\d][\d\s\-()]{7,15}$/;

  function setInvalid(field, msg) {
    var wrap = field.closest('.form-field');
    if (!wrap) return;
    wrap.classList.add('invalid');
    var err = wrap.querySelector('.field-error');
    if (err && msg) err.textContent = msg;
  }
  function clearInvalid(field) {
    var wrap = field.closest('.form-field');
    if (wrap) wrap.classList.remove('invalid');
  }
  window.STACKLY.validate = { EMAIL_RE: EMAIL_RE, PHONE_RE: PHONE_RE, setInvalid: setInvalid, clearInvalid: clearInvalid };

  document.querySelectorAll('.form-field input, .form-field select, .form-field textarea').forEach(function (f) {
    f.addEventListener('input', function () { clearInvalid(f); });
  });

  /* ---------- Contact form ---------- */
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      var name = form.querySelector('#cf-name');
      var email = form.querySelector('#cf-email');
      var phone = form.querySelector('#cf-phone');
      var loc = form.querySelector('#cf-location');
      var help = form.querySelector('#cf-help');
      var msg = form.querySelector('#cf-message');

      if (!name.value.trim()) { setInvalid(name, 'Please tell us your name.'); ok = false; }
      if (!EMAIL_RE.test(email.value.trim())) { setInvalid(email, 'Enter a valid email address.'); ok = false; }
      if (!PHONE_RE.test(phone.value.trim())) { setInvalid(phone, 'Enter a valid phone number.'); ok = false; }
      if (!loc.value.trim()) { setInvalid(loc, 'Please add your city or location.'); ok = false; }
      if (help && !help.value) { setInvalid(help, 'Please choose how you would like to help.'); ok = false; }
      if (msg.value.trim().length < 10) { setInvalid(msg, 'A few words help us route your message (min 10 characters).'); ok = false; }

      if (!ok) {
        var firstBad = form.querySelector('.form-field.invalid input, .form-field.invalid select, .form-field.invalid textarea');
        if (firstBad) firstBad.focus();
        return;
      }

      var fields = form.querySelector('.form-grid');
      var foot = form.querySelector('.form-foot');
      var success = form.querySelector('.form-success');
      if (fields) fields.style.display = 'none';
      if (foot) foot.style.display = 'none';
      if (success) {
        success.classList.add('show');
        if (window.gsap && !window.STACKLY.reduced) {
          gsap.from(success, { y: 24, opacity: 0, duration: 0.7, ease: 'power3.out' });
          gsap.from(success.querySelector('.fs-ico'), { scale: 0, duration: 0.7, ease: 'back.out(2)', delay: 0.15 });
        }
      }
    });
  }

  /* ---------- Newsletter ---------- */
  document.querySelectorAll('.newsletter-form').forEach(function (nf) {
    nf.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = nf.querySelector('input[type="email"]');
      if (!EMAIL_RE.test(input.value.trim())) {
        input.focus();
        input.style.borderColor = '#d64545';
        return;
      }
      input.style.borderColor = '';
      nf.innerHTML = '<p style="color:var(--lime);font-weight:800;font-size:15px;display:flex;align-items:center;gap:10px;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 12.5l5 5L19.5 7"/></svg>You are on the list. Welcome to the community.</p>';
    });
  });
})();
