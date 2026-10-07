// ═══════════════════════════════════════════════════
// ひとつぎ お弁当システム (Ultra-Clean & Rock-Solid Architecture)
// ═══════════════════════════════════════════════════

const DEFAULT_30_BENTO = [
  { id: 'b01', name: 'タラのトマトソース弁当', category: '魚', icon: '🐟', stock: 10, desc: 'ふっくらタラをコク旨トマトソースで煮込みました。' },
  { id: 'b02', name: 'アジの南蛮漬け弁当', category: '魚', icon: '🐟', stock: 10, desc: 'さっぱり酸味が食欲をそそる特製南蛮だれ。' },
  { id: 'b03', name: 'タラの白醤油焼き弁当', category: '魚', icon: '🐟', stock: 10, desc: '白醤油のやさしい風味が上品な和風弁当。' },
  { id: 'b04', name: '豚肉の生姜焼き弁当', category: '豚肉', icon: '🐖', stock: 10, desc: '生姜の香りが引き立つジューシーな一番人気！' },
  { id: 'b05', name: 'サバの味噌だれがけ弁当', category: '魚', icon: '🐟', stock: 10, desc: '濃厚でコクのある味噌だれがサバの旨みを引き立てます。' },
  { id: 'b06', name: 'レバニラ炒め弁当', category: '豚肉', icon: '🐖', stock: 10, desc: 'スタミナ満点！しゃきしゃきニラと特製ダレ。' },
  { id: 'b07', name: '鶏肉の山賊焼き弁当', category: '鶏肉', icon: '🐓', stock: 10, desc: 'ニンニク醤油が香ばしい長野名物の山賊焼き。' },
  { id: 'b08', name: '鶏肉とインゲンの味噌ダレ焼き弁当', category: '鶏肉', icon: '🐓', stock: 10, desc: '甘辛い味噌ダレと彩り豊かなインゲンがベストマッチ。' },
  { id: 'b09', name: '豚肉とチンゲン菜の塩ダレ炒め弁当', category: '豚肉', icon: '🐖', stock: 10, desc: '旨塩ダレでさっぱり仕上げたヘルシーな一品。' },
  { id: 'b10', name: '豚ロース肉と長葱のコチュジャン炒め弁当', category: '豚肉', icon: '🐖', stock: 10, desc: 'ほんのりピリ辛コチュジャンが後を引く美味しさ。' },
  { id: 'b11', name: 'ポークトマト煮弁当', category: '豚肉', icon: '🐖', stock: 10, desc: 'やわらか豚肉をじっくりトマトで煮込みました。' },
  { id: 'b12', name: '豚肉の甘辛炒め弁当', category: '豚肉', icon: '🐖', stock: 10, desc: 'ご飯が進む甘辛醤油ダレの定番人気。' },
  { id: 'b13', name: 'すき焼き風煮弁当', category: '牛肉', icon: '🐂', stock: 10, desc: '甘辛いすき焼きダレが染み込んだ満足感たっぷりの煮物。' },
  { id: 'b14', name: '牛肉のオイスター炒め弁当', category: '牛肉', icon: '🐂', stock: 10, desc: 'オイスターソースの深いコクと豊かな風味。' },
  { id: 'b15', name: '鶏の唐揚げ弁当', category: '鶏肉', icon: '🐓', stock: 10, desc: '外はカリッと中はジューシーなみんな大好き唐揚げ。' },
  { id: 'b16', name: '鶏肉のレモンクリーム弁当', category: '鶏肉', icon: '🐓', stock: 10, desc: 'さわやかなレモンの香りとクリーミーなソース。' },
  { id: 'b17', name: 'ホッケのみりん焼き弁当', category: '魚', icon: '🐟', stock: 10, desc: '脂ののったホッケをほんのり甘いみりん干し風に。' },
  { id: 'b18', name: 'アジの塩焼き弁当', category: '魚', icon: '🐟', stock: 10, desc: 'シンプルだからこそ魚の旨味が際立つ塩焼き。' },
  { id: 'b19', name: '野菜たっぷりエビマヨ弁当', category: '和食・その他', icon: '🦐', stock: 10, desc: 'プリプリ海老やまろやかマヨソース。' },
  { id: 'b20', name: '海老としめじの玉子とじ弁当', category: '和食・その他', icon: '🦐', stock: 10, desc: 'ふんわり優しい玉子で包んだお出汁の効いたお弁当。' },
  { id: 'b21', name: '若鶏の利休焼き弁当', category: '鶏肉', icon: '🐓', stock: 10, desc: '香ばしいゴマの香りが広がる伝統和風メニュー。' },
  { id: 'b22', name: '牛肉と茄子の麻婆ソース弁当', category: '牛肉', icon: '🐂', stock: 10, desc: 'ジューシーな茄子と牛肉のピリ辛本格麻婆。' },
  { id: 'b23', name: '野菜たっぷりキーマカレー弁当', category: '和食・その他', icon: '🍛', stock: 10, desc: 'スパイス香るマイルドで食べやすいキーマカレー。' },
  { id: 'b24', name: '韓国風焼肉炒め弁当', category: '牛肉', icon: '🐂', stock: 0, desc: '特製プルコギダレで炒めたしっかり味付けのお肉。' },
  { id: 'b25', name: '鶏の照焼き弁当', category: '鶏肉', icon: '🐓', stock: 10, desc: '照り照りの甘辛タレが絡む定番の照り焼き。' },
  { id: 'b26', name: 'チリソースミートボール弁当', category: '和食・その他', icon: '🧆', stock: 10, desc: '甘辛チリソースが食欲を刺激するミートボール。' },
  { id: 'b27', name: 'ズッキーニとチキンのトマト煮込み弁当', category: '鶏肉', icon: '🐓', stock: 10, desc: '彩り野菜とチキンのヘルシーな地中海風煮込み。' },
  { id: 'b28', name: '回鍋肉弁当', category: '豚肉', icon: '🐖', stock: 10, desc: 'シャキシャキキャベツと豚肉の甜麺醤炒め。' },
  { id: 'b29', name: '家常豆腐弁当', category: '和食・その他', icon: '🍲', stock: 10, desc: '香ばしく揚げた豆腐と野菜の和風あんかけ煮込み。' },
  { id: 'b30', name: '牛肉きのこの甘辛炒め弁当', category: '牛肉', icon: '🐂', stock: 10, desc: 'たっぷりのきのこ風味と牛肉の甘辛和風炒め。' }
];

