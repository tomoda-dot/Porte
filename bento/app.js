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

// DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initDate();
  loadData();
  setupTabs();
  setupEventListeners();
  renderAll();
});

// 日付表示
function initDate() {
  const now = new Date();
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  const formatted = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日(${days[now.getDay()]})`;
  document.getElementById('currentDateBadge').textContent = formatted;
}

// データ読み込み（LocalStorage or デフォルト）
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
    saveMaster();
  }

  const savedTodays = localStorage.getItem('bento_todays_menu');
  if (savedTodays) {
    try {
      todaysMenuIds = JSON.parse(savedTodays);
    } catch(e) {
      todaysMenuIds = bentoMaster.slice(0, 5).map(b => b.id);
    }
  } else {
    // デフォルトで先頭5品
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
}

function saveMaster() {
  localStorage.setItem('bento_master', JSON.stringify(bentoMaster));
}

function saveTodaysMenu() {
  localStorage.setItem('bento_todays_menu', JSON.stringify(todaysMenuIds));
}

function savePorteUsers() {
  localStorage.setItem('bento_porte_users', JSON.stringify(porteUsers));
}

function saveOrderHistory() {
  localStorage.setItem('bento_order_history', JSON.stringify(orderHistory));
}

// タブ切り替え
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

// 全再描画
function renderAll() {
  renderTodaysMenu();
  renderPorteSection();
  renderStockSection();
  renderMasterSection();
  updateHeaderStats();
}

// 1. 本日の5品 メニュー表示
function renderTodaysMenu() {
  const grid = document.getElementById('todaysMenuGrid');
  grid.innerHTML = '';

  const items = todaysMenuIds.map(id => bentoMaster.find(b => b.id === id)).filter(Boolean);

  items.forEach((item, index) => {
    const isSoldOut = item.stock <= 0;
    const stockPercent = Math.min(100, Math.max(0, (item.stock / 15) * 100));

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

// クイック注文（メニュー表から直接選択）
window.quickOrderBento = function(bentoId) {
  const item = bentoMaster.find(b => b.id === bentoId);
  if (!item || item.stock <= 0) {
    showToast('在庫がありません', 'info');
    return;
  }

  // 在庫減算
  item.stock -= 1;
  saveMaster();

  // 履歴追加
  const newOrder = {
    id: 'ord_' + Date.now(),
    date: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
    userName: '一般選択・ゲスト',
    bentoId: item.id,
    bentoName: item.name,
    category: item.category
  };
  orderHistory.unshift(newOrder);
  saveOrderHistory();

  showToast(`『${item.name}』の受付を完了しました！`, 'success');
  renderAll();
};

// 2. ポルテデータ＆注文受付レンダー
function renderPorteSection() {
  const total = porteUsers.length;
  const ordered = porteUsers.filter(u => u.selectedBentoId).length;
  const pending = total - ordered;

  document.getElementById('summaryTotalUsers').textContent = total;
  document.getElementById('summaryOrderedUsers').textContent = ordered;
  document.getElementById('summaryPendingUsers').textContent = pending;

  document.getElementById('porteTabBadge').textContent = `未受付 ${pending}`;

  // テーブル
  const tbody = document.getElementById('porteUserTableBody');
  tbody.innerHTML = '';

  if (porteUsers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px; color:#747d8c;">ポルテのCSVファイルを読み込むか、右上からサンプルデータをロードしてください。</td></tr>`;
  } else {
    const todaysBentoList = todaysMenuIds.map(id => bentoMaster.find(b => b.id === id)).filter(Boolean);

    porteUsers.forEach((u, idx) => {
      const isDone = !!u.selectedBentoId;
      const tr = document.createElement('tr');

      let optionsHtml = `<option value="">-- お弁当を選択してください --</option>`;
      todaysBentoList.forEach(b => {
        const isSoldOut = b.stock <= 0 && u.selectedBentoId !== b.id;
        optionsHtml += `<option value="${b.id}" ${u.selectedBentoId === b.id ? 'selected' : ''} ${isSoldOut ? 'disabled' : ''}>
          ${b.icon} ${b.name} (残${b.stock})
        </option>`;
      });

      tr.innerHTML = `
        <td><strong>${u.id}</strong></td>
        <td><strong>${u.name}</strong> <span style="font-size:0.75rem; color:#868e96;">(${u.kana || ''})</span></td>
        <td>${u.type || '通所'}</td>
        <td><span style="color:#e64980; font-size:0.85rem; font-weight:700;">${u.note || '-'}</span></td>
        <td>
          <select class="bento-select-dropdown" onchange="assignUserBento(${idx}, this.value)">
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

  // 集計表の更新
  renderCateringOrderTally();
}

// ポルテユーザーへの弁当割り当て
window.assignUserBento = function(userIndex, newBentoId) {
  const user = porteUsers[userIndex];
  const oldBentoId = user.selectedBentoId;

  if (oldBentoId === newBentoId) return;

  // 旧弁当の在庫戻し
  if (oldBentoId) {
    const oldBento = bentoMaster.find(b => b.id === oldBentoId);
    if (oldBento) oldBento.stock += 1;
  }

  // 新弁当の在庫減算
  if (newBentoId) {
    const newBento = bentoMaster.find(b => b.id === newBentoId);
    if (newBento) {
      if (newBento.stock <= 0) {
        showToast('売り切れのため選択できません', 'info');
        user.selectedBentoId = '';
        renderAll();
        return;
      }
      newBento.stock -= 1;

      // 履歴登録
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

// お弁当集計
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

  // 合計行
  const totalEl = document.createElement('div');
  totalEl.style.cssText = 'display:flex; justify-space-between; font-weight:800; font-size:1.1rem; margin-top:10px; padding-top:10px; border-top:2px solid #ffd8a8; color:#d9480f;';
  totalEl.innerHTML = `<span>発注合計</span><span>${totalCount} 食</span>`;
  container.appendChild(totalEl);
}

// 3. 在庫＆利用履歴レンダー
function renderStockSection() {
  const quickList = document.getElementById('quickStockAdjustList');
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
        <input type="number" class="stock-val-input" value="${item.stock}" onchange="setStockDirect('${item.id}', this.value)">
        <button class="btn-qty" onclick="adjustStock('${item.id}', 1)">+</button>
      </div>
    `;
    quickList.appendChild(div);
  });

  // 注文履歴テーブル
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
    item.stock = Math.max(0, item.stock + delta);
    saveMaster();
    renderAll();
  }
};

