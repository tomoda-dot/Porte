/**
 * ==========================================================================
 * ひとつぎお弁当システム v2 (Next-Gen Bento Suite Engine)
 * Database-backed, Multi-Device Realtime Sync & Inventory Management
 * ==========================================================================
 */

'use strict';

// DEFAULT MASTER 30 BENTO
const DEFAULT_30_BENTO_V2 = [
  { id: 'b01', name: 'タラのトマトソース弁当', category: '魚', icon: '🐟', stock: 0, desc: 'ふっくらタラをコク旨トマトソースで煮込みました。' },
  { id: 'b02', name: 'アジの南蛮漬け弁当', category: '魚', icon: '🐟', stock: 0, desc: 'さっぱり酸味が食欲をそそる特製南蛮だれ。' },
  { id: 'b03', name: 'タラの白醤油焼き弁当', category: '魚', icon: '🐟', stock: 0, desc: '白醤油のやさしい風味が上品な和風弁当。' },
  { id: 'b04', name: '豚肉の生姜焼き弁当', category: '豚肉', icon: '🐖', stock: 0, desc: '生姜の香りが引き立つジューシーな一番人気！' },
  { id: 'b05', name: 'サバの味噌だれがけ弁当', category: '魚', icon: '🐟', stock: 0, desc: '濃厚でコクのある味噌だれがサバの旨みを引き立てます。' },
  { id: 'b06', name: 'レバニラ炒め弁当', category: '豚肉', icon: '🐖', stock: 0, desc: 'スタミナ満点！しゃきしゃきニラと特製ダレ。' },
  { id: 'b07', name: '鶏肉の山賊焼き弁当', category: '鶏肉', icon: '🐓', stock: 0, desc: 'ニンニク醤油が香ばしい長野名物の山賊焼き。' },
  { id: 'b08', name: '鶏肉とインゲンの味噌ダレ焼き弁当', category: '鶏肉', icon: '🐓', stock: 0, desc: '甘辛い味噌ダレと彩り豊かなインゲンがベストマッチ。' },
  { id: 'b09', name: '豚肉とチンゲン菜の塩ダレ炒め弁当', category: '豚肉', icon: '🐖', stock: 0, desc: '旨塩ダレでさっぱり仕上げたヘルシーな一品。' },
  { id: 'b10', name: '豚ロース肉と長葱のコチュジャン炒め弁当', category: '豚肉', icon: '🐖', stock: 0, desc: 'ほんのりピリ辛コチュジャンが後を引く美味しさ。' },
  { id: 'b11', name: 'ポークトマト煮弁当', category: '豚肉', icon: '🐖', stock: 0, desc: 'やわらか豚肉をじっくりトマトで煮込みました。' },
  { id: 'b12', name: '豚肉の甘辛炒め弁当', category: '豚肉', icon: '🐖', stock: 0, desc: 'ご飯が進む甘辛醤油ダレの定番人気。' },
  { id: 'b13', name: 'すき焼き風煮弁当', category: '牛肉', icon: '🐂', stock: 0, desc: '甘辛いすき焼きダレが染み込んだ満足感たっぷりの煮物。' },
  { id: 'b14', name: '牛肉のオイスター炒め弁当', category: '牛肉', icon: '🐂', stock: 0, desc: 'オイスターソースの深いコクと豊かな風味。' },
  { id: 'b15', name: '鶏の唐揚げ弁当', category: '鶏肉', icon: '🐓', stock: 0, desc: '外はカリッと中はジューシーなみんな大好き唐揚げ。' },
  { id: 'b16', name: '鶏肉のレモンクリーム弁当', category: '鶏肉', icon: '🐓', stock: 0, desc: 'さわやかなレモンの香りとクリーミーなソース。' },
  { id: 'b17', name: 'ホッケのみりん焼き弁当', category: '魚', icon: '🐟', stock: 0, desc: '脂ののったホッケをほんのり甘いみりん干し風に。' },
  { id: 'b18', name: 'アジの塩焼き弁当', category: '魚', icon: '🐟', stock: 0, desc: 'シンプルだからこそ魚の旨味が際立つ塩焼き。' },
  { id: 'b19', name: '野菜たっぷりエビマヨ弁当', category: '和食・その他', icon: '🦐', stock: 0, desc: 'プリプリ海老やまろやかマヨソース。' },
  { id: 'b20', name: '海老としめじの玉子とじ弁当', category: '和食・その他', icon: '🦐', stock: 0, desc: 'ふんわり優しい玉子で包んだお出汁の効いたお弁当。' },
  { id: 'b21', name: '若鶏の利休焼き弁当', category: '鶏肉', icon: '🐓', stock: 0, desc: '香ばしいゴマの香りが広がる伝統和風メニュー。' },
  { id: 'b22', name: '牛肉と茄子の麻婆ソース弁当', category: '牛肉', icon: '🐂', stock: 0, desc: 'ジューシーな茄子と牛肉のピリ辛本格麻婆。' },
  { id: 'b23', name: '野菜たっぷりキーマカレー弁当', category: '和食・その他', icon: '🍛', stock: 0, desc: 'スパイス香るマイルドで食べやすいキーマカレー。' },
  { id: 'b24', name: '韓国風焼肉炒め弁当', category: '牛肉', icon: '🐂', stock: 0, desc: '特製プルコギダレで炒めたしっかり味付けのお肉。' },
  { id: 'b25', name: '鶏の照焼き弁当', category: '鶏肉', icon: '🐓', stock: 0, desc: '照り照りの甘辛タレが絡む定番の照り焼き。' },
  { id: 'b26', name: 'チリソースミートボール弁当', category: '和食・その他', icon: '🧆', stock: 0, desc: '甘辛チリソースが食欲を刺激するミートボール。' },
  { id: 'b27', name: 'ズッキーニとチキンのトマト煮込み弁当', category: '鶏肉', icon: '🐓', stock: 0, desc: '彩り野菜とチキンのヘルシーな地中海風煮込み。' },
  { id: 'b28', name: '回鍋肉弁当', category: '豚肉', icon: '🐖', stock: 0, desc: 'シャキシャキキャベツと豚肉の甜麺醤炒め。' },
  { id: 'b29', name: '家常豆腐弁当', category: '和食・その他', icon: '🍲', stock: 0, desc: '香ばしく揚げた豆腐と野菜の和風あんかけ煮込み。' },
  { id: 'b30', name: '牛肉きのこの甘辛炒め弁当', category: '牛肉', icon: '🐂', stock: 0, desc: 'たっぷりのきのこ風味と牛肉の甘辛和風炒め。' }
];

