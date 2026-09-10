/**
 * Monster Breeder Championship - UI Controller & DOM Engine
 */

const UIController = {
    activeTab: 'gym',
    selectedTourneyRank: 'E',

    init() {
        this.bindNav();
        this.bindGym();
        this.bindTournament();
        this.bindStarters();
        this.renderAll();
    },

    bindNav() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                if (!tab) return;

                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-page').forEach(p => p.classList.remove('active'));

                e.currentTarget.classList.add('active');
                const page = document.getElementById(`tab-${tab}`);
                if (page) page.classList.add('active');

                this.activeTab = tab;
                this.renderAll();
            });
        });
    },

    bindGym() {
        const stage = document.getElementById('gym-monster-stage');
        if (stage) {
            stage.addEventListener('click', (e) => {
                if (!gameEngine.activeMonster) return;
                const res = TrainingModule.train(gameEngine.activeMonster, 'atk');
                this.handleTrainResult(e.clientX, e.clientY, res);
            });
        }

        const bindBtn = (id, type) => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('click', (e) => {
                    if (!gameEngine.activeMonster) return;
                    let res;
                    if (type === 'rest') {
                        res = TrainingModule.rest(gameEngine.activeMonster);
                        this.spawnFloatingText(e.clientX, e.clientY, '☕ 疲労リセット！', '#ffe066');
                    } else {
                        res = TrainingModule.train(gameEngine.activeMonster, type);
                        this.handleTrainResult(e.clientX, e.clientY, res);
                    }
                    this.renderAll();
                });
            }
        };

        bindBtn('btn-train-atk', 'atk');
        bindBtn('btn-train-def', 'def');
        bindBtn('btn-train-spd', 'spd');
        bindBtn('btn-train-sp', 'sp');
        bindBtn('btn-train-rest', 'rest');
    },

    handleTrainResult(x, y, res) {
        if (!res.success) {
            alert(res.message);
            return;
        }

        const svg = document.querySelector('#gym-monster-stage svg');
        if (svg) {
            svg.style.animation = 'none';
            void svg.offsetWidth;
            svg.style.animation = 'trainHit 0.5s ease-out';
        }

        this.spawnFloatingText(x, y, `✨ ${res.statName}!`, '#52e077');
        if (res.leveledUp) {
            setTimeout(() => {
                this.spawnFloatingText(x, y - 30, '🌟 LEVEL UP!', '#ffe066');
            }, 250);
        }

        this.renderAll();
    },

    spawnFloatingText(x, y, text, color = '#ffffff') {
        const pop = document.createElement('div');
        pop.className = 'floating-stat-popup';
        pop.innerText = text;
        pop.style.color = color;
        pop.style.left = `${x - 20}px`;
        pop.style.top = `${y - 30}px`;
        document.body.appendChild(pop);

        setTimeout(() => {
            if (pop && pop.parentNode) pop.parentNode.removeChild(pop);
        }, 850);
    },

    bindTournament() {
        document.querySelectorAll('.rank-card').forEach(card => {
            card.addEventListener('click', (e) => {
                document.querySelectorAll('.rank-card').forEach(c => c.classList.remove('selected'));
                e.currentTarget.classList.add('selected');
                this.selectedTourneyRank = e.currentTarget.dataset.rank;
                this.renderTournamentPage();
            });
        });

        const btnEnter = document.getElementById('btn-enter-tournament');
        if (btnEnter) {
            btnEnter.addEventListener('click', () => {
                const res = TournamentModule.startMatch(this.selectedTourneyRank);
                if (!res.success) {
                    alert(res.message);
                    return;
                }

                document.getElementById('modal-battle').style.display = 'flex';
                this.renderBattleModal();
            });
        }
    },

    bindStarters() {
        document.querySelectorAll('.starter-card').forEach(card => {
            const specId = card.dataset.species;
            const container = card.querySelector('div');
            if (container) container.innerHTML = renderMonsterSVG(specId);

            card.addEventListener('click', () => {
                gameEngine.createNewMonster(specId);
                document.getElementById('modal-starter').style.display = 'none';
                this.renderAll();
            });
        });
    },

    renderAll() {
        const mon = gameEngine.activeMonster;
        
        // Header
        const rankEl = document.getElementById('header-breeder-rank');
        const goldEl = document.getElementById('header-gold-val');
        if (rankEl) rankEl.innerText = gameEngine.breeder.rank;
        if (goldEl) goldEl.innerText = gameEngine.breeder.gold;

        if (!mon) return;

        this.renderGymPage();
        this.renderTournamentPage();
        this.renderHousePage();
        this.renderDexPage();
    },

    renderGymPage() {
        const mon = gameEngine.activeMonster;
        if (!mon) return;

        const stage = document.getElementById('gym-monster-stage');
        const emotion = mon.fatigue >= 85 ? 'tired' : 'happy';
        if (stage) stage.innerHTML = renderMonsterSVG(mon.speciesId, { emotion });

        const nameEl = document.getElementById('gym-monster-name');
        const stageTag = document.getElementById('gym-monster-stage-tag');
        const levelEl = document.getElementById('gym-monster-level');
        const fatigueText = document.getElementById('val-fatigue-text');
        const conditionText = document.getElementById('val-condition-text');

        if (nameEl) nameEl.innerText = mon.nickname;
        if (stageTag) stageTag.innerText = `${STAGES[mon.stage] || '幼体'} / ${ELEMENT_TYPES[mon.element]?.name || ''}属性`;
        if (levelEl) levelEl.innerText = `Lv. ${mon.level}`;
        if (fatigueText) fatigueText.innerText = `${mon.fatigue}%`;
        if (conditionText) conditionText.innerText = mon.condition;

        // Vitals
        const hpText = document.getElementById('text-hp-val');
        const hpBar = document.getElementById('bar-hp');
        const expText = document.getElementById('text-exp-val');
        const expBar = document.getElementById('bar-exp');
        const fatigueBar = document.getElementById('bar-fatigue');

        if (hpText) hpText.innerText = `${mon.hp}/${mon.maxHp}`;
        if (hpBar) hpBar.style.width = `${Math.floor((mon.hp / mon.maxHp) * 100)}%`;

        if (expText) expText.innerText = `${mon.exp}/${mon.maxExp}`;
        if (expBar) expBar.style.width = `${Math.min(100, Math.floor((mon.exp / mon.maxExp) * 100))}%`;

        if (fatigueBar) fatigueBar.style.width = `${mon.fatigue}%`;

        // 4 Stats
        const valAtk = document.getElementById('val-atk');
        const valDef = document.getElementById('val-def');
        const valSpd = document.getElementById('val-spd');
        const valSp = document.getElementById('val-sp');

        if (valAtk) valAtk.innerText = mon.atk;
        if (valDef) valDef.innerText = mon.def;
        if (valSpd) valSpd.innerText = mon.spd;
        if (valSp) valSp.innerText = mon.maxSp || 100;

        // Check Evolution Ready Button
        const evoContainer = document.getElementById('evolution-btn-container');
        const evoCheck = TrainingModule.checkEvolution(mon);
        if (evoContainer) {
            if (evoCheck.canEvolve) {
                const nextSpec = MONSTERS_DATABASE[evoCheck.nextEvoId];
                evoContainer.innerHTML = `
                    <button class="btn-evolve-shiny" onclick="UIController.triggerEvolution()">
                        ✨ 進化可能！「${nextSpec.name}」へ進化させる！
                    </button>`;
            } else {
                evoContainer.innerHTML = '';
            }
        }
    },

    triggerEvolution() {
        const mon = gameEngine.activeMonster;
        if (!mon) return;

        const res = TrainingModule.evolve(mon);
        if (res && res.success) {
            alert(`✨ おめでとうございます！「${res.oldName}」は「${res.newName}」へ進化しました！`);
            this.renderAll();
        }
    },

    renderTournamentPage() {
        const rankKey = this.selectedTourneyRank;
        const tourney = TOURNAMENTS_DATABASE[rankKey] || TOURNAMENTS_DATABASE.E;

        const titleText = document.getElementById('tourney-title-text');
        const reqLevel = document.getElementById('tourney-req-level');
        if (titleText) titleText.innerText = `${tourney.name} 対戦プレビュー`;
        if (reqLevel) reqLevel.innerText = `推奨 Lv.${tourney.minLevel}〜`;
    },

    renderHousePage() {
        const grid = document.getElementById('monster-house-grid');
        if (!grid) return;

        let html = '';
        gameEngine.monsterBox.forEach((mon, index) => {
            const isCurrent = gameEngine.activeMonster === mon;
            html += `
            <div class="starter-card ${isCurrent ? 'selected' : ''}" onclick="UIController.switchActiveMonster(${index})">
                <div style="width: 70px; height: 70px;">
                    ${renderMonsterSVG(mon.speciesId)}
                </div>
                <div style="font-weight: 900; font-size: 13px;">${mon.nickname}</div>
                <div style="font-size: 11px; color: #ffe066;">Lv. ${mon.level}</div>
                ${isCurrent ? '<span class="rank-badge" style="font-size:10px;">出撃中</span>' : ''}
            </div>`;
        });
        grid.innerHTML = html;
    },

    switchActiveMonster(index) {
        const target = gameEngine.monsterBox[index];
        if (target) {
            gameEngine.activeMonster = target;
            gameEngine.saveState();
            this.renderAll();
        }
    },

    renderDexPage() {
        const grid = document.getElementById('dex-grid');
        if (!grid) return;

        let html = '';
        Object.keys(MONSTERS_DATABASE).forEach(id => {
            const spec = MONSTERS_DATABASE[id];
            const unlocked = !!gameEngine.dex[id];

            html += `
            <div style="background: rgba(255,255,255,0.08); border-radius: 16px; padding: 10px; display: flex; flex-direction: column; align-items: center; gap: 4px; ${!unlocked ? 'opacity: 0.4; filter: grayscale(1);' : ''}">
                <div style="width: 60px; height: 60px;">${unlocked ? renderMonsterSVG(id) : '❓'}</div>
                <div style="font-size: 12px; font-weight: bold;">${unlocked ? spec.name : '？？？？'}</div>
                <div style="font-size: 10px; color: #b39ddb;">${STAGES[spec.stage]}</div>
            </div>`;
        });
        grid.innerHTML = html;
    },

    renderBattleModal() {
        const b = TournamentModule.currentBattle;
        if (!b) return;

        const titleEl = document.getElementById('battle-tourney-name');
        const turnEl = document.getElementById('battle-turn-count');
        const pName = document.getElementById('battle-player-name');
        const pSvg = document.getElementById('battle-player-svg');
        const pHpBar = document.getElementById('battle-player-hp-bar');
        const eName = document.getElementById('battle-enemy-name');
        const eSvg = document.getElementById('battle-enemy-svg');
        const eHpBar = document.getElementById('battle-enemy-hp-bar');
        const logBox = document.getElementById('battle-log-box');
        const movesContainer = document.getElementById('battle-moves-container');

        if (titleEl) titleEl.innerText = `🏆 ${b.tourney.name}`;
        if (turnEl) turnEl.innerText = `ターン ${b.turn}`;

        if (pName) pName.innerText = `${b.player.nickname} (Lv.${b.player.level})`;
        if (pSvg) pSvg.innerHTML = renderMonsterSVG(b.player.speciesId, { emotion: 'train' });
        if (pHpBar) pHpBar.style.width = `${Math.floor((b.player.currentHp / b.player.maxHp) * 100)}%`;

        if (eName) eName.innerText = b.enemy.nickname;
        if (eSvg) eSvg.innerHTML = renderMonsterSVG(b.enemy.speciesId, { emotion: 'train' });
        if (eHpBar) eHpBar.style.width = `${Math.floor((b.enemy.currentHp / b.enemy.maxHp) * 100)}%`;

        if (logBox) {
            logBox.innerHTML = b.log.map(l => `<p style="margin-bottom: 2px;">${l}</p>`).join('');
        }

        if (movesContainer) {
            let movesHtml = '';
            b.player.moves.forEach(mId => {
                const mObj = MOVES_DATABASE[mId] || MOVES_DATABASE.tackle;
                movesHtml += `
                <button class="btn" style="font-size: 12px; padding: 10px; text-align: left;" onclick="UIController.handleBattleMove('${mId}')">
                    <div>⚔️ ${mObj.name}</div>
                    <small style="font-size: 9px; opacity: 0.8;">威力:${mObj.power}</small>
                </button>`;
            });
            movesContainer.innerHTML = movesHtml;
        }
    },

    handleBattleMove(moveId) {
        const res = TournamentModule.executeTurn(moveId);
        if (!res) return;

        this.renderBattleModal();

        if (res.result === 'victory') {
            setTimeout(() => {
                alert(`🎉 優勝おめでとうございます！ 賞金 ${res.prize} G を獲得しました！`);
                document.getElementById('modal-battle').style.display = 'none';
                this.renderAll();
            }, 400);
        } else if (res.result === 'defeat') {
            setTimeout(() => {
                alert('💀 残念... 試合に敗北しました。特訓を積んで再挑戦しましょう！');
                document.getElementById('modal-battle').style.display = 'none';
                this.renderAll();
            }, 400);
        }
    }
};