// App State (Single Source of Truth)
let bentoMaster = [];
let todaysMenuIds = [];
let porteUsers = [];
let orderHistory = [];
let dailyOrders = {};
let currentCategoryFilter = 'ALL';
let currentSelectingBentoId = null;
let currentSelectedMonth = getTodayYM();
let isSyncing = false;

function getSB() {
  if (typeof window !== 'undefined' && window.supabase && window.supabase.createClient) {
    return window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  }
  return null;
}

function getTodayKey() {
  const d = new Date();
  d.setMinutes(d.getMinutes() + d.getTimezoneOffset() + 540); // JST
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function getTodayYM() {
  return getTodayKey().substring(0, 7);
}

function toast(msg) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 300);
  }, 2200);
}

// ─── 重複を作らない Supabase 書き込み ───
async function saveSettingToDB(keyName, jsonValueStr) {
  const SB = getSB();
  if (!SB) return;
  try {
    // 既存行をチェック
    const checkR = await SB.from('設定').select('key').eq('key', keyName);
    if (checkR.data && checkR.data.length > 0) {
      // 全マッチ行を一括更新（絶対に重複行を残さない）
      await SB.from('設定').update({ value: jsonValueStr }).eq('key', keyName);
    } else {
      await SB.from('設定').insert([{ key: keyName, value: jsonValueStr }]);
    }
  } catch (e) {
    console.warn('saveSettingToDB error:', e);
  }
}

async function saveBentoMasterToDB() {
  await saveSettingToDB('bento_master', JSON.stringify(bentoMaster));
}

