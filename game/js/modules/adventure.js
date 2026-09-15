/**
 * PokéTama Biome Exploration Module - v2.0.0
 */

const BIOMES_DATABASE = {
    forest: {
        id: 'forest',
        name: 'はじまりの森',
        description: '緑豊かな静かな森林。可愛い草属性のモンスターが生息する。',
        icon: '🌳',
        color: '#44dd66',
        enemies: ['grass_1', 'grass_2', 'water_1'],
        boss: 'grass_3'
    },
    volcano: {
        id: 'volcano',
        name: '灼熱の火山',
        description: 'マグマの熱気が立ち込める危険なエリア。熱い情熱を持つ怪物が棲む。',
        icon: '🌋',
        color: '#ff5533',
        enemies: ['fire_1', 'fire_2', 'cyber_1'],
        boss: 'fire_3'
    },
    sea: {
        id: 'sea',
        name: '深海ゾーン',
        description: '神秘的な青い深海。巨大な水モンスターが悠々と泳ぎ回る。',
        icon: '🌊',
        color: '#33aaff',
        enemies: ['water_1', 'water_2', 'grass_2'],
        boss: 'water_3'
    },
    ruins: {
        id: 'ruins',
        name: '電脳遺跡',
        description: '古代のテクノロジーが眠る回路の迷宮。強力なサイバー生命体が巡回。',
        icon: '🔮',
        color: '#bb44ff',
        enemies: ['cyber_1', 'cyber_2', 'fire_2'],
        boss: 'cyber_3'
    }
};

