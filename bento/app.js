/**
 * ぽかぽか弁当 Web App - Main Logic (Porte integrated)
 */

// 30品目 初期マスターデータ
const DEFAULT_30_BENTO = [
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

// App State
let bentoMaster = [];
let todaysMenuIds = [];
let porteUsers = [];
let orderHistory = [];
let dailyOrders = {}; // 日別注文確定スナップショット { "2026-08-07": { status: 'CONFIRMED'|'DRAFT', confirmedAt: '...', orders: [...] } }
let currentSelectedMonth = '';
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
  initMonthlyMatrixMonthSelect();
  renderAll();
  
  // ページを開いた瞬間に自動的にPorte DBから最新利用者＆出欠データを非同期取得して画面更新
  try {
    const { url, key } = getSupabaseCredentials();
    if (url && key && typeof supabase !== 'undefined') {
      await fetchPorteDbAttendance(false); // 自動取得して結果をトースト表示＆レンダリング
      await syncFromSupabase();
    }
  } catch (e) {
    console.warn('Auto fetch user data error:', e);
  }
});

function getTodayKey() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

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
  const addQty = parseInt(qty, 10) || 0;
  if (addQty <= 0) return;

  const existingLot = (bento.lots || []).find(l => l.type === type && l.expDate === expDate);
  if (existingLot) {
    existingLot.qty += addQty;
  } else {
    bento.lots.push({
      id: 'lot_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      type: type,
      qty: addQty,
      expDate: expDate
    });
  }
  bento.lots.sort((a, b) => new Date(a.expDate) - new Date(b.expDate));
  recalculateBentoTotalStock(bento);
}

