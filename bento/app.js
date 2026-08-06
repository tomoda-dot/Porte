/**
 * ぽかぽか弁当 Web App - Main Logic (Porte integrated)
 */

// 30品目 初期マスターデータ
const DEFAULT_30_BENTO = [
  { id: 'b01', name: 'タラのトマトソース弁当', category: '魚', icon: '🐟', stock: 10, desc: 'ふっくらタラをコク旨トマトソースで煮込みました。' },
  { id: 'b02', name: 'アジの南蛮漬け弁当', category: '魚', icon: '🐟', stock: 10, desc: 'さっぱり酸味が食欲をそそる特製南蛮だれ。' },
  { id: 'b03', name: 'タラの白醤油焼き弁当', category: '魚', icon: '🐟', stock: 10, desc: '白醤油のやさしい風味が上品な和風弁当。' },
  { id: 'b04', name: '豚肉の生姜焼き弁当', category: '豚肉', icon: '🐖', stock: 12, desc: '生姜の香りが引き立つジューシーな一番人気！' },
  { id: 'b05', name: 'サバの味噌だれがけ弁当', category: '魚', icon: '🐟', stock: 10, desc: '濃厚でコクのある味噌だれがサバの旨みを引き立てます。' },
  { id: 'b06', name: 'レバニラ炒め弁当', category: '豚肉', icon: '🐖', stock: 8, desc: 'スタミナ満点！しゃきしゃきニラと特製ダレ。' },
  { id: 'b07', name: '鶏肉の山賊焼き弁当', category: '鶏肉', icon: '🐓', stock: 10, desc: 'ニンニク醤油が香ばしい長野名物の山賊焼き。' },
  { id: 'b08', name: '鶏肉とインゲンの味噌ダレ焼き弁当', category: '鶏肉', icon: '🐓', stock: 10, desc: '甘辛い味噌ダレと彩り豊かなインゲンがベストマッチ。' },
  { id: 'b09', name: '豚肉とチンゲン菜の塩ダレ炒め弁当', category: '豚肉', icon: '🐖', stock: 10, desc: '旨塩ダレでさっぱり仕上げたヘルシーな一品。' },
  { id: 'b10', name: '豚ロース肉と長葱のコチュジャン炒め弁当', category: '豚肉', icon: '🐖', stock: 10, desc: 'ほんのりピリ辛コチュジャンが後を引く美味しさ。' },
  { id: 'b11', name: 'ポークトマト煮弁当', category: '豚肉', icon: '🐖', stock: 10, desc: 'やわらか豚肉をじっくりトマトで煮込みました。' },
  { id: 'b12', name: '豚肉の甘辛炒め弁当', category: '豚肉', icon: '🐖', stock: 10, desc: 'ご飯が進む甘辛醤油ダレの定番人気。' },
  { id: 'b13', name: 'すき焼き風煮弁当', category: '牛肉', icon: '🐂', stock: 10, desc: '甘辛いすき焼きダレが染み込んだ満足感たっぷりの煮物。' },
  { id: 'b14', name: '牛肉のオイスター炒め弁当', category: '牛肉', icon: '🐂', stock: 10, desc: 'オイスターソースの深いコクと豊かな風味。' },
  { id: 'b15', name: '鶏の唐揚げ弁当', category: '鶏肉', icon: '🐓', stock: 15, desc: '外はカリッと中はジューシーなみんな大好き唐揚げ。' },
  { id: 'b16', name: '鶏肉のレモンクリーム弁当', category: '鶏肉', icon: '🐓', stock: 10, desc: 'さわやかなレモンの香りとクリーミーなソース。' },
  { id: 'b17', name: 'ホッケのみりん焼き弁当', category: '魚', icon: '🐟', stock: 10, desc: '脂ののったホッケをほんのり甘いみりん干し風に。' },
  { id: 'b18', name: 'アジの塩焼き弁当', category: '魚', icon: '🐟', stock: 10, desc: 'シンプルだからこそ魚の旨味が際立つ塩焼き。' },
  { id: 'b19', name: '野菜たっぷりエビマヨ弁当', category: '和食・その他', icon: '🦐', stock: 10, desc: 'プリプリ海老やまろやかマヨソース。' },
  { id: 'b20', name: '海老としめじの玉子とじ弁当', category: '和食・その他', icon: '🦐', stock: 10, desc: 'ふんわり優しい玉子で包んだお出汁の効いたお弁当。' },
  { id: 'b21', name: '若鶏の利休焼き弁当', category: '鶏肉', icon: '🐓', stock: 10, desc: '香ばしいゴマの香りが広がる伝統和風メニュー。' },
  { id: 'b22', name: '牛肉と茄子の麻婆ソース弁当', category: '牛肉', icon: '🐂', stock: 10, desc: 'ジューシーな茄子と牛肉のピリ辛本格麻婆。' },
  { id: 'b23', name: '野菜たっぷりキーマカレー弁当', category: '和食・その他', icon: '🍛', stock: 10, desc: 'スパイス香るマイルドで食べやすいキーマカレー。' },
  { id: 'b24', name: '韓国風焼肉炒め弁当', category: '牛肉', icon: '🐂', stock: 10, desc: '特製プルコギダレで炒めたしっかり味付けのお肉。' },
  { id: 'b25', name: '鶏の照焼き弁当', category: '鶏肉', icon: '🐓', stock: 12, desc: '照り照りの甘辛タレが絡む定番の照り焼き。' },
  { id: 'b26', name: 'チリソースミートボール弁当', category: '和食・その他', icon: '🧆', stock: 10, desc: '甘辛チリソースが食欲を刺激するミートボール。' },
  { id: 'b27', name: 'ズッキーニとチキンのトマト煮込み弁当', category: '鶏肉', icon: '🐓', stock: 10, desc: '彩り野菜とチキンのヘルシーな地中海風煮込み。' },
  { id: 'b28', name: '回鍋肉弁当', category: '豚肉', icon: '🐖', stock: 10, desc: 'シャキシャキキャベツと豚肉の甜麺醤炒め。' },
  { id: 'b29', name: '家常豆腐弁当', category: '和食・その他', icon: '🍲', stock: 10, desc: '香ばしく揚げた豆腐と野菜の和風あんかけ煮込み。' },
  { id: 'b30', name: '牛肉きのこの甘辛炒め弁当', category: '牛肉', icon: '🐂', stock: 10, desc: 'たっぷりのきのこ風味と牛肉の甘辛和風炒め。' }
];

// App State
let bentoMaster = [];
let todaysMenuIds = [];
let porteUsers = [];
let orderHistory = [];
let currentCategoryFilter = 'ALL';
let currentSelectingBentoId = null;

let modalShowAll = false;
let tableShowAll = false;

// モーダル内 一時編集ロット
let tempModalLots = [];

// DOM ready
document.addEventListener('DOMContentLoaded', async () => {
  initDate();
  loadData();
  setupTabs();
  setupEventListeners();
  renderAll();
  
  // ページを開いた瞬間に自動的にPorte Supabase DBから最新利用者＆出欠データを自動取得
  const { url, key } = getSupabaseCredentials();
  if (url && key && typeof supabase !== 'undefined') {
    await fetchPorteDbAttendance();
    await syncFromSupabase();
  } else if (porteUsers.length === 0) {
    loadSamplePorteData(false);
  }
});

