/* ============================================================
   dashboard.js — session, sidebar drawer, notifications,
   logout, canvas charts (no chart libraries)
   ============================================================ */
(function () {
  'use strict';

  var SESSION_KEY = 'stacklySession';

  /* ---------- Session ---------- */
  var session = null;
  try { session = JSON.parse(localStorage.getItem(SESSION_KEY)); } catch (e) { session = null; }
  var isDash = document.body.classList.contains('dash-body');
  if (isDash && !session) {
    window.location.href = 'login.html';
    return;
  }
  if (isDash && session) {
    var first = (session.name || 'Volunteer').split(' ')[0];
    var initials = (session.name || 'S').split(' ').map(function (w) { return w[0]; }).slice(0, 2).join('').toUpperCase();
    document.querySelectorAll('[data-user-name]').forEach(function (el) { el.textContent = session.name; });
    document.querySelectorAll('[data-user-first]').forEach(function (el) { el.textContent = first; });
    document.querySelectorAll('[data-user-email]').forEach(function (el) { el.textContent = session.email; });
    document.querySelectorAll('[data-user-initials]').forEach(function (el) { el.textContent = initials; });
    document.querySelectorAll('[data-user-role]').forEach(function (el) { el.textContent = session.role === 'admin' ? 'Organization Admin' : 'Volunteer'; });
  }

  /* ---------- Logout ---------- */
  document.querySelectorAll('[data-logout]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      localStorage.removeItem(SESSION_KEY);
      window.location.href = 'login.html';
    });
  });

  /* ---------- Sidebar drawer (mobile) ---------- */
  var burger = document.querySelector('.dash-burger');
  var overlay = document.querySelector('.side-overlay');
  function setSide(open) {
    document.body.classList.toggle('side-open', open);
    if (overlay) overlay.classList.toggle('show', open);
    if (burger) burger.setAttribute('aria-expanded', String(open));
  }
  if (burger) burger.addEventListener('click', function () { setSide(!document.body.classList.contains('side-open')); });
  if (overlay) overlay.addEventListener('click', function () { setSide(false); });

  /* ---------- Notifications panel ---------- */
  var bell = document.querySelector('[data-notif-btn]');
  var panel = document.querySelector('.notif-panel');
  if (bell && panel) {
    bell.addEventListener('click', function (e) {
      e.stopPropagation();
      panel.classList.toggle('show');
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.notif-panel') && !e.target.closest('[data-notif-btn]')) panel.classList.remove('show');
    });
  }

  /* ---------- Canvas charts ---------- */
  var FONT = '600 11px Manrope, sans-serif';
  var MUTED = '#69746E';
  var FOREST = '#102B22';
  var DEEP = '#173D2F';
  var LIME = '#C9F45A';
  var LIME_L = '#DFFF91';

  function fitCanvas(canvas) {
    var dpr = window.devicePixelRatio || 1;
    var w = canvas.parentElement.clientWidth;
    var h = parseInt(canvas.getAttribute('data-h') || '240', 10);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.height = h + 'px';
    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return { ctx: ctx, w: w, h: h };
  }

  /* Line chart — volunteer growth */
  var lineC = document.getElementById('chart-line');
  if (lineC) {
    var d = fitCanvas(lineC), ctx = d.ctx;
    var data = [120, 190, 160, 260, 310, 420, 390, 520, 610, 700, 820, 940];
    var labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var pad = { l: 38, r: 12, t: 16, b: 28 };
    var max = 1000;
    function px(i) { return pad.l + (d.w - pad.l - pad.r) * (i / (data.length - 1)); }
    function py(v) { return d.h - pad.b - (d.h - pad.t - pad.b) * (v / max); }
    ctx.strokeStyle = 'rgba(16,43,34,0.08)';
    ctx.fillStyle = MUTED; ctx.font = FONT; ctx.textAlign = 'right';
    for (var g = 0; g <= 4; g++) {
      var gv = (max / 4) * g;
      ctx.beginPath(); ctx.moveTo(pad.l, py(gv)); ctx.lineTo(d.w - pad.r, py(gv)); ctx.stroke();
      ctx.fillText(String(gv), pad.l - 8, py(gv) + 4);
    }
    ctx.textAlign = 'center';
    labels.forEach(function (l, i) { if (i % 2 === 0) ctx.fillText(l, px(i), d.h - 10); });
    // area
    var grad = ctx.createLinearGradient(0, pad.t, 0, d.h - pad.b);
    grad.addColorStop(0, 'rgba(201,244,90,0.45)');
    grad.addColorStop(1, 'rgba(201,244,90,0)');
    ctx.beginPath();
    ctx.moveTo(px(0), py(data[0]));
    data.forEach(function (v, i) { ctx.lineTo(px(i), py(v)); });
    ctx.lineTo(px(data.length - 1), d.h - pad.b); ctx.lineTo(px(0), d.h - pad.b); ctx.closePath();
    ctx.fillStyle = grad; ctx.fill();
    // line
    ctx.beginPath();
    data.forEach(function (v, i) { i === 0 ? ctx.moveTo(px(i), py(v)) : ctx.lineTo(px(i), py(v)); });
    ctx.strokeStyle = DEEP; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.stroke();
    // points
    data.forEach(function (v, i) {
      ctx.beginPath(); ctx.arc(px(i), py(v), 3.4, 0, Math.PI * 2);
      ctx.fillStyle = '#fff'; ctx.fill(); ctx.strokeStyle = DEEP; ctx.lineWidth = 2; ctx.stroke();
    });
  }

  /* Bar chart — donations by month */
  var barC = document.getElementById('chart-bars');
  if (barC) {
    var b = fitCanvas(barC), btx = b.ctx;
    var vals = [42, 68, 55, 90, 74, 110, 96, 125];
    var blabels = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
    var bmax = 140;
    var bw = (b.w - 40) / vals.length;
    btx.font = FONT; btx.fillStyle = MUTED; btx.textAlign = 'center';
    vals.forEach(function (v, i) {
      var x = 24 + i * bw + bw * 0.18;
      var w = bw * 0.64;
      var h = (b.h - 52) * (v / bmax);
      var y = b.h - 30 - h;
      btx.fillStyle = i === vals.length - 1 ? LIME : 'rgba(23,61,47,0.85)';
      btx.beginPath();
      btx.roundRect ? btx.roundRect(x, y, w, h, 6) : btx.rect(x, y, w, h);
      btx.fill();
      btx.fillStyle = MUTED;
      btx.fillText(blabels[i], x + w / 2, b.h - 12);
      btx.fillStyle = FOREST;
      btx.fillText('₹' + v + 'k', x + w / 2, y - 7);
    });
  }

  /* Donut — program distribution */
  var donutC = document.getElementById('chart-donut');
  if (donutC) {
    var o = fitCanvas(donutC), otx = o.ctx;
    var parts = [
      { v: 32, c: LIME, l: 'Community' },
      { v: 24, c: DEEP, l: 'Environment' },
      { v: 18, c: LIME_L, l: 'Education' },
      { v: 14, c: '#5E8F76', l: 'Healthcare' },
      { v: 12, c: '#B9CEC2', l: 'Relief' }
    ];
    var total = parts.reduce(function (s, p) { return s + p.v; }, 0);
    var cx = o.w / 2, cy = o.h / 2, r = Math.min(o.w, o.h) / 2 - 14;
    var a0 = -Math.PI / 2;
    parts.forEach(function (p) {
      var a1 = a0 + (p.v / total) * Math.PI * 2;
      otx.beginPath();
      otx.arc(cx, cy, r, a0 + 0.02, a1 - 0.02);
      otx.arc(cx, cy, r * 0.62, a1 - 0.02, a0 + 0.02, true);
      otx.closePath();
      otx.fillStyle = p.c; otx.fill();
      a0 = a1;
    });
    otx.fillStyle = FOREST;
    otx.font = '800 26px Manrope, sans-serif'; otx.textAlign = 'center';
    otx.fillText('150+', cx, cy - 2);
    otx.font = FONT; otx.fillStyle = MUTED;
    otx.fillText('initiatives', cx, cy + 18);
  }
})();