async function saveTodaysMenuToDB() {
  await saveSettingToDB('bento_todays_menu', JSON.stringify(todaysMenuIds));
}

async function saveDailyOrdersToDB() {
  await saveSettingToDB('bento_daily_orders', JSON.stringify(dailyOrders));
  await saveSettingToDB('bento_order_history', JSON.stringify(orderHistory));
}

// ─── Supabase からの完全ロード（DBが正解）───
async function fetchSupabaseData(showToast = false) {
  if (isSyncing) return;
  isSyncing = true;
  const SB = getSB();
  if (!SB) { isSyncing = false; return; }

  try {
    const todayKey = getTodayKey();
    const keys = ['bento_master', 'bento_todays_menu', 'bento_daily_orders', 'bento_order_history'];
    const settingsRes = await SB.from('設定').select('*').in('key', keys);
    const settingsMap = {};

    if (settingsRes.data) {
      // 同一キーの重複行があっても「一番新しい行」で上書き
      settingsRes.data.forEach(item => {
        if (item.key && item.value) {
          settingsMap[item.key] = item.value;
        }
      });
    }

    if (settingsMap['bento_master']) {
      try { bentoMaster = JSON.parse(settingsMap['bento_master']); } catch(e){}
    } else {
      bentoMaster = JSON.parse(JSON.stringify(DEFAULT_30_BENTO));
    }

    if (settingsMap['bento_todays_menu']) {
      try { todaysMenuIds = JSON.parse(settingsMap['bento_todays_menu']); } catch(e){}
    } else {
      todaysMenuIds = bentoMaster.slice(0, 5).map(b => b.id);
    }

    if (settingsMap['bento_daily_orders']) {
      try { dailyOrders = JSON.parse(settingsMap['bento_daily_orders']); } catch(e){}
    } else {
      dailyOrders = {};
    }

    if (settingsMap['bento_order_history']) {
      try { orderHistory = JSON.parse(settingsMap['bento_order_history']); } catch(e){}
    } else {
      orderHistory = [];
    }

    // 利用者 & 今日の出欠取得
    const [uRes, attRes, stRes] = await Promise.all([
      SB.from('利用者').select('*'),
      SB.from('出欠').select('*').eq('date', todayKey),
      SB.from('スタッフ').select('*')
    ]);

    const users = uRes.data || [];
    const atts = attRes.data || [];
    const staff = stRes.data || [];

    porteUsers = users.filter(u => u.userStatus !== '利用終了').map(u => {
      const rec = atts.find(a => String(a.userId) === String(u.id));
      const bVal = rec ? rec.bento : u.bento;
      const wantsBento = bVal && bVal !== 'なし' && bVal !== '0' && bVal !== 'false';
      return {
        id: u.id,
        name: u.name,
        bentoVal: bVal || 'なし',
        wantsBento: wantsBento,
        selectedBentoId: '',
        isStaff: false
      };
    });

    staff.forEach(s => {
      if (s.loginId && s.loginId.toLowerCase() === 'administrator') return;
      porteUsers.push({
        id: 'staff_' + s.id,
        name: '👔 ' + s.name,
        bentoVal: 'なし',
        wantsBento: true,
        selectedBentoId: '',
        isStaff: true
      });
    });

    // 今日の確定済み/下書き注文スナップショットを復元
    if (dailyOrders[todayKey] && Array.isArray(dailyOrders[todayKey].orders)) {
      dailyOrders[todayKey].orders.forEach(ord => {
        const u = porteUsers.find(item => String(item.id) === String(ord.userId) || item.name === ord.userName);
        if (u) {
          u.selectedBentoId = ord.bentoId || '';
          u.wantsBento = true;
        }
      });
    }

    renderAll();
    if (showToast) toast('🔄 最新データをSupabaseから読み込みました');
  } catch (e) {
    console.error('Supabase fetch error:', e);
  } finally {
    isSyncing = false;
  }
}

