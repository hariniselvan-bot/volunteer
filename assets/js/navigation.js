/* ============================================================
   navigation.js — header, mobile menu, dropdowns, active page
   ============================================================ */
(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var burger = document.querySelector('.hamburger');
  var menu = document.querySelector('.mobile-menu');

  /* ---------- Sticky header state ---------- */
  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  function closeMenu() {
    document.body.classList.remove('menu-open');
    document.body.style.overflow = '';
    if (burger) {
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
    }
  }
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = document.body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';
      if (open && window.gsap && !window.STACKLY.reduced) {
        gsap.fromTo('.mobile-menu .m-link, .mobile-menu .m-cta, .mobile-menu .m-contact',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.07, delay: 0.25, ease: 'power3.out', overwrite: true });
      } else if (open) {
        document.querySelectorAll('.mobile-menu .m-link').forEach(function (l) {
          l.style.opacity = 1; l.style.transform = 'none';
        });
      }
    });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  /* ---------- Dropdowns (click support for touch/keyboard) ---------- */
  document.querySelectorAll('.has-dropdown > .nav-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (window.innerWidth > 1024) {
        var li = link.parentElement;
        var wasOpen = li.classList.contains('open');
        document.querySelectorAll('.has-dropdown.open').forEach(function (o) {
          o.classList.remove('open');
          o.querySelector('.nav-link').setAttribute('aria-expanded', 'false');
        });
        if (!wasOpen) {
          e.preventDefault();
          li.classList.add('open');
          link.setAttribute('aria-expanded', 'true');
        }
      }
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.has-dropdown')) {
      document.querySelectorAll('.has-dropdown.open').forEach(function (o) {
        o.classList.remove('open');
        o.querySelector('.nav-link').setAttribute('aria-expanded', 'false');
      });
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.has-dropdown.open').forEach(function (o) {
        o.classList.remove('open');
        o.querySelector('.nav-link').setAttribute('aria-expanded', 'false');
      });
    }
  });

  /* ---------- Active nav link ---------- */
  var page = (window.location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-link').forEach(function (link) {
    var href = link.getAttribute('href') || '';
    var target = href.split('#')[0];
    if (target === page) {
      link.classList.add('active');
      var parentDrop = link.closest('.dropdown-menu');
      if (parentDrop) parentDrop.closest('.has-dropdown').querySelector('.nav-link').classList.add('active');
    }
  });
  document.querySelectorAll('.mobile-menu .m-link').forEach(function (link) {
    var href = link.getAttribute('href') || '';
    if (href.split('#')[0] === page) link.classList.add('active');
  });
})();
