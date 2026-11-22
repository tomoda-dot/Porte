/**
 * hitotsugi-launcher.js
 * ひとつぎ（Porte / DagashiShop）共通ヘッダーランチャー & 統一「戻る」ヘルパー
 *
 * 使い方:
 *   HitotsugiLauncher.init({
 *     appId: 'work-schedule',          // 現在ページのID（一覧でハイライト）
 *     replaceSelector: '.app-title img', // 既存の左上アイコンを丸いクマボタンに置換
 *     quickBack: true,                 // アイコン横に小さな「← 戻る」ボタンを表示するか
 *     onBack: function () {            // ページ固有の1ステップ戻り処理。trueを返すとそこで停止
 *       ...
 *       return false;
 *     }
 *   });
 */
(function (global) {
  'use strict';

  var PORTE_BASE = 'https://tomoda-dot.github.io/Porte/';
  var DAGASHI_BASE = 'https://tomoda-dot.github.io/DagashiShop/';

  var APPS = [
    { id: 'tablet',        label: '日報入力',           icon: '📝', url: PORTE_BASE + 'tablet.html' },
    { id: 'work-schedule', label: '作業スケジュール',   icon: '📅', url: PORTE_BASE + 'work-schedule.html' },
    { id: 'haccp',         label: '珈琲HACCP',          icon: '☕', url: PORTE_BASE + 'haccp.html' },
    { id: 'timecard',      label: 'タイムカード',       icon: '⏰', url: PORTE_BASE + 'timecard.html' },
    { id: 'mypage',        label: 'マイページ',         icon: '👤', url: PORTE_BASE + 'mypage.html' },
    { id: 'training',      label: '研修アカデミー',     icon: '🎓', url: PORTE_BASE + 'training.html' },
    { id: 'regi',          label: 'おかしのレジ',       icon: '🍬', url: DAGASHI_BASE + 'regi.html' },
    { id: 'admin',         label: '売上管理',           icon: '📊', url: DAGASHI_BASE + 'admin.html' },
    { id: 'purchase-log',  label: '仕入れ・賞味期限',   icon: '📦', url: DAGASHI_BASE + 'purchase-log.html' }
  ];

  var _opts = {};
  var _isOpen = false;
  var _popoverEl = null;
  var _triggerEl = null;

  function getTopUrl() {
    var isMobile = global.innerWidth <= 768 || /iPhone|Android.+Mobile/i.test(navigator.userAgent || '');
    return DAGASHI_BASE + (isMobile ? 'mobile_top.html' : 'index.html');
  }

  function getIconSrc() {
    if (location.pathname.indexOf('/Porte/') !== -1 || location.hostname === '' || location.protocol === 'file:') {
      return 'favicon-kuma.jpg';
    }
    return PORTE_BASE + 'favicon-kuma.jpg';
  }

  function getSessionUser() {
    var keys = ['porte_session', 'porte_user', 'dagashi_staff'];
    for (var i = 0; i < keys.length; i++) {
      var raw = null;
      try { raw = sessionStorage.getItem(keys[i]) || localStorage.getItem(keys[i]); } catch (e) {}
      if (!raw) continue;
      try {
        var parsed = JSON.parse(raw);
        if (parsed && (parsed.name || parsed.display_name || parsed.staff_name)) {
          return {
            name: parsed.name || parsed.display_name || parsed.staff_name,
            role: parsed.role || ''
          };
        }
      } catch (e2) {
        if (typeof raw === 'string' && raw.trim()) {
          return { name: raw.trim(), role: '' };
        }
      }
    }
    return null;
  }

  function clearSessionAndGoLogin() {
    var keys = ['porte_session', 'porte_user', 'dagashi_staff'];
    for (var i = 0; i < keys.length; i++) {
      try { sessionStorage.removeItem(keys[i]); } catch (e) {}
      try { localStorage.removeItem(keys[i]); } catch (e) {}
    }
    location.href = getTopUrl();
  }

  function goBack() {
    closeMenu();

    // 1. ページ固有のステップ戻り（モーダル閉じ・サブタブ戻り等）
    if (typeof _opts.onBack === 'function') {
      try {
        if (_opts.onBack() === true) return;
      } catch (e) {
        console.warn('[HitotsugiLauncher] onBack error:', e);
      }
    }

    // 2. 汎用フォールバック: 表示中のモーダルがあれば閉じる試み
    var openOverlay = document.querySelector('.modal-overlay.show, .modal-backdrop.show, [role="dialog"].show');
    if (openOverlay) {
      openOverlay.classList.remove('show');
      return;
    }

    // 3. 同一オリジン内の前ページがあれば history.back()、なければストアTOPへ
    if (document.referrer && document.referrer.indexOf(location.origin) === 0 && history.length > 1) {
      history.back();
    } else {
      location.href = getTopUrl();
    }
  }

  function injectStyles() {
    if (document.getElementById('hl-launcher-styles')) return;
    var style = document.createElement('style');
    style.id = 'hl-launcher-styles';
    style.textContent = [
      '.hl-wrap { display: inline-flex; align-items: center; gap: 6px; position: relative; flex-shrink: 0; }',
      '.hl-trigger { position: relative; display: inline-flex; align-items: center; justify-content: center; width: 38px; height: 38px; padding: 0; border-radius: 50%; border: 2px solid rgba(255,255,255,0.85); background: #fff; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.2); transition: transform 0.15s ease, box-shadow 0.15s ease; overflow: visible; flex-shrink: 0; }',
      '.hl-trigger:hover { transform: scale(1.06); box-shadow: 0 3px 10px rgba(0,0,0,0.28); }',
      '.hl-trigger:active { transform: scale(0.96); }',
      '.hl-trigger img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; display: block; pointer-events: none; }',
      '.hl-trigger-badge { position: absolute; right: -3px; bottom: -3px; width: 15px; height: 15px; border-radius: 50%; background: #fff; color: #334155; font-size: 8px; font-weight: 800; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 3px rgba(0,0,0,0.3); pointer-events: none; line-height: 1; }',
      '.hl-back-btn { display: inline-flex; align-items: center; gap: 3px; height: 30px; padding: 0 10px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.45); background: rgba(255,255,255,0.18); color: inherit; font-family: inherit; font-size: 12px; font-weight: 700; cursor: pointer; white-space: nowrap; transition: background 0.15s ease; }',
      '.hl-back-btn:hover { background: rgba(255,255,255,0.3); }',
      '.hl-popover { position: fixed; z-index: 99999; width: 300px; max-width: calc(100vw - 24px); background: #ffffff; color: #1e293b; border-radius: 16px; box-shadow: 0 14px 40px rgba(15,23,42,0.28), 0 0 0 1px rgba(15,23,42,0.08); padding: 12px; font-family: "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", sans-serif; display: none; }',
      '.hl-popover.open { display: block; animation: hlPopIn 0.14s ease-out; }',
      '@keyframes hlPopIn { from { opacity: 0; transform: translateY(-6px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }',
      '.hl-user-bar { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 8px 10px; background: #f8fafc; border-radius: 10px; margin-bottom: 10px; border: 1px solid #e2e8f0; }',
      '.hl-user-info { display: flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 700; color: #334155; min-width: 0; }',
      '.hl-user-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }',
      '.hl-user-action { border: 1px solid #cbd5e1; background: #fff; color: #475569; border-radius: 8px; padding: 4px 8px; font-size: 11px; font-weight: 700; cursor: pointer; white-space: nowrap; }',
      '.hl-user-action:hover { background: #f1f5f9; color: #0f172a; }',
      '.hl-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 10px; }',
      '.hl-act-btn { display: flex; align-items: center; justify-content: center; gap: 5px; padding: 9px 8px; border-radius: 10px; border: 1px solid #e2e8f0; background: #fff; color: #1e293b; font-size: 12.5px; font-weight: 700; cursor: pointer; text-decoration: none; transition: background 0.12s; }',
      '.hl-act-btn:hover { background: #f1f5f9; }',
      '.hl-act-btn.primary { background: #fff7ed; border-color: #fed7aa; color: #c2410c; }',
      '.hl-act-btn.primary:hover { background: #ffedd5; }',
      '.hl-sec-title { font-size: 11px; font-weight: 700; color: #64748b; margin: 4px 2px 6px; letter-spacing: 0.03em; }',
      '.hl-app-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }',
      '.hl-app-item { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; padding: 8px 4px; border-radius: 10px; border: 1px solid #e2e8f0; background: #fff; color: #334155; text-decoration: none; font-size: 11px; font-weight: 700; text-align: center; line-height: 1.25; transition: background 0.12s, border-color 0.12s; }',
      '.hl-app-item:hover { background: #f8fafc; border-color: #cbd5e1; }',
      '.hl-app-item.current { background: #eff6ff; border-color: #93c5fd; color: #1d4ed8; }',
      '.hl-app-ico { font-size: 18px; line-height: 1; }'
    ].join('\n');
    document.head.appendChild(style);
  }

  function buildPopover() {
    if (_popoverEl) return _popoverEl;
    var pop = document.createElement('div');
    pop.className = 'hl-popover';
    pop.id = 'hl-popover';
    document.body.appendChild(pop);

    document.addEventListener('click', function (e) {
      if (!_isOpen) return;
      if (pop.contains(e.target) || (_triggerEl && _triggerEl.contains(e.target))) return;
      closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && _isOpen) closeMenu();
    });
    global.addEventListener('resize', function () {
      if (_isOpen) positionPopover();
    });

    _popoverEl = pop;
    return pop;
  }

  function renderPopoverContent() {
    var pop = buildPopover();
    var user = getSessionUser();
    var topUrl = getTopUrl();

    var userHtml = user
      ? '<div class="hl-user-bar">' +
          '<div class="hl-user-info"><span>👤</span><span class="hl-user-name">' + escapeHtml(user.name) + '</span></div>' +
          '<button type="button" class="hl-user-action" id="hl-logout-btn">切替 / ログアウト</button>' +
        '</div>'
      : '<div class="hl-user-bar">' +
          '<div class="hl-user-info"><span>👤</span><span class="hl-user-name">未ログイン（ゲスト）</span></div>' +
          '<a class="hl-user-action" href="' + topUrl + '" style="text-decoration:none;">ログインへ</a>' +
        '</div>';

    var appsHtml = APPS.map(function (app) {
      var isCurrent = _opts.appId && _opts.appId === app.id;
      return '<a class="hl-app-item' + (isCurrent ? ' current' : '') + '" href="' + app.url + '">' +
        '<span class="hl-app-ico">' + app.icon + '</span>' +
        '<span>' + escapeHtml(app.label) + '</span>' +
      '</a>';
    }).join('');

    pop.innerHTML =
      userHtml +
      '<div class="hl-actions">' +
        '<button type="button" class="hl-act-btn" id="hl-pop-back">← 1つ前に戻る</button>' +
        '<a class="hl-act-btn primary" href="' + topUrl + '">🏠 ストアTOP</a>' +
      '</div>' +
      '<div class="hl-sec-title">🔄 他のシステムへ切替</div>' +
      '<div class="hl-app-grid">' + appsHtml + '</div>';

    var backBtn = pop.querySelector('#hl-pop-back');
    if (backBtn) backBtn.addEventListener('click', goBack);

    var logoutBtn = pop.querySelector('#hl-logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', clearSessionAndGoLogin);
  }

  function positionPopover() {
    if (!_triggerEl || !_popoverEl) return;
    var rect = _triggerEl.getBoundingClientRect();
    var left = Math.max(12, Math.min(rect.left, global.innerWidth - 312));
    var top = rect.bottom + 8;
    _popoverEl.style.left = left + 'px';
    _popoverEl.style.top = top + 'px';
  }

  function openMenu() {
    renderPopoverContent();
    _popoverEl.classList.add('open');
    _isOpen = true;
    positionPopover();
  }

  function closeMenu() {
    if (_popoverEl) _popoverEl.classList.remove('open');
    _isOpen = false;
  }

  function toggleMenu(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (_isOpen) closeMenu();
    else openMenu();
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function init(options) {
    _opts = options || {};
    injectStyles();

    var mount = function () {
      var target = _opts.replaceSelector ? document.querySelector(_opts.replaceSelector) : null;
      if (!target && _opts.prependSelector) {
        var parent = document.querySelector(_opts.prependSelector);
        if (parent) {
          target = document.createElement('span');
          parent.insertBefore(target, parent.firstChild);
        }
      }
      if (!target) return;

      var wrap = document.createElement('span');
      wrap.className = 'hl-wrap';

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'hl-trigger';
      btn.title = 'ひとつぎメニュー（TOP・戻る・切替）';
      btn.setAttribute('aria-label', 'ひとつぎメニュー');
      btn.innerHTML = '<img src="' + getIconSrc() + '" alt="ひとつぎ"><span class="hl-trigger-badge">▼</span>';
      btn.addEventListener('click', toggleMenu);
      _triggerEl = btn;
      wrap.appendChild(btn);

      if (_opts.quickBack !== false) {
        var backBtn = document.createElement('button');
        backBtn.type = 'button';
        backBtn.className = 'hl-back-btn';
        backBtn.title = '1つ前の画面に戻る';
        backBtn.textContent = '← 戻る';
        backBtn.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          goBack();
        });
        wrap.appendChild(backBtn);
      }

      target.parentNode.replaceChild(wrap, target);
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', mount);
    } else {
      mount();
    }
  }

  global.HitotsugiLauncher = {
    init: init,
    goBack: goBack,
    open: openMenu,
    close: closeMenu
  };
})(window);