function loadData() {
  const savedMaster = localStorage.getItem('bento_master');
  if (savedMaster) {
    try {
      bentoMaster = JSON.parse(savedMaster);
    } catch(e) {
      bentoMaster = JSON.parse(JSON.stringify(DEFAULT_30_BENTO));
    }
  } else {
    bentoMaster = JSON.parse(JSON.stringify(DEFAULT_30_BENTO));
  }

  bentoMaster.forEach(b => ensureBentoLots(b));

  const savedTodays = localStorage.getItem('bento_todays_menu');
  if (savedTodays) {
    try {
      todaysMenuIds = JSON.parse(savedTodays);
    } catch(e) {
      todaysMenuIds = bentoMaster.slice(0, 5).map(b => b.id);
    }
  } else {
    todaysMenuIds = bentoMaster.slice(0, 5).map(b => b.id);
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

  const savedDailyOrders = localStorage.getItem('bento_daily_orders');
  if (savedDailyOrders) {
    try {
      dailyOrders = JSON.parse(savedDailyOrders);
    } catch(e) {
      dailyOrders = {};
    }
  }

  // 日付チェック：日が変わっていた場合、前日の選択(selectedBentoId)が当日に上書きされないよう自動切り替え
  const todayKey = getTodayKey();
  const lastActiveDate = localStorage.getItem('bento_last_active_date');
  if (lastActiveDate && lastActiveDate !== todayKey) {
    // 押し忘れ防止オートセーブ：前日の確定データが存在せず、選択中のお弁当がある場合は前日日付で自動確定保存
    if (!dailyOrders[lastActiveDate] || dailyOrders[lastActiveDate].status !== 'CONFIRMED') {
      const prevOrdered = porteUsers.filter(u => u.selectedBentoId);
      if (prevOrdered.length > 0) {
        const snapshot = prevOrdered.map(u => {
          const bento = bentoMaster.find(b => b.id === u.selectedBentoId);
          return {
            userId: u.id,
            userName: u.name,
            userKana: u.kana || '',
            bentoId: u.selectedBentoId,
            bentoName: bento ? bento.name : '不明なお弁当',
            bentoIcon: bento ? bento.icon : '🍱',
            category: bento ? bento.category : '',
            price: 500
          };
        });
        dailyOrders[lastActiveDate] = {
          status: 'CONFIRMED',
          confirmedAt: `${lastActiveDate} 23:59:59 (日付跨ぎ自動保存)`,
          orders: snapshot
        };
        saveDailyOrders();
      }
    }

    // 本日の未確定選択状態をクリア
    porteUsers.forEach(u => {
      u.selectedBentoId = '';
    });
    savePorteUsers();
  }
  localStorage.setItem('bento_last_active_date', todayKey);

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

function saveDailyOrders() {
  localStorage.setItem('bento_daily_orders', JSON.stringify(dailyOrders));
  saveDailyOrdersToSupabase();
}

async function saveDailyOrdersToSupabase() {
  const { url, key } = getSupabaseCredentials();
  if (!url || !key || typeof supabase === 'undefined') return;
  try {
    const SB = supabase.createClient(url, key);
    await SB.from('設定').upsert({
      key: 'bento_daily_orders',
      value: JSON.stringify(dailyOrders)
    });
  } catch(e) {}
}

// Supabase データベース同期機能 (複数端末間リアルタイム共有)
async function syncFromSupabase() {
  const { url, key } = getSupabaseCredentials();
  if (!url || !key || typeof supabase === 'undefined') return;

  try {
    const SB = supabase.createClient(url, key);

    // 設定テーブルから商品マスター＆入荷ロットデータを一括読み込み（全端末共有）
    const settingsRes = await SB.from('設定').select('*').in('key', ['bento_master', 'bento_todays_menu', 'bento_order_history', 'bento_daily_orders']);
    if (settingsRes.data && settingsRes.data.length > 0) {
      settingsRes.data.forEach(item => {
        if (item.key === 'bento_master' && item.value) {
          try {
            const parsed = JSON.parse(item.value);
            if (Array.isArray(parsed) && parsed.length > 0) {
              bentoMaster = parsed;
              bentoMaster.forEach(b => ensureBentoLots(b));
              localStorage.setItem('bento_master', JSON.stringify(bentoMaster));
            }
          } catch(e) {}
        } else if (item.key === 'bento_todays_menu' && item.value) {
          try {
            const parsed = JSON.parse(item.value);
            if (Array.isArray(parsed) && parsed.length >= 5) {
              todaysMenuIds = parsed;
              localStorage.setItem('bento_todays_menu', JSON.stringify(todaysMenuIds));
            }
          } catch(e) {}
        } else if (item.key === 'bento_order_history' && item.value) {
          try {
            const parsed = JSON.parse(item.value);
            if (Array.isArray(parsed)) {
              orderHistory = parsed;
              localStorage.setItem('bento_order_history', JSON.stringify(orderHistory));
            }
          } catch(e) {}
        } else if (item.key === 'bento_daily_orders' && item.value) {
          try {
            const parsed = JSON.parse(item.value);
            if (parsed && typeof parsed === 'object') {
              dailyOrders = Object.assign({}, parsed, dailyOrders);
              localStorage.setItem('bento_daily_orders', JSON.stringify(dailyOrders));
            }
          } catch(e) {}
        }
      });
    } else {
      // フォールバック: カスタムテーブルから読み込み
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
    // 確実に他端末と共有できるよう「設定」テーブルへ保存
    await SB.from('設定').upsert({
      key: 'bento_master',
      value: JSON.stringify(bentoMaster)
    });

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
    await SB.from('設定').upsert({
      key: 'bento_todays_menu',
      value: JSON.stringify(todaysMenuIds)
    });

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
    await SB.from('設定').upsert({
      key: 'bento_order_history',
      value: JSON.stringify(orderHistory)
    });

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
  updateConfirmStatusUI();
  renderMonthlyMatrix();
}

function confirmDailyOrder() {
  const todayKey = getTodayKey();
  const orderedUsers = porteUsers.filter(u => u.selectedBentoId);
  if (orderedUsers.length === 0) {
    showToast('確定する注文選択がありません。利用者のお弁当を選択してください。', 'info');
    return;
  }

  const snapshot = orderedUsers.map(u => {
    const bento = bentoMaster.find(b => b.id === u.selectedBentoId);
    return {
      userId: u.id,
      userName: u.name,
      userKana: u.kana || '',
      bentoId: u.selectedBentoId,
      bentoName: bento ? bento.name : '不明なお弁当',
      bentoIcon: bento ? bento.icon : '🍱',
      category: bento ? bento.category : '',
      price: 500
    };
  });

  dailyOrders[todayKey] = {
    status: 'CONFIRMED',
    confirmedAt: new Date().toLocaleString('ja-JP'),
    orders: snapshot
  };
  saveDailyOrders();
  renderAll();
  showToast(`🔒 本日(${todayKey})の注文【${snapshot.length}食】を確定・実績保存しました！`, 'success');
}

function unlockDailyOrder() {
  const todayKey = getTodayKey();
  if (confirm('本日の注文確定を解除しますか？（未確定状態に戻し編集可能にします）')) {
    if (dailyOrders[todayKey]) {
      dailyOrders[todayKey].status = 'DRAFT';
      saveDailyOrders();
    }
    renderAll();
    showToast('🔓 本日注文の確定を解除しました（編集可能状態）', 'info');
  }
}

function isTodayOrderConfirmed() {
  const todayKey = getTodayKey();
  return !!(dailyOrders[todayKey] && dailyOrders[todayKey].status === 'CONFIRMED');
}

function updateConfirmStatusUI() {
  const todayKey = getTodayKey();
  const isConfirmed = isTodayOrderConfirmed();
  
  const statusEl = document.getElementById('summaryConfirmStatus');
  if (statusEl) {
    statusEl.textContent = isConfirmed ? '確定済み 🔒' : '未確定 🔓';
    statusEl.style.color = isConfirmed ? '#2b8a3e' : '#6c757d';
  }

  const btnTop = document.getElementById('confirmDailyOrderBtn');
  if (btnTop) {
    if (isConfirmed) {
      btnTop.textContent = '✅ 本日注文確定済み (クリックで解除)';
      btnTop.style.background = 'linear-gradient(135deg, #2b8a3e, #2b8a3e)';
      btnTop.onclick = unlockDailyOrder;
    } else {
      btnTop.textContent = '🔒 本日の注文を確定して実績保存';
      btnTop.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      btnTop.onclick = confirmDailyOrder;
    }
  }

  const btnCard = document.getElementById('confirmDailyOrderCardBtn');
  if (btnCard) {
    if (isConfirmed) {
      btnCard.textContent = '✅ 確定済み (解除)';
      btnCard.style.background = '#2b8a3e';
      btnCard.onclick = unlockDailyOrder;
    } else {
      btnCard.textContent = '🔒 注文を確定';
      btnCard.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      btnCard.onclick = confirmDailyOrder;
    }
  }
}

function initMonthlyMatrixMonthSelect() {
  const sel = document.getElementById('monthlyMatrixMonthSelect');
  if (!sel) return;
  const now = new Date();
  sel.innerHTML = '';
  
  for (let i = -5; i <= 1; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const val = `${yyyy}-${mm}`;
    const opt = document.createElement('option');
    opt.value = val;
    opt.textContent = `${yyyy}年${d.getMonth() + 1}月`;
    if (i === 0) {
      opt.selected = true;
      currentSelectedMonth = val;
    }
    sel.appendChild(opt);
  }

  sel.addEventListener('change', (e) => {
    currentSelectedMonth = e.target.value;
    renderMonthlyMatrix();
  });

  const exportBtn = document.getElementById('exportMonthlyMatrixCsvBtn');
  if (exportBtn) {
    exportBtn.onclick = exportMonthlyMatrixCsv;
  }
}

function renderMonthlyMatrix() {
  const container = document.getElementById('monthlyMatrixContainer');
  if (!container) return;

  const targetMonth = currentSelectedMonth || getTodayKey().slice(0, 7);
  const [yearStr, monthStr] = targetMonth.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);

  const daysInMonth = new Date(year, month, 0).getDate();
  const todayKey = getTodayKey();

  const userMap = {};
  porteUsers.forEach(u => {
    userMap[u.id] = { id: u.id, name: u.name, kana: u.kana || '' };
  });

  for (let day = 1; day <= daysInMonth; day++) {
    const dayKey = `${targetMonth}-${String(day).padStart(2, '0')}`;
    const dayRecord = dailyOrders[dayKey];
    if (dayRecord && dayRecord.orders) {
      dayRecord.orders.forEach(o => {
        if (!userMap[o.userId]) {
          userMap[o.userId] = { id: o.userId, name: o.userName, kana: o.userKana || '' };
        }
      });
    }
  }

  const userList = Object.values(userMap);
  if (userList.length === 0) {
    container.innerHTML = `<div style="padding:30px; text-align:center; color:#747d8c;">利用者データが登録されていません。</div>`;
    return;
  }

  let thHtml = `<th class="sticky-col" style="min-width:140px;">利用者名</th>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const dayKey = `${targetMonth}-${String(d).padStart(2, '0')}`;
    const isToday = dayKey === todayKey;
    thHtml += `<th class="${isToday ? 'matrix-today-col' : ''}">${d}日</th>`;
  }
  thHtml += `<th style="min-width:80px;">当月食数</th>`;

  let trsHtml = '';
  userList.forEach(u => {
    let rowHtml = `<tr><td class="sticky-col"><strong>${u.name}</strong></td>`;
    let monthTotalCount = 0;

    for (let d = 1; d <= daysInMonth; d++) {
      const dayKey = `${targetMonth}-${String(d).padStart(2, '0')}`;
      const isToday = dayKey === todayKey;
      const dayRecord = dailyOrders[dayKey];
      
      let cellContent = `<span class="matrix-cell-empty">-</span>`;

      if (dayRecord && dayRecord.orders) {
        const userOrder = dayRecord.orders.find(o => o.userId === u.id);
        if (userOrder) {
          monthTotalCount++;
          const bento = bentoMaster.find(b => b.id === userOrder.bentoId);
          const icon = bento ? bento.icon : (userOrder.bentoIcon || '🍱');
          const shortName = (userOrder.bentoName || '').slice(0, 5);
          cellContent = `<span class="matrix-cell-chip" title="${userOrder.bentoName}">${icon} ${shortName}</span>`;
        }
      }
      
      // 未確定日のバックアップ復元表示 (注文履歴ログから検索)
      if (cellContent.indexOf('matrix-cell-chip') < 0) {
        const histMatch = orderHistory.find(ord => {
          if (ord.userName !== u.name && ord.userId !== u.id) return false;
          let ordDateStr = '';
          if (ord.id) {
            const ts = parseInt(String(ord.id).replace('ord_', ''), 10);
            if (!isNaN(ts) && ts > 1000000000000) {
              const d = new Date(ts);
              ordDateStr = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
            }
          }
          return ordDateStr === dayKey;
        });
        if (histMatch) {
          monthTotalCount++;
          const bento = bentoMaster.find(b => b.id === histMatch.bentoId);
          const icon = bento ? bento.icon : '🍱';
          const shortName = (histMatch.bentoName || '').slice(0, 5);
          cellContent = `<span class="matrix-cell-chip" style="background:#f3f0ff; border-color:#d0bfff; color:#6741d9;" title="履歴より復元: ${histMatch.bentoName}">${icon} ${shortName}</span>`;
        }
      }

      if (cellContent.indexOf('matrix-cell-chip') < 0 && isToday) {
        const currentUser = porteUsers.find(item => item.id === u.id);
        if (currentUser && currentUser.selectedBentoId) {
          const bento = bentoMaster.find(b => b.id === currentUser.selectedBentoId);
          if (bento) {
            cellContent = `<span class="matrix-cell-chip" style="background:#e7f5ff; border-color:#a5d8ff; color:#1971c2;" title="本日選択中(未確定)">${bento.icon} ${bento.name.slice(0,4)}</span>`;
          }
        }
      }

      rowHtml += `<td class="${isToday ? 'matrix-today-col' : ''}">${cellContent}</td>`;
    }

    rowHtml += `<td><span class="matrix-total-badge">${monthTotalCount}食</span></td></tr>`;
    trsHtml += rowHtml;
  });

  container.innerHTML = `
    <table class="monthly-matrix-table">
      <thead><tr>${thHtml}</tr></thead>
      <tbody>${trsHtml}</tbody>
    </table>
  `;
}

function exportMonthlyMatrixCsv() {
  const targetMonth = currentSelectedMonth || getTodayKey().slice(0, 7);
  const [yearStr, monthStr] = targetMonth.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const daysInMonth = new Date(year, month, 0).getDate();

  let csv = `\uFEFF日付,利用者ID,利用者名,注文お弁当名,カテゴリー,単価\n`;
  let totalCount = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const dayKey = `${targetMonth}-${String(day).padStart(2, '0')}`;
    const record = dailyOrders[dayKey];
    if (record && record.orders && record.orders.length > 0) {
      record.orders.forEach(o => {
        totalCount++;
        csv += `"${dayKey}","${o.userId}","${o.userName}","${o.bentoName}","${o.category || ''}",${o.price || 500}\n`;
      });
    }
  }

  if (totalCount === 0) {
    showToast(`${targetMonth}月度の確定注文実績データがありません。`, 'info');
    return;
  }

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `bento_monthly_matrix_${targetMonth}.csv`;
  link.click();
  showToast(`📊 ${targetMonth}月度【計${totalCount}食】の給食実績CSVを出力しました！`, 'success');
}

function renderProgressBar() {
  const bentoTargetUsers = porteUsers.filter(u => u.wantsBento !== false);
  const total = bentoTargetUsers.length;
  const ordered = bentoTargetUsers.filter(u => u.selectedBentoId).length;
  const pending = total - ordered;
  const percent = total > 0 ? Math.round((ordered / total) * 100) : 0;

  const elText = document.getElementById('progressText');
  if (elText) elText.textContent = `${ordered} / ${total} 名完了 (${percent}%)`;
  const elSubText = document.getElementById('progressSubText');
  if (elSubText) elSubText.textContent = `未選択: ${pending}名`;
  const elFill = document.getElementById('progressFill');
  if (elFill) elFill.style.width = `${percent}%`;
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

  openUserSelectForBentoModal(bentoId);
};

window.openStaffAllMenuModalAdmin = function() {
  const modal = document.getElementById('staffMenuModalAdmin');
  const grid = document.getElementById('staffMenuGridAdmin');
  if (!modal || !grid) {
    console.error('staffMenuModalAdmin or grid missing');
    return;
  }
  grid.innerHTML = '';

  const masterList = (bentoMaster && bentoMaster.length > 0) ? bentoMaster : DEFAULT_30_BENTO;

  masterList.forEach(item => {
    const isSoldOut = item.stock <= 0;
    const card = document.createElement('div');
    card.style.cssText = `background:#fff; border:1.5px solid ${isSoldOut ? '#e9ecef' : '#bac8ff'}; border-radius:14px; padding:12px; display:flex; flex-direction:column; justify-content:space-between; opacity:${isSoldOut ? 0.6 : 1};`;
    card.innerHTML = `
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <span style="font-size:0.75rem; background:#d0ebff; color:#1864ab; padding:2px 8px; border-radius:10px; font-weight:800;">${item.category}</span>
          <span style="font-size:0.8rem; font-weight:700; color:#495057;">在庫: ${item.stock}</span>
        </div>
        <div style="font-weight:800; font-size:0.95rem; color:#212529; margin-bottom:4px;">${item.icon} ${item.name}</div>
        <div style="font-size:0.75rem; color:#666; margin-bottom:8px; line-height:1.3;">${item.desc || ''}</div>
      </div>
      <button type="button" class="btn btn-sm ${isSoldOut ? 'btn-outline' : 'btn-pop'}" style="width:100%; padding:6px; font-weight:800; font-size:0.85rem;" ${isSoldOut ? 'disabled' : ''} onclick="onChooseStaffSpecialBentoAdmin('${item.id}')">
        ${isSoldOut ? '完売' : 'このお弁当を選ぶ 🍱'}
      </button>
    `;
    grid.appendChild(card);
  });

  modal.classList.add('active');
  modal.style.display = 'flex';
  modal.style.opacity = '1';
  modal.style.pointerEvents = 'auto';
};

window.closeStaffAllMenuModalAdmin = function() {
  const modal = document.getElementById('staffMenuModalAdmin');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
  }
};

