/* ============================================================
   animations.js — GSAP / ScrollTrigger: hero, parallax,
   counters, reveals, SVG draw, tilt
   ============================================================ */
(function () {
  'use strict';

  window.STACKLY = window.STACKLY || {};
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!window.gsap) return;
  if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ---------- Hero intro (word-by-word) ---------- */
  var heroTitle = document.querySelector('.hero-title, [data-split-title]');
  if (heroTitle) {
    heroTitle.classList.add('js-split');
    heroTitle.querySelectorAll('.line, h1, span.split-target').forEach(function () {});
    // wrap words
    var targets = heroTitle.querySelectorAll('.line');
    targets.forEach(function (line) {
      var nodes = Array.prototype.slice.call(line.childNodes);
      nodes.forEach(function (node) {
        if (node.nodeType === 3) {
          var frag = document.createDocumentFragment();
          node.textContent.split(/(\s+)/).forEach(function (piece) {
            if (!piece.trim()) { frag.appendChild(document.createTextNode(piece)); return; }
            var w = document.createElement('span');
            w.className = 'word';
            w.textContent = piece;
            frag.appendChild(w);
          });
          line.replaceChild(frag, node);
        } else if (node.nodeType === 1) {
          node.classList.add('word');
        }
      });
    });

    window.STACKLY.heroIntro = function () {
      if (reduced) { heroTitle.classList.add('lines-in'); return; }
      var tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: function () { heroTitle.classList.add('lines-in'); }
      });
      tl.from('.hero-trust, [data-hero="trust"]', { y: 24, opacity: 0, duration: 0.7 })
        .from('.hero-pills .pill', { y: 18, opacity: 0, duration: 0.5, stagger: 0.08 }, '-=0.4')
        .from('.hero-title .word, [data-split-title] .word', {
          yPercent: 110, opacity: 0, rotate: 2,
          duration: 0.9, stagger: 0.09, ease: 'power4.out'
        }, '-=0.35')
        .from('.hero-desc, [data-hero="desc"]', { y: 22, opacity: 0, duration: 0.7 }, '-=0.5')
        .from('.hero-actions, [data-hero="actions"]', { y: 22, opacity: 0, duration: 0.7 }, '-=0.5')
        .from('.impact-card', { y: 40, opacity: 0, scale: 0.94, duration: 0.8, ease: 'back.out(1.4)' }, '-=0.5')
        .from('.mini-media-card', { y: 40, opacity: 0, scale: 0.94, duration: 0.8, ease: 'back.out(1.4)' }, '-=0.6')
        .from('.float-badge', { y: -30, opacity: 0, duration: 0.8 }, '-=0.6');

      // floating loops
      gsap.to('.impact-card', { y: -12, duration: 3.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      gsap.to('.mini-media-card', { y: -9, duration: 2.7, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.4 });
      gsap.to('.float-badge', { y: -10, duration: 3.6, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.2 });

      // mouse parallax on hero cards
      var hero = document.querySelector('.hero-inner');
      if (hero && window.matchMedia('(hover:hover)').matches) {
        hero.addEventListener('mousemove', function (e) {
          var r = hero.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width - 0.5;
          var y = (e.clientY - r.top) / r.height - 0.5;
          gsap.to('.impact-card', { x: x * 16, duration: 0.6, overwrite: 'auto' });
          gsap.to('.mini-media-card', { x: x * -12, duration: 0.6, overwrite: 'auto' });
          gsap.to('.float-badge', { x: x * 22, duration: 0.6, overwrite: 'auto' });
        });
      }
    };
  }

  if (!window.ScrollTrigger || reduced) {
    // Still run counters instantly
    document.querySelectorAll('[data-count]').forEach(function (el) {
      el.firstChild && (el.childNodes[0].nodeValue = el.getAttribute('data-count'));
    });
    return;
  }

  /* ---------- Hero background parallax ---------- */
  document.querySelectorAll('.hero-bg img, .ph-bg img, [data-parallax] img').forEach(function (img) {
    gsap.to(img, {
      yPercent: 12, ease: 'none',
      scrollTrigger: { trigger: img.closest('.hero-inner, .page-hero-inner, [data-parallax]'), start: 'top top', end: 'bottom top', scrub: true }
    });
  });

  /* ---------- Counters ---------- */
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = (el.getAttribute('data-count').split('.')[1] || '').length;
    var obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: function () {
        gsap.to(obj, {
          v: target, duration: 2, ease: 'power2.out',
          onUpdate: function () {
            el.childNodes[0].nodeValue = decimals ? obj.v.toFixed(decimals) : Math.round(obj.v).toLocaleString('en-IN');
          }
        });
      }
    });
  });

  /* ---------- Generic reveal batches ---------- */
  gsap.utils.toArray('[data-reveal]').forEach(function (el) {
    gsap.from(el, {
      y: 44, opacity: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });
  gsap.utils.toArray('[data-reveal-group]').forEach(function (group) {
    gsap.from(group.children, {
      y: 48, opacity: 0, duration: 0.85, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: group, start: 'top 85%', once: true }
    });
  });

  /* ---------- Mask image reveals ---------- */
  gsap.utils.toArray('.mask-reveal').forEach(function (el) {
    gsap.to(el, {
      clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power3.inOut',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true }
    });
  });

  /* ---------- Steps line draw ---------- */
  gsap.utils.toArray('.steps-wrap').forEach(function (wrap) {
    gsap.from(wrap.querySelectorAll('.step'), {
      y: 40, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: wrap, start: 'top 82%', once: true }
    });
  });

  /* ---------- SVG draw ---------- */
  gsap.utils.toArray('.draw-path').forEach(function (path) {
    ScrollTrigger.create({
      trigger: path, start: 'top 88%', once: true,
      onEnter: function () { path.classList.add('drawn'); }
    });
  });

  /* ---------- Card tilt ---------- */
  if (window.matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('.tilt').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(card, { rotateY: x * 6, rotateX: -y * 6, transformPerspective: 900, duration: 0.5, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', function () {
        gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
      });
    });
  }

  /* ---------- Progress bars (dashboard) ---------- */
  gsap.utils.toArray('.pbar i').forEach(function (bar) {
    var w = bar.getAttribute('data-w') || '60%';
    ScrollTrigger.create({
      trigger: bar, start: 'top 92%', once: true,
      onEnter: function () { bar.style.width = w; }
    });
  });
})();
