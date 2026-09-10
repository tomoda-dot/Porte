/**
 * PokéTama Story RPG - UI Controller & Renderer
 */

const UIController = {
    currentView: 'prof-intro',

    init() {
        this.renderProfIntro();
        this.renderStarterSelect();
        this.renderAll();
    },

    switchView(viewName) {
        document.querySelectorAll('.view-page').forEach(page => page.classList.remove('active'));
        const targetPage = document.getElementById(`view-${viewName}`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentView = viewName;
        }
        this.renderAll();
    },

    renderProfIntro() {
        const box = document.getElementById('prof-avatar-box');
        if (box) box.innerHTML = renderProfSVG();
    },

    renderStarterSelect() {
        const fireSvg = document.getElementById('svg-starter-fire');
        const waterSvg = document.getElementById('svg-starter-water');
        const grassSvg = document.getElementById('svg-starter-grass');

        if (fireSvg) fireSvg.innerHTML = renderMonsterSVG('fire_1');
        if (waterSvg) waterSvg.innerHTML = renderMonsterSVG('water_1');
        if (grassSvg) grassSvg.innerHTML = renderMonsterSVG('grass_1');
    },

    chooseStarter(speciesId) {
        const starter = gameEngine.createPoketamaInstance(speciesId, 5);
        gameEngine.addPoketamaToParty(starter);
        gameEngine.hasSeenIntro = true;
        gameEngine.saveState();

        alert(`✨ おめでとう！「${starter.name}」が旅の最初のパートナーになりました！`);
        this.switchView('main-dashboard');
    },

    healParty() {
        if (gameEngine.party.length === 0) return;
        gameEngine.party.forEach(p => { p.hp = p.maxHp; });
        gameEngine.saveState();
        alert('💖 ポケタマセンター：旅の仲間たちのHPが全回復しました！');
        this.renderAll();
    },

    renderAll() {
        const dexProgress = gameEngine.getDexProgress();

        const badgeEl = document.getElementById('header-badges-val');
        const dexEl = document.getElementById('header-dex-val');
        const moneyEl = document.getElementById('header-gold-val');

        if (badgeEl) badgeEl.innerText = gameEngine.player.badgeCount || 0;
        if (dexEl) dexEl.innerText = dexProgress.caughtCount;
        if (moneyEl) moneyEl.innerText = gameEngine.player.money;

        // Dashboard lead info
        const leadInfo = document.getElementById('dash-lead-mon-info');
        if (leadInfo && gameEngine.party.length > 0) {
            const lead = gameEngine.party[0];
            leadInfo.innerHTML = `相棒: <strong>${lead.name}</strong> Lv.${lead.level} (HP: ${lead.hp}/${lead.maxHp})`;
        }
    },

    openDexModal() {
        const modal = document.getElementById('modal-dex');
        if (modal) modal.style.display = 'flex';
        this.render100DexGrid();
    },

    closeDexModal() {
        const modal = document.getElementById('modal-dex');
        if (modal) modal.style.display = 'none';
    },

    render100DexGrid() {
        const grid = document.getElementById('dex-grid-100');
        const caughtText = document.getElementById('dex-modal-caught-count');
        if (!grid) return;

        const dexProgress = gameEngine.getDexProgress();
        if (caughtText) caughtText.innerText = dexProgress.caughtCount;

        let html = '';
        ALL_100_POKETAMA_LIST.forEach(mon => {
            const unlocked = !!gameEngine.dex[mon.id];

            html += `
            <div style="background: rgba(255,255,255,0.08); border-radius: 14px; padding: 8px; display: flex; flex-direction: column; align-items: center; gap: 4px; ${!unlocked ? 'opacity: 0.35; filter: grayscale(1);' : ''}">
                <div style="font-size: 9px; color: var(--border-gold); font-weight: 800;">#${String(mon.dexNo).padStart(3, '0')}</div>
                <div style="width: 50px; height: 50px;">${unlocked ? renderMonsterSVG(mon.id) : '❓'}</div>
                <div style="font-size: 11px; font-weight: bold; text-align: center;">${unlocked ? mon.name : '？？？？'}</div>
            </div>`;
        });
        grid.innerHTML = html;
    },

    openPartyModal() {
        const modal = document.getElementById('modal-party');
        if (modal) modal.style.display = 'flex';
        this.renderPartyModalList();
    },

    closePartyModal() {
        const modal = document.getElementById('modal-party');
        if (modal) modal.style.display = 'none';
    },

    renderPartyModalList() {
        const list = document.getElementById('party-modal-list');
        if (!list) return;

        let html = '';
        gameEngine.party.forEach((mon, idx) => {
            html += `
            <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.08); padding: 10px 14px; border-radius: 14px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 44px; height: 44px;">${renderMonsterSVG(mon.speciesId)}</div>
                    <div>
                        <div style="font-weight: 900; font-size: 14px; color: #ffffff;">${mon.name} <small style="color:var(--border-gold);">Lv.${mon.level}</small></div>
                        <div style="font-size: 11px; color: #aaa;">HP: ${mon.hp}/${mon.maxHp} | 属性: ${ELEMENT_TYPES[mon.element]?.name || ''}</div>
                    </div>
                </div>
                ${idx === 0 ? '<span style="font-size: 10px; background: var(--color-primary); padding: 3px 8px; border-radius: 10px; font-weight: bold;">先頭</span>' : ''}
            </div>`;
        });
        list.innerHTML = html;
    },

    openBattleOverlay() {
        const overlay = document.getElementById('view-battle-overlay');
        if (overlay) overlay.classList.add('active');
        this.renderBattleOverlay();
    },

    closeBattleOverlay() {
        const overlay = document.getElementById('view-battle-overlay');
        if (overlay) overlay.classList.remove('active');
        BattleModule.activeBattle = null;
        this.renderAll();
    },

    renderBattleOverlay() {
        const b = BattleModule.activeBattle;
        if (!b) return;

        const titleEl = document.getElementById('battle-title-text');
        const pName = document.getElementById('battle-player-name');
        const pLvl = document.getElementById('battle-player-level');
        const pHpFill = document.getElementById('battle-player-hp-fill');
        const pSvg = document.getElementById('battle-player-svg');

        const eName = document.getElementById('battle-enemy-name');
        const eLvl = document.getElementById('battle-enemy-level');
        const eHpFill = document.getElementById('battle-enemy-hp-fill');
        const eSvg = document.getElementById('battle-enemy-svg');

        const logText = document.getElementById('battle-log-text');

        if (titleEl) titleEl.innerText = b.isGym ? '🏆 ジムリーダー戦' : '⚔️ 野生ポケタマ戦';

        if (pName) pName.innerText = b.playerMon.name;
        if (pLvl) pLvl.innerText = `Lv.${b.playerMon.level}`;
        if (pHpFill) pHpFill.style.width = `${Math.floor((b.playerMon.hp / b.playerMon.maxHp) * 100)}%`;
        if (pSvg) pSvg.innerHTML = renderMonsterSVG(b.playerMon.speciesId, { emotion: 'happy' });

        if (eName) eName.innerText = b.enemyMon.name;
        if (eLvl) eLvl.innerText = `Lv.${b.enemyMon.level}`;
        if (eHpFill) eHpFill.style.width = `${Math.floor((b.enemyMon.hp / b.enemyMon.maxHp) * 100)}%`;
        if (eSvg) eSvg.innerHTML = renderMonsterSVG(b.enemyMon.speciesId, { emotion: 'happy' });

        if (logText) {
            logText.innerHTML = b.log.map(l => `<p style="margin-bottom: 2px;">${l}</p>`).join('');
        }

        this.restoreMainCmdGrid();
    },

    restoreMainCmdGrid() {
        const box = document.getElementById('battle-cmds-box');
        if (box) {
            box.innerHTML = `
                <button class="btn" onclick="UIController.showFightSubMenu()">⚔️ たたかう</button>
                <button class="btn btn-secondary" onclick="UIController.showBagSubMenu()">🎒 どうぐ</button>
                <button class="btn btn-secondary" onclick="UIController.openPartyModal()">🐾 交代</button>
                <button class="btn" style="background: #555;" onclick="BattleModule.runAway()">🏃 にげる</button>`;
        }
    },

    showFightSubMenu() {
        const b = BattleModule.activeBattle;
        if (!b) return;
        const box = document.getElementById('battle-cmds-box');
        if (!box) return;

        let html = '';
        b.playerMon.moves.forEach(m => {
            html += `
            <button class="btn" onclick="BattleModule.executePlayerMove('${m.id}')">
                ${m.name} (${m.pp}/${m.maxPp})
            </button>`;
        });
        html += `<button class="btn" style="background:#555;" onclick="UIController.restoreMainCmdGrid()">◀ もどる</button>`;
        box.innerHTML = html;
    },

    showBagSubMenu() {
        const box = document.getElementById('battle-cmds-box');
        if (!box) return;

        const balls = gameEngine.player.items.pokeball;
        const potions = gameEngine.player.items.potion;

        box.innerHTML = `
            <button class="btn" onclick="BattleModule.useItem('pokeball')">⚾ モンスターボール (${balls})</button>
            <button class="btn btn-secondary" onclick="BattleModule.useItem('potion')">🧪 キズぐすり (${potions})</button>
            <button class="btn" style="grid-column: span 2; background:#555;" onclick="UIController.restoreMainCmdGrid()">◀ もどる</button>`;
    }
};

window.UIController = UIController;