window.onChooseStaffSpecialBentoAdmin = function(bentoId) {
  closeStaffAllMenuModalAdmin();
  const item = bentoMaster.find(b => b.id === bentoId);
  openStaffSelectForBentoModal(item || bentoId);
};

let currentStaffSelectingBentoId = null;

window.openStaffSelectForBentoModal = function(bentoItemOrId) {
  let bentoItem = typeof bentoItemOrId === 'string' ? bentoMaster.find(b => b.id === bentoItemOrId) : bentoItemOrId;
  if (!bentoItem) bentoItem = { id: String(bentoItemOrId), name: 'お弁当' };
  currentStaffSelectingBentoId = bentoItem.id;

  const titleEl = document.getElementById('selectStaffModalBentoTitle');
  if (titleEl) titleEl.textContent = `👔 『${bentoItem.name}』をどのスタッフの注文にしますか？`;

  const searchEl = document.getElementById('staffSelectModalSearch');
  if (searchEl) {
    searchEl.value = '';
    searchEl.oninput = (e) => renderStaffPickerList(e.target.value);
  }

  renderStaffPickerList('');

  const modal = document.getElementById('staffSelectForBentoModal');
  if (modal) {
    modal.classList.add('active');
    modal.style.display = 'flex';
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'auto';
  }
};

window.closeStaffSelectForBentoModal = function() {
  const modal = document.getElementById('staffSelectForBentoModal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
  }
  currentStaffSelectingBentoId = null;
};

function renderStaffPickerList(searchQuery) {
  const listContainer = document.getElementById('staffPickerList');
  if (!listContainer) return;
  listContainer.innerHTML = '';

  const q = (searchQuery || '').toLowerCase();

  let staffList = porteUsers.filter(u => u.type === '👔 スタッフ' || u.isStaff || String(u.name).includes('👔'));

  if (staffList.length === 0 && window.porteStaffList && window.porteStaffList.length > 0) {
    staffList = window.porteStaffList.map(s => ({
      id: s.id || ('staff_' + s.name),
      name: s.name,
      type: '👔 スタッフ',
      isStaff: true,
      wantsBento: true,
      selectedBentoId: null
    }));
  }

  const filtered = staffList.filter(s => {
    const matchQuery = s.name.toLowerCase().includes(q) || (s.id && String(s.id).toLowerCase().includes(q));
    return matchQuery;
  });

  if (filtered.length === 0) {
    listContainer.innerHTML = `
      <div style="text-align:center; padding:24px; color:#747d8c;">
        <p style="margin-bottom:12px; font-weight:700;">スタッフの登録データが見つかりません。</p>
        <button class="btn btn-sm btn-pop" style="background:linear-gradient(135deg, #1864ab, #228be6); border:none; font-weight:800;" onclick="addNewStaffUserQuick()">👔 スタッフ名を入力して注文登録</button>
      </div>
    `;
    return;
  }

  filtered.forEach(s => {
    const isChosenThis = s.selectedBentoId === currentStaffSelectingBentoId;
    const currentChoice = s.selectedBentoId ? bentoMaster.find(b => b.id === s.selectedBentoId) : null;

    const div = document.createElement('div');
    div.className = `user-picker-item ${isChosenThis ? 'selected' : ''}`;
    div.style.cssText = 'background:#eef7ff; border:1.5px solid #91c7ff; border-radius:14px; padding:12px 16px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center; cursor:pointer;';
    div.innerHTML = `
      <div style="text-align:left;">
        <div class="user-picker-name" style="color:#1864ab; font-weight:900; font-size:1.05rem;">👔 ${s.name.replace('👔', '').replace('スタッフ', '').trim()}</div>
        <div class="user-picker-sub" style="font-size:0.8rem; color:#495057;">${currentChoice ? `現在選択: ${currentChoice.icon} ${currentChoice.name}` : '未選択'}</div>
      </div>
      <button class="btn btn-sm btn-pop" style="background:linear-gradient(135deg, #1864ab, #228be6); border:none; font-weight:800;">
        ${isChosenThis ? '✅ 選択中' : '決定'}
      </button>
    `;
    div.onclick = () => selectStaffOrder(s.id || s.name);
    listContainer.appendChild(div);
  });
}

window.selectStaffOrder = function(staffIdOrName) {
  let user = porteUsers.find(u => u.id === staffIdOrName || u.name === staffIdOrName);
  if (!user) {
    user = {
      id: 'staff_' + Date.now(),
      name: staffIdOrName.replace('👔', '').trim(),
      type: '👔 スタッフ',
      isStaff: true,
      wantsBento: true,
      selectedBentoId: null
    };
    porteUsers.push(user);
  }

  const bento = bentoMaster.find(b => b.id === currentStaffSelectingBentoId);
  if (!bento) return;

  user.selectedBentoId = bento.id;
  user.type = '👔 スタッフ';

  closeStaffSelectForBentoModal();
  renderPorteSection();
  renderTodaysMenu();
  savePorteData();
  showToast(`🎉 ${user.name} スタッフのお弁当を『${bento.name}』に登録しました！`, 'success');
};

window.addNewStaffUserQuick = function() {
  const name = prompt('お弁当を注文するスタッフのお名前を入力してください:');
  if (!name || !name.trim()) return;
  selectStaffOrder(name.trim());
};

