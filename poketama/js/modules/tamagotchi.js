/**
 * PokéTama Tamagotchi Care System Module
 */

const TamagotchiModule = {
    // Create new instance of monster data when hatched
    createNewMonsterInstance(speciesId, name = null) {
        const base = MONSTERS_DATABASE[speciesId] || MONSTERS_DATABASE.fire_1;
        return {
            uid: 'mon_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
            id: base.id,
            nickname: name || base.name,
            speciesId: base.id,
            level: 1,
            exp: 0,
            maxExp: 50,
            hp: base.maxHp,
            maxHp: base.maxHp,
            sp: 30,
            maxSp: 30,
            atk: base.atk,
            def: base.def,
            spd: base.spd,
            element: base.element,
            stage: base.stage,
            moves: [...base.moves],

            // Tamagotchi Vitals
            hunger: 80, // 0 - 100
            friendship: 50, // 0 - 100
            energy: 90, // 0 - 100
            cleanliness: 100, // 0 - 100
            isSleeping: false,
            poopCount: 0
        };
    },

    getMonsterMood(monster) {
        if (!monster) return 'none';
        if (monster.isSleeping) return 'sleep';
        if (monster.hunger < 30) return 'hungry';
        if (monster.cleanliness < 40 || monster.energy < 25) return 'angry';
        return 'happy';
    },

    feed(monster, itemId) {
        const item = ITEMS_DATABASE[itemId];
        if (!item || item.type !== 'food') return { success: false, message: '食べ物ではありません。' };

        if (monster.hunger >= 100) {
            return { success: false, message: `${monster.nickname}はおなかいっぱいです！` };
        }

        monster.hunger = Math.min(100, monster.hunger + item.hungerRestore);
        monster.friendship = Math.min(100, monster.friendship + item.friendshipGain);

        // Food also slightly refreshes Player Energy (+5)
        if (gameEngine.player) {
            gameEngine.player.energy = Math.min(gameEngine.player.maxEnergy || 100, gameEngine.player.energy + 5);
        }

        // Deduct inventory item
        if (gameEngine.inventory[itemId] > 0) {
            gameEngine.inventory[itemId]--;
        }

        audioFX.playFeed();
        return {
            success: true,
            message: `${monster.nickname}に ${item.name} をあげた！ (おなか+${item.hungerRestore}, なつき度+${item.friendshipGain}, 主人公元気+5)`
        };
    },

    pet(monster) {
        if (!monster) return { success: false };
        if (monster.isSleeping) {
            return { success: false, message: `${monster.nickname}は静かに眠っています...` };
        }

        if (gameEngine.player && gameEngine.player.energy < 3) {
            return { success: false, message: '主人公の元気(スタミナ)が不足しています！(元気3必要)' };
        }

        if (gameEngine.player) {
            gameEngine.player.energy = Math.max(0, gameEngine.player.energy - 3);
        }

        monster.friendship = Math.min(100, monster.friendship + 10);

        // Also warm egg in incubator if present!
        if (gameEngine.incubator && gameEngine.incubator.length > 0) {
            gameEngine.incubator[0].warmth = Math.min(
                EGGS_DATABASE[gameEngine.incubator[0].id].warmthNeeded,
                gameEngine.incubator[0].warmth + 5
            );
        }

        audioFX.playPet();
        return {
            success: true,
            message: `${monster.nickname}を可愛がった！絆が深まった。(なつき度+10, 主人公元気-3)`
        };
    },

    clean(monster) {
        if (!monster) return { success: false };

        if (gameEngine.player && gameEngine.player.energy < 3) {
            return { success: false, message: '主人公の元気(スタミナ)が不足しています！(元気3必要)' };
        }

        if (gameEngine.player) {
            gameEngine.player.energy = Math.max(0, gameEngine.player.energy - 3);
        }

        monster.cleanliness = 100;
        audioFX.playFeed();
        return {
            success: true,
            message: `${monster.nickname}のまわりをキレイにお掃除した！(せいけつ度100%, 主人公元気-3)`
        };
    },

    toggleSleep(monster) {
        if (!monster) return { success: false };
        monster.isSleeping = !monster.isSleeping;

        if (monster.isSleeping && gameEngine.player) {
            gameEngine.player.energy = Math.min(gameEngine.player.maxEnergy || 100, gameEngine.player.energy + 20);
        }

        audioFX.playClick();
        return {
            success: true,
            message: monster.isSleeping ? `${monster.nickname}とおやすみモードに入りました... (主人公元気+20回復)` : `${monster.nickname}が目を覚ましました！`
        };
    },

    train(monster) {
        if (!monster) return { success: false };

        if (gameEngine.player && gameEngine.player.energy < 8) {
            return { success: false, message: '主人公の元気(スタミナ)が不足しています！(元気8必要)' };
        }

        if (monster.hp <= 10) {
            return { success: false, message: `${monster.nickname}の体力が少なすぎます！キズぐすりで回復してください。` };
        }

        if (monster.hunger <= 10) {
            return { success: false, message: `${monster.nickname}のおなかが空きすぎています！ごはんをあげてください。` };
        }

        // Deduct Player Energy & Monster HP / Hunger
        if (gameEngine.player) {
            gameEngine.player.energy = Math.max(0, gameEngine.player.energy - 8);
        }

        const hpLoss = Math.max(5, Math.floor((monster.maxHp || 50) * 0.15));
        monster.hp = Math.max(1, monster.hp - hpLoss);
        monster.hunger = Math.max(0, monster.hunger - 15);
        monster.friendship = Math.min(100, monster.friendship + 8);
        
        // Stats increase
        monster.atk += 2;
        monster.def += 1;

        // EXP gain
        const expGained = 30;
        this.addExp(monster, expGained);

        audioFX.playHit();
        return {
            success: true,
            message: `${monster.nickname}と特訓！ (EXP+${expGained}, なつき度+8, HP-${hpLoss}, おなか-15, 主人公元気-8)`
        };
    },

    addExp(monster, amount) {
        monster.exp += amount;
        let leveledUp = false;

        while (monster.exp >= monster.maxExp) {
            monster.exp -= monster.maxExp;
            monster.level += 1;
            monster.maxExp = Math.floor(monster.maxExp * 1.3);
            monster.maxHp += 15;
            monster.hp = monster.maxHp;
            monster.atk += 4;
            monster.def += 3;
            monster.spd += 3;
            leveledUp = true;
        }

        if (leveledUp) {
            audioFX.playLevelUp();
        }

        // Check Evolution
        const baseSpec = MONSTERS_DATABASE[monster.speciesId];
        if (baseSpec && baseSpec.nextEvolution) {
            if (monster.level >= baseSpec.evoLevel && monster.friendship >= baseSpec.evoFriendship) {
                return { leveledUp, canEvolve: true, nextEvoId: baseSpec.nextEvolution };
            }
        }

        return { leveledUp, canEvolve: false };
    },

    evolveMonster(monster, nextEvoId) {
        const nextSpec = MONSTERS_DATABASE[nextEvoId];
        if (!nextSpec) return false;

        const oldName = monster.nickname;
        monster.speciesId = nextSpec.id;
        monster.stage = nextSpec.stage;
        monster.element = nextSpec.element;
        monster.maxHp += 40;
        monster.hp = monster.maxHp;
        monster.atk += 25;
        monster.def += 20;
        monster.spd += 20;
        monster.moves = [...nextSpec.moves];

        if (monster.nickname === MONSTERS_DATABASE[monster.id]?.name) {
            monster.nickname = nextSpec.name;
        }
        monster.id = nextSpec.id;

        // Record in Dex
        gameEngine.dex[nextSpec.id] = true;

        audioFX.playEvolutionFanfare();
        return {
            success: true,
            oldName,
            newName: monster.nickname,
            nextSpec
        };
    }
};
