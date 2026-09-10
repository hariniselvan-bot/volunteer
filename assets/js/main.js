/* ============================================================
   main.js — global init: preloader, transitions, cursor,
   magnetic buttons, scroll progress, back-to-top, AOS
   ============================================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  window.STACKLY = window.STACKLY || {};
  window.STACKLY.reduced = reduced;

  /* ---------- Image fallback ---------- */
  var FALLBACK = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="800" height="600" fill="#173D2F"/><path d="M400 220c-52 0-90 31-90 74 0 63 106 52 106 107 0 40-34 69-81 69-38 0-70-19-86-47" fill="none" stroke="#C9F45A" stroke-width="18" stroke-linecap="round"/><circle cx="410" cy="212" r="22" fill="#C9F45A"/></svg>'
  );
  document.querySelectorAll('img').forEach(function (img) {
    img.addEventListener('error', function h() {
      img.removeEventListener('error', h);
      img.src = FALLBACK;
    });
  });

  /* ---------- AOS ---------- */
  if (window.AOS) {
    AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 70, disable: reduced });
  }

  /* ---------- Preloader ---------- */
  var pre = document.getElementById('preloader');
  function revealPage() {
    document.body.classList.add('loaded');
    if (window.gsap) {
      gsap.from('.site-header', { y: -30, opacity: 0, duration: 0.8, ease: 'power3.out', clearProps: 'all' });
    }
  }
  if (pre) {
    var count = pre.querySelector('.pre-count');
    var bar = pre.querySelector('.pre-bar i');
    var start = null;
    var DURATION = reduced ? 200 : 1100;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / DURATION, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.round(eased * 100);
      if (count) count.textContent = val + '%';
      if (bar) bar.style.width = val + '%';
      if (p < 1) { requestAnimationFrame(tick); } else { finishPreloader(); }
    }
    function finishPreloader() {
      if (window.gsap && !reduced) {
        var tl = gsap.timeline({ onComplete: function () { pre.remove(); revealPage(); } });
        tl.to(pre.querySelector('.pre-inner'), { y: -24, opacity: 0, duration: 0.45, ease: 'power2.in' })
          .to(pre, { yPercent: -100, duration: 0.7, ease: 'power4.inOut' }, '-=0.1');
      } else {
        pre.style.display = 'none';
        pre.remove();
        revealPage();
      }
      if (window.STACKLY.heroIntro) window.STACKLY.heroIntro();
    }
    if (window.gsap && !reduced) {
      gsap.from(pre.querySelector('.pre-logo'), { scale: 0.6, opacity: 0, duration: 0.7, ease: 'back.out(1.6)' });
      gsap.from(pre.querySelector('.pre-word'), { y: 16, opacity: 0, duration: 0.6, delay: 0.2, ease: 'power3.out' });
    }
    requestAnimationFrame(tick);
  } else {
    revealPage();
    if (window.STACKLY.heroIntro) window.STACKLY.heroIntro();
  }

  /* ---------- Page transitions ---------- */
  var transition = document.querySelector('.page-transition');
  if (transition) {
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) { gsap && gsap.set(transition, { yPercent: 101 }); }
    });
    document.querySelectorAll('a[href$=".html"], a[href$=".html#programs"], a[href^="index.html"]').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (a.target === '_blank' || href.indexOf('http') === 0 || a.hasAttribute('data-no-transition')) return;
      a.addEventListener('click', function (ev) {
        var url = a.href;
        var same = url === window.location.href;
        if (same) return;
        ev.preventDefault();
        if (!window.gsap || reduced) { window.location.href = url; return; }
        gsap.timeline({ onComplete: function () { window.location.href = url; } })
          .set(transition, { yPercent: 101 })
          .to(transition, { yPercent: 0, duration: 0.45, ease: 'power3.inOut' })
          .fromTo(transition.querySelector('svg'), { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3 }, '-=0.15');
      });
    });
  }

  /* ---------- Custom cursor ---------- */
  if (finePointer && !reduced) {
    var dot = document.createElement('div');
    var ring = document.createElement('div');
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    ring.innerHTML = '<span class="cursor-label"></span>';
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    var label = ring.querySelector('.cursor-label');
    var mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; });
    (function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      dot.style.transform = 'translate(' + (mx - 4) + 'px,' + (my - 4) + 'px)';
      ring.style.transform = 'translate(' + (rx - ring.offsetWidth / 2) + 'px,' + (ry - ring.offsetHeight / 2) + 'px)';
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseover', function (e) {
      var t = e.target.closest('[data-cursor], a, button, .program-card, .cause-card, .post-card, .event-card');
      ring.classList.remove('is-hover', 'is-view');
      label.textContent = '';
      if (!t) return;
      var mode = t.getAttribute('data-cursor');
      if (mode === 'view') { ring.classList.add('is-view'); label.textContent = 'VIEW'; }
      else if (mode === 'go') { ring.classList.add('is-view'); label.textContent = 'GO'; }
      else { ring.classList.add('is-hover'); }
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (finePointer && !reduced) {
    document.querySelectorAll('.btn, .slider-btn').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.18;
        var y = (e.clientY - r.top - r.height / 2) * 0.28;
        el.style.transform = 'translate(' + x + 'px,' + (y - 3) + 'px) scale(1.02)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------- Scroll progress + back to top ---------- */
  var progress = document.querySelector('.scroll-progress i');
  var toTop = document.querySelector('.to-top');
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    if (progress) progress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    if (toTop) toTop.classList.toggle('show', h.scrollTop > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); });

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Demo notice for dead links ---------- */
  document.querySelectorAll('a[href="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); });
  });
})();
