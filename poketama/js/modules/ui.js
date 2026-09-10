/**
 * Pokemon-Style 2D RPG - UI Controller & Keyboard / D-Pad Input Router
 */

const UIController = {
    init() {
        this.bindDPad();
        this.bindActionButtons();
        this.bindKeyboard();
        this.bindBattleControls();
        this.renderAll();
    },

    bindDPad() {
        const bindDirection = (id, dir) => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('click', () => {
                    MapEngine.move(dir);
                });
            }
        };

        bindDirection('btn-dpad-up', 'up');
        bindDirection('btn-dpad-down', 'down');
        bindDirection('btn-dpad-left', 'left');
        bindDirection('btn-dpad-right', 'right');
    },

    bindActionButtons() {
        const btnA = document.getElementById('btn-action-a');
        if (btnA) {
            btnA.addEventListener('click', () => {
                MapEngine.interactA();
            });
        }

        const btnB = document.getElementById('btn-action-b');
        if (btnB) {
            btnB.addEventListener('click', () => {
                this.closeMenuModal();
                if (BattleModule.activeBattle) {
                    BattleModule.runAway();
                }
            });
        }

        const btnMenu = document.getElementById('btn-action-menu');
        if (btnMenu) {
            btnMenu.addEventListener('click', () => {
                this.openMenuModal();
            });
        }
    },

    bindKeyboard() {
        window.addEventListener('keydown', (e) => {
            if (BattleModule.activeBattle) return;
            const key = e.key;
            if (key === 'ArrowUp' || key === 'w' || key === 'W') MapEngine.move('up');
            if (key === 'ArrowDown' || key === 's' || key === 'S') MapEngine.move('down');
            if (key === 'ArrowLeft' || key === 'a' || key === 'A') MapEngine.move('left');
            if (key === 'ArrowRight' || key === 'd' || key === 'D') MapEngine.move('right');
            if (key === 'z' || key === 'Z' || key === 'Enter') MapEngine.interactA();
            if (key === 'x' || key === 'X' || key === 'Escape') this.closeMenuModal();
        });
    },

    bindBattleControls() {
        const btnFight = document.getElementById('btn-cmd-fight');
        if (btnFight) {
            btnFight.addEventListener('click', () => {
                this.showFightSubMenu();
            });
        }

        const btnBag = document.getElementById('btn-cmd-bag');
        if (btnBag) {
            btnBag.addEventListener('click', () => {
                this.showBagSubMenu();
            });
        }

        const btnRun = document.getElementById('btn-cmd-run');
        if (btnRun) {
            btnRun.addEventListener('click', () => {
                BattleModule.runAway();
            });
        }
    },

    chooseStarter(speciesId) {
        const starter = gameEngine.createPokemonInstance(speciesId, 5);
        gameEngine.addPokemonToPartyOrPC(starter);
        document.getElementById('modal-starter').style.display = 'none';
        this.renderAll();
    },

    renderAll() {
        // Header
        const badgeEl = document.getElementById('header-badges-val');
        const ballsEl = document.getElementById('header-balls-val');
        const moneyEl = document.getElementById('header-money-val');

        if (badgeEl) badgeEl.innerText = gameEngine.player.badgeCount;
        if (ballsEl) ballsEl.innerText = gameEngine.player.items.pokeball;
        if (moneyEl) moneyEl.innerText = gameEngine.player.money;

        // Map Render
        MapEngine.render();
    },

    openBattleOverlay() {
        const overlay = document.getElementById('battle-overlay');
        if (overlay) overlay.classList.add('active');
        this.renderBattleOverlay();
    },

    closeBattleOverlay() {
        const overlay = document.getElementById('battle-overlay');
        if (overlay) overlay.classList.remove('active');
        BattleModule.activeBattle = null;
        this.renderAll();
    },

    renderBattleOverlay() {
        const b = BattleModule.activeBattle;
        if (!b) return;

        const pName = document.getElementById('battle-player-name');
        const pLvl = document.getElementById('battle-player-level');
        const pHpFill = document.getElementById('battle-player-hp-fill');
        const pHpText = document.getElementById('battle-player-hp-text');
        const pSprite = document.getElementById('battle-player-sprite');

        const eName = document.getElementById('battle-enemy-name');
        const eLvl = document.getElementById('battle-enemy-level');
        const eHpFill = document.getElementById('battle-enemy-hp-fill');
        const eSprite = document.getElementById('battle-enemy-sprite');

        const logText = document.getElementById('battle-log-text');

        if (pName) pName.innerText = b.playerMon.name;
        if (pLvl) pLvl.innerText = `Lv.${b.playerMon.level}`;
        if (pHpFill) pHpFill.style.width = `${Math.floor((b.playerMon.hp / b.playerMon.maxHp) * 100)}%`;
        if (pHpText) pHpText.innerText = `${b.playerMon.hp}/${b.playerMon.maxHp}`;
        if (pSprite) pSprite.innerHTML = renderMonsterSVG(b.playerMon.speciesId, { emotion: 'happy' });

        if (eName) eName.innerText = b.enemyMon.name;
        if (eLvl) eLvl.innerText = `Lv.${b.enemyMon.level}`;
        if (eHpFill) eHpFill.style.width = `${Math.floor((e.enemyMon.hp / e.enemyMon.maxHp) * 100)}%`;
        if (eSprite) eSprite.innerHTML = renderMonsterSVG(b.enemyMon.speciesId, { emotion: 'happy' });

        if (logText) {
            logText.innerHTML = b.log.map(l => `<p style="margin-bottom: 2px;">${l}</p>`).join('');
        }

        // Restore default command grid
        this.restoreMainCmdGrid();
    },

    restoreMainCmdGrid() {
        const box = document.getElementById('battle-cmds-box');
        if (box) {
            box.innerHTML = `
                <button class="cmd-btn" id="btn-cmd-fight" onclick="UIController.showFightSubMenu()">⚔️ たたかう</button>
                <button class="cmd-btn" id="btn-cmd-bag" onclick="UIController.showBagSubMenu()">🎒 どうぐ</button>
                <button class="cmd-btn" id="btn-cmd-party" onclick="UIController.openMenuModal()">🐾 ポケモン</button>
                <button class="cmd-btn" id="btn-cmd-run" onclick="BattleModule.runAway()">🏃 にげる</button>`;
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
            <button class="cmd-btn" onclick="BattleModule.executePlayerMove('${m.id}')">
                ${m.name} (${m.pp}/${m.maxPp})
            </button>`;
        });
        html += `<button class="cmd-btn" style="background:#555;" onclick="UIController.restoreMainCmdGrid()">◀ もどる</button>`;
        box.innerHTML = html;
    },

    showBagSubMenu() {
        const box = document.getElementById('battle-cmds-box');
        if (!box) return;

        const balls = gameEngine.player.items.pokeball;
        const potions = gameEngine.player.items.potion;

        box.innerHTML = `
            <button class="cmd-btn" onclick="BattleModule.useItem('pokeball')">⚾ モンスターボール (${balls})</button>
            <button class="cmd-btn" onclick="BattleModule.useItem('potion')">🧪 キズぐすり (${potions})</button>
            <button class="cmd-btn" style="grid-column: span 2; background:#555;" onclick="UIController.restoreMainCmdGrid()">◀ もどる</button>`;
    },

    openMenuModal() {
        const modal = document.getElementById('modal-menu');
        if (modal) modal.style.display = 'flex';
        this.renderMenuModal();
    },

    closeMenuModal() {
        const modal = document.getElementById('modal-menu');
        if (modal) modal.style.display = 'none';
    },

    renderMenuModal() {
        const partyBox = document.getElementById('party-list-box');
        const itemsBox = document.getElementById('items-list-box');

        if (partyBox) {
            let html = '';
            gameEngine.party.forEach((mon, idx) => {
                html += `
                <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.08); padding: 8px 12px; border-radius: 10px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 36px; height: 36px;">${renderMonsterSVG(mon.speciesId)}</div>
                        <div>
                            <div style="font-weight: 900; font-size: 13px;">${mon.name} <small style="color:#ffd15c;">Lv.${mon.level}</small></div>
                            <div style="font-size: 10px; color: #aaa;">HP: ${mon.hp}/${mon.maxHp}</div>
                        </div>
                    </div>
                    ${idx === 0 ? '<span style="font-size: 10px; background: #ff5544; padding: 2px 6px; border-radius: 8px; font-weight: bold;">先頭</span>' : ''}
                </div>`;
            });
            partyBox.innerHTML = html;
        }

        if (itemsBox) {
            itemsBox.innerHTML = `
                <p>⚾ モンスターボール: ${gameEngine.player.items.pokeball} 個</p>
                <p style="margin-top: 4px;">🧪 キズぐすり: ${gameEngine.player.items.potion} 個</p>`;
        }
    }
};

window.UIController = UIController;