function initDate() {
  const now = new Date();
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  const formatted = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日(${days[now.getDay()]})`;
  document.getElementById('currentDateBadge').textContent = formatted;
}

function getOffsetDateStr(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// ロットデータの整合性保証 ＆ 合計在庫数の自動同期
function ensureBentoLots(bento) {
  if (!bento.lots) {
    bento.lots = [];
  }
  if (bento.lots.length === 0 && bento.stock > 0) {
    bento.lots.push({
      id: 'lot_' + Date.now(),
      type: 'STOCK',
      qty: parseInt(bento.stock, 10) || 0,
      expDate: getOffsetDateStr(7)
    });
  }
  recalculateBentoTotalStock(bento);
}

function recalculateBentoTotalStock(bento) {
  if (!bento.lots) bento.lots = [];
  bento.stock = bento.lots.reduce((sum, l) => sum + (parseInt(l.qty, 10) || 0), 0);
}

// 最長・最も早い賞味期限の取得
function getBentoEarliestExpDate(bento) {
  ensureBentoLots(bento);
  const activeLots = (bento.lots || []).filter(l => l.qty > 0);
  if (activeLots.length === 0) return '9999-12-31';
  activeLots.sort((a, b) => new Date(a.expDate) - new Date(b.expDate));
  return activeLots[0].expDate;
}

// 本日の5品の配列整理（在庫ありを優先、賞味期限ソートは行わない）
function sortTodaysMenuIdsByExpiration() {
  if (!todaysMenuIds || todaysMenuIds.length === 0) return;
  todaysMenuIds.sort((idA, idB) => {
    const bA = bentoMaster.find(b => b.id === idA);
    const bB = bentoMaster.find(b => b.id === idB);
    if (!bA) return 1;
    if (!bB) return -1;

    if (bA.stock > 0 && bB.stock <= 0) return -1;
    if (bA.stock <= 0 && bB.stock > 0) return 1;
    return 0;
  });
}

// FIFO（賞味期限が近い順）での在庫消費
function deductBentoStockFIFO(bento, count = 1) {
  ensureBentoLots(bento);
  if (bento.stock <= 0) return;

  bento.lots.sort((a, b) => new Date(a.expDate) - new Date(b.expDate));

  let remainingToDeduct = count;
  for (let i = 0; i < bento.lots.length; i++) {
    const lot = bento.lots[i];
    if (lot.qty >= remainingToDeduct) {
      lot.qty -= remainingToDeduct;
      remainingToDeduct = 0;
      break;
    } else {
      remainingToDeduct -= lot.qty;
      lot.qty = 0;
    }
  }

  bento.lots = bento.lots.filter(l => l.qty > 0);
  recalculateBentoTotalStock(bento);
}

function addBentoStockLot(bento, qty, expDate, type = 'ARRIVED') {
  ensureBentoLots(bento);
  bento.lots.push({
    id: 'lot_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    type: type,
    qty: parseInt(qty, 10) || 0,
    expDate: expDate
  });
  bento.lots.sort((a, b) => new Date(a.expDate) - new Date(b.expDate));
  recalculateBentoTotalStock(bento);
}

function loadData() {
  const savedMaster = localStorage.getItem('bento_master');
  if (savedMaster) {
    try {
      bentoMaster = JSON.parse(savedMaster);
    } catch(e) {
      bentoMaster = [...DEFAULT_30_BENTO];
    }
  } else {
    bentoMaster = JSON.parse(JSON.stringify(DEFAULT_30_BENTO));
  }

  bentoMaster.forEach(b => ensureBentoLots(b));
  saveMaster();

  const savedTodays = localStorage.getItem('bento_todays_menu');
  if (savedTodays) {
    try {
      todaysMenuIds = JSON.parse(savedTodays);
    } catch(e) {
      todaysMenuIds = bentoMaster.slice(0, 5).map(b => b.id);
    }
  } else {
    todaysMenuIds = bentoMaster.slice(0, 5).map(b => b.id);
    saveTodaysMenu();
  }

  const savedUsers = localStorage.getItem('bento_porte_users');
  if (savedUsers) {
    try {
      porteUsers = JSON.parse(savedUsers);
    } catch(e) {
      porteUsers = [];
    }
  }

  const savedOrders = localStorage.getItem('bento_order_history');
  if (savedOrders) {
    try {
      orderHistory = JSON.parse(savedOrders);
    } catch(e) {
      orderHistory = [];
    }
  }

  autoReplaceSoldOutMenu();
}

function saveMaster() {
  saveMasterToSupabase();
}

function saveTodaysMenu() {
  saveTodaysMenuToSupabase();
}

function savePorteUsers() {
  localStorage.setItem('bento_porte_users', JSON.stringify(porteUsers));
}

function saveOrderHistory() {
  saveOrderHistoryToSupabase();
}

// Supabase データベース同期機能 (複数端末間リアルタイム共有)
async function syncFromSupabase() {
  const { url, key } = getSupabaseCredentials();
  if (!url || !key || typeof supabase === 'undefined') return;

  try {
    const SB = supabase.createClient(url, key);

    // 1. 商品マスター & 在庫データ同期
    const masterRes = await SB.from('bento_master').select('*');
    if (masterRes.data && masterRes.data.length > 0) {
      bentoMaster = masterRes.data.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        icon: item.icon,
        stock: item.stock,
        desc: item.description || item.desc || '',
        lots: item.lots || []
      }));
      bentoMaster.forEach(b => ensureBentoLots(b));
      localStorage.setItem('bento_master', JSON.stringify(bentoMaster));
    }

    // 2. 本日の5品 メニューデータ同期
    const todayRes = await SB.from('bento_todays_menu').select('*').eq('id', 'today').single();
    if (todayRes.data && Array.isArray(todayRes.data.todays_ids) && todayRes.data.todays_ids.length >= 5) {
      todaysMenuIds = todayRes.data.todays_ids;
      localStorage.setItem('bento_todays_menu', JSON.stringify(todaysMenuIds));
    } else if (!todaysMenuIds || todaysMenuIds.length < 5) {
      todaysMenuIds = pickBalancedTodaysMenu(true);
      saveTodaysMenu();
    }

    // 3. 注文履歴 & 各利用者の選択お弁当同期
    const ordersRes = await SB.from('bento_orders').select('*').order('created_at', { ascending: false }).limit(100);
    if (ordersRes.data) {
      orderHistory = ordersRes.data.map(o => ({
        id: o.id,
        date: o.order_date,
        userName: o.user_name,
        bentoId: o.bento_id,
        bentoName: o.bento_name,
        category: o.category
      }));
      localStorage.setItem('bento_order_history', JSON.stringify(orderHistory));

      // 利用者が選んだお弁当の選択状態を全端末で同期
      if (porteUsers && porteUsers.length > 0) {
        porteUsers.forEach(u => {
          const userLatestOrder = ordersRes.data.find(o => o.user_name === u.name);
          if (userLatestOrder) {
            u.selectedBentoId = userLatestOrder.bento_id;
          }
        });
        localStorage.setItem('bento_porte_users', JSON.stringify(porteUsers));
      }
    }

    renderAll();
  } catch (err) {
    // 静かに無視
  }
}

async function saveMasterToSupabase() {
  localStorage.setItem('bento_master', JSON.stringify(bentoMaster));
  const { url, key } = getSupabaseCredentials();
  if (!url || !key || typeof supabase === 'undefined') return;
  try {
    const SB = supabase.createClient(url, key);
    const rows = bentoMaster.map(b => ({
      id: b.id,
      name: b.name,
      category: b.category,
      icon: b.icon,
      stock: b.stock,
      description: b.desc || '',
      lots: b.lots || []
    }));
    await SB.from('bento_master').upsert(rows);
  } catch(e) {}
}

async function saveTodaysMenuToSupabase() {
  sortTodaysMenuIdsByExpiration();
  localStorage.setItem('bento_todays_menu', JSON.stringify(todaysMenuIds));
  const { url, key } = getSupabaseCredentials();
  if (!url || !key || typeof supabase === 'undefined') return;
  try {
    const SB = supabase.createClient(url, key);
    await SB.from('bento_todays_menu').upsert({
      id: 'today',
      todays_ids: todaysMenuIds,
      updated_at: new Date().toISOString()
    });
  } catch(e) {}
}

async function saveOrderHistoryToSupabase() {
  localStorage.setItem('bento_order_history', JSON.stringify(orderHistory));
  const { url, key } = getSupabaseCredentials();
  if (!url || !key || typeof supabase === 'undefined') return;
  try {
    const SB = supabase.createClient(url, key);
    if (orderHistory.length > 0) {
      const top = orderHistory[0];
      await SB.from('bento_orders').upsert({
        id: top.id,
        user_name: top.userName,
        bento_id: top.bentoId,
        bento_name: top.bentoName,
        category: top.category,
        order_date: top.date,
        created_at: new Date().toISOString()
      });
    }
  } catch(e) {}
}

function autoReplaceSoldOutMenu() {
  if (!bentoMaster || bentoMaster.length === 0 || !todaysMenuIds) return;

  const inStockMaster = bentoMaster.filter(b => b.stock > 0);
  if (inStockMaster.length === 0) return;

  // 在庫あり商品を賞味期限が近い順に並び替え
  inStockMaster.sort((a, b) => new Date(getBentoEarliestExpDate(a)) - new Date(getBentoEarliestExpDate(b)));

  let changed = false;
  const currentlyOrderedIds = porteUsers.map(u => u.selectedBentoId).filter(Boolean);

  for (let i = 0; i < todaysMenuIds.length; i++) {
    const currentId = todaysMenuIds[i];
    const bento = bentoMaster.find(b => b.id === currentId);
    const isOrderedBySomeone = currentlyOrderedIds.includes(currentId);

    if (!isOrderedBySomeone && (!bento || bento.stock <= 0)) {
      const unusedInStock = inStockMaster.find(b => !todaysMenuIds.includes(b.id));
      if (unusedInStock) {
        todaysMenuIds[i] = unusedInStock.id;
        changed = true;
      }
    }
  }

  sortTodaysMenuIdsByExpiration();

  if (changed) {
    saveTodaysMenu();
  }
}

function setupTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      tab.classList.add('active');
      const targetId = tab.getAttribute('data-tab');
      document.getElementById(targetId).classList.add('active');
    });
  });
}

function renderAll() {
  renderTodaysMenu();
  renderPorteSection();
  renderStockSection();
  renderMasterSection();
  updateHeaderStats();
  renderProgressBar();
}

function renderProgressBar() {
  const bentoTargetUsers = porteUsers.filter(u => u.wantsBento !== false);
  const total = bentoTargetUsers.length;
  const ordered = bentoTargetUsers.filter(u => u.selectedBentoId).length;
  const pending = total - ordered;
  const percent = total > 0 ? Math.round((ordered / total) * 100) : 0;

  document.getElementById('progressText').textContent = `${ordered} / ${total} 名完了 (${percent}%)`;
  document.getElementById('progressSubText').textContent = `未選択: ${pending}名`;
  document.getElementById('progressFill').style.width = `${percent}%`;
}

// 1. 本日の5品 メニュー表示（賞味期限の短い順で描画）
function renderTodaysMenu() {
  autoReplaceSoldOutMenu();
  sortTodaysMenuIdsByExpiration();

  const grid = document.getElementById('todaysMenuGrid');
  grid.innerHTML = '';

  const items = todaysMenuIds.map(id => bentoMaster.find(b => b.id === id)).filter(Boolean);

  items.forEach((item, index) => {
    const isSoldOut = item.stock <= 0;
    const stockPercent = Math.min(100, Math.max(0, (item.stock / 15) * 100));

    const earliestExp = getBentoEarliestExpDate(item);
    const expBadgeText = earliestExp !== '9999-12-31' ? `⏳ 賞味期限: ${earliestExp}` : '';

    const chosenUsers = porteUsers.filter(u => u.selectedBentoId === item.id);
    let userTagsHtml = '';
    chosenUsers.forEach(u => {
      userTagsHtml += `<span class="user-tag">👤 ${u.name}</span>`;
    });

    const card = document.createElement('div');
    card.className = `bento-card ${isSoldOut ? 'sold-out' : ''}`;
    card.innerHTML = `
      <span class="bento-number-badge">第 ${index + 1} 案</span>
      <span class="bento-cat-tag">${item.category}</span>
      <div class="bento-avatar-box">${item.icon}</div>
      <h3 class="bento-title">${item.name}</h3>
      <p style="font-size:0.8rem; color:#747d8c; margin-bottom:8px;">${item.desc || ''}</p>
      
      <div class="bento-stock-bar">
        <div class="bento-stock-fill ${item.stock <= 3 ? 'low' : ''} ${item.stock <= 0 ? 'zero' : ''}" style="width: ${stockPercent}%;"></div>
      </div>
      <div class="bento-stock-text">
        ${isSoldOut ? '<span style="color:#ff4757; font-weight:800;">完売いたしました</span>' : `残り <strong>${item.stock}</strong> 食`}
      </div>

      <div class="bento-selected-users">
        ${userTagsHtml || '<span style="font-size:0.75rem; color:#adb5bd;">選択した方はまだいません</span>'}
      </div>

      <button class="bento-order-btn" ${isSoldOut ? 'disabled' : ''} onclick="quickOrderBento('${item.id}')">
        ${isSoldOut ? '売り切れ' : 'このお弁当を選ぶ 🍱'}
      </button>

      ${isSoldOut ? `
        <div class="sold-out-overlay">
          <div class="sold-out-stamp">完売御礼</div>
        </div>
      ` : ''}
    `;

    grid.appendChild(card);
  });
}

window.quickOrderBento = function(bentoId) {
  const item = bentoMaster.find(b => b.id === bentoId);
  if (!item || item.stock <= 0) {
    showToast('在庫がありません', 'info');
    return;
  }

  if (porteUsers.length === 0) {
    showToast('本日利用者のデータがありません。先にポルテデータを読み込んでください。', 'info');
    return;
  }

  currentSelectingBentoId = bentoId;
  openUserSelectForBentoModal(item);
};

function openUserSelectForBentoModal(bentoItem) {
  document.getElementById('selectUserModalBentoTitle').textContent = `🍱 『${bentoItem.name}』を誰の注文にしますか？`;
  document.getElementById('userSelectModalSearch').value = '';
  
  renderUserPickerList('');
  document.getElementById('userSelectForBentoModal').classList.add('active');
}

function renderUserPickerList(searchQuery) {
  const listContainer = document.getElementById('userPickerList');
  listContainer.innerHTML = '';

  const q = searchQuery.toLowerCase();

  const filtered = porteUsers.filter(u => {
    const isTarget = modalShowAll || (u.wantsBento !== false) || u.selectedBentoId;
    const matchQuery = u.name.toLowerCase().includes(q) || (u.kana && u.kana.toLowerCase().includes(q)) || u.id.toLowerCase().includes(q);
    return isTarget && matchQuery;
  });

  if (filtered.length === 0) {
    listContainer.innerHTML = `
      <div style="text-align:center; padding:24px; color:#747d8c;">
        <p style="margin-bottom:8px;">該当するお弁当対象者様が見つかりません。</p>
        <button class="btn btn-sm btn-outline" onclick="toggleModalShowAll(true)">👥 全通所者から急遽追加する</button>
      </div>
    `;
    return;
  }

  filtered.forEach(u => {
    const isChosenThis = u.selectedBentoId === currentSelectingBentoId;
    const currentChoice = u.selectedBentoId ? bentoMaster.find(b => b.id === u.selectedBentoId) : null;
    const isSuddenAdd = u.wantsBento === false;

    const div = document.createElement('div');
    div.className = `user-picker-item ${isChosenThis ? 'selected' : ''}`;
    div.innerHTML = `
      <div class="user-picker-info">
        <span class="user-picker-name">
          ${u.name} <small style="color:#868e96; font-size:0.8rem;">(${u.kana || ''})</small>
          ${isSuddenAdd ? '<span style="background:#fff0f6; color:#e64980; font-size:0.75rem; padding:2px 8px; border-radius:10px; margin-left:6px; font-weight:800;">急遽追加</span>' : ''}
        </span>
        <span class="user-picker-sub">
          ${currentChoice ? `現在の選択: <strong>${currentChoice.icon} ${currentChoice.name}</strong>` : '<span style="color:#e64980; font-weight:700;">未選択</span>'}
          ${u.note ? ` | 特記: ${u.note}` : ''}
        </span>
      </div>
      <div>
        <button class="btn btn-sm ${isChosenThis ? 'btn-secondary' : 'btn-primary'}" onclick="confirmAssignUserForBento('${u.id}')">
          ${isChosenThis ? '選択済み' : (isSuddenAdd ? '急遽お弁当を追加 ➕' : (currentChoice ? '変更する' : 'この人に決定 🎯'))}
        </button>
      </div>
    `;
    listContainer.appendChild(div);
  });
}

window.toggleModalShowAll = function(showAll) {
  modalShowAll = showAll;
  document.getElementById('modalFilterBentoOnlyBtn').classList.toggle('active', !showAll);
  document.getElementById('modalFilterShowAllBtn').classList.toggle('active', showAll);
  renderUserPickerList(document.getElementById('userSelectModalSearch').value);
};

window.confirmAssignUserForBento = function(userId) {
  const userIndex = porteUsers.findIndex(u => u.id === userId);
  if (userIndex < 0 || !currentSelectingBentoId) return;

  const user = porteUsers[userIndex];
  
  if (user.wantsBento === false) {
    user.wantsBento = true;
    showToast(`⚡ ${user.name} 様のお弁当希望を追加しました！`, 'info');
  }

  assignUserBento(userIndex, currentSelectingBentoId);
  const bentoItem = bentoMaster.find(b => b.id === currentSelectingBentoId);

  closeUserSelectForBentoModal();
  showToast(`🎉 ${user.name} 様のお弁当を『${bentoItem.name}』に登録しました！`, 'success');
};

function closeUserSelectForBentoModal() {
  document.getElementById('userSelectForBentoModal').classList.remove('active');
  currentSelectingBentoId = null;
}

// 2. ポルテデータ＆注文受付レンダー
function renderPorteSection() {
  const bentoUsers = porteUsers.filter(u => u.wantsBento !== false);
  const totalTarget = bentoUsers.length;
  const ordered = bentoUsers.filter(u => u.selectedBentoId).length;
  const pending = totalTarget - ordered;

  document.getElementById('summaryTotalUsers').textContent = `${totalTarget} (全員:${porteUsers.length})`;
  document.getElementById('summaryOrderedUsers').textContent = ordered;
  document.getElementById('summaryPendingUsers').textContent = pending;

  document.getElementById('porteTabBadge').textContent = `未受付 ${pending}`;

  const tbody = document.getElementById('porteUserTableBody');
  tbody.innerHTML = '';

  if (porteUsers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px; color:#747d8c;">ポルテのDBから自動読込するか、CSVファイルを読み込んでください。</td></tr>`;
  } else {
    const todaysBentoList = todaysMenuIds.map(id => bentoMaster.find(b => b.id === id)).filter(Boolean);
    const displayList = porteUsers.filter(u => tableShowAll || u.wantsBento !== false || u.selectedBentoId);

    displayList.forEach((u) => {
      const realIndex = porteUsers.findIndex(item => item.id === u.id);
      const isDone = !!u.selectedBentoId;
      const wantsBento = u.wantsBento !== false;
      const tr = document.createElement('tr');

      let userBentoOptions = [...todaysBentoList];
      if (u.selectedBentoId && !userBentoOptions.some(b => b.id === u.selectedBentoId)) {
        const chosenItem = bentoMaster.find(b => b.id === u.selectedBentoId);
        if (chosenItem) {
          userBentoOptions.push(chosenItem);
        }
      }

      let optionsHtml = `<option value="">-- お弁当を選択してください --</option>`;
      userBentoOptions.forEach(b => {
        const isSoldOut = b.stock <= 0 && u.selectedBentoId !== b.id;
        const isSelected = u.selectedBentoId === b.id;
        optionsHtml += `<option value="${b.id}" ${isSelected ? 'selected' : ''} ${isSoldOut ? 'disabled' : ''}>
          ${b.icon} ${b.name} (残${b.stock}) ${isSelected ? '✓ 選択中' : ''}
        </option>`;
      });

      tr.innerHTML = `
        <td><strong>${u.id}</strong></td>
        <td><strong>${u.name}</strong> <span style="font-size:0.75rem; color:#868e96;">(${u.kana || ''})</span></td>
        <td>
          <button class="btn btn-sm ${wantsBento ? 'btn-outline' : 'btn-sample'}" style="padding:2px 8px; font-size:0.75rem;" onclick="toggleUserBentoWant(${realIndex})">
            ${wantsBento ? '🍱 注文あり' : '⚪ 注文なし'}
          </button>
        </td>
        <td><span style="color:#e64980; font-size:0.85rem; font-weight:700;">${u.note || '-'}</span></td>
        <td>
          <select class="bento-select-dropdown" onchange="assignUserBento(${realIndex}, this.value)">
            ${optionsHtml}
          </select>
        </td>
        <td>
          <span class="badge-status ${isDone ? 'done' : 'pending'}">
            ${isDone ? '決定' : '未選択'}
          </span>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  renderCateringOrderTally();
}

window.toggleUserBentoWant = function(userIndex) {
  const user = porteUsers[userIndex];
  if (!user) return;

  user.wantsBento = !(user.wantsBento !== false);
  if (!user.wantsBento && user.selectedBentoId) {
    assignUserBento(userIndex, '');
  }
  savePorteUsers();
  renderAll();
  showToast(`${user.name} 様のお弁当注文希望を切り替えました`, 'info');
};

window.assignUserBento = function(userIndex, newBentoId) {
  const user = porteUsers[userIndex];
  const oldBentoId = user.selectedBentoId;

  if (oldBentoId === newBentoId) return;

  if (oldBentoId) {
    const oldBento = bentoMaster.find(b => b.id === oldBentoId);
    if (oldBento) {
      addBentoStockLot(oldBento, 1, getOffsetDateStr(7), 'STOCK');
    }
  }

  if (newBentoId) {
    const newBento = bentoMaster.find(b => b.id === newBentoId);
    if (newBento) {
      if (newBento.stock <= 0) {
        showToast('売り切れのため選択できません', 'info');
        user.selectedBentoId = '';
        renderAll();
        return;
      }

      deductBentoStockFIFO(newBento, 1);
      user.wantsBento = true;

      if (!todaysMenuIds.includes(newBento.id)) {
        const replaceableIndex = todaysMenuIds.findIndex(id => {
          return !porteUsers.some(u => u.selectedBentoId === id);
        });
        if (replaceableIndex >= 0) {
          todaysMenuIds[replaceableIndex] = newBento.id;
        } else {
          todaysMenuIds[0] = newBento.id;
        }
        saveTodaysMenu();
      }

      orderHistory.unshift({
        id: 'ord_' + Date.now(),
        date: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
        userName: user.name,
        bentoId: newBento.id,
        bentoName: newBento.name,
        category: newBento.category
      });
    }
  }

  user.selectedBentoId = newBentoId;
  saveMaster();
  savePorteUsers();
  saveOrderHistory();
  renderAll();
};

function renderCateringOrderTally() {
  const container = document.getElementById('cateringOrderTally');
  container.innerHTML = '';

  const tally = {};
  porteUsers.forEach(u => {
    if (u.selectedBentoId) {
      const b = bentoMaster.find(item => item.id === u.selectedBentoId);
      const name = b ? b.name : '不明なお弁当';
      tally[name] = (tally[name] || 0) + 1;
    }
  });

  const keys = Object.keys(tally);
  if (keys.length === 0) {
    container.innerHTML = `<p style="color:#747d8c; text-align:center; padding:10px;">本日の注文決定分はまだありません。</p>`;
    return;
  }

  let totalCount = 0;
  keys.forEach(bentoName => {
    const count = tally[bentoName];
    totalCount += count;
    const itemEl = document.createElement('div');
    itemEl.className = 'tally-item';
    itemEl.innerHTML = `
      <span class="tally-name">${bentoName}</span>
      <span class="tally-count">${count} 食</span>
    `;
    container.appendChild(itemEl);
  });

  const totalEl = document.createElement('div');
  totalEl.style.cssText = 'display:flex; justify-space-between; font-weight:800; font-size:1.1rem; margin-top:10px; padding-top:10px; border-top:2px solid #ffd8a8; color:#d9480f;';
  totalEl.innerHTML = `<span>発注合計</span><span>${totalCount} 食</span>`;
  container.appendChild(totalEl);
}

function renderStockSection() {
  const quickList = document.getElementById('quickStockAdjustList');
  if (quickList) {
    quickList.innerHTML = '';
    todaysMenuIds.map(id => bentoMaster.find(b => b.id === id)).filter(Boolean).forEach(item => {
      const div = document.createElement('div');
      div.className = 'quick-stock-item';
      div.innerHTML = `
        <div>
          <strong>${item.icon} ${item.name}</strong>
          <div style="font-size:0.75rem; color:#747d8c;">${item.category}</div>
        </div>
        <div class="stock-control">
          <button class="btn-qty" onclick="adjustStock('${item.id}', -1)">-</button>
          <strong style="font-size:1.1rem; color:#d9480f; min-width:32px; text-align:center;">${item.stock}</strong>
          <button class="btn-qty" onclick="adjustStock('${item.id}', 1)">+</button>
        </div>
      `;
      quickList.appendChild(div);
    });
  }

  const tbody = document.getElementById('orderHistoryTableBody');
  tbody.innerHTML = '';

  if (orderHistory.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px; color:#747d8c;">注文履歴はありません。</td></tr>`;
  } else {
    orderHistory.slice(0, 30).forEach((ord, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${ord.date}</td>
        <td><strong>${ord.userName}</strong></td>
        <td>${ord.bentoName}</td>
        <td><span class="pill-btn" style="font-size:0.75rem;">${ord.category}</span></td>
        <td><button class="btn btn-sm btn-outline-danger" onclick="cancelOrderHistory(${index})">取消</button></td>
      `;
      tbody.appendChild(tr);
    });
  }
}

window.adjustStock = function(bentoId, delta) {
  const item = bentoMaster.find(b => b.id === bentoId);
  if (item) {
    if (delta < 0) {
      deductBentoStockFIFO(item, Math.abs(delta));
    } else {
      addBentoStockLot(item, delta, getOffsetDateStr(7), 'ARRIVED');
    }
    saveMaster();
    renderAll();
  }
};

window.setStockDirect = function(bentoId, val) {
  const item = bentoMaster.find(b => b.id === bentoId);
  if (item) {
    const newQty = Math.max(0, parseInt(val, 10) || 0);
    const diff = newQty - item.stock;
    if (diff < 0) {
      deductBentoStockFIFO(item, Math.abs(diff));
    } else if (diff > 0) {
      addBentoStockLot(item, diff, getOffsetDateStr(7), 'ARRIVED');
    }
    saveMaster();
    renderAll();
  }
};

window.adjustMasterStock = function(bentoId, delta) {
  adjustStock(bentoId, delta);
};

window.cancelOrderHistory = function(index) {
  const removed = orderHistory.splice(index, 1)[0];
  if (removed) {
    const item = bentoMaster.find(b => b.id === removed.bentoId);
    if (item) {
      addBentoStockLot(item, 1, getOffsetDateStr(7), 'STOCK');
    }
  }
  saveMaster();
  saveOrderHistory();
  showToast('注文取消を完了しました', 'info');
  renderAll();
};

function renderMasterSection() {
  const container = document.getElementById('masterItemsGrid');
  container.innerHTML = '';

  const searchVal = (document.getElementById('masterSearchInput').value || '').toLowerCase();

  const filtered = bentoMaster.filter(item => {
    ensureBentoLots(item);
    const matchCat = currentCategoryFilter === 'ALL' || item.category === currentCategoryFilter;
    const matchSearch = item.name.toLowerCase().includes(searchVal);
    return matchCat && matchSearch;
  });

  document.getElementById('masterTotalCount').textContent = bentoMaster.length;
  const countBadge = document.getElementById('masterCountBadge');
  if (countBadge) countBadge.textContent = `${bentoMaster.length}品目`;

  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:40px; color:#747d8c; font-weight:700;">該当する商品が見つかりません。</div>`;
    return;
  }

  const table = document.createElement('table');
  table.className = 'master-list-table';
  
  let rowsHtml = '';
  filtered.forEach(item => {
    const isToday = todaysMenuIds.includes(item.id);

    let lotBadgesHtml = '';
    if (item.lots && item.lots.length > 0) {
      item.lots.forEach((lot, lIdx) => {
        if (lot.qty > 0) {
          const isArrived = lot.type === 'ARRIVED';
          const daysLeft = Math.ceil((new Date(lot.expDate) - new Date().setHours(0,0,0,0)) / (1000 * 60 * 60 * 24));
          
          let statusClass = 'exp-normal';
          if (daysLeft <= 0) statusClass = 'exp-expired';
          else if (daysLeft <= 3) statusClass = 'exp-warning';

          const typeLabel = isArrived ? '🚚 入荷分' : '📦 既存在庫';
          const typeBg = isArrived ? '#e7f5ff' : '#fff4e6';
          const typeColor = isArrived ? '#1971c2' : '#d9480f';

          lotBadgesHtml += `
            <div class="lot-badge ${statusClass}">
              <span style="font-size:0.75rem; font-weight:900; background:${typeBg}; color:${typeColor}; padding:2px 6px; border-radius:6px; margin-right:4px;">${typeLabel}</span>
              <span>📅 ${lot.expDate}</span>
              <strong style="margin-left:6px; font-size:0.88rem; color:#212529;">${lot.qty}食</strong>
              <button class="btn-del-lot" onclick="deleteBentoLot('${item.id}', ${lIdx})" title="このロットを削除">&times;</button>
            </div>
          `;
        }
      });
    }

    if (!lotBadgesHtml) {
      lotBadgesHtml = `<span style="color:#adb5bd; font-size:0.85rem;">(在庫・入荷ロットなし)</span>`;
    }

    rowsHtml += `
      <tr>
        <td style="width: 120px;">
          <span class="cat-pill">${item.category}</span>
        </td>
        <td style="width: 240px;">
          <strong style="font-size:1.05rem; color:#212529;">${item.name}</strong>
        </td>
        <td style="width: 140px; text-align:center;">
          <div class="stock-control" style="justify-content: center;">
            <button class="btn-qty" onclick="adjustMasterStock('${item.id}', -1)">-</button>
            <strong style="font-size:1.2rem; color:#d9480f; min-width:34px; text-align:center;">${item.stock}</strong>
            <button class="btn-qty" onclick="adjustMasterStock('${item.id}', 1)">+</button>
            <span style="font-size:0.85rem; font-weight:800; color:#495057; margin-left:4px;">食</span>
          </div>
        </td>
        <td>
          <div style="display:flex; align-items:center; justify-space-between; flex-wrap:wrap; gap:8px;">
            <div class="lot-badge-container">
              ${lotBadgesHtml}
            </div>
            <button class="btn btn-sm btn-outline" style="font-size:0.8rem; padding:4px 10px; font-weight:700; border-color:#ffa8a8; color:#e03131;" onclick="openAddLotModal('${item.id}')">
              🚚 入荷分を追加
            </button>
          </div>
        </td>
        <td style="width: 100px; text-align:center;">
          ${isToday ? '<span class="badge-status done">本日5品</span>' : '<span style="color:#adb5bd; font-size:0.85rem;">-</span>'}
        </td>
        <td style="width: 110px; text-align:center;">
          <button class="btn btn-sm btn-outline" style="font-weight:700;" onclick="openEditBentoModal('${item.id}')">✏️ 編集・明細</button>
        </td>
      </tr>
    `;
  });

  table.innerHTML = `
    <thead>
      <tr>
        <th style="width: 120px;">カテゴリー</th>
        <th style="width: 240px;">商品名</th>
        <th style="width: 140px; text-align:center;">合計在庫数</th>
        <th>既存在庫 ＆ 入荷分 ロット明細一覧</th>
        <th style="width: 100px; text-align:center;">本日の5品</th>
        <th style="width: 110px; text-align:center;">操作</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  `;

  container.appendChild(table);
}

window.addModalLotRow = function(type = 'STOCK') {
  tempModalLots.push({
    id: 'lot_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    type: type,
    qty: type === 'ARRIVED' ? 5 : 2,
    expDate: getOffsetDateStr(7)
  });
  renderModalLotRows();
};

window.removeModalLotRow = function(index) {
  tempModalLots.splice(index, 1);
  renderModalLotRows();
};

window.updateModalLotField = function(index, field, val) {
  if (!tempModalLots[index]) return;
  if (field === 'qty') {
    tempModalLots[index].qty = Math.max(0, parseInt(val, 10) || 0);
  } else if (field === 'expDate') {
    tempModalLots[index].expDate = val;
  } else if (field === 'type') {
    tempModalLots[index].type = val;
  }
  updateModalTotalStockText();
};

function updateModalTotalStockText() {
  const total = tempModalLots.reduce((sum, l) => sum + (parseInt(l.qty, 10) || 0), 0);
  const textEl = document.getElementById('modalTotalStockText');
  if (textEl) textEl.textContent = total;
  const inputEl = document.getElementById('bentoStockInput');
  if (inputEl) inputEl.value = total;
}

function renderModalLotRows() {
  const container = document.getElementById('modalLotRowsContainer');
  if (!container) return;

  container.innerHTML = '';

  if (tempModalLots.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:16px; color:#868e96; font-size:0.9rem;">登録されている既存在庫・入荷ロットはありません。下のボタンから追加してください。</div>`;
    updateModalTotalStockText();
    return;
  }

  tempModalLots.forEach((lot, idx) => {
    const row = document.createElement('div');
    row.className = 'modal-lot-row';
    row.innerHTML = `
      <select onchange="updateModalLotField(${idx}, 'type', this.value)">
        <option value="STOCK" ${lot.type === 'STOCK' ? 'selected' : ''}>📦 既存在庫分</option>
        <option value="ARRIVED" ${lot.type === 'ARRIVED' ? 'selected' : ''}>🚚 新規入荷分</option>
      </select>
      
      <div style="display:flex; align-items:center; gap:4px;">
        <span style="font-size:0.85rem; font-weight:700; color:#495057;">数量:</span>
        <input type="number" value="${lot.qty}" min="0" onchange="updateModalLotField(${idx}, 'qty', this.value)">
        <span style="font-size:0.85rem; font-weight:800; color:#495057;">食</span>
      </div>

      <div style="display:flex; align-items:center; gap:4px; margin-left:auto;">
        <span style="font-size:0.85rem; font-weight:700; color:#495057;">賞味期限:</span>
        <input type="date" value="${lot.expDate}" onchange="updateModalLotField(${idx}, 'expDate', this.value)">
      </div>

      <button type="button" class="btn btn-sm btn-outline-danger" style="padding:2px 8px; font-size:0.8rem;" onclick="removeModalLotRow(${idx})" title="この明細行を削除">&times;</button>
    `;
    container.appendChild(row);
  });

  updateModalTotalStockText();
}

window.openAddLotModal = function(bentoId) {
  const item = bentoMaster.find(b => b.id === bentoId);
  if (!item) return;

  ensureBentoLots(item);

  document.getElementById('addLotBentoId').value = item.id;
  document.getElementById('addLotBentoName').textContent = item.name;
  document.getElementById('lotQtyInput').value = 5;
  document.getElementById('lotExpDateInput').value = getOffsetDateStr(7);

  const listEl = document.getElementById('existingLotsList');
  listEl.innerHTML = '';
  if (item.lots && item.lots.length > 0) {
    item.lots.forEach((l, idx) => {
      const isArrived = l.type === 'ARRIVED';
      const label = isArrived ? '🚚 新規入荷' : '📦 既存在庫';

      const div = document.createElement('div');
      div.style.cssText = 'display:flex; justify-content:space-between; align-items:center; padding:4px 0; border-bottom:1px dashed #dee2e6; font-size:0.9rem;';
      div.innerHTML = `
        <span><strong>${label}</strong>: 📅 <strong>${l.expDate}</strong> (${l.qty}食)</span>
        <button type="button" class="btn btn-sm btn-outline-danger" style="padding:2px 8px; font-size:0.75rem;" onclick="deleteBentoLot('${item.id}', ${idx})">削除</button>
      `;
      listEl.appendChild(div);
    });
  } else {
    listEl.innerHTML = `<span style="color:#868e96; font-size:0.85rem;">登録されているロットはありません</span>`;
  }

  document.getElementById('addLotModal').classList.add('active');
};

window.closeAddLotModal = function() {
  document.getElementById('addLotModal').classList.remove('active');
};

window.deleteBentoLot = function(bentoId, lotIndex) {
  const item = bentoMaster.find(b => b.id === bentoId);
  if (!item || !item.lots || !item.lots[lotIndex]) return;

  item.lots.splice(lotIndex, 1);
  recalculateBentoTotalStock(item);

  saveMaster();
  renderAll();

  const openModalId = document.getElementById('addLotBentoId').value;
  if (openModalId === bentoId && document.getElementById('addLotModal').classList.contains('active')) {
    openAddLotModal(bentoId);
  }

  showToast('ロット明細を削除しました', 'info');
};

function updateHeaderStats() {
  const bentoUsers = porteUsers.filter(u => u.wantsBento !== false);
  const totalUsers = bentoUsers.length;
  const orderedUsers = bentoUsers.filter(u => u.selectedBentoId).length;

  document.getElementById('headerUserCount').textContent = `${totalUsers}名 (全${porteUsers.length}名)`;
  document.getElementById('headerOrderedCount').textContent = `${orderedUsers}食`;
}

function getSupabaseCredentials() {
  const url = (window.SUPABASE_URL || localStorage.getItem('porte_supabase_url') || '').trim();
  const key = (window.SUPABASE_KEY || localStorage.getItem('porte_supabase_key') || '').trim();
  return { url, key };
}

function openSupabaseConfigModal() {
  const { url, key } = getSupabaseCredentials();
  const urlInput = document.getElementById('supabaseUrlInput');
  const keyInput = document.getElementById('supabaseKeyInput');
  if (urlInput) urlInput.value = url;
  if (keyInput) keyInput.value = key;

  const modal = document.getElementById('supabaseConfigModal');
  if (modal) modal.classList.add('active');
}

function closeSupabaseConfigModal() {
  const modal = document.getElementById('supabaseConfigModal');
  if (modal) modal.classList.remove('active');
}

function handleSaveSupabaseConfig(e) {
  e.preventDefault();
  const url = document.getElementById('supabaseUrlInput').value.trim();
  const key = document.getElementById('supabaseKeyInput').value.trim();

  localStorage.setItem('porte_supabase_url', url);
  localStorage.setItem('porte_supabase_key', key);
  window.SUPABASE_URL = url;
  window.SUPABASE_KEY = key;

  closeSupabaseConfigModal();
  showToast('💾 Supabase接続設定を保存しました！DBから読み込みます...', 'success');
  fetchPorteDbAttendance();
}

// Porte Supabase DB から直接本日利用者＆本日の出欠（お弁当要不要）を自動取得
async function fetchPorteDbAttendance() {
  const { url, key } = getSupabaseCredentials();

  if (!url || !key) {
    showToast('⚙️ Supabaseの接続設定（URL・APIキー）を入力してください。', 'warning');
    openSupabaseConfigModal();
    return;
  }

  if (typeof supabase === 'undefined') {
    showToast('⚠️ Supabase SDKの読み込みに失敗しました。インターネット接続をご確認ください。', 'warning');
    return;
  }

  showToast('⚡ Porteデータベースから最新利用者を読み込み中...', 'info');

  try {
    const SB = supabase.createClient(url, key);
    
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const [userRes, attRes] = await Promise.all([
      SB.from('利用者').select('*'),
      SB.from('出欠').select('*').eq('date', todayStr)
    ]);

    if (userRes.error) {
      console.warn('Porte DB Error:', userRes.error);
      throw userRes.error;
    }

    const attMap = {};
    if (attRes && attRes.data) {
      attRes.data.forEach(a => {
        if (a && a.userId) attMap[String(a.userId).trim()] = a;
      });
    }

    if (userRes.data && userRes.data.length > 0) {
      porteUsers = userRes.data.map((u, idx) => {
        const uId = String(u.id || '').trim();
        const r = attMap[uId];
        
        // 欠席・お休み判定
        const isAbsent = r ? (
          r.status === '欠席' || 
          r.status === '公休' || 
          r.status === '調整休' || 
          r.status === '欠勤' || 
          r.status === 'お休み' || 
          r.status === 'キャンセル' ||
          String(r.status || '').includes('欠') ||
          String(r.status || '').includes('休')
        ) : (
          u.status === '欠席' || u.status === 'お休み'
        );

        const curB = (r && r.bento !== undefined && r.bento !== null && r.bento !== '') ? r.bento : u.bento;
        const curMeal = (r && r.meal !== undefined && r.meal !== null) ? r.meal : u.meal;

        // 欠席・お休みの場合はお弁当対象外（wantsBento = false）
        const wantsBento = !isAbsent && (curB === 'あり' || curMeal === true);

        const noteText = (r && r.notes) ? r.notes : (u.note || u.特記事項 || '');
        const fullNote = isAbsent ? (noteText ? `【欠席】${noteText}` : '【欠席】') : noteText;

        return {
          id: u.id || `P${idx+1}`,
          name: u.name || u.氏名 || '利用者',
          kana: u.kana || u.フリガナ || '',
          type: u.type || u.区分 || '通所',
          note: fullNote,
          status: r ? (r.status || '出席') : '出席',
          wantsBento: wantsBento,
          selectedBentoId: ''
        };
      });
    } else {
      const staffRes = await SB.from('スタッフ').select('*');
      if (staffRes.data && staffRes.data.length > 0) {
        porteUsers = staffRes.data.map((s, idx) => ({
          id: s.id || `P${idx+1}`,
          name: s.name || s.username || '利用者',
          kana: s.kana || '',
          type: '通所',
          note: s.note || '',
          wantsBento: false,
          selectedBentoId: ''
        }));
      } else {
        showToast('⚠️ テーブル内にデータが見つかりませんでした。', 'warning');
        return;
      }
    }

    savePorteUsers();
    const bentoCount = porteUsers.filter(u => u.wantsBento).length;
    showToast(`⚡ Porte DBから${porteUsers.length}名の利用者データを読み込みました！（お弁当対象: ${bentoCount}名）`, 'success');
    renderAll();
  } catch (err) {
    console.error('Porte DB read error:', err);
    showToast(`❌ Supabase接続エラー: ${err.message || 'URL・APIキーをご確認ください'}`, 'warning');
  }
}

// イベント処理（イベントリスナー登録）
function setupEventListeners() {
  const bentoOnlyBtn = document.getElementById('filterBentoUsersOnlyBtn');
  const allUsersBtn = document.getElementById('filterAllUsersBtn');
  if (bentoOnlyBtn && allUsersBtn) {
    bentoOnlyBtn.addEventListener('click', () => {
      tableShowAll = false;
      bentoOnlyBtn.classList.add('active');
      allUsersBtn.classList.remove('active');
      renderPorteSection();
    });
    allUsersBtn.addEventListener('click', () => {
      tableShowAll = true;
      allUsersBtn.classList.add('active');
      bentoOnlyBtn.classList.remove('active');
      renderPorteSection();
    });
  }

  const modalBentoBtn = document.getElementById('modalFilterBentoOnlyBtn');
  const modalAllBtn = document.getElementById('modalFilterShowAllBtn');
  if (modalBentoBtn && modalAllBtn) {
    modalBentoBtn.addEventListener('click', () => toggleModalShowAll(false));
    modalAllBtn.addEventListener('click', () => toggleModalShowAll(true));
  }

  const bulkBtn = document.getElementById('bulkSet10StockBtn');
  if (bulkBtn) {
    bulkBtn.addEventListener('click', () => {
      if (confirm('全商品の在庫数を一律10食に更新しますか？')) {
        bentoMaster.forEach(item => {
          item.lots = [{ id: 'lot_' + Date.now(), type: 'STOCK', qty: 10, expDate: getOffsetDateStr(7) }];
          recalculateBentoTotalStock(item);
        });
        saveMaster();
        renderAll();
        showToast('📦 全商品の在庫を一律10食に更新しました！', 'success');
      }
    });
  }

  const fetchBtn = document.getElementById('fetchPorteDbBtn');
  if (fetchBtn) fetchBtn.addEventListener('click', fetchPorteDbAttendance);

  const refreshHeaderBtn = document.getElementById('refreshUsersHeaderBtn');
  if (refreshHeaderBtn) refreshHeaderBtn.addEventListener('click', fetchPorteDbAttendance);

  const userSearch = document.getElementById('userSelectModalSearch');
  if (userSearch) {
    userSearch.addEventListener('input', (e) => renderUserPickerList(e.target.value));
  }

  const closeUserModalBtn = document.getElementById('closeUserSelectForBentoModal');
  if (closeUserModalBtn) closeUserModalBtn.addEventListener('click', closeUserSelectForBentoModal);

  const cancelUserModalBtn = document.getElementById('cancelUserSelectForBentoBtn');
  if (cancelUserModalBtn) cancelUserModalBtn.addEventListener('click', closeUserSelectForBentoModal);

// 賞味期限の短さを最重視しつつ、同等期限内でのゆらぎ選出 ＆ 肉・魚・その他カテゴリーバランス調整
function pickBalancedTodaysMenu(preferStockOnly = true) {
  let pool = preferStockOnly ? bentoMaster.filter(b => b.stock > 0) : bentoMaster;
  if (!pool || pool.length === 0) pool = [...bentoMaster];

  // 1. 賞味期限（日数）に0〜2.5日のランダムゆらぎ（Jitter）を加算してスコア化
  // 賞味期限が短いものが最優先されつつ、近い期限の商品同士で毎回ランダムな変化が出ます
  const scored = pool.map(item => {
    const earliestExp = getBentoEarliestExpDate(item);
    const expTime = earliestExp !== '9999-12-31' ? new Date(earliestExp).getTime() : (Date.now() + 30 * 86400000);
    const jitter = Math.random() * 2.5 * 86400000;
    return { item, score: expTime + jitter };
  });

  scored.sort((a, b) => a.score - b.score);
  const candidates = scored.map(s => s.item);

  // 2. カテゴリーバランス調整（魚・肉・その他をバランスよく抽出）
  const selected = [];
  const getCatType = (cat) => {
    if (cat === '魚') return 'FISH';
    if (cat === '豚肉' || cat === '牛肉' || cat === '鶏肉') return 'MEAT';
    return 'OTHER';
  };

  // 魚、肉、その他からそれぞれ1品ずつ優先ピック
  const fishItem = candidates.find(b => getCatType(b.category) === 'FISH');
  if (fishItem) selected.push(fishItem);

  const meatItem = candidates.find(b => getCatType(b.category) === 'MEAT' && !selected.includes(b));
  if (meatItem) selected.push(meatItem);

  const otherItem = candidates.find(b => getCatType(b.category) === 'OTHER' && !selected.includes(b));
  if (otherItem) selected.push(otherItem);

  // 残りの枠（計5品になるまで）をスコア（期限重視＋ゆらぎ）順で補充
  for (let i = 0; i < candidates.length && selected.length < 5; i++) {
    if (!selected.includes(candidates[i])) {
      selected.push(candidates[i]);
    }
  }

  // 万が一足りない場合はマスター全体から補填
  if (selected.length < 5) {
    for (let i = 0; i < bentoMaster.length && selected.length < 5; i++) {
      if (!selected.includes(bentoMaster[i])) {
        selected.push(bentoMaster[i]);
      }
    }
  }

  return selected.slice(0, 5).sort(() => Math.random() - 0.5).map(b => b.id);
}

  const randomBtn = document.getElementById('randomSelectBtn');
  if (randomBtn) {
    randomBtn.addEventListener('click', () => {
      const cards = document.querySelectorAll('.bento-card');
      cards.forEach(c => c.classList.add('shuffling'));

      setTimeout(() => {
        todaysMenuIds = pickBalancedTodaysMenu(true);
        saveTodaysMenu();
        renderAll();
        showToast('🍱 賞味期限の短い商品を優先し、魚・お肉のバランスよく本日の5品を選出しました！', 'success');
      }, 400);
    });
  }

  const autoStockPickBtn = document.getElementById('autoStockPickBtn');
  if (autoStockPickBtn) {
    autoStockPickBtn.addEventListener('click', () => {
      const available = bentoMaster.filter(b => b.stock > 0);
      if (available.length === 0) {
        showToast('⚠️ 在庫がある商品がありません。商品マスターで在庫を補充してください。', 'warning');
        return;
      }

      // 賞味期限関係なく、在庫あり商品からランダムに並び替え（シャッフル）
      const shuffledAvailable = [...available].sort(() => Math.random() - 0.5);

      let chosenIds = [];
      if (shuffledAvailable.length >= 5) {
        chosenIds = shuffledAvailable.slice(0, 5).map(b => b.id);
      } else {
        const chosenAvailable = [...shuffledAvailable];
        const remainingMaster = bentoMaster.filter(b => !chosenAvailable.some(a => a.id === b.id)).sort(() => Math.random() - 0.5);
        const chosenRemaining = remainingMaster.slice(0, 5 - chosenAvailable.length);
        chosenIds = [...chosenAvailable, ...chosenRemaining].map(b => b.id);
      }

      todaysMenuIds = chosenIds;
      saveTodaysMenu();
      renderAll();
      showToast('🎲 在庫のある商品の中から賞味期限関係なくランダムに5品を選出しました！', 'success');
    });
  }

  const customPickBtn = document.getElementById('customPickBtn');
  if (customPickBtn) customPickBtn.addEventListener('click', openPickFiveModal);
  
  const closePickModalBtn = document.getElementById('closePickFiveModal');
  if (closePickModalBtn) closePickModalBtn.addEventListener('click', closePickFiveModal);
  
  const cancelPickModalBtn = document.getElementById('cancelPickFiveBtn');
  if (cancelPickModalBtn) cancelPickModalBtn.addEventListener('click', closePickFiveModal);
  
  const savePickModalBtn = document.getElementById('savePickFiveBtn');
  if (savePickModalBtn) savePickModalBtn.addEventListener('click', savePickFiveSelection);

  const openConfigBtn = document.getElementById('openSupabaseConfigBtn');
  if (openConfigBtn) openConfigBtn.addEventListener('click', openSupabaseConfigModal);

  const closeConfigBtn = document.getElementById('closeSupabaseConfigModalBtn');
  if (closeConfigBtn) closeConfigBtn.addEventListener('click', closeSupabaseConfigModal);

  const cancelConfigBtn = document.getElementById('cancelSupabaseConfigBtn');
  if (cancelConfigBtn) cancelConfigBtn.addEventListener('click', closeSupabaseConfigModal);

  const configForm = document.getElementById('supabaseConfigForm');
  if (configForm) configForm.addEventListener('submit', handleSaveSupabaseConfig);

  const csvInput = document.getElementById('porteCsvInput');
  csvInput.addEventListener('change', handlePorteCsvUpload);

  const dropZone = document.getElementById('csvDropZone');
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
      parsePorteCsvFile(e.dataTransfer.files[0]);
    }
  });

  document.getElementById('copyOrderSummaryBtn').addEventListener('click', copyCateringOrderTally);

  document.getElementById('clearTodayOrdersBtn').addEventListener('click', () => {
    if (confirm('本日の注文履歴をクリアしますか？')) {
      orderHistory = [];
      saveOrderHistory();
      renderAll();
      showToast('履歴をクリアしました', 'info');
    }
  });

  document.getElementById('exportHistoryCsvBtn').addEventListener('click', exportHistoryCsv);

  document.getElementById('masterSearchInput').addEventListener('input', renderMasterSection);
  document.querySelectorAll('#categoryFilterPills .pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#categoryFilterPills .pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategoryFilter = btn.getAttribute('data-category');
      renderMasterSection();
    });
  });

  document.getElementById('addNewBentoBtn').addEventListener('click', () => openEditBentoModal(null));
  document.getElementById('resetMasterBtn').addEventListener('click', () => {
    if (confirm('商品マスターを初期30品目にリセットしますか？')) {
      bentoMaster = JSON.parse(JSON.stringify(DEFAULT_30_BENTO));
      bentoMaster.forEach(b => ensureBentoLots(b));
      todaysMenuIds = bentoMaster.slice(0, 5).map(b => b.id);
      saveMaster();
      saveTodaysMenu();
      renderAll();
      showToast('30品目のデフォルトデータにリセットしました', 'success');
    }
  });

  document.getElementById('closeBentoEditModal').addEventListener('click', closeEditBentoModal);
  document.getElementById('cancelBentoEditBtn').addEventListener('click', closeEditBentoModal);
  document.getElementById('bentoForm').addEventListener('submit', handleSaveBentoForm);

  const closeLotBtn = document.getElementById('closeAddLotModalBtn');
  const cancelLotBtn = document.getElementById('cancelAddLotModalBtn');
  if (closeLotBtn) closeLotBtn.addEventListener('click', closeAddLotModal);
  if (cancelLotBtn) cancelLotBtn.addEventListener('click', closeAddLotModal);

  const addLotForm = document.getElementById('addLotForm');
  if (addLotForm) {
    addLotForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const bentoId = document.getElementById('addLotBentoId').value;
      const qty = parseInt(document.getElementById('lotQtyInput').value, 10) || 0;
      const expDate = document.getElementById('lotExpDateInput').value;

      if (!bentoId || qty <= 0 || !expDate) {
        alert('数量と賞味期限を正しく入力してください');
        return;
      }

      const item = bentoMaster.find(b => b.id === bentoId);
      if (item) {
        addBentoStockLot(item, qty, expDate, 'ARRIVED');
        saveMaster();
        renderAll();
        closeAddLotModal();
        showToast(`🚚 『${item.name}』に ${expDate} 期限 ${qty}食 の新規入荷分を追加しました！`, 'success');
      }
    });
  }
}