// STATE MANAGEMENT
window.BentoState = {
  master: [],
  todaysMenuIds: [],
  porteUsers: [],
  orderHistory: [],
  dailyOrders: {},
  realtimeChannel: null,
  activeTab: 'menu-tab',
  filterCategory: 'ALL'
};

// HELPER: Date Strings
function getTodayKeyV2() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getOffsetDateStrV2(days) {
  const d = new Date();
  if (days) d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// INVENTORY & LOT HELPERS
function recalculateTotalStockV2(bento) {
  if (!bento.lots) bento.lots = [];
  bento.stock = bento.lots.reduce((sum, l) => sum + (parseInt(l.qty, 10) || 0), 0);
}

function ensureBentoLotsV2(bento) {
  if (!bento.lots) bento.lots = [];
  recalculateTotalStockV2(bento);
}

function deductBentoStockFIFOV2(bento, count = 1) {
  ensureBentoLotsV2(bento);
  if (bento.stock <= 0) return;

  bento.lots.sort((a, b) => new Date(a.expDate) - new Date(b.expDate));
  let remaining = count;
  for (let i = 0; i < bento.lots.length; i++) {
    const lot = bento.lots[i];
    if (lot.qty >= remaining) {
      lot.qty -= remaining;
      remaining = 0;
      break;
    } else {
      remaining -= lot.qty;
      lot.qty = 0;
    }
  }
  bento.lots = bento.lots.filter(l => l.qty > 0);
  recalculateTotalStockV2(bento);
}

function addBentoStockLotV2(bento, qty, expDate, type = 'ARRIVED') {
  ensureBentoLotsV2(bento);
  const addQty = parseInt(qty, 10) || 0;
  if (addQty <= 0) return;

  const existing = bento.lots.find(l => l.type === type && l.expDate === expDate);
  if (existing) {
    existing.qty += addQty;
  } else {
    bento.lots.push({
      id: 'lot_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      type: type,
      qty: addQty,
      expDate: expDate
    });
  }
  bento.lots.sort((a, b) => new Date(a.expDate) - new Date(b.expDate));
  recalculateTotalStockV2(bento);
}

// PURE USER NORMALIZATION (NO SIDE EFFECTS)
function normalizeUserDataV2(u) {
  if (!u) return;
  if (u.wantsBento === false) {
    u.bentoCount = 0;
  } else {
    if (!u.bentoCount || u.bentoCount < 1) {
      const bs = String(u.bentoVal || u.bento || '').trim();
      if (bs === '3食' || bs === '3' || bs === '3個') u.bentoCount = 3;
      else if (bs === '2食' || bs === '2' || bs === '2個') u.bentoCount = 2;
      else u.bentoCount = 1;
    }
  }

  if (!Array.isArray(u.selectedBentoIds)) {
    u.selectedBentoIds = [];
    if (u.selectedBentoId) u.selectedBentoIds[0] = u.selectedBentoId;
  }

  while (u.selectedBentoIds.length < u.bentoCount) {
    u.selectedBentoIds.push('');
  }
  if (u.selectedBentoIds.length > u.bentoCount) {
    u.selectedBentoIds = u.selectedBentoIds.slice(0, u.bentoCount);
  }
  u.selectedBentoId = u.selectedBentoIds[0] || '';
}

// SUPABASE CREDENTIALS & ADAPTER
function getSupabaseCredsV2() {
  const url = (typeof SUPABASE_URL !== 'undefined' && SUPABASE_URL) ? SUPABASE_URL : localStorage.getItem('porte_sb_url');
  const key = (typeof SUPABASE_KEY !== 'undefined' && SUPABASE_KEY) ? SUPABASE_KEY : localStorage.getItem('porte_sb_key');
  return { url, key };
}

async function saveSettingToSupabaseV2(keyName, jsonValueStr) {
  const { url, key } = getSupabaseCredsV2();
  if (!url || !key || typeof supabase === 'undefined') return;
  try {
    const SB = supabase.createClient(url, key);
    await SB.from('設定').delete().eq('key', keyName);
    await SB.from('設定').insert({ key: keyName, value: jsonValueStr });
  } catch(e) {
    console.warn('Supabase save error:', e);
  }
}

// DATA PERSISTENCE & SYNC
async function saveMasterV2() {
  localStorage.setItem('bento_master', JSON.stringify(BentoState.master));
  await saveSettingToSupabaseV2('bento_master', JSON.stringify(BentoState.master));
}

async function saveTodaysMenuV2() {
  localStorage.setItem('bento_todays_menu', JSON.stringify(BentoState.todaysMenuIds));
  await saveSettingToSupabaseV2('bento_todays_menu', JSON.stringify(BentoState.todaysMenuIds));
}

async function savePorteUsersV2() {
  localStorage.setItem('bento_porte_users', JSON.stringify(BentoState.porteUsers));
  await saveSettingToSupabaseV2('bento_porte_users', JSON.stringify(BentoState.porteUsers));
  await updateDailyOrdersAndHistoryV2();
}

async function saveOrderHistoryV2() {
  localStorage.setItem('bento_order_history', JSON.stringify(BentoState.orderHistory));
  await saveSettingToSupabaseV2('bento_order_history', JSON.stringify(BentoState.orderHistory));
}

async function updateDailyOrdersAndHistoryV2() {
  const todayKey = getTodayKeyV2();
  const currentOrders = [];
  BentoState.porteUsers.forEach(u => {
    normalizeUserDataV2(u);
    if (u.wantsBento !== false && Array.isArray(u.selectedBentoIds)) {
      u.selectedBentoIds.forEach((bId, idx) => {
        if (bId) {
          const b = BentoState.master.find(item => item.id === bId);
          currentOrders.push({
            userId: u.id,
            userName: u.name,
            slotIndex: idx,
            slotName: u.bentoCount > 1 ? `${idx + 1}食目` : '1食目',
            bentoId: bId,
            bentoName: b ? b.name : '不明なお弁当',
            category: b ? b.category : ''
          });
        }
      });
    }
  });

  const existingStatus = (BentoState.dailyOrders[todayKey] && BentoState.dailyOrders[todayKey].status) ? BentoState.dailyOrders[todayKey].status : 'DRAFT';
  const existingConfirmedAt = (BentoState.dailyOrders[todayKey] && BentoState.dailyOrders[todayKey].confirmedAt) ? BentoState.dailyOrders[todayKey].confirmedAt : null;

  BentoState.dailyOrders[todayKey] = {
    status: existingStatus,
    confirmedAt: existingConfirmedAt,
    orders: currentOrders
  };

  localStorage.setItem('bento_daily_orders', JSON.stringify(BentoState.dailyOrders));
  await saveSettingToSupabaseV2('bento_daily_orders', JSON.stringify(BentoState.dailyOrders));

  // Sync to history log
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  const parts = todayKey.split('-');
  const dateLabel = (parts.length === 3) ? `${parseInt(parts[1], 10)}/${parseInt(parts[2], 10)} ${timeStr}` : todayKey;

  currentOrders.forEach(o => {
    const existingIndex = BentoState.orderHistory.findIndex(h => h.dateKey === todayKey && String(h.userId) === String(o.userId) && h.slotIndex === o.slotIndex);
    if (existingIndex >= 0) {
      BentoState.orderHistory[existingIndex].bentoId = o.bentoId;
      BentoState.orderHistory[existingIndex].bentoName = o.bentoName;
      BentoState.orderHistory[existingIndex].category = o.category;
    } else {
      BentoState.orderHistory.unshift({
        id: 'ord_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        date: dateLabel,
        dateKey: todayKey,
        userId: o.userId,
        userName: o.userName,
        slotIndex: o.slotIndex,
        slotName: o.slotName,
        bentoId: o.bentoId,
        bentoName: o.bentoName,
        category: o.category
      });
    }
  });

  await saveOrderHistoryV2();
}

// REALTIME SUPABASE SYNC
async function syncFromSupabaseV2() {
  const { url, key } = getSupabaseCredsV2();
  if (!url || !key || typeof supabase === 'undefined') return;

  try {
    const SB = supabase.createClient(url, key);
    const keysToFetch = ['bento_master', 'bento_todays_menu', 'bento_order_history', 'bento_daily_orders', 'bento_porte_users'];
    const settingsRes = await SB.from('設定').select('*').in('key', keysToFetch);

    if (settingsRes.data && settingsRes.data.length > 0) {
      const latestByKey = {};
      settingsRes.data.forEach(item => {
        if (item.key && item.value && !latestByKey[item.key]) {
          latestByKey[item.key] = item.value;
        }
      });

      if (latestByKey['bento_master']) {
        try {
          const parsed = JSON.parse(latestByKey['bento_master']);
          if (Array.isArray(parsed) && parsed.length > 0) {
            BentoState.master = parsed;
            BentoState.master.forEach(b => ensureBentoLotsV2(b));
            localStorage.setItem('bento_master', JSON.stringify(BentoState.master));
          }
        } catch(e){}
      }

      if (latestByKey['bento_todays_menu']) {
        try {
          const parsed = JSON.parse(latestByKey['bento_todays_menu']);
          if (Array.isArray(parsed) && parsed.length >= 5) {
            BentoState.todaysMenuIds = parsed;
            localStorage.setItem('bento_todays_menu', JSON.stringify(BentoState.todaysMenuIds));
          }
        } catch(e){}
      }

      if (latestByKey['bento_order_history']) {
        try {
          const parsed = JSON.parse(latestByKey['bento_order_history']);
          if (Array.isArray(parsed)) {
            BentoState.orderHistory = parsed;
            localStorage.setItem('bento_order_history', JSON.stringify(BentoState.orderHistory));
          }
        } catch(e){}
      }

      if (latestByKey['bento_daily_orders']) {
        try {
          const parsed = JSON.parse(latestByKey['bento_daily_orders']);
          if (parsed && typeof parsed === 'object') {
            BentoState.dailyOrders = parsed;
            localStorage.setItem('bento_daily_orders', JSON.stringify(BentoState.dailyOrders));
          }
        } catch(e){}
      }

      if (latestByKey['bento_porte_users']) {
        try {
          const parsed = JSON.parse(latestByKey['bento_porte_users']);
          if (Array.isArray(parsed) && parsed.length > 0) {
            BentoState.porteUsers = parsed;
            localStorage.setItem('bento_porte_users', JSON.stringify(BentoState.porteUsers));
          }
        } catch(e){}
      }

      renderAllV2();
    }
  } catch(e) {
    console.warn('Realtime sync error:', e);
  }
}

function initSupabaseRealtimeV2() {
  const { url, key } = getSupabaseCredsV2();
  if (!url || !key || typeof supabase === 'undefined') return;

  try {
    const SB = supabase.createClient(url, key);
    if (BentoState.realtimeChannel) {
      SB.removeChannel(BentoState.realtimeChannel);
    }
    BentoState.realtimeChannel = SB.channel('bento_v2_sync_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: '設定' }, () => {
        syncFromSupabaseV2();
      })
      .subscribe();
  } catch(e){}
}