// 1. 本日の5品 メニュー表示（賞味期限の短い順で描画）
function renderTodaysMenu() {
  autoReplaceSoldOutMenu();
  sortTodaysMenuIdsByExpiration();

  const container = document.getElementById('todaysMenuGrid');
  container.innerHTML = '';

  const items = todaysMenuIds.map(id => bentoMaster.find(b => b.id === id)).filter(Boolean);

  if (items.length === 0) {
    container.innerHTML = `<p style="padding:20px; color:#868e96;">本日のメニューが設定されていません</p>`;
    return;
  }

  let tableHtml = `
    <div style="background:#fff; border-radius:18px; border:1.5px solid #e9ecef; overflow-x:auto; -webkit-overflow-scrolling:touch; box-shadow:0 4px 12px rgba(0,0,0,0.03); width:100%;">
      <table class="data-table admin-menu-table" style="width:100%; min-width:780px; border-collapse:collapse; font-size:0.95rem; table-layout:auto;">
        <thead>
          <tr style="background:#fff4e6; color:#d9480f; border-bottom:2px solid #ffd8a8; font-weight:800;">
            <th style="padding:12px 14px; width:90px; min-width:90px; text-align:center; white-space:nowrap !important; word-break:keep-all !important;">枠</th>
            <th style="padding:12px 14px; width:130px; min-width:130px; text-align:center; white-space:nowrap !important; word-break:keep-all !important;">カテゴリ</th>
            <th style="padding:12px 14px; min-width:220px; white-space:nowrap !important; word-break:keep-all !important;">お弁当名</th>
            <th style="padding:12px 14px; width:100px; min-width:100px; text-align:center; white-space:nowrap !important; word-break:keep-all !important;">残在庫</th>
            <th style="padding:12px 14px; min-width:180px;">本日選択された方</th>
            <th style="padding:12px 14px; width:130px; min-width:130px; text-align:center; white-space:nowrap !important; word-break:keep-all !important;">操作</th>
          </tr>
        </thead>
        <tbody>
  `;

  const isConfirmedToday = isTodayOrderConfirmed();

  items.forEach((item, index) => {
    const isSoldOut = item.stock <= 0;
    const chosenUsers = porteUsers.filter(u => u.selectedBentoId === item.id);
    let userNamesHtml = chosenUsers.map(u => `<span style="background:#fff0f6; border:1px solid #ffdeeb; color:#c2255c; padding:2px 8px; border-radius:12px; font-size:0.85rem; font-weight:700; display:inline-block; margin:2px; white-space:nowrap !important; word-break:keep-all !important;">${u.name}</span>`).join(' ');
    if (!userNamesHtml) userNamesHtml = '<span style="color:#adb5bd; font-size:0.85rem; white-space:nowrap !important;">(未選択)</span>';

    const orderBtnHtml = isConfirmedToday
      ? `<button type="button" class="btn btn-sm btn-outline" style="padding:6px 14px; font-size:0.85rem; font-weight:800; white-space:nowrap !important; opacity:0.6; cursor:not-allowed;" disabled title="本日の注文は確定済みです">🔒 確定済み</button>`
      : (isSoldOut 
          ? `<button type="button" class="btn btn-sm btn-outline" style="padding:6px 14px; font-size:0.85rem; font-weight:800; white-space:nowrap !important;" disabled>完売</button>`
          : `<button type="button" class="btn btn-sm btn-pop" style="padding:6px 14px; font-size:0.85rem; font-weight:800; white-space:nowrap !important;" onclick="quickOrderBento('${item.id}')">注文登録 🍱</button>`);

    tableHtml += `
      <tr style="border-bottom:1px solid #f1f3f5; background:${index % 2 === 0 ? '#fff' : '#fafafa'};">
        <td style="padding:12px 14px; text-align:center; font-weight:800; color:#d9480f; white-space:nowrap !important; word-break:keep-all !important;">第${index + 1}案</td>
        <td style="padding:12px 14px; text-align:center; white-space:nowrap !important; word-break:keep-all !important;"><span style="background:#e7f5ff; color:#1971c2; padding:4px 12px; border-radius:14px; font-size:0.8rem; font-weight:800; display:inline-block; white-space:nowrap !important; word-break:keep-all !important;">${item.category}</span></td>
        <td style="padding:12px 14px; font-weight:800; color:#212529; white-space:nowrap !important; word-break:keep-all !important;">${item.icon} ${item.name}</td>
        <td style="padding:12px 14px; text-align:center; white-space:nowrap !important; word-break:keep-all !important;">
          ${isSoldOut ? '<span style="color:#ff4757; font-weight:900;">完売</span>' : `<span style="font-weight:900; color:#2b8a3e;">${item.stock} 食</span>`}
        </td>
        <td style="padding:12px 14px;">${userNamesHtml}</td>
        <td style="padding:12px 14px; text-align:center; white-space:nowrap !important; word-break:keep-all !important;">
          ${orderBtnHtml}
        </td>
      </tr>
    `;
  });

  tableHtml += `
        </tbody>
      </table>
    </div>
  `;

  container.innerHTML = tableHtml;
}