function openEditBentoModal(id) {
  const modal = document.getElementById('bentoEditModal');
  const title = document.getElementById('bentoModalTitle');
  const deleteBtn = document.getElementById('deleteCurrentBentoBtn');

  if (id) {
    const item = bentoMaster.find(b => b.id === id);
    if (item) {
      ensureBentoLots(item);
      title.textContent = 'お弁当・在庫・入荷管理';
      document.getElementById('editBentoId').value = item.id;
      document.getElementById('bentoNameInput').value = item.name;
      document.getElementById('bentoCategoryInput').value = item.category;
      document.getElementById('bentoIconInput').value = item.icon || '🍱';
      document.getElementById('bentoDescInput').value = item.desc || '';

      tempModalLots = JSON.parse(JSON.stringify(item.lots || []));

      deleteBtn.style.display = 'inline-flex';
      deleteBtn.onclick = () => deleteBento(item.id);
    }
  } else {
    title.textContent = '新しいお弁当の追加';
    document.getElementById('editBentoId').value = '';
    document.getElementById('bentoForm').reset();
    document.getElementById('bentoIconInput').value = '🍱';

    tempModalLots = [
      { id: 'lot_init_1', type: 'STOCK', qty: 5, expDate: getOffsetDateStr(7) }
    ];

    deleteBtn.style.display = 'none';
    deleteBtn.onclick = null;
  }

  renderModalLotRows();
  modal.classList.add('active');
}

