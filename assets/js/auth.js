/* ============================================================
   auth.js — demo frontend authentication (localStorage)
   Keys: stacklyUser {name,email,phone,location,role,password}
         stacklySession {email, role, name, ts}
   ============================================================ */
(function () {
  'use strict';

  var USER_KEY = 'stacklyUser';
  var SESSION_KEY = 'stacklySession';

  function getUser() {
    try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch (e) { return null; }
  }
  function showAlert(el, msg, ok) {
    if (!el) return;
    el.textContent = '';
    el.className = 'auth-alert show ' + (ok ? 'ok' : 'error');
    el.appendChild(document.createTextNode(msg));
  }

  /* ---------- Role toggle ---------- */
  var roleInput = document.getElementById('auth-role');
  document.querySelectorAll('.role-toggle button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.role-toggle button').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      if (roleInput) roleInput.value = btn.getAttribute('data-role');
    });
  });

  /* ---------- Password visibility ---------- */
  document.querySelectorAll('.pw-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = btn.closest('.pw-wrap').querySelector('input');
      var show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      btn.classList.toggle('on', show);
    });
  });

  /* ---------- Password strength ---------- */
  var pw = document.getElementById('reg-password');
  var meter = document.querySelector('.pw-meter');
  var hint = document.querySelector('.pw-hint');
  if (pw && meter) {
    pw.addEventListener('input', function () {
      var v = pw.value;
      var s = 0;
      if (v.length >= 8) s++;
      if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++;
      if (/\d/.test(v)) s++;
      if (/[^A-Za-z0-9]/.test(v)) s++;
      meter.setAttribute('data-strength', String(s));
      if (hint) hint.textContent = ['Use 8+ characters.', 'Getting there — mix cases.', 'Good — add a symbol.', 'Strong password.', 'Excellent password.'][s];
    });
  }

  /* ---------- Register ---------- */
  var regForm = document.getElementById('register-form');
  if (regForm) {
    regForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var alert = document.getElementById('auth-alert');
      var name = document.getElementById('reg-name');
      var email = document.getElementById('reg-email');
      var phone = document.getElementById('reg-phone');
      var loc = document.getElementById('reg-location');
      var pass = document.getElementById('reg-password');
      var pass2 = document.getElementById('reg-password2');
      var terms = document.getElementById('reg-terms');
      var role = roleInput ? roleInput.value : 'user';
      var V = window.STACKLY.validate;
      var ok = true;

      if (name.value.trim().length < 2) { V.setInvalid(name, 'Please enter your full name.'); ok = false; }
      if (!V.EMAIL_RE.test(email.value.trim())) { V.setInvalid(email, 'Enter a valid email address.'); ok = false; }
      if (!V.PHONE_RE.test(phone.value.trim())) { V.setInvalid(phone, 'Enter a valid phone number.'); ok = false; }
      if (!loc.value.trim()) { V.setInvalid(loc, 'Please add your city or location.'); ok = false; }
      if (pass.value.length < 8) { V.setInvalid(pass, 'Password must be at least 8 characters.'); ok = false; }
      if (pass2.value !== pass.value || !pass2.value) { V.setInvalid(pass2, 'Passwords do not match.'); ok = false; }
      if (!terms.checked) { showAlert(alert, 'Please accept the Terms & Conditions to continue.', false); ok = false; }
      if (!ok) return;

      localStorage.setItem(USER_KEY, JSON.stringify({
        name: name.value.trim(),
        email: email.value.trim().toLowerCase(),
        phone: phone.value.trim(),
        location: loc.value.trim(),
        role: role,
        password: pass.value
      }));
      showAlert(alert, 'Account created. Redirecting you to sign in…', true);
      setTimeout(function () { window.location.href = 'login.html'; }, 1200);
    });
  }

  /* ---------- Login ---------- */
  var loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var alert = document.getElementById('auth-alert');
      var email = document.getElementById('login-email');
      var pass = document.getElementById('login-password');
      var remember = document.getElementById('login-remember');
      var role = roleInput ? roleInput.value : 'user';
      var V = window.STACKLY.validate;

      if (!V.EMAIL_RE.test(email.value.trim())) { V.setInvalid(email, 'Enter a valid email address.'); return; }
      if (!pass.value) { V.setInvalid(pass, 'Please enter your password.'); return; }

      var user = getUser();
      if (!user) {
        // Demo fallback: accept any valid email, create a profile on the fly
        user = { name: email.value.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }), email: email.value.trim().toLowerCase(), role: role };
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      }
      if (user.email !== email.value.trim().toLowerCase()) {
        showAlert(alert, 'No account found for this email. Try registering first.', false);
        return;
      }
      user.role = role;
      localStorage.setItem(USER_KEY, JSON.stringify(user));

      var session = { name: user.name, email: user.email, role: role, ts: Date.now() };
      (remember && remember.checked ? localStorage : sessionStorage);
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));

      showAlert(alert, 'Welcome back, ' + user.name.split(' ')[0] + '. Signing you in…', true);
      setTimeout(function () {
        window.location.href = role === 'admin' ? 'seller-dashboard.html' : 'dashboard.html';
      }, 900);
    });
  }
})();