// BENTO SELECTION & INVENTORY ACTION
window.assignUserBentoSlotV2 = async function(userIndex, slotIndex, newBentoId) {
  const user = BentoState.porteUsers[userIndex];
  if (!user) return;
  normalizeUserDataV2(user);

  if (slotIndex < 0 || slotIndex >= user.bentoCount) return;

  const oldBentoId = user.selectedBentoIds[slotIndex];
  if (oldBentoId === newBentoId) return;

  // Validate stock
  if (newBentoId) {
    const newBento = BentoState.master.find(b => b.id === newBentoId);
    if (newBento && newBento.stock <= 0) {
      showToastV2(`⚠️ 『${newBento.name}』は完売（在庫なし）のため選択できません`, 'warning');
      renderAllV2();
      return;
    }
  }

  // Return old stock
  if (oldBentoId) {
    const oldBento = BentoState.master.find(b => b.id === oldBentoId);
    if (oldBento) addBentoStockLotV2(oldBento, 1, getOffsetDateStrV2(7), 'STOCK');
  }

  // Deduct new stock
  if (newBentoId) {
    const newBento = BentoState.master.find(b => b.id === newBentoId);
    if (newBento) {
      user.wantsBento = true;
      deductBentoStockFIFOV2(newBento, 1);
    }
  }

  user.selectedBentoIds[slotIndex] = newBentoId;
  user.selectedBentoId = user.selectedBentoIds[0] || '';

  await saveMasterV2();
  await savePorteUsersV2();
  renderAllV2();
};