window.quickOrderBento = function(bentoId) {
  if (isTodayOrderConfirmed()) {
    showToast('⚠️ 本日の注文は確定済みです。変更する場合は「本日注文確定済み (クリックで解除)」を押して確定を解除してください。', 'warning');
    return;
  }
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

function openUserSelectForBentoModal(bentoItemOrId) {
  let bentoItem = typeof bentoItemOrId === 'string' ? bentoMaster.find(b => b.id === bentoItemOrId) : bentoItemOrId;
  if (!bentoItem) bentoItem = { id: String(bentoItemOrId), name: 'お弁当' };
  currentSelectedBentoId = bentoItem.id;

  const titleEl = document.getElementById('selectUserModalBentoTitle');
  if (titleEl) titleEl.textContent = `🍱 『${bentoItem.name}』を誰の注文にしますか？`;
  
  const searchEl = document.getElementById('userSelectModalSearch');
  if (searchEl) {
    searchEl.value = '';
    searchEl.oninput = (e) => renderUserPickerList(e.target.value);
  }
  
  renderUserPickerList('');
  const modal = document.getElementById('userSelectForBentoModal');
  if (modal) {
    modal.classList.add('active');
    modal.style.display = 'flex';
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'auto';
  }
}

let adminModalFilterMode = 'bentoOnly';

window.setAdminModalFilterMode = function(mode) {
  adminModalFilterMode = mode;
  modalShowAll = (mode === 'showAll');

  const bentoBtn = document.getElementById('modalFilterBentoOnlyBtn');
  const allBtn = document.getElementById('modalFilterShowAllBtn');
  const staffBtn = document.getElementById('modalFilterStaffBtn');

  const activeCss = 'padding:8px 16px; border-radius:20px; border:2px solid #ff7e67; background:#fff5eb; color:#d9480f; font-weight:800; font-size:0.95rem; cursor:pointer;';
  const staffActiveCss = 'padding:8px 16px; border-radius:20px; border:2px solid #91c7ff; background:#eef7ff; color:#1864ab; font-weight:800; font-size:0.95rem; cursor:pointer;';
  const inactiveCss = 'padding:8px 16px; border-radius:20px; border:2px solid #ced4da; background:#fff; color:#495057; font-weight:800; font-size:0.95rem; cursor:pointer;';

  if (bentoBtn) bentoBtn.style.cssText = (mode === 'bentoOnly' ? activeCss : inactiveCss);
  if (allBtn) allBtn.style.cssText = (mode === 'showAll' ? activeCss : inactiveCss);
  if (staffBtn) staffBtn.style.cssText = (mode === 'staff' ? staffActiveCss : inactiveCss);

  renderUserPickerList('');
};

window.toggleModalShowAll = function(showAll) {
  setAdminModalFilterMode(showAll ? 'showAll' : 'bentoOnly');
};

function renderUserPickerList(searchQuery) {
  const listContainer = document.getElementById('userPickerList');
  if (!listContainer) return;
  listContainer.innerHTML = '';

  const q = (searchQuery || '').toLowerCase();

  let targetList = [];

  if (adminModalFilterMode === 'staff') {
    targetList = porteUsers.filter(u => u.type === '👔 スタッフ' || u.isStaff || String(u.name).includes('👔'));
    if (targetList.length === 0 && window.porteStaffList && window.porteStaffList.length > 0) {
      targetList = window.porteStaffList.map(s => ({
        id: s.id || ('staff_' + s.name),
        name: s.name,
        type: '👔 スタッフ',
        isStaff: true,
        wantsBento: true,
        selectedBentoId: null
      }));
    }
  } else if (adminModalFilterMode === 'showAll') {
    targetList = porteUsers.filter(u => u.type !== '👔 スタッフ' && !String(u.name).includes('👔'));
  } else {
    // bentoOnly
    targetList = porteUsers.filter(u => (u.type !== '👔 スタッフ' && !String(u.name).includes('👔')) && (modalShowAll || u.wantsBento !== false || u.selectedBentoId));
  }

  const filtered = targetList.filter(u => {
    const matchQuery = u.name.toLowerCase().includes(q) || (u.kana && u.kana.toLowerCase().includes(q)) || String(u.id).toLowerCase().includes(q);
    return matchQuery;
  });

  if (filtered.length === 0) {
    if (adminModalFilterMode === 'staff') {
      listContainer.innerHTML = `
        <div style="grid-column:1/-1; width:100%; text-align:center; padding:30px 10px; color:#1864ab;">
          <p style="margin-bottom:12px; font-weight:700; font-size:1.05rem;">登録されているスタッフデータが見つかりません。</p>
          <button class="btn btn-sm btn-pop" style="background:linear-gradient(135deg, #1864ab, #228be6); border:none; font-weight:800; padding:8px 20px;" onclick="addNewStaffUserQuick()">👔 スタッフ名を入力して注文登録</button>
        </div>
      `;
    } else {
      listContainer.innerHTML = `
        <div style="grid-column:1/-1; width:100%; text-align:center; padding:30px 10px; color:#868e96;">
          <p style="font-weight:700; font-size:1rem; line-height:1.7; margin:0;">本日利用のご利用者様データが登録されていません。上部の「👥 全ご利用者様から選択」または「👔 スタッフから選択」ボタンをお試しください。</p>
        </div>
      `;
    }
    return;
  }

  filtered.forEach(u => {
    const isChosenThis = u.selectedBentoId === currentSelectingBentoId;
    const currentChoice = u.selectedBentoId ? bentoMaster.find(b => b.id === u.selectedBentoId) : null;
    const isStaff = u.type === '👔 スタッフ' || u.isStaff || String(u.name).includes('👔');

    const cleanName = u.name.replace('👔', '').replace('スタッフ', '').trim();
    const displayName = isStaff ? `👔 ${cleanName}` : `👤 ${cleanName} 様`;

    const btn = document.createElement('button');
    btn.className = `user-btn ${isChosenThis ? 'chosen' : ''}`;
    btn.style.cssText = `
      padding: 16px 20px;
      border-radius: 20px;
      font-size: 1.05rem;
      font-weight: 900;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.2s ease;
      ${isStaff 
        ? (isChosenThis ? 'background:#e6fcf5; border:2px solid #63e6be; color:#0ca678;' : 'background:#eef7ff; border:2px solid #91c7ff; color:#1864ab;')
        : (isChosenThis ? 'background:#d3f9d8; border:2px solid #63e6be; color:#2b8a3e;' : 'background:#fff0f6; border:2px solid #ffdeeb; color:#c2255c;')
      }
    `;
    btn.innerHTML = `
      <div style="text-align:left; width:100%; display:flex; justify-content:space-between; align-items:center;">
        <span style="font-weight:900; font-size:1.05rem;">${displayName}</span>
        ${isChosenThis ? '<span style="font-size:0.85rem; font-weight:800; color:#2b8a3e; background:#ffffff; padding:3px 10px; border-radius:10px;">✅ 選択中</span>' : (currentChoice ? `<span style="font-size:0.8rem; opacity:0.8;">(変更: ${currentChoice.icon})</span>` : '')}
      </div>
    `;
    btn.onclick = () => confirmAssignUserForBento(u.id || u.name);
    listContainer.appendChild(btn);
  });
}

window.confirmAssignUserForBento = function(userId) {
  let userIndex = porteUsers.findIndex(u => u.id === userId || u.name === userId);
  if (userIndex < 0) {
    const userObj = {
      id: 'staff_' + Date.now(),
      name: String(userId).replace('👔', '').trim(),
      type: '👔 スタッフ',
      isStaff: true,
      wantsBento: true,
      selectedBentoId: null
    };
    porteUsers.push(userObj);
    userIndex = porteUsers.length - 1;
  }
  if (!currentSelectingBentoId) return;

  const user = porteUsers[userIndex];
  
  if (user.wantsBento === false) {
    user.wantsBento = true;
    showToast(`⚡ ${user.name} 様のお弁当希望を追加しました！`, 'info');
  }

  assignUserBento(userIndex, currentSelectingBentoId);
  const bentoItem = bentoMaster.find(b => b.id === currentSelectingBentoId);

  closeUserSelectForBentoModal();
  showToast(`🎉 ${user.name} 様のお弁当を『${bentoItem ? bentoItem.name : ''}』に登録しました！`, 'success');
};

window.closeUserSelectForBentoModal = function() {
  const modal = document.getElementById('userSelectForBentoModal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
  }
  currentSelectingBentoId = null;
  currentSelectedBentoId = null;
};

// 2. ポルテデータ＆注文受付レンダー
function renderPorteSection() {
  const bentoUsers = porteUsers.filter(u => u.wantsBento !== false);
  const totalTarget = bentoUsers.length;
  const ordered = bentoUsers.filter(u => u.selectedBentoId).length;
  const pending = totalTarget - ordered;

  const elTotal = document.getElementById('summaryTotalUsers');
  if (elTotal) elTotal.textContent = `${totalTarget} (全員:${porteUsers.length})`;
  const elOrdered = document.getElementById('summaryOrderedUsers');
  if (elOrdered) elOrdered.textContent = ordered;
  const elPending = document.getElementById('summaryPendingUsers');
  if (elPending) elPending.textContent = pending;

  const elTabBadge = document.getElementById('porteTabBadge');
  if (elTabBadge) elTabBadge.textContent = `未受付 ${pending}`;

  const tbody = document.getElementById('porteUserTableBody');
  tbody.innerHTML = '';

  if (porteUsers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px; color:#747d8c;">ポルテのDBから自動読込するか、CSVファイルを読み込んでください。</td></tr>`;
  } else {
    const todaysBentoList = todaysMenuIds.map(id => bentoMaster.find(b => b.id === id)).filter(Boolean);
    const displayList = porteUsers.filter(u => tableShowAll || u.wantsBento !== false || u.selectedBentoId);
    const isConfirmedToday = isTodayOrderConfirmed();

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
          <button class="btn btn-sm ${wantsBento ? 'btn-outline' : 'btn-sample'}" style="padding:2px 8px; font-size:0.75rem; ${isConfirmedToday ? 'opacity:0.6; cursor:not-allowed;' : ''}" ${isConfirmedToday ? 'disabled title="本日の注文は確定済みです"' : ''} onclick="toggleUserBentoWant(${realIndex})">
            ${wantsBento ? '🍱 注文あり' : '⚪ 注文なし'}
          </button>
        </td>
        <td><span style="color:#e64980; font-size:0.85rem; font-weight:700;">${u.note || '-'}</span></td>
        <td>
          <select class="bento-select-dropdown" ${isConfirmedToday ? 'disabled style="background:#e9ecef; cursor:not-allowed; opacity:0.85; border-color:#ced4da;" title="本日の注文は確定済みです（クリックで確定解除すると変更可能）"' : ''} onchange="assignUserBento(${realIndex}, this.value)">
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
  if (isTodayOrderConfirmed()) {
    showToast('⚠️ 本日の注文は確定済みです。変更する場合は「本日注文確定済み (クリックで解除)」を押して確定を解除してください。', 'warning');
    return;
  }
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
  if (isTodayOrderConfirmed()) {
    showToast('⚠️ 本日の注文は確定済みです。変更する場合は「本日注文確定済み (クリックで解除)」を押して確定を解除してください。', 'warning');
    renderAll();
    return;
  }
  const user = porteUsers[userIndex];
  if (!user) return;
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

      user.wantsBento = true;
      deductBentoStockFIFO(newBento, 1);

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

      const now = new Date();
      const mStr = (now.getMonth() + 1) + '/' + now.getDate() + ' ' + new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
      orderHistory.unshift({
        id: 'ord_' + Date.now(),
        date: mStr,
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
  if (!container) return;
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
      let dateDisp = ord.date || '';
      if (dateDisp && dateDisp.indexOf('/') < 0 && dateDisp.indexOf('-') < 0 && ord.id) {
        const ts = parseInt(String(ord.id).replace('ord_', ''), 10);
        if (!isNaN(ts) && ts > 1000000000000) {
          const d = new Date(ts);
          dateDisp = `${d.getMonth() + 1}/${d.getDate()} ${ord.date}`;
        }
      }
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-size:0.85rem; font-weight:700; color:#495057;">${dateDisp}</td>
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

let currentMasterSortKey = 'default';
let currentMasterSortOrder = 'asc';

window.setMasterSort = function(key) {
  if (currentMasterSortKey === key) {
    currentMasterSortOrder = (currentMasterSortOrder === 'asc') ? 'desc' : 'asc';
  } else {
    currentMasterSortKey = key;
    currentMasterSortOrder = (key === 'expDate' || key === 'stock' || key === 'isToday') ? 'desc' : 'asc';
    if (key === 'expDate') currentMasterSortOrder = 'asc';
  }
  renderMasterSection();
};

window.filterCategory = function(catKey) {
  currentCategoryFilter = catKey;
  renderMasterSection();
};

function toKatakana(str) {
  return (str || '').replace(/[\u3041-\u3096]/g, ch =>
    String.fromCharCode(ch.charCodeAt(0) + 0x60)
  );
}

function toHiragana(str) {
  return (str || '').replace(/[\u30a1-\u30f6]/g, ch =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );
}

function renderMasterSection() {
  const container = document.getElementById('masterItemsGrid');
  if (!container) return;
  container.innerHTML = '';

  const searchInput = document.getElementById('masterSearchInput');
  const rawSearch = (searchInput ? searchInput.value || '' : '').trim().toLowerCase();
  const searchKana = toKatakana(rawSearch);
  const searchHira = toHiragana(rawSearch);

  // 各カテゴリーの件数を集計＆ピルボタン表示更新
  const catCounts = { ALL: bentoMaster.length, '魚': 0, '豚肉': 0, '牛肉': 0, '鶏肉': 0, '和食・その他': 0 };
  bentoMaster.forEach(b => {
    const cat = (b.category || '').trim();
    if (cat.includes('魚')) catCounts['魚']++;
    else if (cat.includes('豚')) catCounts['豚肉']++;
    else if (cat.includes('牛')) catCounts['牛肉']++;
    else if (cat.includes('鶏')) catCounts['鶏肉']++;
    else catCounts['和食・その他']++;
  });

  const iconLabels = {
    'ALL': 'すべて',
    '魚': '🐟 魚料理',
    '豚肉': '🐖 豚肉',
    '牛肉': '🐂 牛肉',
    '鶏肉': '🐓 鶏肉',
    '和食・その他': '🍲 和食・中華・その他'
  };

  document.querySelectorAll('#categoryFilterPills .pill-btn').forEach(btn => {
    const catKey = btn.getAttribute('data-category');
    const label = iconLabels[catKey] || catKey;
    const count = catCounts[catKey] !== undefined ? catCounts[catKey] : 0;
    btn.textContent = `${label} (${count})`;

    if (catKey === currentCategoryFilter) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

function matchCategoryItem(itemCategory, filterCategory) {
  if (!filterCategory || filterCategory === 'ALL') return true;
  if (!itemCategory) return false;

  const itemCat = itemCategory.trim();
  const filterCat = filterCategory.trim();

  if (itemCat === filterCat) return true;

  if (filterCat.includes('魚') && itemCat.includes('魚')) return true;
  if (filterCat.includes('豚') && itemCat.includes('豚')) return true;
  if (filterCat.includes('牛') && itemCat.includes('牛')) return true;
  if (filterCat.includes('鶏') && itemCat.includes('鶏')) return true;
  
  if ((filterCat.includes('和食') || filterCat.includes('その他') || filterCat.includes('中華')) &&
      (itemCat.includes('和食') || itemCat.includes('その他') || itemCat.includes('中華') || itemCat.includes('エビ') || itemCat.includes('海老') || itemCat.includes('カレー'))) {
    return true;
  }

  return false;
}

  let filtered = bentoMaster.filter(item => {
    ensureBentoLots(item);
    
    // 検索窓に文字がある場合（1文字以上入力時）：全30品目から部分一致リアルタイム検索
    if (rawSearch.length > 0) {
      const nameLower = (item.name || '').toLowerCase();
      const nameKana = toKatakana(nameLower);
      const nameHira = toHiragana(nameLower);
      const descLower = (item.desc || '').toLowerCase();
      const descKana = toKatakana(descLower);
      const descHira = toHiragana(descLower);
      const catLower = (item.category || '').toLowerCase();

      return nameLower.includes(rawSearch) || 
             nameKana.includes(searchKana) || 
             nameHira.includes(searchHira) || 
             descLower.includes(rawSearch) || 
             descKana.includes(searchKana) ||
             descHira.includes(searchHira) ||
             catLower.includes(rawSearch);
    }

    // 文字が空（削除時）：カテゴリー選択に応じた全件を即座に復元・全件表示
    return matchCategoryItem(item.category, currentCategoryFilter);
  });

  // テーブルソート実行
  if (currentMasterSortKey !== 'default') {
    filtered.sort((a, b) => {
      let valA, valB;
      if (currentMasterSortKey === 'category') {
        valA = a.category || '';
        valB = b.category || '';
      } else if (currentMasterSortKey === 'name') {
        valA = a.name || '';
        valB = b.name || '';
      } else if (currentMasterSortKey === 'stock') {
        valA = a.stock || 0;
        valB = b.stock || 0;
      } else if (currentMasterSortKey === 'expDate') {
        valA = getBentoEarliestExpDate(a);
        valB = getBentoEarliestExpDate(b);
      } else if (currentMasterSortKey === 'isToday') {
        valA = todaysMenuIds.includes(a.id) ? 1 : 0;
        valB = todaysMenuIds.includes(b.id) ? 1 : 0;
      }

      if (valA < valB) return currentMasterSortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return currentMasterSortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

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

  const getSortIcon = (key) => {
    if (currentMasterSortKey !== key) return '<span style="color:#adb5bd; font-size:0.75rem; margin-left:4px;">⇅</span>';
    return currentMasterSortOrder === 'asc' 
      ? '<span style="color:#d9480f; font-size:0.85rem; margin-left:4px; font-weight:900;">▲</span>' 
      : '<span style="color:#d9480f; font-size:0.85rem; margin-left:4px; font-weight:900;">▼</span>';
  };

  table.innerHTML = `
    <thead>
      <tr>
        <th style="width: 120px; cursor:pointer; user-select:none;" onclick="setMasterSort('category')" title="カテゴリーで並び替え">
          カテゴリー ${getSortIcon('category')}
        </th>
        <th style="width: 240px; cursor:pointer; user-select:none;" onclick="setMasterSort('name')" title="商品名で並び替え">
          商品名 ${getSortIcon('name')}
        </th>
        <th style="width: 140px; text-align:center; cursor:pointer; user-select:none;" onclick="setMasterSort('stock')" title="合計在庫数で並び替え">
          合計在庫数 ${getSortIcon('stock')}
        </th>
        <th style="cursor:pointer; user-select:none;" onclick="setMasterSort('expDate')" title="賞味期限の近い順で並び替え">
          既存在庫 ＆ 入荷分 ロット明細一覧 ${getSortIcon('expDate')}
        </th>
        <th style="width: 110px; text-align:center; cursor:pointer; user-select:none;" onclick="setMasterSort('isToday')" title="本日の5品で並び替え">
          本日の5品 ${getSortIcon('isToday')}
        </th>
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

  const idEl = document.getElementById('addLotBentoId');
  if (idEl) idEl.value = item.id;
  const nameEl = document.getElementById('addLotBentoName');
  if (nameEl) nameEl.textContent = item.name;
  const qtyEl = document.getElementById('lotQtyInput');
  if (qtyEl) qtyEl.value = 5;
  const expEl = document.getElementById('lotExpDateInput');
  if (expEl) expEl.value = getOffsetDateStr(7);

  const listEl = document.getElementById('existingLotsList');
  if (listEl) listEl.innerHTML = '';
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

  const userCountEl = document.getElementById('headerUserCount');
  if (userCountEl) userCountEl.textContent = `${totalUsers}名 (全${porteUsers.length}名)`;
  const orderedCountEl = document.getElementById('headerOrderedCount');
  if (orderedCountEl) orderedCountEl.textContent = `${orderedUsers}食`;

  const totalStock = bentoMaster.reduce((sum, item) => sum + (parseInt(item.stock, 10) || 0), 0);
  const stockEl = document.getElementById('headerTotalStockCount');
  if (stockEl) {
    stockEl.textContent = `${totalStock}食`;
  }
  const masterStockEl = document.getElementById('masterTotalStockText');
  if (masterStockEl) {
    masterStockEl.textContent = totalStock;
  }
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

window.closeSupabaseConfigModal = function() {
  const modal = document.getElementById('supabaseConfigModal');
  if (modal) modal.classList.remove('active');
};

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
async function fetchPorteDbAttendance(isAutoLoad = false) {
  const { url, key } = getSupabaseCredentials();

  if (!url || !key) {
    if (!isAutoLoad) {
      showToast('⚙️ Supabaseの接続設定（URL・APIキー）を入力してください。', 'warning');
      openSupabaseConfigModal();
    }
    return;
  }

  if (typeof supabase === 'undefined') {
    if (!isAutoLoad) showToast('⚠️ Supabase SDKの読み込みに失敗しました。インターネット接続をご確認ください。', 'warning');
    return;
  }

  if (!isAutoLoad) {
    showToast('⚡ Porteデータベースから最新利用者を読み込み中...', 'info');
  }

  try {
    const SB = supabase.createClient(url, key);
    
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const [userRes, attRes, staffRes, staffAttRes] = await Promise.all([
      SB.from('利用者').select('*'),
      SB.from('出欠').select('*').eq('date', todayStr),
      SB.from('スタッフ').select('*'),
      SB.from('スタッフ出欠').select('*').eq('date', todayStr)
    ]);

    if (userRes.error) {
      console.warn('Porte DB Error:', userRes.error);
      throw userRes.error;
    }

    const attMap = {};
    if (attRes && attRes.data) {
      attRes.data.forEach(a => {
        if (a) {
          if (a.userId) attMap[String(a.userId).trim()] = a;
          if (a.user_id) attMap[String(a.user_id).trim()] = a;
          if (a.name) attMap[String(a.name).trim()] = a;
          if (a.userName) attMap[String(a.userName).trim()] = a;
        }
      });
    }

    const staffAttMap = {};
    if (staffAttRes && staffAttRes.data) {
      staffAttRes.data.forEach(a => {
        if (a) {
          if (a.staffId) staffAttMap[String(a.staffId).trim()] = a;
          if (a.staff_id) staffAttMap[String(a.staff_id).trim()] = a;
          if (a.name) staffAttMap[String(a.name).trim()] = a;
        }
      });
    }

    let loadedUsers = [];
    if (userRes.data && userRes.data.length > 0) {
      userRes.data.forEach((u, idx) => {
        // 利用終了・退所済みの利用者は除外
        if (u.userStatus === '利用終了' || u.userStatus === '退所' || u.status === '利用終了' || u.status === '退所') return;
        if (u.enrollDate && u.enrollDate > todayStr) return;
        if (u.endDate && u.endDate < todayStr) return;

        const daysJp = ['日', '月', '火', '水', '木', '金', '土'];
        const todayDayJp = daysJp[now.getDay()];

        const uId = String(u.id || '').trim();
        const uName = String(u.name || u.氏名 || '').trim();
        const r = attMap[uId] || attMap[uName];
        
        // 利用曜日のチェック
        const scheduleDays = (u.scheduleDays || '').split(',').map(s => s.trim()).filter(Boolean);
        const isScheduledToday = scheduleDays.length === 0 || scheduleDays.includes(todayDayJp);

        // 欠席・お休み判定
        let isAbsent = false;
        if (r) {
          isAbsent = (
            r.status === '欠席' || 
            r.status === '公休' || 
            r.status === '調整休' || 
            r.status === '欠勤' || 
            r.status === 'お休み' || 
            r.status === 'キャンセル' ||
            String(r.status || '').includes('欠') ||
            String(r.status || '').includes('休')
          );
        } else {
          // 出欠レコードがない場合、登録利用曜日に入っていなければ「お休み（利用曜日外）」判定
          if (scheduleDays.length > 0 && !isScheduledToday) {
            isAbsent = true;
          }
        }

        const curB = (r && r.bento !== undefined && r.bento !== null && r.bento !== '') ? String(r.bento).trim() : (u.bento ? String(u.bento).trim() : '');
        const curMeal = (r && r.meal !== undefined && r.meal !== null) ? r.meal : u.meal;

        // お弁当が必要（wantsBento = true）かの判定：
        let wantsBento = false;
        if (!isAbsent) {
          if (curB === 'あり' || curB === '必要' || curB === 'true' || curB === '1' || curMeal === true || curMeal === 'あり' || curMeal === '必要') {
            wantsBento = true;
          }
        }

        const noteText = (r && r.notes) ? r.notes : (u.note || u.特記事項 || '');
        let fullNote = '';
        if (isAbsent) {
          if (!r && scheduleDays.length > 0 && !isScheduledToday) {
            fullNote = noteText ? `【利用曜日外】${noteText}` : '【利用曜日外(本日お休み)】';
          } else {
            fullNote = noteText ? `【本日お休み】${noteText}` : '【本日お休み】';
          }
        } else {
          fullNote = wantsBento ? noteText : (noteText ? `【お弁当不要】${noteText}` : '【お弁当不要】');
        }

        // 既存の選択中のお弁当IDを保護・マージ
        const existingUser = porteUsers.find(item => String(item.id).trim() === uId || String(item.name).trim() === String(u.name || u.氏名).trim());
        const savedBentoId = existingUser ? (existingUser.selectedBentoId || '') : '';

        loadedUsers.push({
          id: u.id || `P${idx+1}`,
          name: u.name || u.氏名 || '利用者',
          kana: u.kana || u.フリガナ || '',
          type: u.type || u.区分 || '通所',
          note: fullNote,
          status: r ? (r.status || '出席') : (isAbsent ? '利用曜日外' : '出席'),
          wantsBento: wantsBento,
          selectedBentoId: savedBentoId
        });
      });
    }

    // スタッフの統合（退職済スタッフを除外し在職者のみ追加）
    if (staffRes && staffRes.data && staffRes.data.length > 0) {
      staffRes.data.forEach((s, idx) => {
        // 退職・離職・非表示スタッフは除外
        const isStaffResigned = (
          s.userStatus === '退職' || s.userStatus === '退職済' || s.userStatus === '利用終了' || s.userStatus === '退所' ||
          s.status === '退職' || s.status === '退職済' || s.status === '離職' || s.status === '無効' || s.status === '非表示' ||
          (s.startDate && s.startDate > todayStr) ||
          (s.endDate && s.endDate <= todayStr)
        );
        if (isStaffResigned) return;

        const sId = String(s.id || '').trim();
        const sName = String(s.name || s.氏名 || '').trim();
        const r = staffAttMap[sId] || staffAttMap[sName];

        const curB = (r && r.bento !== undefined && r.bento !== null && r.bento !== '') ? String(r.bento).trim() : (s.bento ? String(s.bento).trim() : '');
        let wantsBento = false;
        if (curB === 'あり' || curB === '必要' || curB === 'true' || curB === '1') {
          wantsBento = true;
        }

        const existingUser = porteUsers.find(item => String(item.id).trim() === sId || String(item.name).trim() === (`👔 ${sName}`));
        const savedBentoId = existingUser ? (existingUser.selectedBentoId || '') : '';

        loadedUsers.push({
          id: sId || `ST${idx+1}`,
          name: `👔 ${sName}`,
          kana: s.kana || s.furigana || '',
          type: '👔 スタッフ',
          note: wantsBento ? '【スタッフ用お弁当】' : '【お弁当不要】',
          status: r ? '出勤' : '未出勤',
          wantsBento: wantsBento,
          selectedBentoId: savedBentoId
        });
      });
    }

    if (loadedUsers.length > 0) {
      porteUsers = loadedUsers;
    } else {
      showToast('⚠️ テーブル内にデータが見つかりませんでした。', 'warning');
      return;
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

  const staffSpecialBtn = document.getElementById('staffSpecialMenuBtn');
  if (staffSpecialBtn) staffSpecialBtn.addEventListener('click', openStaffAllMenuModalAdmin);

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

// 5品カスタム手動選択モーダル機能
let tempPickFiveIds = [];

window.openPickFiveModal = function() {
  // 在庫がある商品のみを優先取得して初期選択セット
  const inStockIds = todaysMenuIds.filter(id => {
    const b = bentoMaster.find(item => item.id === id);
    return b && b.stock > 0;
  });

  const availableInStock = bentoMaster.filter(b => b.stock > 0);
  availableInStock.forEach(b => {
    if (inStockIds.length < 5 && !inStockIds.includes(b.id)) {
      inStockIds.push(b.id);
    }
  });

  tempPickFiveIds = [...inStockIds];
  renderPickFiveGrid();
  const modal = document.getElementById('pickFiveModal');
  if (modal) modal.classList.add('active');
};

window.closePickFiveModal = function() {
  const modal = document.getElementById('pickFiveModal');
  if (modal) modal.classList.remove('active');
};

window.renderPickFiveGrid = function() {
  const countEl = document.getElementById('selectedFiveCount');
  if (countEl) countEl.textContent = tempPickFiveIds.length;

  const container = document.getElementById('pickFiveItemsList');
  if (!container) return;
  container.innerHTML = '';

  // 在庫がある商品を最優先して上にソート表示
  const sortedMaster = [...bentoMaster].sort((a, b) => {
    if (a.stock > 0 && b.stock <= 0) return -1;
    if (a.stock <= 0 && b.stock > 0) return 1;
    return 0;
  });

  sortedMaster.forEach(item => {
    ensureBentoLots(item);
    const isSelected = tempPickFiveIds.includes(item.id);
    const isSoldOut = item.stock <= 0;
    const earliestExp = getBentoEarliestExpDate(item);
    const expText = earliestExp !== '9999-12-31' ? earliestExp : '未設定';

    const card = document.createElement('div');
    card.className = `pick-five-item-card ${isSelected ? 'selected' : ''} ${isSoldOut ? 'disabled-card' : ''}`;
    card.style.cssText = `
      border: 2px solid ${isSoldOut ? '#e9ecef' : (isSelected ? '#ff7e67' : '#e9ecef')};
      background: ${isSoldOut ? '#f8f9fa' : (isSelected ? '#fff5eb' : '#ffffff')};
      border-radius: 14px;
      padding: 12px 14px;
      cursor: ${isSoldOut ? 'not-allowed' : 'pointer'};
      opacity: ${isSoldOut ? 0.45 : 1};
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all 0.2s ease;
      box-shadow: ${isSelected && !isSoldOut ? '0 4px 12px rgba(255, 126, 103, 0.18)' : 'none'};
    `;

    if (isSoldOut) {
      card.onclick = () => showToast(`⚠️ 『${item.name}』は在庫切れ（0食）のため選択できません。`, 'warning');
    } else {
      card.onclick = () => togglePickFiveItem(item.id);
    }

    card.innerHTML = `
      <div style="display:flex; align-items:center; gap:10px;">
        <span style="font-size:1.6rem; opacity:${isSoldOut ? 0.5 : 1};">${item.icon || '🍱'}</span>
        <div>
          <div style="font-weight:800; font-size:0.95rem; color:${isSoldOut ? '#868e96' : '#212529'};">${item.name}</div>
          <div style="font-size:0.78rem; color:#747d8c; margin-top:2px;">
            <span class="cat-pill" style="font-size:0.7rem; padding:1px 6px;">${item.category}</span>
            <span style="margin-left:6px;">在庫: <strong style="color:${isSoldOut ? '#e03131' : '#d9480f'};">${item.stock}食</strong></span>
            ${isSoldOut ? '<span style="color:#e03131; font-weight:800; font-size:0.75rem; background:#ffe3e3; padding:2px 6px; border-radius:6px; margin-left:6px;">在庫切れ(選択不可)</span>' : `<span style="margin-left:6px;">賞味期限: 📅 ${expText}</span>`}
          </div>
        </div>
      </div>
      <div>
        <input type="checkbox" ${isSelected ? 'checked' : ''} ${isSoldOut ? 'disabled' : ''} style="width:20px; height:20px; accent-color:#ff7e67; pointer-events:none;">
      </div>
    `;

    container.appendChild(card);
  });
};

window.togglePickFiveItem = function(bentoId) {
  const item = bentoMaster.find(b => b.id === bentoId);
  if (item && item.stock <= 0) {
    showToast(`⚠️ 『${item.name}』は在庫切れ（0食）のため選択できません。在庫があるお弁当をお選びください。`, 'warning');
    return;
  }

  const index = tempPickFiveIds.indexOf(bentoId);
  if (index >= 0) {
    tempPickFiveIds.splice(index, 1);
  } else {
    if (tempPickFiveIds.length >= 5) {
      showToast('⚠️ 本日のメニューは5品までしか選べません。先に別の商品の選択を解除してください。', 'warning');
      return;
    }
    tempPickFiveIds.push(bentoId);
  }
  renderPickFiveGrid();
};

window.savePickFiveSelection = function() {
  const soldOutSelected = tempPickFiveIds.map(id => bentoMaster.find(b => b.id === id)).filter(b => !b || b.stock <= 0);
  if (soldOutSelected.length > 0) {
    showToast(`⚠️ 在庫切れのお弁当（『${soldOutSelected[0].name}』等）が含まれています。在庫があるお弁当（1食以上）のみ選択してください。`, 'warning');
    return;
  }

  if (tempPickFiveIds.length !== 5) {
    showToast(`⚠️ 本日のメニューはちょうど5品選んでください（現在: ${tempPickFiveIds.length}品選択中）`, 'warning');
    return;
  }

  todaysMenuIds = [...tempPickFiveIds];
  saveTodaysMenu();
  closePickFiveModal();
  renderAll();
  showToast('✨ 在庫があるお弁当5品を本日のメニューに設定しました！', 'success');
};

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
  if (csvInput) csvInput.addEventListener('change', handlePorteCsvUpload);

  const dropZone = document.getElementById('csvDropZone');
  if (dropZone) {
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
  }

function copyCateringOrderTally() {
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
    showToast('コピーする発注内容がありません', 'info');
    return;
  }

  let text = `【本日(${getTodayKey()})のお弁当発注集計】\n`;
  let total = 0;
  keys.forEach(k => {
    text += `・${k}: ${tally[k]}食\n`;
    total += tally[k];
  });
  text += `合計: ${total}食`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('📋 発注リストをクリップボードにコピーしました！', 'success');
    }).catch(() => {
      showToast('コピーに失敗しました', 'warning');
    });
  } else {
    showToast(text, 'info');
  }
}

function exportHistoryCsv() {
  if (!orderHistory || orderHistory.length === 0) {
    showToast('出力する注文履歴データがありません', 'info');
    return;
  }
  let csv = '日時,利用者名,注文お弁当,カテゴリ\n';
  orderHistory.forEach(ord => {
    csv += `"${ord.date}","${ord.userName}","${ord.bentoName}","${ord.category}"\n`;
  });
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bento_orders_${getTodayKey()}.csv`;
  a.click();
  showToast('📥 注文履歴CSVを出力しました', 'success');
}

function handlePorteCsvUpload(e) {
  if (e.target.files && e.target.files.length > 0) {
    parsePorteCsvFile(e.target.files[0]);
  }
}

function parsePorteCsvFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    showToast('CSVファイルを読み込みました', 'success');
  };
  reader.readAsText(file);
}

  const copySummaryBtn = document.getElementById('copyOrderSummaryBtn');
  if (copySummaryBtn) copySummaryBtn.addEventListener('click', copyCateringOrderTally);

  const clearTodayBtn = document.getElementById('clearTodayOrdersBtn');
  if (clearTodayBtn) {
    clearTodayBtn.addEventListener('click', () => {
      if (confirm('本日の注文履歴をクリアしますか？')) {
        orderHistory = [];
        saveOrderHistory();
        renderAll();
        showToast('履歴をクリアしました', 'info');
      }
    });
  }

  const exportCsvBtn = document.getElementById('exportHistoryCsvBtn');
  if (exportCsvBtn) exportCsvBtn.addEventListener('click', exportHistoryCsv);

  const searchInput = document.getElementById('masterSearchInput');
  if (searchInput) {
    ['input', 'keyup', 'change', 'search', 'compositionend', 'compositionupdate'].forEach(evtType => {
      searchInput.addEventListener(evtType, () => {
        renderMasterSection();
      });
    });
  }

  const categoryPillsContainer = document.getElementById('categoryFilterPills');
  if (categoryPillsContainer) {
    categoryPillsContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.pill-btn');
      if (btn) {
        const catKey = btn.getAttribute('data-category');
        if (catKey) {
          currentCategoryFilter = catKey;
          renderMasterSection();
        }
      }
    });
  }

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
        
        // 入荷によって在庫が復活した場合、本日の5品に未登録であれば自動追加・復元
        if (!todaysMenuIds.includes(item.id)) {
          if (todaysMenuIds.length < 5) {
            todaysMenuIds.push(item.id);
          } else {
            const zeroStockIdx = todaysMenuIds.findIndex(id => {
              const b = bentoMaster.find(x => x.id === id);
              return !b || b.stock <= 0;
            });
            if (zeroStockIdx >= 0) {
              todaysMenuIds[zeroStockIdx] = item.id;
            }
          }
          saveTodaysMenu();
        }

        saveMaster();
        renderAll();
        closeAddLotModal();
        showToast(`🚚 『${item.name}』に ${expDate} 期限 ${qty}食 の新規入荷分を追加・保存しました！`, 'success');
      }
    });
  }

  // 暗転背景タップ時およびEscapeキー押下でモーダルを閉じる共通安全ガード
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
    }
  });
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

window.closeEditBentoModal = function() {
  const modal = document.getElementById('bentoEditModal');
  if (modal) modal.classList.remove('active');
};

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
