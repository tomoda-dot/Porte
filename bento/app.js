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

// DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initDate();
  loadData();
  setupTabs();
  setupEventListeners();
  renderAll();
  
  if (porteUsers.length === 0) {
    loadSamplePorteData(false);
  }
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

  // 初期ロード時、注文中の品目は保持しつつ完売品目を自動置換
  autoReplaceSoldOutMenu();
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

// 本日の5品の中で「完売（在庫0）」になっているお弁当があれば、マスターの「在庫あり商品」と自動差し替え（※選択中のお弁当は保護）
function autoReplaceSoldOutMenu() {
  if (!bentoMaster || bentoMaster.length === 0 || !todaysMenuIds) return;

  const inStockMaster = bentoMaster.filter(b => b.stock > 0);
  if (inStockMaster.length === 0) return;

  let changed = false;

  // 既に誰かが選択中のお弁当IDリスト
  const currentlyOrderedIds = porteUsers.map(u => u.selectedBentoId).filter(Boolean);

  for (let i = 0; i < todaysMenuIds.length; i++) {
    const currentId = todaysMenuIds[i];
    const bento = bentoMaster.find(b => b.id === currentId);
    
    // 誰も選択しておらず、かつ在庫0または無効な商品のみ置換
    const isOrderedBySomeone = currentlyOrderedIds.includes(currentId);

    if (!isOrderedBySomeone && (!bento || bento.stock <= 0)) {
      const unusedInStock = inStockMaster.find(b => !todaysMenuIds.includes(b.id));
      if (unusedInStock) {
        todaysMenuIds[i] = unusedInStock.id;
        changed = true;
      }
    }
  }

  if (changed) {
    saveTodaysMenu();
  }
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

// 1. 本日の5品 メニュー表示
function renderTodaysMenu() {
  autoReplaceSoldOutMenu();

  const grid = document.getElementById('todaysMenuGrid');
  grid.innerHTML = '';

  const items = todaysMenuIds.map(id => bentoMaster.find(b => b.id === id)).filter(Boolean);

  items.forEach((item, index) => {
    const isSoldOut = item.stock <= 0;
    const stockPercent = Math.min(100, Math.max(0, (item.stock / 15) * 100));

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
      <p style="font-size:0.8rem; color:#747d8c; margin-bottom:6px;">${item.desc || ''}</p>
      
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

      // 本日の5品に加えて、そのご利用者様が選択中のお弁当もドロップダウン選択肢に必ず含める
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
    if (oldBento) oldBento.stock += 1;
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
      newBento.stock -= 1;
      user.wantsBento = true;

      // 新しく選択したお弁当が本日の5品に含まれていなければ、自動で本日の5品に追加
      if (!todaysMenuIds.includes(newBento.id)) {
        // 未使用のワクと置換
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

// 商品マスター画面での直接在庫変更 (+ / - ボタン)
window.adjustMasterStock = function(bentoId, delta) {
  const item = bentoMaster.find(b => b.id === bentoId);
  if (item) {
    item.stock = Math.max(0, item.stock + delta);
    saveMaster();
    renderAll();
  }
};

// 商品マスター画面での直接在庫変更 (数値入力)
window.setMasterStockDirect = function(bentoId, val) {
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

// 4. 商品マスター＆全在庫管理レンダー
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
          <span style="font-size:0.75rem; color:#747d8c;">${item.category}</span>
        </div>
      </div>
      <p style="font-size:0.8rem; color:#495057; margin-bottom:8px;">${item.desc || '説明なし'}</p>
      
      <div class="master-stock-panel">
        <span class="master-stock-label">📦 現在の在庫:</span>
        <div class="stock-control">
          <button class="btn-qty" onclick="adjustMasterStock('${item.id}', -1)">-</button>
          <input type="number" class="stock-val-input" value="${item.stock}" min="0" onchange="setMasterStockDirect('${item.id}', this.value)">
          <button class="btn-qty" onclick="adjustMasterStock('${item.id}', 1)">+</button>
          <span style="font-size:0.85rem; font-weight:800; color:#495057;">食</span>
        </div>
      </div>

      <div class="master-actions">
        <button class="btn btn-sm btn-outline" style="width:100%; font-weight:700;" onclick="openEditBentoModal('${item.id}')">✏️ 編集</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function updateHeaderStats() {
  const bentoUsers = porteUsers.filter(u => u.wantsBento !== false);
  const totalUsers = bentoUsers.length;
  const orderedUsers = bentoUsers.filter(u => u.selectedBentoId).length;

  document.getElementById('headerUserCount').textContent = `${totalUsers}名 (全${porteUsers.length}名)`;
  document.getElementById('headerOrderedCount').textContent = `${orderedUsers}食`;
}

// Porte Supabase DB から直接本日利用者＆本日の出欠（お弁当要不要）を自動取得
async function fetchPorteDbAttendance() {
  if (typeof supabase === 'undefined' || typeof SUPABASE_URL === 'undefined') {
    showToast('Supabase設定が見つかりません。サンプルデータをロードします。', 'info');
    loadSamplePorteData(true);
    return;
  }

  showToast('⚡ Porteデータベースから最新利用者を読み込み中...', 'info');

  try {
    const SB = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    
    // 本日の日付 (YYYY-MM-DD)
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    // 利用者テーブルと本日の出欠テーブルを並行取得
    const [userRes, attRes] = await Promise.all([
      SB.from('利用者').select('*'),
      SB.from('出欠').select('*').eq('date', todayStr)
    ]);

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
        
        // Porteダッシュボードと100%同一の判定ロジック
        const curB = (r && r.bento !== undefined && r.bento !== null && r.bento !== '') ? r.bento : u.bento;
        const curMeal = (r && r.meal !== undefined && r.meal !== null) ? r.meal : u.meal;

        const wantsBento = (curB === 'あり' || curMeal === true);

        return {
          id: u.id || `P${idx+1}`,
          name: u.name || u.氏名 || '利用者',
          kana: u.kana || u.フリガナ || '',
          type: u.type || u.区分 || '通所',
          note: u.note || u.特記事項 || (r ? r.notes : ''),
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
        loadSamplePorteData(true);
        return;
      }
    }

    savePorteUsers();
    const bentoCount = porteUsers.filter(u => u.wantsBento).length;
    showToast(`⚡ Porte DBから${porteUsers.length}名の利用者データを読み込みました！（お弁当対象: ${bentoCount}名）`, 'success');
    renderAll();
  } catch (err) {
    console.warn('Porte DB read error:', err);
    loadSamplePorteData(true);
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
        bentoMaster.forEach(item => { item.stock = 10; });
        saveMaster();
        renderAll();
        showToast('📦 全商品の在庫を一律10食に更新しました！', 'success');
      }
    });
  }

  document.getElementById('fetchPorteDbBtn').addEventListener('click', fetchPorteDbAttendance);

  document.getElementById('userSelectModalSearch').addEventListener('input', (e) => {
    renderUserPickerList(e.target.value);
  });

  document.getElementById('closeUserSelectForBentoModal').addEventListener('click', closeUserSelectForBentoModal);
  document.getElementById('cancelUserSelectForBentoBtn').addEventListener('click', closeUserSelectForBentoModal);

  // 在庫がある商品（stock > 0）を最優先でランダム5品選出
  document.getElementById('randomSelectBtn').addEventListener('click', () => {
    const cards = document.querySelectorAll('.bento-card');
    cards.forEach(c => c.classList.add('shuffling'));

    setTimeout(() => {
      const available = bentoMaster.filter(b => b.stock > 0);
      let chosenIds = [];

      if (available.length >= 5) {
        chosenIds = [...available].sort(() => 0.5 - Math.random()).slice(0, 5).map(b => b.id);
      } else if (available.length > 0) {
        const chosenAvailable = [...available].sort(() => 0.5 - Math.random());
        const remainingMaster = bentoMaster.filter(b => !chosenAvailable.some(a => a.id === b.id));
        const chosenRemaining = [...remainingMaster].sort(() => 0.5 - Math.random()).slice(0, 5 - available.length);
        chosenIds = [...chosenAvailable, ...chosenRemaining].map(b => b.id);
      } else {
        chosenIds = [...bentoMaster].sort(() => 0.5 - Math.random()).slice(0, 5).map(b => b.id);
      }

      todaysMenuIds = chosenIds;
      saveTodaysMenu();
      renderAll();

      if (available.length >= 5) {
        showToast('✨ 在庫がある30品目の中から本日の5品を選出しました！', 'success');
      } else if (available.length > 0) {
        showToast(`⚠️ 在庫あり商品(${available.length}品)を優先選出しました。一部完売商品が含まれます。`, 'info');
      } else {
        showToast('⚠️ 全商品の在庫が0食です。商品マスター画面で在庫を補充してください。', 'warning');
      }
    }, 400);
  });

  const autoStockPickBtn = document.getElementById('autoStockPickBtn');
  if (autoStockPickBtn) {
    autoStockPickBtn.addEventListener('click', () => {
      const available = bentoMaster.filter(b => b.stock > 0);
      if (available.length === 0) {
        showToast('⚠️ 在庫がある商品がありません。商品マスターで在庫を補充してください。', 'warning');
        return;
      }
      autoReplaceSoldOutMenu();
      renderAll();
      showToast('🔄 完売品を在庫がある商品と自動で差し替えました！', 'success');
    });
  }

  document.getElementById('customPickBtn').addEventListener('click', openPickFiveModal);
  document.getElementById('closePickFiveModal').addEventListener('click', closePickFiveModal);
  document.getElementById('cancelPickFiveBtn').addEventListener('click', closePickFiveModal);
  document.getElementById('savePickFiveBtn').addEventListener('click', savePickFiveSelection);

  document.getElementById('loadSamplePorteBtn').addEventListener('click', () => loadSamplePorteData(true));

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
}

function loadSamplePorteData(showNotification = true) {
  porteUsers = [
    { id: 'P001', name: '岡村 芽衣', kana: 'オカムラ メイ', type: '通所A', note: 'アレルギーなし', wantsBento: true, selectedBentoId: '' },
    { id: 'P002', name: '高島 直樹', kana: 'タカシマ ナオキ', type: '通所A', note: '持参弁当', wantsBento: false, selectedBentoId: '' },
    { id: 'P003', name: '佐藤 花子', kana: 'サトウ ハナコ', type: '通所A', note: '減塩希望', wantsBento: true, selectedBentoId: '' },
    { id: 'P004', name: '鈴木 一郎', kana: 'スズキ イチロウ', type: '通所B', note: '一口大カット', wantsBento: true, selectedBentoId: '' },
    { id: 'P005', name: '高橋 恵子', kana: 'タカハシ ケイコ', type: '通所A', note: '', wantsBento: true, selectedBentoId: '' },
    { id: 'P006', name: '田中 健二', kana: 'タナカ ケンジ', type: '通所A', note: '', wantsBento: true, selectedBentoId: '' }
  ];
  savePorteUsers();
  if (showNotification) {
    showToast('📂 ポルテのサンプル利用者データ（岡村様:お弁当要, 高島様:持参/なし）をセットしました！', 'success');
  }
  renderAll();
}

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

      if (i === 0 && (cols[0].includes('ID') || cols[0].includes('利用者'))) continue;

      if (cols.length >= 2) {
        const noteStr = (cols[5] || cols[4] || '').toString();
        const noBento = noteStr.includes('持参') || noteStr.includes('なし') || noteStr.includes('不要');

        parsed.push({
          id: cols[0] || `P${parsed.length + 1}`,
          name: cols[1] || '名前未設定',
          kana: cols[2] || '',
          type: cols[3] || '通所',
          note: noteStr,
          wantsBento: !noBento,
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

function openPickFiveModal() {
  const list = document.getElementById('pickFiveItemsList');
  list.innerHTML = '';

  bentoMaster.forEach(item => {
    const isChecked = todaysMenuIds.includes(item.id);
    const isSoldOut = item.stock <= 0;

    const div = document.createElement('label');
    div.className = 'pick-five-item';
    div.innerHTML = `
      <input type="checkbox" value="${item.id}" ${isChecked ? 'checked' : ''} onchange="updatePickFiveCount()">
      <span>${item.icon}</span>
      <strong>${item.name}</strong>
      ${isSoldOut ? '<span style="color:#ff4757; font-size:0.75rem; margin-left:6px; font-weight:700;">(完売)</span>' : `<span style="color:#2b8a3e; font-size:0.75rem; margin-left:6px;">(残${item.stock}食)</span>`}
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

function openEditBentoModal(id) {
  const modal = document.getElementById('bentoEditModal');
  const title = document.getElementById('bentoModalTitle');
  const deleteBtn = document.getElementById('deleteCurrentBentoBtn');

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

      deleteBtn.style.display = 'inline-flex';
      deleteBtn.onclick = () => deleteBento(item.id);
    }
  } else {
    title.textContent = '新しいお弁当の追加';
    document.getElementById('editBentoId').value = '';
    document.getElementById('bentoForm').reset();
    document.getElementById('bentoStockInput').value = 10;
    document.getElementById('bentoIconInput').value = '🍱';

    deleteBtn.style.display = 'none';
    deleteBtn.onclick = null;
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
