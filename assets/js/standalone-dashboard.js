(function () {
  'use strict';
  var session = null;
  try { session = JSON.parse(localStorage.getItem('stacklySession')); } catch (e) {}
  var savedUser = null;
  try { savedUser = JSON.parse(localStorage.getItem('stacklyUser')); } catch (e) {}
  var email = (session && session.email) || (savedUser && savedUser.email) || sessionStorage.getItem('stacklyEmail') || localStorage.getItem('stacklyUserEmail') || 'hello@stackly.org';
  var name = (session && session.name) || (savedUser && savedUser.name) || localStorage.getItem('stacklyUserName') || email.split('@')[0].replace(/[._-]+/g, ' ');
  var initial = name.charAt(0).toUpperCase();

  ['sideEmail', 'topEmail'].forEach(function (id) { var el = document.getElementById(id); if (el) el.textContent = email; });
  ['sideName'].forEach(function (id) { var el = document.getElementById(id); if (el) el.textContent = name; });
  ['sideAvatar', 'topAvatar'].forEach(function (id) { var el = document.getElementById(id); if (el) el.textContent = initial; });

  var sideBrand = document.querySelector('.sidebar .brand');
  if (sideBrand && !sideBrand.querySelector('.sidebar-logo')) {
    sideBrand.href = 'index.html';
    sideBrand.setAttribute('aria-label', 'Stackly home');
    sideBrand.innerHTML = '<img class="sidebar-logo" src="assets/img/impact/logo STAC.webp" alt="Stackly Volunteer Organization">';
  }

  var topbar = document.querySelector('.topbar');
  if (topbar && !topbar.querySelector('.dashboard-header-logo')) {
    var brand = document.createElement('a');
    brand.href = 'index.html'; brand.className = 'dashboard-header-logo'; brand.setAttribute('aria-label', 'Stackly home');
    brand.innerHTML = '<img src="assets/svg/stackly-symbol.svg" alt=""><span>Stackly<small>Volunteer Organization</small></span>';
    topbar.insertBefore(brand, topbar.firstChild);
  }
}());