// INITIALIZATION
document.addEventListener('DOMContentLoaded', async () => {
  // Load local cache
  try {
    const m = localStorage.getItem('bento_master');
    BentoState.master = m ? JSON.parse(m) : JSON.parse(JSON.stringify(DEFAULT_30_BENTO_V2));
  } catch(e) {
    BentoState.master = JSON.parse(JSON.stringify(DEFAULT_30_BENTO_V2));
  }
  BentoState.master.forEach(b => ensureBentoLotsV2(b));

  try {
    const t = localStorage.getItem('bento_todays_menu');
    BentoState.todaysMenuIds = t ? JSON.parse(t) : BentoState.master.slice(0, 5).map(b => b.id);
  } catch(e) {
    BentoState.todaysMenuIds = BentoState.master.slice(0, 5).map(b => b.id);
  }

  try {
    const u = localStorage.getItem('bento_porte_users');
    BentoState.porteUsers = u ? JSON.parse(u) : [];
  } catch(e) {
    BentoState.porteUsers = [];
  }
  BentoState.porteUsers.forEach(u => normalizeUserDataV2(u));

  try {
    const h = localStorage.getItem('bento_order_history');
    BentoState.orderHistory = h ? JSON.parse(h) : [];
  } catch(e) {
    BentoState.orderHistory = [];
  }

  // UI Setup & Tab Switching
  setupTabsV2();
  renderAllV2();

  // Supabase Realtime & Event-driven sync
  initSupabaseRealtimeV2();
  await syncFromSupabaseV2();

  window.addEventListener('focus', () => { syncFromSupabaseV2(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) syncFromSupabaseV2(); });
});

