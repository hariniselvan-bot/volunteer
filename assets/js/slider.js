/* ============================================================
   slider.js — testimonials slider + blog search/filter/loadmore
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Testimonial / story slider ---------- */
  document.querySelectorAll('[data-slider]').forEach(function (root) {
    var track = root.querySelector('.story-track');
    var slides = track ? Array.prototype.slice.call(track.children) : [];
    if (!slides.length) return;
    var prev = root.querySelector('.slider-btn.prev');
    var next = root.querySelector('.slider-btn.next');
    var dotsWrap = root.querySelector('.slider-dots');
    var index = 0, timer = null;

    slides.forEach(function (_, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Go to story ' + (i + 1));
      if (i === 0) b.classList.add('active');
      b.addEventListener('click', function () { go(i); restart(); });
      dotsWrap && dotsWrap.appendChild(b);
    });
    var dots = dotsWrap ? Array.prototype.slice.call(dotsWrap.children) : [];

    function go(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + index * 100 + '%)';
      dots.forEach(function (d, j) { d.classList.toggle('active', j === index); });
    }
    function restart() {
      if (timer) clearInterval(timer);
      if (!window.STACKLY.reduced) timer = setInterval(function () { go(index + 1); }, 6500);
    }
    prev && prev.addEventListener('click', function () { go(index - 1); restart(); });
    next && next.addEventListener('click', function () { go(index + 1); restart(); });

    /* swipe */
    var startX = null;
    track.addEventListener('pointerdown', function (e) { startX = e.clientX; });
    window.addEventListener('pointerup', function (e) {
      if (startX === null) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
      startX = null; restart();
    });
    restart();
  });

  /* ---------- Blog: search + category filter + load more ---------- */
  var blogGrid = document.getElementById('blog-grid');
  if (blogGrid) {
    var cards = Array.prototype.slice.call(blogGrid.querySelectorAll('.post-card'));
    var chips = Array.prototype.slice.call(document.querySelectorAll('.blog-chips .chip'));
    var search = document.getElementById('blog-search-input');
    var moreBtn = document.getElementById('load-more');
    var empty = document.querySelector('.blog-empty');
    var PAGE = 6;
    var shown = PAGE;
    var activeCat = 'all';
    var query = '';

    function matches(card) {
      var cat = card.getAttribute('data-category');
      var text = (card.textContent || '').toLowerCase();
      var okCat = activeCat === 'all' || cat === activeCat;
      var okQuery = !query || text.indexOf(query) !== -1;
      return okCat && okQuery;
    }
    function render() {
      var visible = 0;
      cards.forEach(function (card) {
        if (matches(card) && visible < shown) {
          card.style.display = '';
          visible++;
        } else {
          card.style.display = 'none';
        }
      });
      var total = cards.filter(matches).length;
      if (empty) empty.style.display = total === 0 ? 'block' : 'none';
      if (moreBtn) moreBtn.style.display = total > shown ? '' : 'none';
    }
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
        activeCat = chip.getAttribute('data-cat');
        shown = PAGE;
        render();
      });
    });
    if (search) {
      search.addEventListener('input', function () {
        query = search.value.trim().toLowerCase();
        shown = PAGE;
        render();
      });
    }
    if (moreBtn) {
      moreBtn.addEventListener('click', function () {
        shown += PAGE;
        render();
        if (window.gsap && !window.STACKLY.reduced) {
          gsap.from(cards.filter(function (c) { return c.style.display !== 'none'; }).slice(-PAGE),
            { y: 30, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' });
        }
      });
    }
    render();
  }
})();
