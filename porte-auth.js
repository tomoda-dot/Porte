/**
 * porte-auth.js
 * Porte 全システム共通のセッション・スタッフ在籍判定・並び順ヘルパー
 * （index.html / tablet.html / training.html / mypage.html で共用）
 */
(function (global) {
  'use strict';

  var ROLE_ORDER = {
    'サービス管理責任者': 1,
    '生活支援員': 2,
    '職業指導員': 3
  };

  function getTodayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function isStaffActive(s, targetDate) {
    if (!s) return false;
    var td = targetDate || getTodayStr();
    var join = String(s.joinDate || s.startDate || '').trim();
    var retire = String(s.retireDate || s.endDate || '').trim();
    if (join && join > td) return false;
    if (retire && retire < td) return false;
    return true;
  }

  function sortStaffList(list) {
    return (list || []).slice().sort(function (a, b) {
      var diff = (ROLE_ORDER[a.role] || 99) - (ROLE_ORDER[b.role] || 99);
      if (diff !== 0) return diff;
      return String(a.id || '').localeCompare(String(b.id || ''));
    });
  }

  function filterLoginStaff(list, targetDate) {
    var active = (list || []).filter(function (s) {
      if (!s) return false;
      var lid = String(s.loginId || '').toLowerCase();
      var name = String(s.name || '').toLowerCase();
      if (lid === 'administrator' || name === 'administrator') return false;
      return isStaffActive(s, targetDate);
    });
    return sortStaffList(active);
  }

  function savePorteSession(staffObj) {
    if (!staffObj) return;
    var keepEl = document.getElementById('chk-keep-login');
    var keep = false;
    try {
      keep = keepEl ? !!keepEl.checked : (localStorage.getItem('porte_keep_login') === '1');
      localStorage.setItem('porte_keep_login', keep ? '1' : '0');
    } catch (e) { }
    var payload = JSON.stringify(staffObj);
    try {
      sessionStorage.setItem('porte_session', payload);
      sessionStorage.setItem('tb_me', payload);
    } catch (e) { }
    try {
      if (keep) localStorage.setItem('porte_session', payload);
      else localStorage.removeItem('porte_session');
    } catch (e) { }
  }

  function loadPorteSession() {
    try {
      var s = sessionStorage.getItem('porte_session') ||
              localStorage.getItem('porte_session') ||
              sessionStorage.getItem('tb_me');
      return s ? JSON.parse(s) : null;
    } catch (e) {
      return null;
    }
  }

  function clearPorteSession() {
    var keys = ['porte_session', 'tb_me', 'mp', 'porte_training_admin_auth'];
    for (var i = 0; i < keys.length; i++) {
      try { sessionStorage.removeItem(keys[i]); } catch (e) { }
    }
    try { localStorage.removeItem('porte_session'); } catch (e) { }
  }

  global.PorteAuth = {
    ROLE_ORDER: ROLE_ORDER,
    isStaffActive: isStaffActive,
    sortStaffList: sortStaffList,
    filterLoginStaff: filterLoginStaff,
    savePorteSession: savePorteSession,
    loadPorteSession: loadPorteSession,
    clearPorteSession: clearPorteSession
  };

  if (typeof global.isStaffActive !== 'function') global.isStaffActive = isStaffActive;
  if (typeof global.savePorteSession !== 'function') global.savePorteSession = savePorteSession;
  if (typeof global.loadPorteSession !== 'function') global.loadPorteSession = loadPorteSession;
  if (typeof global.clearPorteSession !== 'function') global.clearPorteSession = clearPorteSession;
})(window);