window.setStockDirect = function(bentoId, val) {
  const item = bentoMaster.find(b => b.id === bentoId);
  if (item) {
    item.stock = Math.max(0, parseInt(val, 10) || 0);
    saveMaster();
    renderAll();
  }
};

window.cancelOrderHistory = function(index) {
  const removed = orderHistory.splice(index, 1)[0];
  if (removed) {
    const item = bentoMaster.find(b => b.id === removed.bentoId);
    if (item) item.stock += 1;
  }
  saveMaster();
  saveOrderHistory();
  showToast('注文取消を完了しました', 'info');
  renderAll();
};

// 4. 商品マスター管理レンダー
function renderMasterSection() {
  const grid = document.getElementById('masterItemsGrid');
  grid.innerHTML = '';

  const searchVal = (document.getElementById('masterSearchInput').value || '').toLowerCase();

  const filtered = bentoMaster.filter(item => {
    const matchCat = currentCategoryFilter === 'ALL' || item.category === currentCategoryFilter;
    const matchSearch = item.name.toLowerCase().includes(searchVal);
    return matchCat && matchSearch;
  });

  document.getElementById('masterTotalCount').textContent = bentoMaster.length;
  document.getElementById('masterCountBadge').textContent = `${bentoMaster.length}品目`;

  filtered.forEach(item => {
    const isToday = todaysMenuIds.includes(item.id);

    const card = document.createElement('div');
    card.className = 'master-card';
    card.innerHTML = `
      ${isToday ? '<span class="badge-status done" style="position:absolute; top:12px; right:12px;">本日5品表示中</span>' : ''}
      <div class="master-card-header">
        <div class="master-icon">${item.icon}</div>
        <div>
          <h4 class="master-title">${item.name}</h4>
          <span style="font-size:0.75rem; color:#747d8c;">${item.category} | 初期在庫: ${item.stock}食</span>
        </div>
      </div>
      <p style="font-size:0.8rem; color:#495057; margin-bottom:12px;">${item.desc || '説明なし'}</p>
      
      <div class="master-actions">
        <button class="btn btn-sm btn-outline" onclick="openEditBentoModal('${item.id}')">編集</button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteBento('${item.id}')">削除</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ヘッダーステータス更新
function updateHeaderStats() {
  const totalUsers = porteUsers.length;
  const orderedUsers = porteUsers.filter(u => u.selectedBentoId).length;

  document.getElementById('headerUserCount').textContent = `${totalUsers}名`;
  document.getElementById('headerOrderedCount').textContent = `${orderedUsers}食`;
}

// 事件処理（イベントリスナー登録）
function setupEventListeners() {
  // 5品ランダム選出
  document.getElementById('randomSelectBtn').addEventListener('click', () => {
    const cards = document.querySelectorAll('.bento-card');
    cards.forEach(c => c.classList.add('shuffling'));

    setTimeout(() => {
      // 30品目からランダムで5つ選出
      const shuffled = [...bentoMaster].sort(() => 0.5 - Math.random());
      todaysMenuIds = shuffled.slice(0, 5).map(b => b.id);
      saveTodaysMenu();
      renderAll();
      showToast('✨ 本日の5品をランダムに選出しました！', 'success');
    }, 400);
  });

  // 手動選出モーダル
  document.getElementById('customPickBtn').addEventListener('click', openPickFiveModal);
  document.getElementById('closePickFiveModal').addEventListener('click', closePickFiveModal);
  document.getElementById('cancelPickFiveBtn').addEventListener('click', closePickFiveModal);
  document.getElementById('savePickFiveBtn').addEventListener('click', savePickFiveSelection);

  // ポルテサンプル読込
  document.getElementById('loadSamplePorteBtn').addEventListener('click', loadSamplePorteData);

  // ポルテCSVインポート
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

  // 発注コピー
  document.getElementById('copyOrderSummaryBtn').addEventListener('click', copyCateringOrderTally);

  // 履歴クリア
  document.getElementById('clearTodayOrdersBtn').addEventListener('click', () => {
    if (confirm('本日の注文履歴をクリアしますか？')) {
      orderHistory = [];
      saveOrderHistory();
      renderAll();
      showToast('履歴をクリアしました', 'info');
    }
  });

  // 履歴CSVダウンロード
  document.getElementById('exportHistoryCsvBtn').addEventListener('click', exportHistoryCsv);

  // マスター管理フィルター＆検索
  document.getElementById('masterSearchInput').addEventListener('input', renderMasterSection);
  document.querySelectorAll('#categoryFilterPills .pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#categoryFilterPills .pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategoryFilter = btn.getAttribute('data-category');
      renderMasterSection();
    });
  });

  // マスター追加/リセット
  document.getElementById('addNewBentoBtn').addEventListener('click', () => openEditBentoModal(null));
  document.getElementById('resetMasterBtn').addEventListener('click', () => {
    if (confirm('商品マスターを初期30品目にリセットしますか？')) {
      bentoMaster = JSON.parse(JSON.stringify(DEFAULT_30_BENTO));
      todaysMenuIds = bentoMaster.slice(0, 5).map(b => b.id);
      saveMaster();
      saveTodaysMenu();
      renderAll();
      showToast('30品目のデフォルトデータにリセットしました', 'success');
    }
  });

  // お弁当編集モーダル
  document.getElementById('closeBentoEditModal').addEventListener('click', closeEditBentoModal);
  document.getElementById('cancelBentoEditBtn').addEventListener('click', closeEditBentoModal);
  document.getElementById('bentoForm').addEventListener('submit', handleSaveBentoForm);
}

// サンプルポルテデータ読み込み
function loadSamplePorteData() {
  porteUsers = [
    { id: 'P001', name: '山田 太郎', kana: 'ヤマダ タロウ', type: '通所A', note: 'アレルギーなし', selectedBentoId: '' },
    { id: 'P002', name: '佐藤 花子', kana: 'サトウ ハナコ', type: '通所A', note: '減塩希望', selectedBentoId: '' },
    { id: 'P003', name: '鈴木 一郎', kana: 'スズキ イチロウ', type: '通所B', note: '一口大カット', selectedBentoId: '' },
    { id: 'P004', name: '高橋 恵子', kana: 'タカハシ ケイコ', type: '通所A', note: '', selectedBentoId: '' },
    { id: 'P005', name: '田中 健二', kana: 'タナカ ケンジ', type: '通所A', note: '', selectedBentoId: '' },
    { id: 'P006', name: '伊藤 美咲', kana: 'イトウ ミサキ', type: '通所B', note: 'アレルギー：エビ', selectedBentoId: '' },
    { id: 'P007', name: '渡辺 誠', kana: 'ワタナベ マコト', type: '通所A', note: '', selectedBentoId: '' },
    { id: 'P008', name: '小林 さゆり', kana: 'コバヤシ サユリ', type: '通所A', note: '', selectedBentoId: '' },
    { id: 'P009', name: '加藤 隆', kana: 'カトウ タカシ', type: '通所B', note: '', selectedBentoId: '' },
    { id: 'P010', name: '吉田 由美', kana: 'ヨシダ ユミ', type: '通所A', note: '一口大カット', selectedBentoId: '' }
  ];
  savePorteUsers();
  showToast('📂 ポルテのサンプル利用者データ（10名）をセットしました！', 'success');
  renderAll();
}

// ポルテCSVインポート処理
function handlePorteCsvUpload(e) {
  if (e.target.files.length > 0) {
    parsePorteCsvFile(e.target.files[0]);
  }
}

function parsePorteCsvFile(file) {
  const reader = new FileReader();
  reader.onload = function(evt) {
    const text = evt.target.result;
    const lines = text.split(/\r\n|\n/);
    const parsed = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const cols = line.split(',');

      // ヘッダー行スキップ判定
      if (i === 0 && (cols[0].includes('ID') || cols[0].includes('利用者'))) continue;

      if (cols.length >= 2) {
        parsed.push({
          id: cols[0] || `P${parsed.length + 1}`,
          name: cols[1] || '名前未設定',
          kana: cols[2] || '',
          type: cols[3] || '通所',
          note: cols[5] || cols[4] || '',
          selectedBentoId: ''
        });
      }
    }

    if (parsed.length > 0) {
      porteUsers = parsed;
      savePorteUsers();
      showToast(`📄 ポルテCSVから${parsed.length}名の利用者データを読み込みました！`, 'success');
      renderAll();
    } else {
      showToast('CSVデータを読み込めませんでした。フォーマットをご確認ください。', 'info');
    }
  };
  reader.readAsText(file, 'UTF-8');
}

// 発注リストクリップボードコピー
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
    showToast('コピーする注文データがありません', 'info');
    return;
  }

  let text = `【本日のお弁当発注リスト】\n日付: ${document.getElementById('currentDateBadge').textContent}\n---------------------\n`;
  let total = 0;
  keys.forEach(k => {
    text += `・${k}: ${tally[k]}食\n`;
    total += tally[k];
  });
  text += `---------------------\n合計: ${total}食`;

  navigator.clipboard.writeText(text).then(() => {
    showToast('📋 発注リストをクリップボードにコピーしました！', 'success');
  });
}

// 履歴CSV出力
function exportHistoryCsv() {
  if (orderHistory.length === 0) {
    showToast('出力する注文履歴がありません', 'info');
    return;
  }

  let csv = "\uFEFF日時,利用者名,注文お弁当名,カテゴリー\n";
  orderHistory.forEach(ord => {
    csv += `"${ord.date}","${ord.userName}","${ord.bentoName}","${ord.category}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `bento_orders_${new Date().toISOString().slice(0,10)}.csv`;
  link.click();
  showToast('📥 注文履歴CSVを出力しました', 'success');
}

// 5品手動選出モーダル
function openPickFiveModal() {
  const list = document.getElementById('pickFiveItemsList');
  list.innerHTML = '';

  bentoMaster.forEach(item => {
    const isChecked = todaysMenuIds.includes(item.id);
    const div = document.createElement('label');
    div.className = 'pick-five-item';
    div.innerHTML = `
      <input type="checkbox" value="${item.id}" ${isChecked ? 'checked' : ''} onchange="updatePickFiveCount()">
      <span>${item.icon}</span>
      <strong>${item.name}</strong>
      <span style="font-size:0.8rem; color:#747d8c; margin-left:auto;">${item.category}</span>
    `;
    list.appendChild(div);
  });

  updatePickFiveCount();
  document.getElementById('pickFiveModal').classList.add('active');
}

window.updatePickFiveCount = function() {
  const checked = document.querySelectorAll('#pickFiveItemsList input[type="checkbox"]:checked');
  document.getElementById('selectedFiveCount').textContent = checked.length;
};

function closePickFiveModal() {
  document.getElementById('pickFiveModal').classList.remove('active');
}

function savePickFiveSelection() {
  const checked = Array.from(document.querySelectorAll('#pickFiveItemsList input[type="checkbox"]:checked')).map(c => c.value);
  if (checked.length !== 5) {
    alert('本日のメニューはちょうど5品選択してください。（現在: ' + checked.length + '品）');
    return;
  }

  todaysMenuIds = checked;
  saveTodaysMenu();
  closePickFiveModal();
  renderAll();
  showToast('🍱 本日の5品メニューを手動設定しました！', 'success');
}

// お弁当マスター追加・編集モーダル
function openEditBentoModal(id) {
  const modal = document.getElementById('bentoEditModal');
  const title = document.getElementById('bentoModalTitle');

  if (id) {
    const item = bentoMaster.find(b => b.id === id);
    if (item) {
      title.textContent = 'お弁当の編集';
      document.getElementById('editBentoId').value = item.id;
      document.getElementById('bentoNameInput').value = item.name;
      document.getElementById('bentoCategoryInput').value = item.category;
      document.getElementById('bentoStockInput').value = item.stock;
      document.getElementById('bentoIconInput').value = item.icon || '🍱';
      document.getElementById('bentoDescInput').value = item.desc || '';
    }
  } else {
    title.textContent = '新しいお弁当の追加';
    document.getElementById('editBentoId').value = '';
    document.getElementById('bentoForm').reset();
    document.getElementById('bentoStockInput').value = 10;
    document.getElementById('bentoIconInput').value = '🍱';
  }

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
  const stock = parseInt(document.getElementById('bentoStockInput').value, 10) || 0;
  const icon = document.getElementById('bentoIconInput').value.trim() || '🍱';
  const desc = document.getElementById('bentoDescInput').value.trim();

  if (!name) return;

  if (id) {
    const item = bentoMaster.find(b => b.id === id);
    if (item) {
      item.name = name;
      item.category = category;
      item.stock = stock;
      item.icon = icon;
      item.desc = desc;
    }
  } else {
    const newId = 'b' + (Date.now());
    bentoMaster.push({ id: newId, name, category, stock, icon, desc });
  }

  saveMaster();
  closeEditBentoModal();
  renderAll();
  showToast('お弁当情報を保存しました！', 'success');
}

window.deleteBento = function(id) {
  const item = bentoMaster.find(b => b.id === id);
  if (!item) return;

  if (confirm(`『${item.name}』をマスターから削除してもよろしいですか？`)) {
    bentoMaster = bentoMaster.filter(b => b.id !== id);
    todaysMenuIds = todaysMenuIds.filter(tId => tId !== id);
    if (todaysMenuIds.length < 5 && bentoMaster.length >= 5) {
      // 5品足りない場合は自動補填
      const unused = bentoMaster.find(b => !todaysMenuIds.includes(b.id));
      if (unused) todaysMenuIds.push(unused.id);
    }
    saveMaster();
    saveTodaysMenu();
    renderAll();
    showToast('お弁当を削除しました', 'info');
  }
};

// トースト通知表示
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