function setupTabsV2() {
  document.querySelectorAll('.v2-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      if (!tabId) return;

      document.querySelectorAll('.v2-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.v2-tab-panel').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const panel = document.getElementById(tabId);
      if (panel) panel.classList.add('active');
      BentoState.activeTab = tabId;
    });
  });
}

function renderAllV2() {
  renderHeaderStatsV2();
  renderTodaysMenuV2();
  renderUserOrdersV2();
  renderOrderHistoryV2();
  renderMasterInventoryV2();
}

function renderHeaderStatsV2() {
  const dBadge = document.getElementById('v2HeaderDate');
  if (dBadge) {
    const now = new Date();
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    dBadge.textContent = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日(${days[now.getDay()]})`;
  }

  const userCnt = BentoState.porteUsers.length;
  const orderedCnt = BentoState.porteUsers.reduce((sum, u) => {
    normalizeUserDataV2(u);
    return sum + (u.selectedBentoIds || []).filter(Boolean).length;
  }, 0);

  const totalStock = BentoState.master.reduce((sum, b) => sum + (b.stock || 0), 0);

  const uEl = document.getElementById('v2UserCount');
  if (uEl) uEl.textContent = `${userCnt}名`;

  const oEl = document.getElementById('v2OrderedCount');
  if (oEl) oEl.textContent = `${orderedCnt}食`;

  const sEl = document.getElementById('v2TotalStock');
  if (sEl) sEl.textContent = `${totalStock}食`;
}

function renderTodaysMenuV2() {
  const grid = document.getElementById('v2TodaysMenuGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const items = BentoState.todaysMenuIds.map(id => BentoState.master.find(b => b.id === id)).filter(Boolean);
  if (items.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--txt-secondary);">メニューが選択されていません。</p>';
    return;
  }

  items.forEach((item, idx) => {
    const isSoldOut = item.stock <= 0;

    // Selected users for this bento
    const selectedUsers = [];
    BentoState.porteUsers.forEach(u => {
      normalizeUserDataV2(u);
      if ((u.selectedBentoIds || []).includes(item.id)) {
        selectedUsers.push(u.name);
      }
    });

    const card = document.createElement('div');
    card.className = `v2-bento-card ${isSoldOut ? 'sold-out' : ''}`;
    card.innerHTML = `
      <span class="v2-bento-num-badge">第 ${idx + 1} 案</span>
      <span class="v2-bento-cat-badge">${item.category}</span>
      <div class="v2-bento-icon-title">
        <span class="v2-bento-icon">${item.icon}</span>
        <h3 class="v2-bento-name">${item.name}</h3>
      </div>
      <p class="v2-bento-desc">${item.desc || ''}</p>

      <div class="v2-bento-stock-bar">
        <span>リアルタイム在庫:</span>
        <span class="v2-bento-stock-val ${isSoldOut ? 'low' : ''}">${isSoldOut ? '完売 (0食)' : item.stock + '食'}</span>
      </div>

      <div class="v2-bento-users-pills">
        ${selectedUsers.map(name => `<span class="v2-user-pill">👤 ${name} 様</span>`).join('') || '<span style="font-size:0.8rem; color:var(--txt-muted);">まだ選ばれていません</span>'}
      </div>

      <button class="v2-btn v2-btn-pri" ${isSoldOut ? 'disabled' : ''} onclick="onSelectBentoKioskV2('${item.id}')">
        ${isSoldOut ? '売り切れ' : 'これにする！ 🎯'}
      </button>
    `;
    grid.appendChild(card);
  });
}

function renderUserOrdersV2() {
  const tbody = document.getElementById('v2UserOrdersTbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (BentoState.porteUsers.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">登録ユーザーがいません</td></tr>';
    return;
  }

  BentoState.porteUsers.forEach((u, uIdx) => {
    normalizeUserDataV2(u);
    const tr = document.createElement('tr');

    const selectedBento = BentoState.master.find(b => b.id === u.selectedBentoId);

    tr.innerHTML = `
      <td><strong>${u.name}</strong></td>
      <td style="text-align:center;">${u.wantsBento !== false ? '🍱 必要 (' + u.bentoCount + '食)' : '❌ 不要'}</td>
      <td>${u.note || '-'}</td>
      <td>
        <select style="padding:6px 10px; border-radius:var(--radius-sm); border:1px solid var(--border-color);" onchange="assignUserBentoSlotV2(${uIdx}, 0, this.value)">
          <option value="">-- 選択なし --</option>
          ${BentoState.todaysMenuIds.map(id => {
            const b = BentoState.master.find(x => x.id === id);
            if (!b) return '';
            const sel = (u.selectedBentoIds[0] === id) ? 'selected' : '';
            return `<option value="${b.id}" ${sel}>${b.icon} ${b.name} (在庫:${b.stock})</option>`;
          }).join('')}
        </select>
      </td>
      <td style="text-align:center;">
        ${u.selectedBentoId ? '<span class="v2-user-pill">✅ 確定</span>' : '<span style="color:var(--txt-muted); font-size:0.85rem;">未選択</span>'}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderOrderHistoryV2() {
  const tbody = document.getElementById('v2HistoryTbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (BentoState.orderHistory.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px; color:var(--txt-muted);">受付履歴はありません</td></tr>';
    return;
  }

  BentoState.orderHistory.slice(0, 30).forEach(h => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-size:0.85rem; color:var(--txt-secondary);">${h.date || h.dateKey}</td>
      <td><strong>${h.userName}</strong></td>
      <td>${h.bentoName}</td>
      <td><span class="v2-tab-badge">${h.category || '和食'}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function renderMasterInventoryV2() {
  const grid = document.getElementById('v2MasterInventoryGrid');
  if (!grid) return;
  grid.innerHTML = '';

  let filtered = BentoState.master;
  if (BentoState.filterCategory !== 'ALL') {
    filtered = filtered.filter(b => b.category === BentoState.filterCategory);
  }

  const table = document.createElement('table');
  table.className = 'v2-table';
  table.innerHTML = `
    <thead>
      <tr>
        <th>お弁当名</th>
        <th>カテゴリ</th>
        <th>リアルタイム在庫</th>
        <th>賞味期限・ロット状況</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
      ${filtered.map((b, idx) => `
        <tr>
          <td><strong>${b.icon} ${b.name}</strong></td>
          <td><span class="v2-tab-badge">${b.category}</span></td>
          <td>
            <strong style="font-size:1.1rem; color:${b.stock > 0 ? 'var(--acc-green)' : 'var(--acc-red)'};">
              ${b.stock} 食
            </strong>
          </td>
          <td>
            ${(b.lots || []).map(l => `<span style="font-size:0.8rem; background:var(--bg-surface); padding:2px 8px; border-radius:6px; margin-right:4px;">📅 ${l.expDate}: ${l.qty}食</span>`).join('') || '<span style="color:var(--txt-muted); font-size:0.8rem;">(ロットなし)</span>'}
          </td>
          <td>
            <button class="v2-btn v2-btn-sec v2-btn-sm" onclick="quickAddStockV2('${b.id}', 5)">＋5食追加</button>
          </td>
        </tr>
      `).join('')}
    </tbody>
  `;
  grid.appendChild(table);
}

window.quickAddStockV2 = async function(bentoId, qty) {
  const b = BentoState.master.find(x => x.id === bentoId);
  if (!b) return;
  addBentoStockLotV2(b, qty, getOffsetDateStrV2(7), 'STOCK');
  await saveMasterV2();
  renderAllV2();
  showToastV2(`『${b.name}』に ${qty}食 追加しました`, 'success');
};

function showToastV2(msg, type = 'info') {
  let container = document.getElementById('v2ToastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'v2ToastContainer';
    container.className = 'v2-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `v2-toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}
