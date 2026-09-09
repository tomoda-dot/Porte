/**
 * PokéTama User Interface Controller & Render Engine - v1.6.0
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

        // Prompt Trainer setup modal on first launch
        if (!gameEngine.player || !gameEngine.player.hasChosen) {
            setTimeout(() => {
                this.openTrainerSelectModal();
            }, 400);
        }
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
                if (res.leveledUp) {
                    const stageContainer = document.getElementById('care-stage-container');
                    this.triggerLevelUpEffect(stageContainer, res.newLevel);
                }
            });
        }

        // Care Monster Prev/Next Arrow Controls
        const btnPrev = document.getElementById('btn-care-prev');
        if (btnPrev) {
            btnPrev.addEventListener('click', () => {
                gameEngine.switchActiveMonster(-1);
                audioFX.playClick();
                this.renderAll();
            });
        }

        const btnNext = document.getElementById('btn-care-next');
        if (btnNext) {
            btnNext.addEventListener('click', () => {
                gameEngine.switchActiveMonster(1);
                audioFX.playClick();
                this.renderAll();
            });
        }

        // Care Stage Horizontal Touch Swipe Gesture Handler
        const lcdShell = document.getElementById('care-lcd-shell') || document.getElementById('care-stage-container');
        if (lcdShell && !this.careSwipeBound) {
            this.careSwipeBound = true;
            let touchStartX = 0;
            lcdShell.addEventListener('touchstart', (e) => {
                if (e.touches && e.touches.length > 0) {
                    touchStartX = e.touches[0].clientX;
                }
            }, { passive: true });

            lcdShell.addEventListener('touchend', (e) => {
                if (e.changedTouches && e.changedTouches.length > 0) {
                    const touchEndX = e.changedTouches[0].clientX;
                    const diff = touchEndX - touchStartX;
                    if (Math.abs(diff) > 40) {
                        if (diff < 0) {
                            gameEngine.switchActiveMonster(1); // Swipe left -> Next
                        } else {
                            gameEngine.switchActiveMonster(-1); // Swipe right -> Prev
                        }
                        audioFX.playClick();
                        this.renderAll();
                    }
                }
            }, { passive: true });
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

        const btnCancelExplore = document.getElementById('btn-cancel-explore');
        if (btnCancelExplore) {
            btnCancelExplore.addEventListener('click', () => {
                this.closeFullscreenExploreModal();
            });
        }
    },

    startWalkingExplorationSequence(stageEventRes = null) {
        const biome = BIOMES_DATABASE[gameEngine.currentBiome || 'forest'];
        const party = gameEngine.getBattleParty();
        const aliveParty = party.filter(m => m && m.hp > 0);

        if (aliveParty.length === 0) {
            this.showToast('⚠️ 出撃できるパートナーのHPがありません。まずお世話・回復をしてください。', 'warning');
            return;
        }

        const res = stageEventRes || AdventureModule.explore(gameEngine.currentBiome);
        if (!res || !res.eventType) {
            if (res && res.message) this.showToast(res.message, 'warning');
            const btnExplore = document.getElementById('btn-explore-search');
            if (btnExplore) btnExplore.disabled = false;
            this.closeFullscreenExploreModal();
            return;
        }

        const modalExplore = document.getElementById('modal-fullscreen-explore');
        const titleEl = document.getElementById('fullscreen-biome-title');
        const statusEl = document.getElementById('fullscreen-explore-status');
        const bgStage = document.getElementById('fullscreen-walking-bg');
        const trioBox = document.getElementById('fullscreen-party-trio-box');
        const approachEl = document.getElementById('fullscreen-approaching-target');
        const eventOverlay = document.getElementById('fullscreen-event-overlay');
        const btnExplore = document.getElementById('btn-explore-search');

        if (btnExplore) btnExplore.disabled = true;
        if (eventOverlay) eventOverlay.style.display = 'none';

        // 1. Open Fullscreen Explore Overlay
        if (modalExplore) modalExplore.style.display = 'flex';
        if (titleEl) titleEl.innerText = `${biome.icon} ${biome.name} (ステージ ${res.stageNumber}/${res.totalStages})`;
        if (statusEl) statusEl.innerText = `🚩 [ステージ ${res.stageNumber}/${res.totalStages}] 🚶 【${party.length}体】で進行中...`;

        if (bgStage) {
            bgStage.className = `fullscreen-walking-viewport biome-bg-${gameEngine.currentBiome || 'forest'}`;
        }

        // 2. Render All Party Monsters (up to 3) in Trio Walking Formation!
        if (trioBox) {
            let html = '';
            party.forEach((mon, index) => {
                html += `
                <div class="party-trio-unit">
                    <span class="unit-name-tag" style="font-size:10px; background:rgba(0,0,0,0.6); padding:1px 6px; border-radius:8px; color:#fff; white-space:nowrap; margin-bottom:2px;">
                        ${mon.nickname} ${index === 0 ? '★' : ''}
                    </span>
                    ${renderMonsterSVG(mon.speciesId, { emotion: 'happy' })}
                </div>`;
            });
            trioBox.innerHTML = html;
        }

        audioFX.playClick();

        // 3. Trigger Right-to-Left Approaching Animation Sprite!
        if (approachEl) {
            if (res.eventType === 'chest') {
                approachEl.innerHTML = `<div style="font-size: 64px; filter: drop-shadow(0 0 16px #ffd15c);" class="walking-party-member">🎁</div>`;
            } else if (res.eventType === 'battle' || res.eventType === 'boss') {
                const enemySpec = res.battleData.enemyGroup[0].speciesId;
                approachEl.innerHTML = `
                    <div style="width: 90px; height: 90px;" class="walking-party-member">
                        ${renderMonsterSVG(enemySpec, { emotion: 'angry' })}
                    </div>`;
            }
            approachEl.style.display = 'block';
            approachEl.className = 'walking-approaching-target approaching-slide-active';
        }

        // 4. Fast 1.2s animated approaching before encounter triggers!
        setTimeout(() => {
            if (approachEl) {
                approachEl.style.display = 'none';
                approachEl.className = 'walking-approaching-target';
            }
            if (btnExplore) btnExplore.disabled = false;

            if (res.eventType === 'chest') {
                if (eventOverlay) {
                    eventOverlay.innerHTML = `
                        <div class="encounter-event-box chest-popup">
                            <span style="font-size: 56px;">🎁</span>
                            <h3 style="color: var(--color-accent); font-size: 20px;">【宝箱を発見！】</h3>
                            <p style="font-size: 14px; color: #fff; margin: 8px 0;">${res.goldFound} G と 「${res.itemFound.name}」 を手に入れた！</p>
                            <button class="btn btn-sm" style="font-size: 15px; padding: 10px 24px; font-weight: 800; background: linear-gradient(90deg, #76c84c, #ffd15c); border: 1px solid #fff; color: #0b1a0e;" onclick="UIController.closeWalkingEventOverlay()">✨ 宝箱を回収して次へ</button>
                        </div>`;
                    eventOverlay.style.display = 'flex';
                }
            } else if (res.eventType === 'battle' || res.eventType === 'boss') {
                if (bgStage) bgStage.classList.add('encounter-flash-active');
                if (eventOverlay) {
                    eventOverlay.innerHTML = `
                        <div class="encounter-event-box" style="border-color: #ff4444; box-shadow: 0 0 35px rgba(255, 68, 68, 0.7);">
                            <span style="font-size: 56px;">⚔️</span>
                            <h3 style="color: #ff4466; font-size: 20px;">【${res.eventType === 'boss' ? '⚠️ エリアボス軍団と遭遇！' : '野生モンスター遭遇！'}】</h3>
                            <p style="font-size: 14px; color: #fff;">${res.message}</p>
                        </div>`;
                    eventOverlay.style.display = 'flex';
                }

                audioFX.playHit();

                setTimeout(() => {
                    if (bgStage) bgStage.classList.remove('encounter-flash-active');
                    if (eventOverlay) eventOverlay.style.display = 'none';

                    const modalExplore = document.getElementById('modal-fullscreen-explore');
                    if (modalExplore) modalExplore.style.display = 'none';

                    document.getElementById('adventure-explore-view').style.display = 'none';
                    document.getElementById('battle-arena-view').style.display = 'block';
                    this.renderBattleArena();
                }, 900);
            }
        }, 1200);
    },

    closeFullscreenExploreModal() {
        const modalExplore = document.getElementById('modal-fullscreen-explore');
        const btnExplore = document.getElementById('btn-explore-search');
        if (modalExplore) modalExplore.style.display = 'none';
        if (btnExplore) btnExplore.disabled = false;
        this.renderAdventurePage();
    },

    closeWalkingEventOverlay() {
        const eventOverlay = document.getElementById('fullscreen-event-overlay');
        if (eventOverlay) eventOverlay.style.display = 'none';
        
        const nextStageRes = AdventureModule.advanceToNextStage();
        if (nextStageRes && nextStageRes.completed) {
            this.showToast('🎉 ダンジョン完全踏破クリア！', 'success');
            this.closeFullscreenExploreModal();
        } else if (nextStageRes && nextStageRes.eventType) {
            this.startWalkingExplorationSequence(nextStageRes);
        } else {
            this.closeFullscreenExploreModal();
        }
    },

    bindBattleButtons() {
        // Moves 1-4
        for (let i = 0; i < 4; i++) {
            const btnMove = document.getElementById(`btn-move-${i}`);
            if (btnMove) {
                btnMove.addEventListener('click', () => {
                    if (!battleEngine.inBattle) return;

                    const res = battleEngine.selectMemberMove(i, battleEngine.selectedTargetIndex || 0);
                    if (res && res.isError) {
                        this.showToast(res.message, 'warning');
                        return;
                    }
                    if (res && res.steps) {
                        this.playBattleRoundSequence(res);
                    } else {
                        this.renderBattleArena();
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
        const btnMute = document.getElementById('btn-mute-toggle');
        if (btnMute) {
            btnMute.addEventListener('click', () => {
                const muted = audioFX.toggleMute();
                btnMute.innerHTML = muted ? '🔇 SE: OFF' : '🔊 SE: ON';
            });
        }

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

        const btnOpenTrainer = document.getElementById('btn-open-trainer-select');
        if (btnOpenTrainer) {
            btnOpenTrainer.addEventListener('click', () => {
                this.openTrainerSelectModal();
            });
        }

        const btnConfirmPlayer = document.getElementById('btn-confirm-player');
        if (btnConfirmPlayer) {
            btnConfirmPlayer.addEventListener('click', () => {
                const inputName = document.getElementById('input-trainer-name');
                const name = inputName ? inputName.value.trim() || '主人公' : '主人公';
                if (!gameEngine.player) gameEngine.player = { energy: 100, maxEnergy: 100 };
                gameEngine.player.gender = this.selectedGender || 'boy';
                gameEngine.player.name = name;
                gameEngine.player.hasChosen = true;
                gameEngine.saveState();

                const modal = document.getElementById('modal-player-select');
                if (modal) modal.style.display = 'none';

                this.showToast(`✨ 主人公「${name}」を設定しました！`, 'success');
                this.renderAll();
            });
        }
    },

    openTrainerSelectModal() {
        const modal = document.getElementById('modal-player-select');
        const player = gameEngine.player || { gender: 'boy', name: '主人公' };
        this.selectGenderChoice(player.gender || 'boy');
        const inputName = document.getElementById('input-trainer-name');
        if (inputName) inputName.value = player.name || '主人公';
        if (modal) modal.style.display = 'flex';
    },

    selectGenderChoice(gender) {
        this.selectedGender = gender;
        const cardBoy = document.getElementById('choice-trainer-boy');
        const cardGirl = document.getElementById('choice-trainer-girl');

        if (cardBoy && cardGirl) {
            if (gender === 'boy') {
                cardBoy.style.borderColor = 'var(--color-primary)';
                cardBoy.classList.add('selected');
                cardGirl.style.borderColor = 'rgba(255,255,255,0.2)';
                cardGirl.classList.remove('selected');
            } else {
                cardGirl.style.borderColor = 'var(--color-primary)';
                cardGirl.classList.add('selected');
                cardBoy.style.borderColor = 'rgba(255,255,255,0.2)';
                cardBoy.classList.remove('selected');
            }
        }
    },

    renderAll() {
        this.renderHeader();
        if (this.activeTab === 'care') this.renderCarePage();
        else if (this.activeTab === 'incubator') this.renderIncubatorPage();
        else if (this.activeTab === 'adventure') this.renderAdventurePage();
        else if (this.activeTab === 'shop') this.renderShopPage();
        else if (this.activeTab === 'box') this.renderBoxPage();
        else if (this.activeTab === 'dex') this.renderDexPage();
    },

    renderHeader() {
        const goldEl = document.getElementById('header-gold-val');
        if (goldEl) goldEl.innerText = `${gameEngine.gold} G`;

        const player = gameEngine.player || { gender: 'boy', name: '主人公', energy: 100, maxEnergy: 100 };
        const trainerImg = document.getElementById('header-trainer-img');
        const trainerName = document.getElementById('header-trainer-name');
        const energyPill = document.getElementById('header-player-energy-val');

        if (trainerImg) {
            trainerImg.src = player.gender === 'girl' ? 'img/trainer_girl.png' : 'img/trainer_boy.png';
        }
        if (trainerName) {
            trainerName.innerText = player.name || '主人公';
        }
        if (energyPill) {
            energyPill.innerText = `⚡ 元気: ${player.energy}/${player.maxEnergy || 100}`;
        }
    },

    renderCarePage() {
        const stageContainer = document.getElementById('care-stage-container');
        const infoName = document.getElementById('care-monster-name');
        const infoSpecies = document.getElementById('care-monster-species');
        const infoLevel = document.getElementById('care-monster-level');
        const infoElement = document.getElementById('care-monster-element');

        const barHp = document.getElementById('bar-care-hp');
        const textHp = document.getElementById('text-care-hp-val');
        const barHunger = document.getElementById('bar-care-hunger');
        const barFriendship = document.getElementById('bar-care-friendship');
        const barCleanliness = document.getElementById('bar-care-cleanliness');
        const barExp = document.getElementById('bar-care-exp');

        const player = gameEngine.player || { gender: 'boy', name: '主人公', energy: 100, maxEnergy: 100 };

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

        // Auto recover HP if player has energy
        if (mon.hp === undefined || mon.hp === null || (mon.hp <= 0 && player.energy >= 5)) {
            mon.hp = mon.maxHp || 50;
            mon.isFainted = false;
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

        const hpPct = Math.floor((mon.hp / (mon.maxHp || 50)) * 100);
        if (barHp) barHp.style.width = `${hpPct}%`;
        if (textHp) textHp.innerText = `${mon.hp}/${mon.maxHp || 50}`;

        if (barHunger) barHunger.style.width = `${mon.hunger}%`;
        if (barFriendship) barFriendship.style.width = `${mon.friendship}%`;
        if (barCleanliness) barCleanliness.style.width = `${mon.cleanliness}%`;
        
        const expPct = Math.floor((mon.exp / mon.maxExp) * 100);
        if (barExp) barExp.style.width = `${expPct}%`;

        // Render ATK, DEF, SPD Values
        const valAtk = document.getElementById('val-care-atk');
        const valDef = document.getElementById('val-care-def');
        const valSpd = document.getElementById('val-care-spd');
        const movesListEl = document.getElementById('care-moves-list');

        if (valAtk) valAtk.innerText = mon.atk || spec.atk || 10;
        if (valDef) valDef.innerText = mon.def || spec.def || 10;
        if (valSpd) valSpd.innerText = mon.spd || spec.spd || 10;

        // Render 4 Attack Move Patterns with Elemental Icons & PP
        if (movesListEl) {
            const defaultPools = {
                fire: ['tackle', 'ember', 'flame_charge', 'fire_breath', 'fire_claw', 'lava_surge'],
                water: ['tackle', 'water_drop', 'bubble_beam', 'aqua_tail', 'surf_wave', 'hydro_pump'],
                grass: ['tackle', 'leaf_shot', 'vine_whip', 'leaf_blade', 'petal_storm', 'solar_beam'],
                cyber: ['tackle', 'spark', 'thunder_bolt', 'laser_claw', 'discharge', 'giga_volt']
            };
            const pool = defaultPools[mon.element || spec.element] || defaultPools.fire;
            const currentMoveItems = [...(mon.moves || spec.moves)];

            const moveIds = currentMoveItems.map(m => typeof m === 'string' ? m : (m ? m.id : 'tackle'));
            pool.forEach(pId => {
                if (moveIds.length < 4 && !moveIds.includes(pId)) {
                    moveIds.push(pId);
                }
            });

            let movesHtml = '';
            moveIds.slice(0, 4).forEach((mId, moveIdx) => {
                const mObj = MOVES_DATABASE[mId] || MOVES_DATABASE.tackle;
                const mElem = ELEMENT_TYPES[mObj.type] || { icon: '⚔️', color: '#fff' };
                const existing = currentMoveItems[moveIdx];
                const ppVal = (typeof existing === 'object' && existing && existing.pp !== undefined) ? existing.pp : (mObj.maxPp || 20);
                const maxPpVal = mObj.maxPp || 20;

                movesHtml += `
                <div style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 6px 8px; display: flex; flex-direction: column; gap: 2px;">
                    <div style="font-size: 11px; font-weight: bold; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${mElem.icon} ${mObj.name}
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8;">
                        <span>威力:${mObj.power}</span>
                        <span style="color: ${ppVal <= 0 ? '#ff6666' : '#ffd15c'}; font-weight: bold;">PP:${ppVal}/${maxPpVal}</span>
                    </div>
                </div>`;
            });

            movesListEl.innerHTML = movesHtml;
        }

        const owned = gameEngine.getAllOwnedMonsters();
        const switcherBar = document.getElementById('care-monster-switcher-bar');
        const counterEl = document.getElementById('care-monster-counter');

        if (owned.length > 1) {
            let activeIdx = owned.findIndex(m => m === mon || (m.uid && m.uid === mon.uid));
            if (activeIdx === -1) activeIdx = 0;
            if (switcherBar) switcherBar.style.display = 'flex';
            if (counterEl) counterEl.innerText = `${activeIdx + 1} / ${owned.length}`;
        } else {
            if (switcherBar) switcherBar.style.display = 'none';
        }

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
                    <p>冒険に出かけるかショップで新しいタマゴを購入できます！</p>
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

    renderShopPage() {
        const catalogGrid = document.getElementById('shop-catalog-grid');
        if (!catalogGrid) return;

        let html = '';

        // 1. Food Items
        SHOP_CATALOG.food.forEach(shopItem => {
            const item = ITEMS_DATABASE[shopItem.id];
            const ownCount = gameEngine.inventory[shopItem.id] || 0;
            html += `
            <div class="shop-card">
                <div class="shop-card-header">
                    <span class="shop-card-icon">${item.icon}</span>
                    <div class="shop-card-title">
                        <h4>${item.name}</h4>
                        <small style="color: #44dd66;">所持数: ${ownCount} 個</small>
                    </div>
                </div>
                <p class="shop-card-desc">${item.description}</p>
                <div class="shop-card-action">
                    <span class="shop-price-tag">💰 ${shopItem.buyPrice} G</span>
                    <div style="display: flex; gap: 4px;">
                        <button class="btn btn-sm" onclick="UIController.buyShopItem('${shopItem.id}')">購入</button>
                        ${ownCount > 0 ? `<button class="btn btn-sm" style="background: #442233; color: #ff88aa;" onclick="UIController.sellShopItem('${shopItem.id}')">売却(${shopItem.sellPrice}G)</button>` : ''}
                    </div>
                </div>
            </div>`;
        });

        // 2. Medicine & Tools
        SHOP_CATALOG.medicine.forEach(shopItem => {
            const item = ITEMS_DATABASE[shopItem.id];
            const ownCount = gameEngine.inventory[shopItem.id] || 0;
            html += `
            <div class="shop-card">
                <div class="shop-card-header">
                    <span class="shop-card-icon">${item.icon}</span>
                    <div class="shop-card-title">
                        <h4>${item.name}</h4>
                        <small style="color: #33aaff;">所持数: ${ownCount} 個</small>
                    </div>
                </div>
                <p class="shop-card-desc">${item.description}</p>
                <div class="shop-card-action">
                    <span class="shop-price-tag">💰 ${shopItem.buyPrice} G</span>
                    <div style="display: flex; gap: 4px;">
                        <button class="btn btn-sm" onclick="UIController.buyShopItem('${shopItem.id}')">購入</button>
                        ${ownCount > 0 ? `<button class="btn btn-sm" style="background: #442233; color: #ff88aa;" onclick="UIController.sellShopItem('${shopItem.id}')">売却(${shopItem.sellPrice}G)</button>` : ''}
                    </div>
                </div>
            </div>`;
        });

        // 3. Eggs
        SHOP_CATALOG.eggs.forEach(shopEgg => {
            const egg = EGGS_DATABASE[shopEgg.id];
            html += `
            <div class="shop-card" style="border-color: rgba(255, 209, 92, 0.4);">
                <div class="shop-card-header">
                    <span class="shop-card-icon">🥚</span>
                    <div class="shop-card-title">
                        <h4>${egg.name}</h4>
                        <small style="color: var(--color-accent);">属性タマゴ</small>
                <p class="shop-card-desc">${egg.description}</p>
                <div class="shop-card-action">
                    <span class="shop-price-tag">💰 ${shopEgg.buyPrice} G</span>
                    <button class="btn btn-sm" style="background: linear-gradient(90deg, #ffaa00, #ffd15c);" onclick="UIController.buyShopEgg('${shopEgg.id}')">🥚 タマゴ購入</button>
                </div>
            </div>`;
        });

        catalogGrid.innerHTML = html;
    },

    async playBattleRoundSequence(res) {
        if (!res || !res.steps) return;

        // Disable move buttons during resolution
        for (let i = 0; i < 4; i++) {
            const btn = document.getElementById(`btn-move-${i}`);
            if (btn) btn.disabled = true;
        }

        const sleep = ms => new Promise(r => setTimeout(r, ms));
        const fxLayer = document.getElementById('battle-fx-layer');

        // Track HP for each monster prior to step execution
        const enemyHpState = {};
        if (res.steps.length > 0) {
            res.steps.forEach(s => {
                if (s.targetSide === 'enemy' && enemyHpState[s.targetIndex] === undefined) {
                    enemyHpState[s.targetIndex] = s.targetHpBefore !== undefined ? s.targetHpBefore : s.targetMaxHp;
                }
            });
        }
        const playerHpState = {};
        if (res.steps.length > 0) {
            res.steps.forEach(s => {
                if (s.targetSide === 'player' && playerHpState[s.targetIndex] === undefined) {
                    playerHpState[s.targetIndex] = s.targetHpBefore !== undefined ? s.targetHpBefore : s.targetMaxHp;
                }
            });
        }

        for (const step of res.steps) {
            // Render arena showing HP BEFORE this step's damage
            this.renderBattleArena({ enemyHp: enemyHpState, playerHp: playerHpState });

            // Clear battle log box and show ONLY active step log line!
            const logBox = document.getElementById('battle-log-box');
            if (logBox) {
                logBox.innerHTML = `<p class="log-line">${step.logText}</p>`;
                logBox.scrollTop = logBox.scrollHeight;
            }

            const targetCardId = step.targetSide === 'enemy' ? `enemy-card-${step.targetIndex}` : `player-card-${step.targetIndex}`;
            const attackerCardId = step.attackerSide === 'player' ? `player-card-${step.attackerIndex}` : `enemy-card-${step.attackerIndex}`;

            const attackerEl = document.getElementById(attackerCardId);
            const targetEl = document.getElementById(targetCardId);

            // 1. Attacker steps forward
            if (attackerEl) {
                attackerEl.classList.add(step.attackerSide === 'player' ? 'step-attacker-player' : 'step-attacker-enemy');
            }

            // 2. Play Audio SE & Elemental Spell FX
            if (step.isCrit) audioFX.playCrit();
            else audioFX.playHit();

            if (fxLayer && targetEl) {
                const rect = targetEl.getBoundingClientRect();
                const frameRect = document.querySelector('.ff-battle-frame')?.getBoundingClientRect() || { left: 0, top: 0 };

                const fxDiv = document.createElement('div');
                const moveType = step.moveObj ? step.moveObj.type : 'normal';
                fxDiv.className = `attack-fx-overlay attack-fx-${moveType}`;
                fxDiv.style.position = 'absolute';
                fxDiv.style.left = `${rect.left - frameRect.left + rect.width / 2 - 35}px`;
                fxDiv.style.top = `${rect.top - frameRect.top + rect.height / 2 - 35}px`;
                fxDiv.style.width = '70px';
                fxDiv.style.height = '70px';
                fxDiv.style.pointerEvents = 'none';
                fxDiv.style.zIndex = '80';
                fxDiv.innerHTML = `<span style="font-size:42px;">${ELEMENT_TYPES[moveType]?.icon || '⚔️'}</span>`;

                fxLayer.appendChild(fxDiv);
                setTimeout(() => fxDiv.remove(), 600);
            }

            // 3. Target Flash & Shake + Animated HP Reduction + Floating Damage Text
            if (targetEl) {
                targetEl.classList.add('hit');

                // Animate HP Bar Reduction on Target Card upon hit!
                if (step.targetSide === 'enemy') {
                    enemyHpState[step.targetIndex] = step.targetHpRemaining;
                } else {
                    playerHpState[step.targetIndex] = step.targetHpRemaining;
                }

                const hpPct = Math.floor((step.targetHpRemaining / step.targetMaxHp) * 100);
                const hpBarFill = targetEl.querySelector('.progress-bar-fill');
                const hpText = targetEl.querySelector('small');
                if (hpBarFill) hpBarFill.style.width = `${hpPct}%`;
                if (hpText) hpText.innerText = `HP: ${step.targetHpRemaining}/${step.targetMaxHp}`;

                if (step.targetFainted) {
                    targetEl.classList.add('fainted');
                }

                const pop = document.createElement('div');
                pop.className = `floating-damage-popup ${step.isCrit ? 'crit' : ''}`;
                pop.innerText = `${step.isCrit ? '💥 CRITICAL! ' : ''}-${step.damage} HP`;
                targetEl.appendChild(pop);

                setTimeout(() => pop.remove(), 850);
            }

            await sleep(750);

            // Clean up classes
            if (attackerEl) {
                attackerEl.classList.remove('step-attacker-player', 'step-attacker-enemy');
            }
            if (targetEl) {
                targetEl.classList.remove('hit');
            }
        }

        // Re-enable buttons
        for (let i = 0; i < 4; i++) {
            const btn = document.getElementById(`btn-move-${i}`);
            if (btn) btn.disabled = false;
        }

        this.renderBattleArena();

        if (res.status === 'victory') {
            this.handleVictorySequence(res.victoryData || res);
        } else if (res.status === 'defeat') {
            this.handleDefeatSequence(res);
        } else {
            // Clear log box and set clean turn prompt for next action
            const logBox = document.getElementById('battle-log-box');
            if (logBox) {
                const actor = battleEngine.getCurrentActor();
                logBox.innerHTML = `<p class="log-line">⚔️ ▶ 【${actor ? actor.nickname : '仲間'}】 のコマンドを選択してください！</p>`;
            }
        }
    },

    renderBattleArena(hpState = null) {
        if (!battleEngine.inBattle) return;

        if (battleEngine.autoSelectAliveTarget) {
            battleEngine.autoSelectAliveTarget();
        }

        const actor = battleEngine.getCurrentActor();
        const turnHeader = document.getElementById('battle-turn-indicator');
        if (turnHeader) {
            if (actor) {
                turnHeader.innerHTML = `⚔️ ターン${battleEngine.turnCount} (メンバー ${battleEngine.currentActorIndex + 1}/${battleEngine.playerParty.length})： <strong>▶ 【${actor.nickname}】</strong> のコマンドを選択`;
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
                const displayHp = (hpState && hpState.enemyHp && hpState.enemyHp[idx] !== undefined) ? hpState.enemyHp[idx] : enemy.hp;
                const isFainted = (hpState && hpState.enemyHp && hpState.enemyHp[idx] !== undefined) ? (hpState.enemyHp[idx] <= 0) : enemy.isFainted;
                const hpPct = Math.floor((displayHp / enemy.maxHp) * 100);
                const isSelected = (!isFainted) && ((battleEngine.selectedTargetIndex || 0) === idx);

                html += `
                <div class="unit-party-card ${isFainted ? 'fainted' : ''} ${isSelected ? 'target-selected' : ''}" id="enemy-card-${idx}" onclick="UIController.setBattleTarget(${idx})">
                    <div class="unit-mini-sprite">${renderMonsterSVG(enemy.speciesId, { emotion: isFainted ? 'sleep' : 'angry' })}</div>
                    <div class="unit-info-box">
                        <div class="unit-name">${enemy.nickname} <small style="color:${elem.color}">Lv.${enemy.level}</small></div>
                        <div class="progress-bar-bg"><div class="progress-bar-fill fill-hunger" style="width:${hpPct}%"></div></div>
                        <small style="font-size:10px;">HP: ${displayHp}/${enemy.maxHp}</small>
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
                const displayHp = (hpState && hpState.playerHp && hpState.playerHp[idx] !== undefined) ? hpState.playerHp[idx] : member.hp;
                const isFainted = (hpState && hpState.playerHp && hpState.playerHp[idx] !== undefined) ? (hpState.playerHp[idx] <= 0) : member.isFainted;
                const hpPct = Math.floor((displayHp / member.maxHp) * 100);
                const isCurrentActor = actor && battleEngine.currentActorIndex === idx;

                html += `
                <div class="unit-party-card ${isFainted ? 'fainted' : ''} ${isCurrentActor ? 'active-turn' : ''}" id="player-card-${idx}">
                    <div class="unit-mini-sprite">${renderMonsterSVG(member.speciesId, { emotion: isFainted ? 'sleep' : (isCurrentActor ? 'happy' : 'battle') })}</div>
                    <div class="unit-info-box">
                        <div class="unit-name">${member.nickname} <small style="color:${elem.color}">Lv.${member.level}</small></div>
                        <div class="progress-bar-bg"><div class="progress-bar-fill fill-hunger" style="width:${hpPct}%"></div></div>
                        <small style="font-size:10px;">HP: ${displayHp}/${member.maxHp}</small>
                    </div>
                </div>`;
            });
            playerContainer.innerHTML = html;
        }

        // Render Current Actor's 4 Moves with PP Limits
        if (actor && actor.moves) {
            for (let i = 0; i < 4; i++) {
                const btnMove = document.getElementById(`btn-move-${i}`);
                if (btnMove) {
                    const moveItem = actor.moves[i];
                    if (moveItem) {
                        const moveId = typeof moveItem === 'string' ? moveItem : moveItem.id;
                        const baseMoveObj = MOVES_DATABASE[moveId] || MOVES_DATABASE.tackle;
                        const moveName = (typeof moveItem === 'object' && moveItem.name) ? moveItem.name : baseMoveObj.name;
                        const moveType = (typeof moveItem === 'object' && moveItem.type) ? moveItem.type : baseMoveObj.type;
                        const ppVal = (typeof moveItem === 'object' && moveItem.pp !== undefined) ? moveItem.pp : (baseMoveObj.maxPp || 20);
                        const maxPpVal = (typeof moveItem === 'object' && moveItem.maxPp !== undefined) ? moveItem.maxPp : (baseMoveObj.maxPp || 20);

                        const elem = ELEMENT_TYPES[moveType] || { icon: '⚔️', color: '#fff' };
                        const isZeroPp = ppVal <= 0;

                        btnMove.innerHTML = `<span>${elem.icon} ${moveName}</span><small style="${isZeroPp ? 'color:#ff6666;' : 'color:#ffd15c; font-weight:bold;'}">PP: ${ppVal}/${maxPpVal}</small>`;
                        btnMove.disabled = isZeroPp;
                        btnMove.style.opacity = isZeroPp ? '0.4' : '1.0';
                        btnMove.style.display = 'block';
                    } else {
                        btnMove.style.display = 'none';
                    }
                }
            }
        }
    },

    setBattleTarget(targetIdx) {
        if (battleEngine.enemyGroup && battleEngine.enemyGroup[targetIdx] && !battleEngine.enemyGroup[targetIdx].isFainted) {
            battleEngine.selectedTargetIndex = targetIdx;
            this.renderBattleArena();
        }
    },

    handleVictorySequence(res) {
        this.renderBattleArena();
        const logBox = document.getElementById('battle-log-box');
        const hasDungeon = !!AdventureModule.currentDungeon;

        // Disable move buttons during victory transition
        for (let i = 0; i < 4; i++) {
            const btn = document.getElementById(`btn-move-${i}`);
            if (btn) btn.disabled = true;
        }

        // Trigger Level-Up Effects on Party Member Cards
        if (battleEngine.playerParty) {
            battleEngine.playerParty.forEach((member, idx) => {
                if (member.leveledUp) {
                    const cardEl = document.getElementById(`player-card-${idx}`);
                    if (cardEl) {
                        this.triggerLevelUpEffect(cardEl, member.newLevel || member.level);
                    }
                    member.leveledUp = false;
                }
            });
        }

        if (logBox) {
            logBox.innerHTML += `
                <div style="margin-top: 10px; text-align: center; background: rgba(162, 217, 106, 0.25); border: 2px solid var(--color-primary); border-radius: 14px; padding: 12px; animation: popIn 0.3s ease-out;">
                    <h3 style="color: var(--color-accent); font-size: 18px; margin-bottom: 4px;">🎉 VICTORY！ バトル勝利！</h3>
                    <p style="font-size: 13px; color: #e0ffe0; margin: 0;">${hasDungeon ? '仲間モンスターの勝利！ 2秒後に次のステージへ進みます...' : '仲間モンスターの勝利！ 2秒後に冒険画面へ戻ります...'}</p>
                </div>`;
            logBox.scrollTop = logBox.scrollHeight;
        }

        // Automatic transition after 2 seconds (no button required!)
        setTimeout(() => {
            if (res.evoCandidates && res.evoCandidates.length > 0) {
                const firstEvo = res.evoCandidates[0];
                this.triggerEvolutionModal(firstEvo.member, firstEvo.nextEvoId);
            } else {
                this.finishBattleAndAdvanceDungeon();
            }
        }, 2000);
    },

    finishBattleAndAdvanceDungeon() {
        if (AdventureModule.currentDungeon) {
            const nextStageRes = AdventureModule.advanceToNextStage();
            if (nextStageRes && nextStageRes.completed) {
                this.showToast('🎉 ダンジョン完全踏破！エリアボス撃破おめでとう！', 'success');
                this.exitBattleArena();
            } else if (nextStageRes && nextStageRes.eventType) {
                this.startWalkingExplorationSequence(nextStageRes);
                document.getElementById('battle-arena-view').style.display = 'none';
            } else {
                this.exitBattleArena();
            }
        } else {
            this.exitBattleArena();
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

        if (preSprite) preSprite.innerHTML = renderMonsterSVG(monster.speciesId);
        if (postSprite) postSprite.innerHTML = renderMonsterSVG(nextEvoId);

        if (modal) modal.style.display = 'flex';

        const btnDoEvo = document.getElementById('btn-confirm-evo');
        if (btnDoEvo) {
            btnDoEvo.onclick = () => {
                const evoRes = TamagotchiModule.evolveMonster(monster, nextEvoId);
                if (modal) modal.style.display = 'none';

                this.showToast(`✨ おめでとう！ ${evoRes.oldName} は 「${evoRes.newName}」 に進化した！`, 'success');
                this.finishBattleAndAdvanceDungeon();
            };
        }
    },

    exitBattleArena() {
        battleEngine.inBattle = false;
        document.getElementById('battle-arena-view').style.display = 'none';
        document.getElementById('adventure-explore-view').style.display = 'block';
        this.renderAll();
    },

    renderBoxPage() {
        const grid = document.getElementById('monster-box-grid');
        if (!grid) return;

        const owned = gameEngine.getAllOwnedMonsters();

        if (owned.length === 0) {
            grid.innerHTML = '<p class="empty-box">手元にモンスターがいません。タマゴを孵化させましょう！</p>';
            return;
        }

        const currentParty = gameEngine.getBattleParty();

        let html = '';
        owned.forEach((mon, index) => {
            const isLeader = gameEngine.activeMonster && (gameEngine.activeMonster === mon || (mon.uid && mon.uid === gameEngine.activeMonster.uid));
            const inParty = currentParty.some(p => p === mon || (p.uid && p.uid === mon.uid));
            const partySlot = currentParty.findIndex(p => p === mon || (p.uid && p.uid === mon.uid)) + 1;

            const spec = MONSTERS_DATABASE[mon.speciesId] || MONSTERS_DATABASE.fire_1;
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
                <div style="font-size: 11px; font-weight: bold; color: #fff; margin-top: 4px; text-align: center;">
                    ${mon.nickname} <small style="color:#ffd15c;">Lv.${mon.level}</small>
                </div>
                <div style="display: flex; gap: 6px; font-size: 10px; color: #dcedc8; background: rgba(0,0,0,0.3); padding: 3px 8px; border-radius: 8px; margin: 2px 0;">
                    <span>⚔️${mon.atk || spec.atk}</span>
                    <span>🛡️${mon.def || spec.def}</span>
                    <span>💨${mon.spd || spec.spd}</span>
                </div>
                <div style="display: flex; gap: 6px; margin-top: 4px; width: 100%;">
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
        const owned = gameEngine.getAllOwnedMonsters();
        const target = owned[index];
        if (!target) return;

        gameEngine.activeMonster = target;
        gameEngine.saveState();

        audioFX.playClick();
        this.showToast(`「${target.nickname}」をメイン相棒に変更しました！`, 'success');
        this.renderAll();
    },

    togglePartyMember(index) {
        const owned = gameEngine.getAllOwnedMonsters();
        const target = owned[index];
        if (!target) return;

        if (!gameEngine.battleParty) gameEngine.battleParty = [];

        const existingIdx = gameEngine.battleParty.findIndex(p => p === target || (p.uid && p.uid === target.uid));
        if (existingIdx !== -1) {
            if (gameEngine.battleParty.length <= 1) {
                this.showToast('⚠️ 出撃パーティには最低1体が必要です。', 'warning');
                return;
            }
            gameEngine.battleParty.splice(existingIdx, 1);
            this.showToast(`「${target.nickname}」をパーティから外しました。`, 'info');
        } else {
            if (gameEngine.battleParty.length >= 3) {
                this.showToast('⚠️ パーティに編入できるのは最大3体までです。', 'warning');
                return;
            }
            gameEngine.battleParty.push(target);
            this.showToast(`⚔️ 「${target.nickname}」をパーティに編入しました！`, 'success');
        }

        gameEngine.saveState();
        this.renderAll();
    },

    renderDexPage() {
        const grid = document.getElementById('dex-grid');
        if (!grid) return;

        let html = '';
        
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
                    ${unlocked ? `
                        <p style="color: ${elem.color}">${elem.icon} ${STAGES[mon.stage]} - ${elem.name}属性</p>
                        <p style="font-size: 11px; color: #ffd15c; font-weight: bold; margin: 3px 0;">⚔️攻撃:${mon.atk} 🛡️防御:${mon.def} 💨早さ:${mon.spd}</p>
                        <p class="dex-desc">${mon.description}</p>
                    ` : '<p>未発見のモンスター</p>'}
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
            html = '<p class="empty-inventory">ごはんアイテムがありません！ショップで購入するか冒険の宝箱で獲得しましょう。</p>';
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
            html = '<p class="empty-inventory">バトルで使用できる回復薬がありません！ショップで購入しましょう。</p>';
        }

        container.innerHTML = html;
        modal.style.display = 'flex';
    },

    useBattleItemAction(itemId) {
        document.getElementById('modal-food-select').style.display = 'none';
        const res = battleEngine.useBattleItem(itemId);
        if (res && res.steps) {
            this.playBattleRoundSequence(res);
        } else {
            this.renderBattleArena();
        }
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
    },

    triggerLevelUpEffect(targetElement, newLevel = null) {
        if (!targetElement) return;

        audioFX.playLevelUp();

        targetElement.classList.add('level-up-target');

        const banner = document.createElement('div');
        banner.className = 'level-up-banner';
        banner.innerHTML = `🌟 LEVEL UP! ${newLevel ? 'Lv.' + newLevel : ''} 🌟`;
        targetElement.appendChild(banner);

        const sparkleBox = document.createElement('div');
        sparkleBox.className = 'level-up-sparkle-box';

        const colors = ['#ffd15c', '#ff5599', '#00ffff', '#76c84c', '#ffffff'];
        for (let i = 0; i < 14; i++) {
            const dot = document.createElement('div');
            dot.className = 'level-up-sparkle-dot';
            const angle = (i / 14) * Math.PI * 2;
            const dist = 45 + Math.random() * 45;
            const dx = (Math.cos(angle) * dist).toFixed(1) + 'px';
            const dy = (Math.sin(angle) * dist).toFixed(1) + 'px';
            dot.style.setProperty('--dx', dx);
            dot.style.setProperty('--dy', dy);
            dot.style.background = colors[i % colors.length];
            sparkleBox.appendChild(dot);
        }
        targetElement.appendChild(sparkleBox);

        setTimeout(() => {
            targetElement.classList.remove('level-up-target');
            banner.remove();
            sparkleBox.remove();
        }, 2400);
    }
};

window.renderGameUI = () => {
    UIController.renderAll();
};
