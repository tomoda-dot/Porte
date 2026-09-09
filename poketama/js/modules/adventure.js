/**
 * PokéTama Biome Exploration Module - v1.8.0
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
            isCompleted: false
        };

        return this.processNextDungeonStage();
    },

    processNextDungeonStage() {
        if (!this.currentDungeon) return { success: false, message: 'ダンジョン情報がありません。' };

        const biome = BIOMES_DATABASE[this.currentDungeon.biomeId];
        const party = gameEngine.getBattleParty();
        const aliveParty = party.filter(m => m && m.hp > 0);

        if (aliveParty.length === 0) {
            this.currentDungeon = null;
            return { success: false, message: '出撃できるパートナーのHPがありません！ダンジョン探索を中断します。' };
        }

        const stage = this.currentDungeon.currentStage;
        const total = this.currentDungeon.totalStages;
        const isFinalStage = (stage === total);

        if (isFinalStage) {
            // Final Stage: Always BOSS Battle!
            const bossSpecies = biome.boss || biome.enemies[0];
            const enemyGroup = [bossSpecies];
            if (biome.enemies && biome.enemies.length > 0) {
                enemyGroup.push(biome.enemies[0]);
            }

            const bRes = battleEngine.startPartyBattle(aliveParty, enemyGroup, true);
            return {
                eventType: 'boss',
                stageNumber: stage,
                totalStages: total,
                battleData: bRes,
                message: `🚩 【ステージ ${stage}/${total} - 最奥部】 ⚠️ エリアボス 「${bRes.enemyGroup[0].nickname}」 軍団が現れた！`
            };
        } else {
            // Stages 1 to (N-1): Randomized Chest (30%) or Wild Battle (70%)
            const roll = Math.random();

            if (roll < 0.30) {
                // Treasure Chest
                const goldFound = Math.floor(80 + Math.random() * 120);
                gameEngine.gold += goldFound;

                const possibleItems = ['berry_red', 'berry_blue', 'berry_golden', 'potion_small', 'egg_blanket'];
                const itemFoundId = possibleItems[Math.floor(Math.random() * possibleItems.length)];
                const itemObj = ITEMS_DATABASE[itemFoundId];

                gameEngine.inventory[itemFoundId] = (gameEngine.inventory[itemFoundId] || 0) + 1;

                // Award EXP +20 to all alive party members
                const expFound = 20;
                aliveParty.forEach(m => {
                    TamagotchiModule.addExp(m, expFound);
                });

                audioFX.playFeed();

                return {
                    eventType: 'chest',
                    stageNumber: stage,
                    totalStages: total,
                    goldFound,
                    expFound,
                    itemFound: itemObj,
                    message: `🚩 【ステージ ${stage}/${total}】 🎁 宝箱を発見！ ${goldFound}G 、「${itemObj.name}」、EXP+${expFound} を入手した！`
                };
            } else {
                // Wild Monster Battle (1 to 3 enemies)
                const enemyCount = Math.min(3, Math.max(1, Math.floor(Math.random() * aliveParty.length) + (Math.random() < 0.5 ? 1 : 0)));
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
                    message: `🚩 【ステージ ${stage}/${total}】 ⚔️ 野生モンスター軍団に遭遇した！`
                };
            }
        }
    },

    advanceToNextStage() {
        if (!this.currentDungeon) return null;
        this.currentDungeon.currentStage++;
        if (this.currentDungeon.currentStage > this.currentDungeon.totalStages) {
            this.currentDungeon.isCompleted = true;
            this.currentDungeon = null;
            return { completed: true };
        }
        return this.processNextDungeonStage();
    }
};
