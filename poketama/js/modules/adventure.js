/**
 * PokéTama Biome Exploration Module
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
    explore(biomeId, playerMonster) {
        const biome = BIOMES_DATABASE[biomeId];
        if (!biome) return { success: false, message: '無効なエリアです。' };

        if (!playerMonster || playerMonster.hp <= 0) {
            return { success: false, message: 'パートナーのHPがありません。まずお世話・回復をしてください。' };
        }

        if (playerMonster.energy < 15) {
            return { success: false, message: 'パートナーが疲れています！睡眠でお休みさせてください。(元気15以上必要)' };
        }

        // Consume energy
        playerMonster.energy -= 15;

        // Roll event (70% Enemy Battle, 20% Treasure Chest, 10% Boss Encounter)
        const roll = Math.random();

        if (roll < 0.70) {
            // Wild Battle
            const enemyId = biome.enemies[Math.floor(Math.random() * biome.enemies.length)];
            const bRes = battleEngine.startBattle(playerMonster, enemyId, false);
            return {
                eventType: 'battle',
                battleData: bRes,
                message: `【${biome.name}】を探索中、野生のモンスターに遭遇した！`
            };
        } else if (roll < 0.90) {
            // Treasure Chest
            const goldFound = Math.floor(80 + Math.random() * 120);
            gameEngine.gold += goldFound;

            const possibleItems = ['berry_red', 'berry_blue', 'berry_golden', 'potion_small', 'egg_blanket'];
            const itemFoundId = possibleItems[Math.floor(Math.random() * possibleItems.length)];
            const itemObj = ITEMS_DATABASE[itemFoundId];

            gameEngine.inventory[itemFoundId] = (gameEngine.inventory[itemFoundId] || 0) + 1;

            audioFX.playFeed();

            return {
                eventType: 'chest',
                goldFound,
                itemFound: itemObj,
                message: `【宝箱を発見！】 ${goldFound}G と「${itemObj.name}」を入手した！`
            };
        } else {
            // Boss Encounter
            const bRes = battleEngine.startBattle(playerMonster, biome.boss, true);
            return {
                eventType: 'boss',
                battleData: bRes,
                message: `【警告！】 ${biome.name} のエリアボスが現れた！`
            };
        }
    }
};