function closeEditBentoModal() {
  document.getElementById('bentoEditModal').classList.remove('active');
}

function handleSaveBentoForm(e) {
  e.preventDefault();
  const id = document.getElementById('editBentoId').value;
  const name = document.getElementById('bentoNameInput').value.trim();
  const category = document.getElementById('bentoCategoryInput').value;
  const icon = document.getElementById('bentoIconInput').value.trim() || '🍱';
  const desc = document.getElementById('bentoDescInput').value.trim();

  if (!name) return;

  const validLots = tempModalLots.filter(l => l.qty > 0 && l.expDate);
  validLots.sort((a, b) => new Date(a.expDate) - new Date(b.expDate));
  const newTotalStock = validLots.reduce((sum, l) => sum + (parseInt(l.qty, 10) || 0), 0);

  if (id) {
    const item = bentoMaster.find(b => b.id === id);
    if (item) {
      item.name = name;
      item.category = category;
      item.icon = icon;
      item.desc = desc;
      item.lots = validLots;
      item.stock = newTotalStock;
    }
  } else {
    const newId = 'b' + (Date.now());
    const newItem = {
      id: newId,
      name,
      category,
      icon,
      desc,
      lots: validLots,
      stock: newTotalStock
    };
    bentoMaster.push(newItem);
  }

  saveMaster();
  closeEditBentoModal();
  renderAll();
  showToast('お弁当・在庫明細を保存しました！', 'success');
}

window.deleteBento = function(id) {
  const item = bentoMaster.find(b => b.id === id);
  if (!item) return;

  if (confirm(`『${item.name}』をマスターから削除してもよろしいですか？`)) {
    bentoMaster = bentoMaster.filter(b => b.id !== id);
    todaysMenuIds = todaysMenuIds.filter(tId => tId !== id);
    if (todaysMenuIds.length < 5 && bentoMaster.length >= 5) {
      const unused = bentoMaster.find(b => !todaysMenuIds.includes(b.id));
      if (unused) todaysMenuIds.push(unused.id);
    }
    saveMaster();
    saveTodaysMenu();
    closeEditBentoModal();
    renderAll();
    showToast('お弁当を削除しました', 'info');
  }
};

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}