const AdventureModule = {
    currentDungeon: null,

    explore(biomeId) {
        return this.startDungeon(biomeId);
    },

    startDungeon(biomeId) {
        const biome = BIOMES_DATABASE[biomeId];
        if (!biome) return { success: false, message: '無効なエリアです。' };

        const party = gameEngine.getBattleParty();
        const aliveParty = party.filter(m => m && m.hp > 0);

        if (aliveParty.length === 0) {
            return { success: false, message: '出撃できるパートナーのHPがありません。まずお世話・回復をしてください。' };
        }

        if (!gameEngine.player) {
            gameEngine.player = { gender: 'boy', name: '主人公', energy: 100, maxEnergy: 100 };
        }

        if (gameEngine.player.energy < 5) {
            return { success: false, message: '主人公の元気(スタミナ)が不足しています！(元気5以上必要)。時間経過・おやすみで回復してください。' };
        }

        // Consume Player Energy (5 energy per adventure)
        gameEngine.player.energy = Math.max(0, gameEngine.player.energy - 5);

        // Determine total stages for this dungeon run (5 to 7 stages)
        const totalStages = Math.floor(5 + Math.random() * 3); // 5, 6, or 7
        
        this.currentDungeon = {
            biomeId,
            currentStage: 1,
            totalStages: totalStages,
            isCompleted: false,
            // Temporary Pending Rewards (only claimed upon defeating final Boss!)
            pendingRewards: {
                gold: 0,
                exp: 0,
                items: []
            }
        };

        return this.processNextDungeonStage();
    },

    processNextDungeonStage() {
        if (!this.currentDungeon) return { success: false, message: 'ダンジョン情報がありません。' };

        const biome = BIOMES_DATABASE[this.currentDungeon.biomeId];
        const party = gameEngine.getBattleParty();
        const aliveParty = party.filter(m => m && m.hp > 0);

        if (aliveParty.length === 0) {
            this.handleDungeonDefeat();
            return { success: false, isDefeat: true, message: '出撃できるパートナーのHPがありません！ダンジョン探索失敗（報酬没収）' };
        }

        const stage = this.currentDungeon.currentStage;
        const total = this.currentDungeon.totalStages;
        const isFinalStage = (stage === total);

        if (isFinalStage) {
            // Final Stage: Always BOSS Battle! (Boss + up to 5 minions, total up to 6 enemies)
            const bossSpecies = biome.boss || biome.enemies[0];
            const enemyGroup = [bossSpecies];
            
            // Add 1 to 5 minion enemies (total max 6)
            const minionCount = Math.floor(1 + Math.random() * 5);
            for (let i = 0; i < minionCount; i++) {
                enemyGroup.push(biome.enemies[Math.floor(Math.random() * biome.enemies.length)]);
            }

            const bRes = battleEngine.startPartyBattle(aliveParty, enemyGroup, true);
            return {
                eventType: 'boss',
                stageNumber: stage,
                totalStages: total,
                battleData: bRes,
                message: `🚩 【ステージ ${stage}/${total} - 最奥部】 ⚠️ エリアボス 「${bRes.enemyGroup[0].nickname}」 軍団（全${bRes.enemyGroup.length}体）が現れた！`
            };
        } else {
            // Stages 1 to (N-1): Randomized Chest (30%) or Wild Battle (70%)
            const roll = Math.random();

            if (roll < 0.30) {
                // Treasure Chest -> Add to pendingRewards!
                const goldFound = Math.floor(80 + Math.random() * 120);
                const expFound = 20;

                // Weighted item pool: Common berries & potions, rare incubators
                const itemRoll = Math.random();
                let itemFoundId = 'berry_red';
                if (itemRoll < 0.35) {
                    itemFoundId = Math.random() < 0.5 ? 'berry_red' : 'berry_blue';
                } else if (itemRoll < 0.65) {
                    itemFoundId = 'potion_small';
                } else if (itemRoll < 0.85) {
                    itemFoundId = Math.random() < 0.7 ? 'incubator_standard' : 'berry_golden';
                } else if (itemRoll < 0.96) {
                    itemFoundId = 'incubator_super';
                } else {
                    itemFoundId = 'incubator_hyper'; // Rare (4% chance)
                }

                const itemObj = ITEMS_DATABASE[itemFoundId];

                // Accumulate in pendingRewards
                this.currentDungeon.pendingRewards.gold += goldFound;
                this.currentDungeon.pendingRewards.exp += expFound;
                this.currentDungeon.pendingRewards.items.push(itemFoundId);

                audioFX.playFeed();

                return {
                    eventType: 'chest',
                    stageNumber: stage,
                    totalStages: total,
                    goldFound,
                    expFound,
                    itemFound: itemObj,
                    pendingRewards: this.currentDungeon.pendingRewards,
                    message: `🚩 【ステージ ${stage}/${total}】 🎁 宝箱を発見！ ${goldFound}G 、「${itemObj.name}」、EXP+${expFound} を保留箱に追加！`
                };
            } else {
                // Wild Monster Battle (1 to 6 enemies!)
                const enemyCount = Math.floor(1 + Math.random() * 6); // 1, 2, 3, 4, 5, or 6
                const enemySpeciesList = [];
                for (let i = 0; i < enemyCount; i++) {
                    enemySpeciesList.push(biome.enemies[Math.floor(Math.random() * biome.enemies.length)]);
                }

                const bRes = battleEngine.startPartyBattle(aliveParty, enemySpeciesList, false);
                return {
                    eventType: 'battle',
                    stageNumber: stage,
                    totalStages: total,
                    battleData: bRes,
                    message: `🚩 【ステージ ${stage}/${total}】 ⚔️ 野生モンスター軍団（全${enemyCount}体）に遭遇した！`
                };
            }
        }
    },

    /**
     * Called when battle ends in victory or next stage progresses
     */
    addPendingBattleRewards(goldAmount, expAmount) {
        if (this.currentDungeon && this.currentDungeon.pendingRewards) {
            this.currentDungeon.pendingRewards.gold += goldAmount;
            this.currentDungeon.pendingRewards.exp += expAmount;
        }
    },

    /**
     * Called upon Boss Victory to claim all pending rewards!
     */
    claimAllPendingRewards() {
        if (!this.currentDungeon || !this.currentDungeon.pendingRewards) {
            return { gold: 0, exp: 0, items: [] };
        }

        const rewards = this.currentDungeon.pendingRewards;

        // 1. Award Gold
        gameEngine.gold += rewards.gold;

        // 2. Award Inventory Items
        rewards.items.forEach(itemId => {
            gameEngine.inventory[itemId] = (gameEngine.inventory[itemId] || 0) + 1;
        });

        // 3. Award EXP to alive party members
        const party = gameEngine.getBattleParty();
        const aliveParty = party.filter(m => m && m.hp > 0);
        aliveParty.forEach(mon => {
            TamagotchiModule.addExp(mon, rewards.exp);
        });

        gameEngine.saveState();
        return rewards;
    },

    /**
     * Called upon Wiping Out in Battle (Forfeits all pending rewards!)
     */
    handleDungeonDefeat() {
        const lostRewards = this.currentDungeon ? this.currentDungeon.pendingRewards : null;
        this.currentDungeon = null;
        return lostRewards;
    },

    advanceToNextStage() {
        if (!this.currentDungeon) return null;
        this.currentDungeon.currentStage++;
        if (this.currentDungeon.currentStage > this.currentDungeon.totalStages) {
            // Dungeon Cleared! Claim rewards!
            const claimed = this.claimAllPendingRewards();
            this.currentDungeon.isCompleted = true;
            this.currentDungeon = null;
            return { completed: true, claimedRewards: claimed };
        }
        return this.processNextDungeonStage();
    }
};
