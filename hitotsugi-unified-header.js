/**
 * hitotsugi-unified-header.js
 * レジ（regi系）と Porte本体（Porte/index.html）以外のページで：
 *   1. ヘッダーバーの高さ（56px）・横幅（100%）・タイトル表示を統一
 *   2. タイトル以外のボタン・タブ・操作系をすべて「サブバー」へ集約
 *   3. 左上のクマアイコンに共通メニュー（TOP・1つ戻る・他システム切替・ログイン状態）を搭載
 *
 * ※ 元に戻したい場合は各HTMLのこのスクリプト読み込みを削除するだけで完全に元に戻ります。
 */
(function (global) {
  'use strict';

  // URLパラメータ ?unified=off で一時的に無効化して元のレイアウトを確認可能
  if (location.search.indexOf('unified=off') !== -1) return;

  var PORTE_BASE = 'https://tomoda-dot.github.io/Porte/';
  var DAGASHI_BASE = 'https://tomoda-dot.github.io/DagashiShop/';

  var APPS = [
    { id: 'tablet',        label: '日報入力',         icon: '📝', url: PORTE_BASE + 'tablet.html' },
    { id: 'work-schedule', label: '作業スケジュール', icon: '📅', url: PORTE_BASE + 'work-schedule.html' },
    { id: 'haccp',         label: '珈琲HACCP',        icon: '☕', url: PORTE_BASE + 'haccp.html' },
    { id: 'timecard',      label: 'タイムカード',     icon: '⏰', url: PORTE_BASE + 'timecard.html' },
    { id: 'mypage',        label: 'マイページ',       icon: '👤', url: PORTE_BASE + 'mypage.html' },
    { id: 'training',      label: '研修アカデミー',   icon: '🎓', url: PORTE_BASE + 'training.html' },
    { id: 'regi',          label: 'おかしのレジ',     icon: '🍬', url: DAGASHI_BASE + 'regi.html' },
    { id: 'admin',         label: '売上管理',         icon: '📊', url: DAGASHI_BASE + 'admin.html' },
    { id: 'purchase-log',  label: '仕入れ・賞味期限', icon: '📦', url: DAGASHI_BASE + 'purchase-log.html' },
    { id: 'analytics',     label: '売上分析',         icon: '📈', url: DAGASHI_BASE + 'analytics.html' }
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
    if (location.protocol === 'file:') {
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
            name: parsed.name || parsed.display_name || parsed.staff_name
          };
        }
      } catch (e2) {
        if (typeof raw === 'string' && raw.trim()) {
          return { name: raw.trim() };
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
    if (typeof _opts.onBack === 'function') {
      try {
        if (_opts.onBack() === true) return;
      } catch (e) {
        console.warn('[HitotsugiUnifiedHeader] onBack error:', e);
      }
    }
    var openOverlay = document.querySelector('.modal-overlay.show, .modal-backdrop.show, [role="dialog"].show');
    if (openOverlay) {
      openOverlay.classList.remove('show');
      return;
    }
    if (document.referrer && document.referrer.indexOf(location.origin) === 0 && history.length > 1) {
      history.back();
    } else {
      location.href = getTopUrl();
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function injectStyles() {
    if (document.getElementById('hu-unified-styles')) return;
    var style = document.createElement('style');
    style.id = 'hu-unified-styles';
    style.textContent = [
      '/* === 共通ヘッダーバー（高さ56px・横幅100%統一） === */',
      '.hu-header {',
      '  min-height: 56px !important;',
      '  height: 56px !important;',
      '  padding: 0 20px !important;',
      '  margin-top: 0 !important;',
      '  margin-bottom: 0 !important;',
      '  border-radius: 0 !important;',
      '  display: flex !important;',
      '  align-items: center !important;',
      '  justify-content: flex-start !important;',
      '  gap: 12px !important;',
      '  flex-wrap: nowrap !important;',
      '  position: sticky !important;',
      '  top: 0 !important;',
      '  z-index: 200 !important;',
      '  box-sizing: border-box !important;',
      '  border-bottom: 1px solid rgba(0,0,0,0.1) !important;',
      '  box-shadow: none !important;',
      '}',
      '.hu-header.hu-fullbleed {',
      '  width: 100vw !important;',
      '  max-width: 100vw !important;',
      '  margin-left: calc(50% - 50vw) !important;',
      '  margin-right: calc(50% - 50vw) !important;',
      '}',
      '.hu-trigger {',
      '  position: relative;',
      '  display: inline-flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '  width: 36px;',
      '  height: 36px;',
      '  padding: 0;',
      '  border-radius: 50%;',
      '  border: 2px solid rgba(255,255,255,0.88);',
      '  background: #fff;',
      '  cursor: pointer;',
      '  box-shadow: 0 2px 6px rgba(0,0,0,0.22);',
      '  flex-shrink: 0;',
      '  transition: transform 0.15s ease;',
      '}',
      '.hu-trigger:hover { transform: scale(1.06); }',
      '.hu-trigger img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; display: block; pointer-events: none; }',
      '.hu-trigger-badge {',
      '  position: absolute; right: -3px; bottom: -3px; width: 14px; height: 14px;',
      '  border-radius: 50%; background: #fff; color: #334155; font-size: 8px; font-weight: 800;',
      '  display: flex; align-items: center; justify-content: center;',
      '  box-shadow: 0 1px 3px rgba(0,0,0,0.3); pointer-events: none; line-height: 1;',
      '}',
      '.hu-title {',
      '  margin: 0 !important;',
      '  font-size: 18px !important;',
      '  font-weight: 800 !important;',
      '  line-height: 1.2 !important;',
      '  white-space: nowrap;',
      '  overflow: hidden;',
      '  text-overflow: ellipsis;',
      '  letter-spacing: 0.02em;',
      '}',
      '',
      '/* === 共通サブバー（タイトル以外の操作系を集約） === */',
      '.hu-subbar {',
      '  width: 100%;',
      '  min-height: 44px;',
      '  padding: 6px 20px;',
      '  background: #ffffff;',
      '  color: #334155;',
      '  border-bottom: 1px solid #e2e8f0;',
      '  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.05);',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: space-between;',
      '  gap: 8px;',
      '  flex-wrap: wrap;',
      '  box-sizing: border-box;',
      '  position: sticky;',
      '  top: 56px;',
      '  z-index: 190;',
      '}',
      '.hu-subbar.hu-fullbleed {',
      '  width: 100vw;',
      '  max-width: 100vw;',
      '  margin-left: calc(50% - 50vw);',
      '  margin-right: calc(50% - 50vw);',
      '  margin-bottom: 12px;',
      '}',
      '.hu-sub-left { display: inline-flex; align-items: center; gap: 6px; flex-wrap: wrap; }',
      '.hu-sub-right { display: inline-flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-left: auto; }',
      '.hu-btn {',
      '  display: inline-flex; align-items: center; gap: 4px; height: 30px; padding: 0 11px;',
      '  border-radius: 999px; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155;',
      '  font-family: inherit; font-size: 12px; font-weight: 700; cursor: pointer;',
      '  text-decoration: none; white-space: nowrap; transition: background 0.15s;',
      '}',
      '.hu-btn:hover { background: #e2e8f0; color: #0f172a; }',
      '.hu-btn.hu-btn-top { background: #fff7ed; border-color: #fed7aa; color: #c2410c; }',
      '.hu-btn.hu-btn-top:hover { background: #ffedd5; }',
      '',
      '/* サブバーへ移動した既存コントロールの白背景向けコントラスト補正 */',
      '.hu-subbar .nav-tabs, .hu-subbar .haccp-nav-pills {',
      '  background: #f1f5f9 !important; padding: 3px !important; border-radius: 999px !important;',
      '  border: 1px solid #e2e8f0 !important; gap: 3px !important;',
      '}',
      '.hu-subbar .nav-tab, .hu-subbar .haccp-pill, .hu-subbar .mode-switch-btn {',
      '  color: #475569 !important; background: transparent !important; border: none !important;',
      '  padding: 5px 12px !important; font-size: 12.5px !important; border-radius: 999px !important;',
      '  text-decoration: none !important;',
      '}',
      '.hu-subbar .nav-tab.active, .hu-subbar .haccp-pill.active, .hu-subbar .mode-switch-btn.active {',
      '  background: #1e293b !important; color: #ffffff !important; box-shadow: 0 1px 4px rgba(0,0,0,0.15) !important;',
      '}',
      '.hu-subbar .top-link-btn, .hu-subbar .nav-btn {',
      '  color: #334155 !important; background: #f8fafc !important; border: 1px solid #cbd5e1 !important;',
      '  padding: 5px 11px !important; border-radius: 999px !important; font-size: 12px !important;',
      '  text-decoration: none !important;',
      '}',
      '.hu-subbar #btn-logout, .hu-subbar #btn-chg-pw {',
      '  color: #334155 !important; background: #f8fafc !important; border: 1px solid #cbd5e1 !important;',
      '  border-radius: 999px !important; padding: 5px 12px !important; font-size: 12px !important;',
      '}',
      '.hu-subbar .hd-staff { color: #334155 !important; font-size: 12.5px !important; font-weight: 700 !important; }',
      '.hu-subbar .header-right { flex-direction: row !important; align-items: center !important; gap: 10px !important; color: #334155 !important; }',
      '.hu-subbar .header-right .date { font-size: 12px !important; margin: 0 !important; opacity: 1 !important; color: #64748b !important; }',
      '.hu-subbar .header-right .clock { font-size: 16px !important; color: #0f172a !important; }',
      '.hu-subbar #clock { background: #f1f5f9 !important; color: #0f172a !important; border: 1px solid #cbd5e1; }',
      '.hu-subbar .hsub { color: #475569 !important; font-size: 12px !important; }',
      '',
      '/* === ポップオーバーメニュー === */',
      '.hu-popover {',
      '  position: fixed; z-index: 99999; width: 300px; max-width: calc(100vw - 24px);',
      '  background: #ffffff; color: #1e293b; border-radius: 16px;',
      '  box-shadow: 0 14px 40px rgba(15,23,42,0.28), 0 0 0 1px rgba(15,23,42,0.08);',
      '  padding: 12px; font-family: "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", sans-serif; display: none;',
      '}',
      '.hu-popover.open { display: block; animation: huPopIn 0.14s ease-out; }',
      '@keyframes huPopIn { from { opacity: 0; transform: translateY(-6px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }',
      '.hu-user-bar { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 8px 10px; background: #f8fafc; border-radius: 10px; margin-bottom: 10px; border: 1px solid #e2e8f0; }',
      '.hu-user-info { display: flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 700; color: #334155; min-width: 0; }',
      '.hu-user-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }',
      '.hu-user-action { border: 1px solid #cbd5e1; background: #fff; color: #475569; border-radius: 8px; padding: 4px 8px; font-size: 11px; font-weight: 700; cursor: pointer; white-space: nowrap; text-decoration: none; }',
      '.hu-user-action:hover { background: #f1f5f9; color: #0f172a; }',
      '.hu-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 10px; }',
      '.hu-act-btn { display: flex; align-items: center; justify-content: center; gap: 5px; padding: 9px 8px; border-radius: 10px; border: 1px solid #e2e8f0; background: #fff; color: #1e293b; font-size: 12.5px; font-weight: 700; cursor: pointer; text-decoration: none; }',
      '.hu-act-btn:hover { background: #f1f5f9; }',
      '.hu-act-btn.primary { background: #fff7ed; border-color: #fed7aa; color: #c2410c; }',
      '.hu-sec-title { font-size: 11px; font-weight: 700; color: #64748b; margin: 4px 2px 6px; }',
      '.hu-app-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }',
      '.hu-app-item { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; padding: 8px 4px; border-radius: 10px; border: 1px solid #e2e8f0; background: #fff; color: #334155; text-decoration: none; font-size: 11px; font-weight: 700; text-align: center; line-height: 1.25; }',
      '.hu-app-item:hover { background: #f8fafc; border-color: #cbd5e1; }',
      '.hu-app-item.current { background: #eff6ff; border-color: #93c5fd; color: #1d4ed8; }',
      '.hu-app-ico { font-size: 18px; line-height: 1; }',
      '@media print { .hu-header, .hu-subbar, .hu-popover { display: none !important; } }'
    ].join('\n');
    document.head.appendChild(style);
  }

  function buildPopover() {
    if (_popoverEl) return _popoverEl;
    var pop = document.createElement('div');
    pop.className = 'hu-popover';
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
      ? '<div class="hu-user-bar">' +
          '<div class="hu-user-info"><span>👤</span><span class="hu-user-name">' + escapeHtml(user.name) + '</span></div>' +
          '<button type="button" class="hu-user-action" id="hu-logout-btn">切替 / ログアウト</button>' +
        '</div>'
      : '<div class="hu-user-bar">' +
          '<div class="hu-user-info"><span>👤</span><span class="hu-user-name">未ログイン</span></div>' +
          '<a class="hu-user-action" href="' + topUrl + '">ログインへ</a>' +
        '</div>';

    var appsHtml = APPS.map(function (app) {
      var isCurrent = _opts.appId && _opts.appId === app.id;
      return '<a class="hu-app-item' + (isCurrent ? ' current' : '') + '" href="' + app.url + '">' +
        '<span class="hu-app-ico">' + app.icon + '</span>' +
        '<span>' + escapeHtml(app.label) + '</span>' +
      '</a>';
    }).join('');

    pop.innerHTML =
      userHtml +
      '<div class="hu-actions">' +
        '<button type="button" class="hu-act-btn" id="hu-pop-back">← 1つ前に戻る</button>' +
        '<a class="hu-act-btn primary" href="' + topUrl + '">🏠 ストアTOP</a>' +
      '</div>' +
      '<div class="hu-sec-title">🔄 他のシステムへ切替</div>' +
      '<div class="hu-app-grid">' + appsHtml + '</div>';

    var backBtn = pop.querySelector('#hu-pop-back');
    if (backBtn) backBtn.addEventListener('click', goBack);
    var logoutBtn = pop.querySelector('#hu-logout-btn');
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

  function init(options) {
    _opts = options || {};
    injectStyles();

    var apply = function () {
      var header = document.querySelector(_opts.headerSelector || 'header, .app-header, .header');
      if (!header) return;

      var movedNodes = [];
      if (Array.isArray(_opts.moveSelectors) && _opts.moveSelectors.length > 0) {
        _opts.moveSelectors.forEach(function (sel) {
          var nodes = header.querySelectorAll(sel);
          for (var i = 0; i < nodes.length; i++) {
            movedNodes.push(nodes[i]);
          }
        });
      }

      // タイトルテキストの特定
      var titleText = _opts.title || '';
      if (!titleText && _opts.titleSelector) {
        var tEl = header.querySelector(_opts.titleSelector);
        if (tEl) titleText = tEl.textContent.trim();
      }
      if (!titleText) {
        var h1 = header.querySelector('h1, .app-title, .hd-title, .htl');
        if (h1) titleText = h1.textContent.trim();
      }

      // ヘッダー内を「クマアイコン + タイトル」のみに整理（noSubbar時は右側に既存要素を残す）
      header.innerHTML = '';
      header.classList.add('hu-header');
      if (_opts.fullBleed) {
        header.classList.add('hu-fullbleed');
        if (header.parentElement && header.parentElement.id === 'pg-main') {
          header.parentElement.style.paddingTop = '0';
        }
      }

      var trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'hu-trigger';
      trigger.title = 'ひとつぎメニュー（TOP・戻る・切替）';
      trigger.setAttribute('aria-label', 'ひとつぎメニュー');
      trigger.innerHTML = '<img src="' + getIconSrc() + '" alt="ひとつぎ"><span class="hu-trigger-badge">▼</span>';
      trigger.addEventListener('click', toggleMenu);
      _triggerEl = trigger;

      var titleSpan = document.createElement('h1');
      titleSpan.className = 'hu-title';
      titleSpan.textContent = titleText || 'HITOTSUGI';
      if (typeof _opts.onTitleClick === 'function') {
        titleSpan.style.cursor = 'pointer';
        titleSpan.addEventListener('click', _opts.onTitleClick);
      }

      header.appendChild(trigger);
      header.appendChild(titleSpan);

      if (_opts.noSubbar) {
        if (movedNodes.length > 0) {
          var hdrRight = document.createElement('div');
          hdrRight.style.cssText = 'margin-left:auto;display:inline-flex;align-items:center;gap:10px;flex-shrink:0;';
          movedNodes.forEach(function (n) { hdrRight.appendChild(n); });
          header.appendChild(hdrRight);
        }
        return;
      }

      // サブバーを作成（タイトル以外の既存要素を受け入れる）
      var subbar = document.createElement('div');
      subbar.className = 'hu-subbar' + (_opts.fullBleed ? ' hu-fullbleed' : '');

      var subLeft = document.createElement('div');
      subLeft.className = 'hu-sub-left';

      var backBtn = document.createElement('button');
      backBtn.type = 'button';
      backBtn.className = 'hu-btn';
      backBtn.textContent = '← 戻る';
      backBtn.title = '1つ前の画面に戻る';
      backBtn.addEventListener('click', goBack);
      subLeft.appendChild(backBtn);

      if (!_opts.hideTopBtn) {
        var topLink = document.createElement('a');
        topLink.className = 'hu-btn hu-btn-top';
        topLink.href = getTopUrl();
        topLink.textContent = '🏠 ストアTOP';
        subLeft.appendChild(topLink);
      }

      var subRight = document.createElement('div');
      subRight.className = 'hu-sub-right';
      movedNodes.forEach(function (n) { subRight.appendChild(n); });

      subbar.appendChild(subLeft);
      subbar.appendChild(subRight);
      header.insertAdjacentElement('afterend', subbar);
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', apply);
    } else {
      apply();
    }
  }

  global.HitotsugiUnifiedHeader = {
    init: init,
    goBack: goBack,
    open: openMenu,
    close: closeMenu
  };
})(window);