// ─── 注文の記録 & 出欠テーブル連動 ───
async function recordUserOrder(userId, bentoId) {
  const todayKey = getTodayKey();
  const u = porteUsers.find(x => String(x.id) === String(userId));
  const b = bentoMaster.find(x => x.id === bentoId);
  if (!u || !b) return;

  if (b.stock <= 0) {
    alert('【' + b.name + '】は本日完売しています');
    return;
  }

  // 在庫マイナス1
  b.stock = Math.max(0, b.stock - 1);
  await saveBentoMasterToDB();

  u.selectedBentoId = bentoId;
  u.wantsBento = true;

  if (!dailyOrders[todayKey]) {
    dailyOrders[todayKey] = { status: 'DRAFT', confirmedAt: null, orders: [] };
  }
  const currentList = dailyOrders[todayKey].orders || [];
  const existingIdx = currentList.findIndex(o => String(o.userId) === String(userId));
  const orderObj = {
    userId: u.id,
    userName: u.name,
    bentoId: b.id,
    bentoName: b.name,
    category: b.category
  };

  if (existingIdx >= 0) currentList[existingIdx] = orderObj;
  else currentList.push(orderObj);

  dailyOrders[todayKey].orders = currentList;

  const now = new Date();
  const dateLabel = `${now.getMonth() + 1}/${now.getDate()} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  orderHistory.unshift({
    id: 'ord_' + Date.now(),
    date: dateLabel,
    dateKey: todayKey,
    userId: u.id,
    userName: u.name,
    bentoId: b.id,
    bentoName: b.name,
    category: b.category
  });

  await saveDailyOrdersToDB();

  // Porteの「出欠」テーブルにもbentoフラグ連動
  if (!u.isStaff) {
    const SB = getSB();
    if (SB) {
      try {
        const attR = await SB.from('出欠').select('id').eq('userId', u.id).eq('date', todayKey).limit(1);
        if (attR.data && attR.data.length > 0) {
          await SB.from('出欠').update({ bento: '1食' }).eq('id', attR.data[0].id);
        } else {
          await SB.from('出欠').insert([{
            id: 'a' + Date.now() + Math.random().toString(36).substring(2, 6),
            userId: u.id,
            date: todayKey,
            status: '出席',
            bento: '1食'
          }]);
        }
      } catch(e) {}
    }
  }

  renderAll();
  toast('✅ ' + u.name + ' 様の『' + b.name + '』ご注文を保存しました');
}

// ─── メニュー選出ロジック ───
async function randomSelectFive() {
  if (bentoMaster.length < 5) return;
  const shuffled = [...bentoMaster].sort(() => Math.random() - 0.5);
  todaysMenuIds = shuffled.slice(0, 5).map(b => b.id);
  await saveTodaysMenuToDB();
  renderAll();
  toast('🎲 本日の5品をランダム選出しました');
}

async function autoStockPickFive() {
  const inStock = bentoMaster.filter(b => b.stock > 0);
  let selected = [];
  if (inStock.length >= 5) {
    selected = inStock.slice(0, 5).map(b => b.id);
  } else {
    selected = inStock.map(b => b.id);
    const remaining = bentoMaster.filter(b => !selected.includes(b.id));
    selected = selected.concat(remaining.slice(0, 5 - selected.length).map(b => b.id));
  }
  todaysMenuIds = selected;
  await saveTodaysMenuToDB();
  renderAll();
  toast('🔄 在庫あり商品を優先して本日5品を設定しました');
}

function openPickFiveModal() {
  const container = document.getElementById('pickFiveItemsList');
  if (!container) return;

  container.innerHTML = bentoMaster.map(b => {
    const isChecked = todaysMenuIds.includes(b.id);
    return `
      <label style="display:flex; align-items:center; gap:8px; padding:8px 10px; background:#fff; border:1px solid #ced4da; border-radius:10px; cursor:pointer">
        <input type="checkbox" class="pick-five-check" value="${b.id}" ${isChecked ? 'checked' : ''} onchange="updatePickFiveCount()">
        <span style="font-size:1.2rem">${b.icon}</span>
        <span style="font-weight:700; font-size:0.85rem">${b.name}</span>
      </label>
    `;
  }).join('');

  updatePickFiveCount();
  document.getElementById('pickFiveModal').classList.add('active');
}

function closePickFiveModal() {
  document.getElementById('pickFiveModal').classList.remove('active');
}

function updatePickFiveCount() {
  const checked = document.querySelectorAll('.pick-five-check:checked');
  const countEl = document.getElementById('selectedFiveCount');
  if (countEl) countEl.textContent = checked.length;
}

async function saveCustomPickFive() {
  const checked = Array.from(document.querySelectorAll('.pick-five-check:checked')).map(el => el.value);
  if (checked.length !== 5) {
    alert(`ちょうど5品を選択してください（現在: ${checked.length}品）`);
    return;
  }
  todaysMenuIds = checked;
  await saveTodaysMenuToDB();
  closePickFiveModal();
  renderAll();
  toast('⚙️ 本日のメニュー5品を保存しました');
}

// ─── 画面描画 ───
function renderAll() {
  renderHeaderStats();
  renderTodaysMenu();
  renderPorteUserTable();
  renderOrderHistoryTable();
  renderMonthlyMatrix();
  renderMasterGrid();
}

function renderHeaderStats() {
  const badgeEl = document.getElementById('currentDateBadge');
  if (badgeEl) badgeEl.textContent = getTodayKey().replace(/-/g, '/') + ' の状況';
  const uCountEl = document.getElementById('headerUserCount');
  if (uCountEl) uCountEl.textContent = porteUsers.filter(u => !u.isStaff).length + '名';

  const todayKey = getTodayKey();
  const dayRecord = dailyOrders[todayKey];
  const orderedCount = (dayRecord && dayRecord.orders) ? dayRecord.orders.length : 0;
  const oCountEl = document.getElementById('headerOrderedCount');
  if (oCountEl) oCountEl.textContent = orderedCount + '食';

  const totalStock = bentoMaster.reduce((sum, b) => sum + b.stock, 0);
  const sCountEl = document.getElementById('headerTotalStockCount');
  if (sCountEl) sCountEl.textContent = totalStock + '食';

  const bentoUsers = porteUsers.filter(u => u.wantsBento && !u.isStaff);
  const doneUsers = bentoUsers.filter(u => u.selectedBentoId);
  const pct = bentoUsers.length > 0 ? Math.round((doneUsers.length / bentoUsers.length) * 100) : 0;

  const pText = document.getElementById('progressText');
  if (pText) pText.textContent = `${doneUsers.length} / ${bentoUsers.length} 名完了 (${pct}%)`;
  const pSub = document.getElementById('progressSubText');
  if (pSub) pSub.textContent = `未選択: ${bentoUsers.length - doneUsers.length}名`;
  const pFill = document.getElementById('progressFill');
  if (pFill) pFill.style.width = pct + '%';
  const pBadge = document.getElementById('porteTabBadge');
  if (pBadge) pBadge.textContent = `未受付 ${bentoUsers.length - doneUsers.length}`;
}

function renderTodaysMenu() {
  const container = document.getElementById('todaysMenuGrid');
  if (!container) return;

  const items = todaysMenuIds.map(id => bentoMaster.find(b => b.id === id)).filter(Boolean);
  const todayKey = getTodayKey();
  const dayRecord = dailyOrders[todayKey];
  const activeOrders = (dayRecord && dayRecord.orders) ? dayRecord.orders : [];

  container.innerHTML = items.map((b, idx) => {
    const orderedUsers = activeOrders.filter(o => o.bentoId === b.id);
    const userPills = orderedUsers.map(o => `<span class="user-pill">${o.userName}</span>`).join('');
    const isSoldOut = b.stock <= 0;

    return `
      <div class="menu-card ${isSoldOut ? 'sold-out' : ''}">
        <span class="card-num-badge">本日 ${idx + 1}</span>
        <span class="card-cat-badge">${b.category}</span>
        <div class="bento-icon">${b.icon}</div>
        <div class="bento-title">${b.name}</div>
        <div class="bento-desc">${b.desc}</div>
        <div class="stock-indicator ${isSoldOut ? 'out-of-stock' : 'in-stock'}">
          ${isSoldOut ? '❌ 完売 (在庫0)' : '📦 残り在庫: ' + b.stock + '食'}
        </div>
        <div class="selected-users-list">
          ${userPills || '<span style="font-size:0.78rem;color:#999">まだ選択されていません</span>'}
        </div>
        <button class="btn btn-primary btn-choose" ${isSoldOut ? 'disabled' : ''} onclick="openUserSelectModal('${b.id}')">
          ${isSoldOut ? '完売' : 'これにする！ 🎯'}
        </button>
      </div>
    `;
  }).join('');
}

function renderPorteUserTable() {
  const tbody = document.getElementById('porteUserTableBody');
  if (!tbody) return;

  const btnEl = document.getElementById('filterBentoUsersOnlyBtn');
  const filterUsersOnly = btnEl ? btnEl.classList.contains('active') : true;
  const targetUsers = porteUsers.filter(u => filterUsersOnly ? u.wantsBento : true);

  tbody.innerHTML = targetUsers.map(u => {
    const isDone = !!u.selectedBentoId;
    const bentoItem = bentoMaster.find(b => b.id === u.selectedBentoId);

    return `
      <tr>
        <td style="font-weight:800; color:var(--dark)">${u.name}</td>
        <td style="text-align:center">
          <span class="pill-btn ${u.wantsBento ? 'active' : ''}">${u.wantsBento ? '必要' : '不要'}</span>
        </td>
        <td style="color:var(--subtext); font-size:0.82rem">${u.bentoVal || '-'}</td>
        <td style="font-weight:700; color:#d9480f">${isDone ? bentoItem.name : '<span style="color:#999">未選択</span>'}</td>
        <td style="text-align:center">
          ${isDone ? '<span class="badge-count" style="background:#e6fcf5;color:#0ca678">✅ 選択済</span>' : '<span class="badge-count pending">未受付</span>'}
        </td>
      </tr>
    `;
  }).join('');
}

function renderOrderHistoryTable() {
  const tbody = document.getElementById('orderHistoryTableBody');
  if (!tbody) return;

  const logs = orderHistory.slice(0, 15);
  tbody.innerHTML = logs.map(l => `
    <tr>
      <td style="font-size:0.8rem; color:var(--subtext)">${l.date}</td>
      <td style="font-weight:800">${l.userName}</td>
      <td style="font-weight:800; color:#d9480f">${l.bentoName}</td>
      <td><span class="card-cat-badge" style="position:static">${l.category}</span></td>
    </tr>
  `).join('');
}

function renderMonthlyMatrix() {
  const container = document.getElementById('monthlyMatrixContainer');
  if (!container) return;

  const ym = currentSelectedMonth;
  const parts = ym.split('-');
  const y = parseInt(parts[0]), m = parseInt(parts[1]);
  const daysInMonth = new Date(y, m, 0).getDate();

  let html = `<table class="data-table" style="font-size:0.8rem"><thead><tr><th style="min-width:120px">利用者名</th>`;
  for (let d = 1; d <= daysInMonth; d++) {
    html += `<th style="text-align:center; min-width:32px; padding:6px 2px">${d}</th>`;
  }
  html += `</tr></thead><tbody>`;

  const users = porteUsers.filter(u => !u.isStaff);
  users.forEach(u => {
    html += `<tr><td style="font-weight:800; white-space:nowrap">${u.name}</td>`;
    for (let d = 1; d <= daysInMonth; d++) {
      const dateKey = `${ym}-${String(d).padStart(2, '0')}`;
      const dayRec = dailyOrders[dateKey];
      const hasOrder = dayRec && dayRec.orders && dayRec.orders.some(o => String(o.userId) === String(u.id) || o.userName === u.name);
      html += `<td style="text-align:center; padding:4px 2px">${hasOrder ? '🍱' : '-'}</td>`;
    }
    html += `</tr>`;
  });
  html += `</tbody></table>`;
  container.innerHTML = html;
}

function renderMasterGrid() {
  const container = document.getElementById('masterItemsGrid');
  if (!container) return;

  const searchInput = document.getElementById('masterSearchInput');
  const search = searchInput ? (searchInput.value || '').trim().toLowerCase() : '';
  const items = bentoMaster.filter(b => {
    if (currentCategoryFilter !== 'ALL' && b.category !== currentCategoryFilter) return false;
    if (search && !b.name.toLowerCase().includes(search)) return false;
    return true;
  });

  const mTotal = document.getElementById('masterTotalCount');
  if (mTotal) mTotal.textContent = bentoMaster.length;
  const mStock = document.getElementById('masterTotalStockText');
  if (mStock) mStock.textContent = bentoMaster.reduce((s, b) => s + b.stock, 0);

  container.innerHTML = `<div class="master-grid">` + items.map(b => `
    <div class="master-item-card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px">
        <span class="card-cat-badge" style="position:static">${b.category}</span>
        <span style="font-weight:900; color:${b.stock > 0 ? '#0ca678' : '#c92a2a'}">${b.stock > 0 ? '在庫: ' + b.stock + '食' : '完売'}</span>
      </div>
      <div style="font-size:1.8rem; text-align:center; margin:6px 0">${b.icon}</div>
      <div style="font-weight:900; font-size:1rem; text-align:center; margin-bottom:6px">${b.name}</div>
      <div style="font-size:0.8rem; color:var(--subtext); margin-bottom:12px; height:2.4rem; overflow:hidden">${b.desc}</div>
      <div style="display:flex; gap:6px; justify-content:flex-end; align-items:center">
        <button class="btn btn-sm btn-outline" onclick="addStockQuick('${b.id}', 5)">＋5食追加</button>
        <button class="btn btn-sm btn-outline" onclick="openAddLotModal('${b.id}')">在庫設定</button>
      </div>
    </div>
  `).join('') + `</div>`;
}

// ─── 在庫クイック追加 ───
async function addStockQuick(bentoId, count = 5) {
  const b = bentoMaster.find(x => x.id === bentoId);
  if (!b) return;
  b.stock = (b.stock || 0) + count;
  await saveBentoMasterToDB();
  renderAll();
  toast(`📦 【${b.name}】に ${count}食 追加しました`);
}

// ─── モーダル ＆ 操作ロジック ───
function openUserSelectModal(bentoId) {
  currentSelectingBentoId = bentoId;
  const b = bentoMaster.find(x => x.id === bentoId);
  if (!b) return;

  const tEl = document.getElementById('selectUserModalBentoTitle');
  if (tEl) tEl.textContent = `${b.icon} 『${b.name}』`;
  renderUserPickerList();
  document.getElementById('userSelectForBentoModal').classList.add('active');
}

function closeUserSelectForBentoModal() {
  document.getElementById('userSelectForBentoModal').classList.remove('active');
}

function renderUserPickerList() {
  const container = document.getElementById('userPickerList');
  if (!container) return;

  container.innerHTML = porteUsers.map(u => {
    const isChosen = u.selectedBentoId === currentSelectingBentoId;
    return `
      <div class="user-btn ${isChosen ? 'chosen' : ''}" onclick="selectUserForBento('${u.id}')">
        <span>${u.name}</span>
        <span>${isChosen ? '✅ 選択中' : '選ぶ 🎯'}</span>
      </div>
    `;
  }).join('');
}

async function selectUserForBento(userId) {
  if (!currentSelectingBentoId) return;
  await recordUserOrder(userId, currentSelectingBentoId);
  closeUserSelectForBentoModal();
}

function openAddLotModal(bentoId) {
  const b = bentoMaster.find(x => x.id === bentoId);
  if (!b) return;
  document.getElementById('addLotBentoId').value = b.id;
  document.getElementById('addLotBentoName').textContent = b.name;
  document.getElementById('lotQtyInput').value = b.stock;
  document.getElementById('addLotModal').classList.add('active');
}

function closeAddLotModal() {
  document.getElementById('addLotModal').classList.remove('active');
}

// ─── 確定 ＆ CSVエクスポート ───
async function confirmDailyOrder() {
  const todayKey = getTodayKey();
  if (!confirm(`${todayKey} のご注文を確定して保存しますか？`)) return;

  if (!dailyOrders[todayKey]) dailyOrders[todayKey] = { orders: [] };
  dailyOrders[todayKey].status = 'CONFIRMED';
  dailyOrders[todayKey].confirmedAt = new Date().toLocaleString('ja-JP');

  await saveDailyOrdersToDB();
  toast('🔒 本日の注文を確定して保存いたしました');
  renderAll();
}

function exportMonthlyMatrixCSV() {
  const ym = currentSelectedMonth;
  const parts = ym.split('-');
  const y = parseInt(parts[0]), m = parseInt(parts[1]);
  const daysInMonth = new Date(y, m, 0).getDate();

  let csv = '\uFEFF' + '氏名';
  for (let d = 1; d <= daysInMonth; d++) csv += `,${d}日`;
  csv += '\n';

  porteUsers.forEach(u => {
    csv += `"${u.name}"`;
    for (let d = 1; d <= daysInMonth; d++) {
      const dateKey = `${ym}-${String(d).padStart(2, '0')}`;
      const dayRec = dailyOrders[dateKey];
      const hasOrder = dayRec && dayRec.orders && dayRec.orders.some(o => String(o.userId) === String(u.id) || o.userName === u.name);
      csv += `,${hasOrder ? '1' : '0'}`;
    }
    csv += '\n';
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `bento_matrix_${ym}.csv`;
  a.click();
}

// ─── 初期化 ＆ イベントリスナー ───
document.addEventListener('DOMContentLoaded', () => {
  fetchSupabaseData();

  window.addEventListener('focus', () => fetchSupabaseData());
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) fetchSupabaseData();
  });

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab');
      const targetContent = document.getElementById(tabId);
      if (targetContent) targetContent.classList.add('active');
    });
  });

  document.querySelectorAll('#categoryFilterPills .pill-btn').forEach(p => {
    p.addEventListener('click', () => {
      document.querySelectorAll('#categoryFilterPills .pill-btn').forEach(x => x.classList.remove('active'));
      p.classList.add('active');
      currentCategoryFilter = p.getAttribute('data-category');
      renderMasterGrid();
    });
  });

  const refreshBtn = document.getElementById('refreshUsersHeaderBtn');
  if (refreshBtn) refreshBtn.addEventListener('click', () => fetchSupabaseData(true));
  const confirmBtn = document.getElementById('confirmDailyOrderBtn');
  if (confirmBtn) confirmBtn.addEventListener('click', confirmDailyOrder);
  const exportBtn = document.getElementById('exportMonthlyMatrixCsvBtn');
  if (exportBtn) exportBtn.addEventListener('click', exportMonthlyMatrixCSV);

  const randBtn = document.getElementById('randomSelectBtn');
  if (randBtn) randBtn.addEventListener('click', randomSelectFive);
  const autoBtn = document.getElementById('autoStockPickBtn');
  if (autoBtn) autoBtn.addEventListener('click', autoStockPickFive);
  const customBtn = document.getElementById('customPickBtn');
  if (customBtn) customBtn.addEventListener('click', openPickFiveModal);

  const addLotF = document.getElementById('addLotForm');
  if (addLotF) {
    addLotF.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('addLotBentoId').value;
      const qty = parseInt(document.getElementById('lotQtyInput').value, 10);
      const b = bentoMaster.find(x => x.id === id);
      if (b) {
        b.stock = Math.max(0, qty);
        await saveBentoMasterToDB();
        closeAddLotModal();
        renderAll();
        toast('📦 在庫を保存しました');
      }
    });
  }
});
