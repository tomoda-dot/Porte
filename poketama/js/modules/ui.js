/**
 * PokéTama User Interface Controller & Render Engine
 */

const UIController = {
    activeTab: 'care',

    init() {
        this.bindNavigation();
        this.bindCareButtons();
        this.bindIncubatorButtons();
        this.bindAdventureButtons();
        this.bindBattleButtons();
        this.bindShopButtons();
        this.bindModals();

        // Initial DOM Render
        this.renderAll();
    },

    bindNavigation() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetTab = e.currentTarget.dataset.tab;
                if (!targetTab) return;

                // Don't switch tab if in middle of battle
                if (battleEngine.inBattle && targetTab !== 'adventure') {
                    this.showToast('⚠️ バトル中はタブを切り替えられません！', 'warning');
                    return;
                }

                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-page').forEach(page => page.classList.remove('active'));

                e.currentTarget.classList.add('active');
                const targetPage = document.getElementById(`tab-${targetTab}`);
                if (targetPage) targetPage.classList.add('active');

                this.activeTab = targetTab;
                audioFX.playClick();
                this.renderAll();
            });
        });
    },

    bindCareButtons() {
        const btnFeed = document.getElementById('btn-feed');
        if (btnFeed) {
            btnFeed.addEventListener('click', () => {
                if (!gameEngine.activeMonster) return;
                // Show Food selection modal
                this.openFoodModal();
            });
        }

        const btnPet = document.getElementById('btn-pet');
        if (btnPet) {
            btnPet.addEventListener('click', () => {
                if (!gameEngine.activeMonster) return;
                const res = TamagotchiModule.pet(gameEngine.activeMonster);
                this.showToast(res.message, res.success ? 'success' : 'info');
                this.renderAll();
            });
        }

        const btnClean = document.getElementById('btn-clean');
        if (btnClean) {
            btnClean.addEventListener('click', () => {
                if (!gameEngine.activeMonster) return;
                const res = TamagotchiModule.clean(gameEngine.activeMonster);
                this.showToast(res.message, 'success');
                this.renderAll();
            });
        }

        const btnSleep = document.getElementById('btn-sleep');
        if (btnSleep) {
            btnSleep.addEventListener('click', () => {
                if (!gameEngine.activeMonster) return;
                const res = TamagotchiModule.toggleSleep(gameEngine.activeMonster);
                this.showToast(res.message, 'info');
                this.renderAll();
            });
        }

        const btnTrain = document.getElementById('btn-train');
        if (btnTrain) {
            btnTrain.addEventListener('click', () => {
                if (!gameEngine.activeMonster) return;
                const res = TamagotchiModule.train(gameEngine.activeMonster);
                this.showToast(res.message, res.success ? 'success' : 'warning');
                this.renderAll();
            });
        }
    },

    bindIncubatorButtons() {
        // Dynamic event delegation for incubator
    },

    bindAdventureButtons() {
        document.querySelectorAll('.biome-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const biomeId = e.currentTarget.dataset.biome;
                document.querySelectorAll('.biome-card').forEach(c => c.classList.remove('selected'));
                e.currentTarget.classList.add('selected');
                gameEngine.currentBiome = biomeId;
                audioFX.playClick();
                this.renderAdventurePage();
            });
        });

        const btnExplore = document.getElementById('btn-explore-search');
        if (btnExplore) {
            btnExplore.addEventListener('click', () => {
                if (battleEngine.inBattle) return;
                this.startWalkingExplorationSequence();
            });
        }
    },

    startWalkingExplorationSequence() {
        const biome = BIOMES_DATABASE[gameEngine.currentBiome || 'forest'];
        const party = gameEngine.getBattleParty();
        const aliveParty = party.filter(m => m && m.hp > 0);

        if (aliveParty.length === 0) {
            this.showToast('⚠️ 出撃できるパートナーのHPがありません。まずお世話・回復をしてください。', 'warning');
            return;
        }

        const leader = aliveParty[0];
        if (leader.energy < 10) {
            this.showToast('⚠️ リーダーが疲れています！睡眠でお休みさせてください。(元気10以上必要)', 'warning');
            return;
        }

        const bgStage = document.getElementById('walking-bg-stage');
        const eventOverlay = document.getElementById('walking-event-overlay');
        const descEl = document.getElementById('adventure-biome-desc');
        const btnExplore = document.getElementById('btn-explore-search');

        if (eventOverlay) eventOverlay.style.display = 'none';
        if (btnExplore) btnExplore.disabled = true;

        if (descEl) descEl.innerText = `🚶 【${biome.name}】をパーティで探検中... (距離: 25m... 60m... 90m)`;

        audioFX.playClick();

        // Fast 1.2s animated walking before encounter!
        setTimeout(() => {
            if (btnExplore) btnExplore.disabled = false;

            const res = AdventureModule.explore(gameEngine.currentBiome);

            if (res.eventType === 'chest') {
                if (eventOverlay) {
                    eventOverlay.innerHTML = `
                        <div class="encounter-event-box chest-popup">
                            <span style="font-size: 48px;">🎁</span>
                            <h3 style="color: var(--color-accent); font-size: 18px;">【宝箱を発見！】</h3>
                            <p style="font-size: 13px; color: #fff;">${res.goldFound} G と 「${res.itemFound.name}」 を手に入れた！</p>
                            <button class="btn btn-sm" style="margin-top: 6px; font-weight: 800;" onclick="UIController.closeWalkingEventOverlay()">✨ 宝箱を回収する</button>
                        </div>`;
                    eventOverlay.style.display = 'flex';
                }
                this.renderAdventurePage();
            } else if (res.eventType === 'battle' || res.eventType === 'boss') {
                if (bgStage) bgStage.classList.add('encounter-flash-active');
                if (eventOverlay) {
                    eventOverlay.innerHTML = `
                        <div class="encounter-event-box" style="border-color: #ff4444; box-shadow: 0 0 30px rgba(255, 68, 68, 0.6);">
                            <span style="font-size: 48px;">⚔️</span>
                            <h3 style="color: #ff4466; font-size: 18px;">【${res.eventType === 'boss' ? '⚠️ エリアボス軍団と遭遇！' : '野生モンスター遭遇！'}】</h3>
                            <p style="font-size: 13px; color: #fff;">${res.message}</p>
                        </div>`;
                    eventOverlay.style.display = 'flex';
                }

                audioFX.playHit();

                setTimeout(() => {
                    if (bgStage) bgStage.classList.remove('encounter-flash-active');
                    if (eventOverlay) eventOverlay.style.display = 'none';

                    document.getElementById('adventure-explore-view').style.display = 'none';
                    document.getElementById('battle-arena-view').style.display = 'block';
                    this.renderBattleArena();
                }, 800);
            }
        }, 1200);
    },

    closeWalkingEventOverlay() {
        const eventOverlay = document.getElementById('walking-event-overlay');
        if (eventOverlay) eventOverlay.style.display = 'none';
        this.renderAdventurePage();
    },

    bindBattleButtons() {
        // Moves 1-4
        for (let i = 0; i < 4; i++) {
            const btnMove = document.getElementById(`btn-move-${i}`);
            if (btnMove) {
                btnMove.addEventListener('click', () => {
                    if (!battleEngine.inBattle) return;

                    const res = battleEngine.selectMemberMove(i, battleEngine.selectedTargetIndex || 0);
                    this.renderBattleArena();

                    if (res && res.status === 'victory') {
                        this.handleVictorySequence(res);
                    } else if (res && res.status === 'defeat') {
                        this.handleDefeatSequence(res);
                    }
                });
            }
        }

        const btnFlee = document.getElementById('btn-battle-flee');
        if (btnFlee) {
            btnFlee.addEventListener('click', () => {
                if (!battleEngine.inBattle) return;
                battleEngine.flee();
                this.exitBattleArena();
            });
        }

        const btnBattleItem = document.getElementById('btn-battle-item');
        if (btnBattleItem) {
            btnBattleItem.addEventListener('click', () => {
                if (!battleEngine.inBattle) return;
                this.openBattleItemModal();
            });
        }
    },

    bindShopButtons() {
        // Audio mute toggle
        const btnMute = document.getElementById('btn-mute-toggle');
        if (btnMute) {
            btnMute.addEventListener('click', () => {
                const muted = audioFX.toggleMute();
                btnMute.innerHTML = muted ? '🔇 SE: OFF' : '🔊 SE: ON';
            });
        }

        // Reset game save data button
        const btnReset = document.getElementById('btn-reset-save');
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                if (confirm('ゲームデータを初期化してもよろしいですか？（育てるモンスターも削除されます）')) {
                    StorageManager.clearSave();
                    location.reload();
                }
            });
        }
    },

    bindModals() {
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.currentTarget.closest('.modal-overlay');
                if (modal) modal.style.display = 'none';
            });
        });
    },

    renderAll() {
        this.renderHeader();
        if (this.activeTab === 'care') this.renderCarePage();
        else if (this.activeTab === 'incubator') this.renderIncubatorPage();
        else if (this.activeTab === 'adventure') this.renderAdventurePage();
        else if (this.activeTab === 'box') this.renderBoxPage();
        else if (this.activeTab === 'dex') this.renderDexPage();
    },

    renderHeader() {
        const goldEl = document.getElementById('header-gold-val');
        if (goldEl) goldEl.innerText = `${gameEngine.gold} G`;
    },

    renderCarePage() {
        const stageContainer = document.getElementById('care-stage-container');
        const infoName = document.getElementById('care-monster-name');
        const infoSpecies = document.getElementById('care-monster-species');
        const infoLevel = document.getElementById('care-monster-level');
        const infoElement = document.getElementById('care-monster-element');

        const barHunger = document.getElementById('bar-care-hunger');
        const barFriendship = document.getElementById('bar-care-friendship');
        const barEnergy = document.getElementById('bar-care-energy');
        const barCleanliness = document.getElementById('bar-care-cleanliness');
        const barExp = document.getElementById('bar-care-exp');

        const mon = gameEngine.activeMonster;

        if (!mon) {
            if (stageContainer) {
                stageContainer.innerHTML = `
                    <div class="empty-care-notice">
                        <p>🐣 現在育成中のパートナーがいません！</p>
                        <p>「孵化器」タブからタマゴを温めて孵化させてください！</p>
                    </div>`;
            }
            return;
        }

        const mood = TamagotchiModule.getMonsterMood(mon);
        const spec = MONSTERS_DATABASE[mon.speciesId] || MONSTERS_DATABASE.fire_1;
        const elem = ELEMENT_TYPES[mon.element];

        if (infoName) infoName.innerText = mon.nickname;
        if (infoSpecies) infoSpecies.innerText = `${STAGES[mon.stage]} - ${spec.name}`;
        if (infoLevel) infoLevel.innerText = `Lv. ${mon.level}`;
        if (infoElement) {
            infoElement.innerText = `${elem.icon} ${elem.name}`;
            infoElement.style.color = elem.color;
        }

        // Render Vitals Bars
        if (barHunger) barHunger.style.width = `${mon.hunger}%`;
        if (barFriendship) barFriendship.style.width = `${mon.friendship}%`;
        if (barEnergy) barEnergy.style.width = `${mon.energy}%`;
        if (barCleanliness) barCleanliness.style.width = `${mon.cleanliness}%`;
        
        const expPct = Math.floor((mon.exp / mon.maxExp) * 100);
        if (barExp) barExp.style.width = `${expPct}%`;

        // Render SVG Creature Stage
        if (stageContainer) {
            stageContainer.innerHTML = renderMonsterSVG(mon.speciesId, { emotion: mood });
        }
    },

    renderIncubatorPage() {
        const grid = document.getElementById('incubator-grid');
        if (!grid) return;

        if (!gameEngine.incubator || gameEngine.incubator.length === 0) {
            grid.innerHTML = `
                <div class="empty-nursery">
                    <p>🥚 現在温めているタマゴはありません。</p>
                    <p>冒険に出かけると新しいタマゴを発見できます！</p>
                </div>`;
            return;
        }

        let html = '';
        gameEngine.incubator.forEach((egg, index) => {
            const eggData = EGGS_DATABASE[egg.id];
            const pct = Math.floor((egg.warmth / eggData.warmthNeeded) * 100);
            const isReady = egg.warmth >= eggData.warmthNeeded;

            html += `
            <div class="egg-card ${isReady ? 'ready-hatch' : ''}">
                <div class="egg-preview">
                    ${renderMonsterSVG(egg.id, { crackProgress: egg.warmth / eggData.warmthNeeded })}
                </div>
                <div class="egg-info">
                    <h4>${eggData.name}</h4>
                    <p class="egg-desc">${eggData.description}</p>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill warmth-fill" style="width: ${pct}%"></div>
                    </div>
                    <p class="warmth-text">温もり度: ${pct}% ${isReady ? '✨ 孵化可能！' : ''}</p>
                </div>
                <div class="egg-actions">
                    ${isReady ? `
                        <button class="btn btn-hatch" onclick="UIController.triggerHatchModal(${index})">🥚 孵化させる！</button>
                    ` : `
                        <button class="btn btn-warm" onclick="UIController.warmEggAction(${index})">🔥 手で温める</button>
                    `}
                </div>
            </div>`;
        });

        grid.innerHTML = html;
    },

    warmEggAction(index) {
        const res = IncubatorModule.warmEgg(index);
        this.showToast(res.message, res.readyToHatch ? 'success' : 'info');
        this.renderIncubatorPage();
    },

    triggerHatchModal(index) {
        const modal = document.getElementById('modal-hatch');
        const container = document.getElementById('hatch-egg-display');
        const nameInput = document.getElementById('input-hatch-nickname');

        const egg = gameEngine.incubator[index];
        const eggData = EGGS_DATABASE[egg.id];
        const hatchesSpec = MONSTERS_DATABASE[eggData.hatchesTo];

        if (container) {
            container.innerHTML = renderMonsterSVG(eggData.hatchesTo, { emotion: 'happy' });
        }
        if (nameInput) nameInput.value = hatchesSpec.name;

        const btnConfirm = document.getElementById('btn-confirm-hatch');
        if (btnConfirm) {
            btnConfirm.onclick = () => {
                const nickname = nameInput.value.trim() || hatchesSpec.name;
                const hRes = IncubatorModule.hatchEgg(index, nickname);
                if (modal) modal.style.display = 'none';

                this.showToast(`🎉 「${hRes.hatchedName}」がタマゴから元気に生まれました！`, 'success');
                this.renderAll();
            };
        }

        if (modal) modal.style.display = 'flex';
    },

    renderAdventurePage() {
        const biome = BIOMES_DATABASE[gameEngine.currentBiome || 'forest'];
        const viewExplore = document.getElementById('adventure-explore-view');
        const viewBattle = document.getElementById('battle-arena-view');

        if (battleEngine.inBattle) {
            if (viewExplore) viewExplore.style.display = 'none';
            if (viewBattle) viewBattle.style.display = 'block';
            this.renderBattleArena();
            return;
        }

        if (viewExplore) viewExplore.style.display = 'block';
        if (viewBattle) viewBattle.style.display = 'none';

        const bgStage = document.getElementById('walking-bg-stage');
        if (bgStage) {
            bgStage.className = `walking-stage-viewport biome-bg-${gameEngine.currentBiome || 'forest'}`;
        }

        const partyBox = document.getElementById('walking-party-sprites-box');
        if (partyBox) {
            const party = gameEngine.getBattleParty();
            let html = '';
            party.forEach(mon => {
                html += `
                <div class="walking-party-unit walking-party-member">
                    <span class="unit-name-tag">${mon.nickname}</span>
                    ${renderMonsterSVG(mon.speciesId, { emotion: 'happy' })}
                </div>`;
            });
            partyBox.innerHTML = html;
        }

        const titleEl = document.getElementById('adventure-biome-title');
        const descEl = document.getElementById('adventure-biome-desc');

        if (titleEl) titleEl.innerText = `${biome.icon} ${biome.name}`;
        if (descEl) descEl.innerText = biome.description;
    },

    renderBattleArena() {
        if (!battleEngine.inBattle) return;

        const actor = battleEngine.getCurrentActor();
        const turnHeader = document.getElementById('battle-turn-indicator');
        if (turnHeader) {
            if (actor) {
                turnHeader.innerHTML = `⚔️ 行動入力 (メンバー ${battleEngine.currentActorIndex + 1}/${battleEngine.playerParty.length})： <strong>▶ 【${actor.nickname}】</strong> のコマンドを選択`;
            } else {
                turnHeader.innerHTML = `⚔️ バトル実行中...`;
            }
        }

        // Render Enemies Column (Left Side)
        const enemyContainer = document.getElementById('enemy-group-container');
        if (enemyContainer) {
            let html = '';
            battleEngine.enemyGroup.forEach((enemy, idx) => {
                const elem = ELEMENT_TYPES[enemy.element];
                const hpPct = Math.floor((enemy.hp / enemy.maxHp) * 100);
                const isSelected = (battleEngine.selectedTargetIndex || 0) === idx;

                html += `
                <div class="unit-party-card ${enemy.isFainted ? 'fainted' : ''} ${isSelected ? 'target-selected' : ''}" onclick="UIController.setBattleTarget(${idx})">
                    <div class="unit-mini-sprite">${renderMonsterSVG(enemy.speciesId, { emotion: enemy.isFainted ? 'sleep' : 'angry' })}</div>
                    <div class="unit-info-box">
                        <div class="unit-name">${enemy.nickname} <small style="color:${elem.color}">Lv.${enemy.level}</small></div>
                        <div class="progress-bar-bg"><div class="progress-bar-fill fill-hunger" style="width:${hpPct}%"></div></div>
                        <small style="font-size:10px;">HP: ${enemy.hp}/${enemy.maxHp}</small>
                    </div>
                </div>`;
            });
            enemyContainer.innerHTML = html;
        }

        // Render Player Party Column (Right Side)
        const playerContainer = document.getElementById('player-party-container');
        if (playerContainer) {
            let html = '';
            battleEngine.playerParty.forEach((member, idx) => {
                const elem = ELEMENT_TYPES[member.element];
                const hpPct = Math.floor((member.hp / member.maxHp) * 100);
                const isCurrentActor = actor && battleEngine.currentActorIndex === idx;

                html += `
                <div class="unit-party-card ${member.isFainted ? 'fainted' : ''} ${isCurrentActor ? 'active-turn' : ''}">
                    <div class="unit-mini-sprite">${renderMonsterSVG(member.speciesId, { emotion: member.isFainted ? 'sleep' : (isCurrentActor ? 'happy' : 'battle') })}</div>
                    <div class="unit-info-box">
                        <div class="unit-name">${member.nickname} <small style="color:${elem.color}">Lv.${member.level}</small></div>
                        <div class="progress-bar-bg"><div class="progress-bar-fill fill-hunger" style="width:${hpPct}%"></div></div>
                        <small style="font-size:10px;">HP: ${member.hp}/${member.maxHp}</small>
                    </div>
                </div>`;
            });
            playerContainer.innerHTML = html;
        }

        // Render Target Select Buttons
        const targetBtnContainer = document.getElementById('target-enemy-buttons-container');
        if (targetBtnContainer) {
            let html = '';
            battleEngine.enemyGroup.forEach((enemy, idx) => {
                if (!enemy.isFainted) {
                    const isSelected = (battleEngine.selectedTargetIndex || 0) === idx;
                    html += `<button class="btn-target-select ${isSelected ? 'active' : ''}" onclick="UIController.setBattleTarget(${idx})">🎯 ${enemy.nickname}</button>`;
                }
            });
            targetBtnContainer.innerHTML = html;
        }

        // Render Current Actor's 4 Moves
        if (actor) {
            for (let i = 0; i < 4; i++) {
                const btnMove = document.getElementById(`btn-move-${i}`);
                if (btnMove) {
                    const moveId = actor.moves[i];
                    if (moveId) {
                        const moveObj = MOVES_DATABASE[moveId];
                        const elem = ELEMENT_TYPES[moveObj.type] || { icon: '⚔️', color: '#fff' };
                        btnMove.innerHTML = `<span>${elem.icon} ${moveObj.name}</span><small>威力:${moveObj.power}</small>`;
                        btnMove.style.display = 'block';
                    } else {
                        btnMove.style.display = 'none';
                    }
                }
            }
        }

        // Render Battle Log
        const logBox = document.getElementById('battle-log-box');
        if (logBox) {
            logBox.innerHTML = battleEngine.battleLog.map(msg => `<p class="log-line">${msg}</p>`).join('');
            logBox.scrollTop = logBox.scrollHeight;
        }
    },

    setBattleTarget(targetIdx) {
        battleEngine.selectedTargetIndex = targetIdx;
        this.renderBattleArena();
    },

    handleVictorySequence(res) {
        this.renderBattleArena();
        const logBox = document.getElementById('battle-log-box');
        if (logBox) {
            logBox.innerHTML += `
                <div style="margin-top: 10px; text-align: center; background: rgba(162, 217, 106, 0.25); border: 2px solid var(--color-primary); border-radius: 14px; padding: 10px;">
                    <h3 style="color: var(--color-accent); font-size: 16px; margin-bottom: 6px;">🎉 パートナー軍団の勝利！</h3>
                    <button class="btn btn-sm" id="btn-battle-exit-confirm" style="margin-top: 4px; font-weight: 800; background: linear-gradient(90deg, #76c84c, #ffd15c);">🧭 冒険エリアに戻る</button>
                </div>`;
            logBox.scrollTop = logBox.scrollHeight;

            const btnExit = document.getElementById('btn-battle-exit-confirm');
            if (btnExit) {
                btnExit.onclick = () => {
                    if (res.evoCandidates && res.evoCandidates.length > 0) {
                        const firstEvo = res.evoCandidates[0];
                        this.triggerEvolutionModal(firstEvo.member, firstEvo.nextEvoId);
                    } else {
                        this.exitBattleArena();
                    }
                };
            }
        }
    },

    handleDefeatSequence(res) {
        this.renderBattleArena();
        const logBox = document.getElementById('battle-log-box');
        if (logBox) {
            logBox.innerHTML += `
                <div style="margin-top: 10px; text-align: center; background: rgba(255, 68, 68, 0.25); border: 2px solid #ff4444; border-radius: 14px; padding: 10px;">
                    <h3 style="color: #ff6666; font-size: 16px; margin-bottom: 6px;">💀 全員倒れてしまった...</h3>
                    <p style="font-size: 12px; margin-bottom: 6px; color: #ffcccc;">お世話をして回復させてから再挑戦しましょう！</p>
                    <button class="btn btn-sm" id="btn-battle-exit-confirm" style="background: #552233; margin-top: 4px; border: 1px solid #ff4444;">🏠 冒険エリアに戻る</button>
                </div>`;
            logBox.scrollTop = logBox.scrollHeight;

            const btnExit = document.getElementById('btn-battle-exit-confirm');
            if (btnExit) {
                btnExit.onclick = () => {
                    this.exitBattleArena();
                };
            }
        }
    },

    triggerEvolutionModal(monster, nextEvoId) {
        const modal = document.getElementById('modal-evolution');
        const preSprite = document.getElementById('evo-before-sprite');
        const postSprite = document.getElementById('evo-after-sprite');
        const titleText = document.getElementById('evo-title-text');

        if (preSprite) preSprite.innerHTML = renderMonsterSVG(monster.speciesId);
        if (postSprite) postSprite.innerHTML = renderMonsterSVG(nextEvoId);

        if (modal) modal.style.display = 'flex';

        const btnDoEvo = document.getElementById('btn-confirm-evo');
        if (btnDoEvo) {
            btnDoEvo.onclick = () => {
                const evoRes = TamagotchiModule.evolveMonster(monster, nextEvoId);
                if (modal) modal.style.display = 'none';

                this.showToast(`✨ おめでとう！ ${evoRes.oldName} は 「${evoRes.newName}」 に進化した！`, 'success');
                this.exitBattleArena();
            };
        }
    },

    exitBattleArena() {
        document.getElementById('battle-arena-view').style.display = 'none';
        document.getElementById('adventure-explore-view').style.display = 'block';
        this.renderAll();
    },

    renderBoxPage() {
        const grid = document.getElementById('monster-box-grid');
        if (!grid) return;

        const allPartners = [];
        if (gameEngine.activeMonster) allPartners.push(gameEngine.activeMonster);
        if (gameEngine.monsterBox) allPartners.push(...gameEngine.monsterBox);

        if (allPartners.length === 0) {
            grid.innerHTML = '<p class="empty-box">手元にモンスターがいません。タマゴを孵化させましょう！</p>';
            return;
        }

        const currentParty = gameEngine.getBattleParty();

        let html = '';
        allPartners.forEach((mon, index) => {
            const isLeader = gameEngine.activeMonster && gameEngine.activeMonster === mon;
            const inParty = currentParty.includes(mon);
            const partySlot = currentParty.indexOf(mon) + 1;

            const spec = MONSTERS_DATABASE[mon.speciesId];
            const elem = ELEMENT_TYPES[mon.element];

            html += `
            <div class="box-card ${isLeader ? 'active-partner' : ''}">
                <div class="box-card-header">
                    <span class="box-badge" style="background:${inParty ? '#ffd15c' : '#76c84c'}; color:#0b1a0e;">
                        ${isLeader ? 'リーダー★' : (inParty ? `パーティ ${partySlot}枠` : '控え')}
                    </span>
                    <span style="color: ${elem.color}">${elem.icon} ${elem.name}</span>
                </div>
                <div class="box-sprite">${renderMonsterSVG(mon.speciesId)}</div>
                <div style="display: flex; gap: 6px; margin-top: 6px; width: 100%;">
                    ${!isLeader ? `
                        <button class="btn btn-sm" style="flex:1; font-size:11px;" onclick="UIController.switchActivePartner(${index})">メインお世話</button>
                    ` : ''}
                    <button class="btn btn-sm" style="flex:1; font-size:11px; background:${inParty ? '#442233' : '#225533'}; border:1px solid ${inParty ? '#ff4444' : '#44dd66'};" onclick="UIController.togglePartyMember(${index})">
                        ${inParty ? '❌ パーティ解除' : '⚔️ パーティ編入'}
                    </button>
                </div>
            </div>`;
        });
        grid.innerHTML = html;
    },

    switchActivePartner(index) {
        const allPartners = [];
        if (gameEngine.activeMonster) allPartners.push(gameEngine.activeMonster);
        if (gameEngine.monsterBox) allPartners.push(...gameEngine.monsterBox);

        const target = allPartners[index];
        if (!target) return;

        // Move current active to box, set target as active
        const remaining = allPartners.filter(m => m !== target);
        gameEngine.activeMonster = target;
        gameEngine.monsterBox = remaining;

        audioFX.playClick();
        this.showToast(`「${target.nickname}」をメイン相棒に変更しました！`, 'success');
        this.renderAll();
    },

    renderDexPage() {
        const grid = document.getElementById('dex-grid');
        if (!grid) return;

        let html = '';
        
        // Render Egg entries & Monster entries
        Object.keys(EGGS_DATABASE).forEach(eggId => {
            const unlocked = !!gameEngine.dex[eggId];
            const egg = EGGS_DATABASE[eggId];
            html += `
            <div class="dex-card ${unlocked ? 'unlocked' : 'locked'}">
                <div class="dex-sprite">${unlocked ? renderMonsterSVG(eggId) : '❓'}</div>
                <div class="dex-info">
                    <h4>${unlocked ? egg.name : '？？？？'}</h4>
                    <p>${unlocked ? egg.description : '未発見のタマゴ'}</p>
                </div>
            </div>`;
        });

        Object.keys(MONSTERS_DATABASE).forEach(specId => {
            const unlocked = !!gameEngine.dex[specId];
            const mon = MONSTERS_DATABASE[specId];
            const elem = ELEMENT_TYPES[mon.element];
            html += `
            <div class="dex-card ${unlocked ? 'unlocked' : 'locked'}">
                <div class="dex-sprite">${unlocked ? renderMonsterSVG(specId) : '❓'}</div>
                <div class="dex-info">
                    <h4>${unlocked ? mon.name : '？？？？'}</h4>
                    ${unlocked ? `<p style="color: ${elem.color}">${elem.icon} ${STAGES[mon.stage]} - ${elem.name}属性</p><p class="dex-desc">${mon.description}</p>` : '<p>未発見のモンスター</p>'}
                </div>
            </div>`;
        });

        grid.innerHTML = html;
    },

    openFoodModal() {
        const modal = document.getElementById('modal-food-select');
        const container = document.getElementById('food-select-grid');
        if (!modal || !container) return;

        let html = '';
        Object.keys(gameEngine.inventory).forEach(itemId => {
            const count = gameEngine.inventory[itemId];
            const item = ITEMS_DATABASE[itemId];
            if (item && item.type === 'food' && count > 0) {
                html += `
                <div class="food-item-btn" onclick="UIController.feedItemAction('${itemId}')">
                    <span class="food-icon">${item.icon}</span>
                    <div class="food-info">
                        <strong>${item.name} (所持:${count})</strong>
                        <small>${item.description}</small>
                    </div>
                </div>`;
            }
        });

        if (html === '') {
            html = '<p class="empty-inventory">ごはんアイテムがありません！冒険の宝箱で獲得しましょう。</p>';
        }

        container.innerHTML = html;
        modal.style.display = 'flex';
    },

    feedItemAction(itemId) {
        document.getElementById('modal-food-select').style.display = 'none';
        const res = TamagotchiModule.feed(gameEngine.activeMonster, itemId);
        this.showToast(res.message, res.success ? 'success' : 'warning');
        this.renderAll();
    },

    openBattleItemModal() {
        const modal = document.getElementById('modal-food-select');
        const container = document.getElementById('food-select-grid');
        if (!modal || !container) return;

        let html = '';
        Object.keys(gameEngine.inventory).forEach(itemId => {
            const count = gameEngine.inventory[itemId];
            const item = ITEMS_DATABASE[itemId];
            if (item && item.type === 'medicine' && count > 0) {
                html += `
                <div class="food-item-btn" onclick="UIController.useBattleItemAction('${itemId}')">
                    <span class="food-icon">${item.icon}</span>
                    <div class="food-info">
                        <strong>${item.name} (所持:${count})</strong>
                        <small>${item.description}</small>
                    </div>
                </div>`;
            }
        });

        if (html === '') {
            html = '<p class="empty-inventory">バトルで使用できる回復薬がありません！</p>';
        }

        container.innerHTML = html;
        modal.style.display = 'flex';
    },

    useBattleItemAction(itemId) {
        document.getElementById('modal-food-select').style.display = 'none';
        battleEngine.useBattleItem(itemId);
        this.renderBattleArena();
    },

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerText = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

window.renderGameUI = () => {
    UIController.renderAll();
};
