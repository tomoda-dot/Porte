/**
 * PokéTama Story RPG - Battle & 100-Dex Catch Engine
 */

const GYM_LEADERS_DATABASE = [
    { rank: 1, name: 'タケシ', town: 'ヒワダジム', badgeName: 'グレーバッジ', enemyId: 'grass_2', level: 12, prize: 1500 },
    { rank: 2, name: 'カスミ', town: 'ハナダジム', badgeName: 'ブルーバッジ', enemyId: 'water_2', level: 18, prize: 3000 },
    { rank: 3, name: 'マチス', town: 'クチバジム', badgeName: 'オレンジバッジ', enemyId: 'fire_2', level: 25, prize: 5000 },
    { rank: 4, name: 'エリカ', town: 'タマムシジム', badgeName: 'レインボーバッジ', enemyId: 'grass_3', level: 32, prize: 8000 },
    { rank: 5, name: 'キョウ', town: 'セキチクジム', badgeName: 'ピンクバッジ', enemyId: 'water_3', level: 40, prize: 12000 },
    { rank: 6, name: 'ナツメ', town: 'ヤマブキジム', badgeName: 'ゴールドバッジ', enemyId: 'fire_3', level: 48, prize: 18000 },
    { rank: 7, name: 'カツラ', town: 'グレンジム', badgeName: 'クリムゾンバッジ', enemyId: 'fire_3', level: 56, prize: 25000 },
    { rank: 8, name: 'サカキ', town: 'トキワジム (最終話)', badgeName: 'アースバッジ', enemyId: 'fire_3', level: 65, prize: 50000 }
];

const BattleModule = {
    activeBattle: null,

    startWildEncounter() {
        if (gameEngine.party.length === 0) return;

        // Pick random species from ALL_100_POKETAMA_LIST
        const randIndex = Math.floor(Math.random() * ALL_100_POKETAMA_LIST.length);
        const spec = ALL_100_POKETAMA_LIST[randIndex] || MONSTERS_DATABASE.fire_1;
        const wildLvl = Math.floor(Math.random() * 4) + 3; // Level 3~6

        const enemyMon = gameEngine.createPoketamaInstance(spec.id, wildLvl);
        const playerMon = gameEngine.party.find(p => p.hp > 0) || gameEngine.party[0];

        this.activeBattle = {
            isGym: false,
            playerMon,
            enemyMon,
            log: [`あせっ！ 野生の「${enemyMon.name}」(図鑑#${enemyMon.dexNo}) が飛び出してきた！`]
        };

        if (window.UIController) {
            window.UIController.openBattleOverlay();
        }
    },

    startGymBattle() {
        if (gameEngine.party.length === 0) return;

        const badgeCount = gameEngine.player.badgeCount || 0;
        const gym = GYM_LEADERS_DATABASE[badgeCount] || GYM_LEADERS_DATABASE[GYM_LEADERS_DATABASE.length - 1];

        const enemyMon = gameEngine.createPoketamaInstance(gym.enemyId, gym.level);
        enemyMon.name = `ジムリーダー [${gym.name}] の ${enemyMon.name}`;
        const playerMon = gameEngine.party.find(p => p.hp > 0) || gameEngine.party[0];

        this.activeBattle = {
            isGym: true,
            gym,
            playerMon,
            enemyMon,
            log: [`🏆 ${gym.town}！ ジムリーダーの${gym.name}が勝負を仕掛けてきた！`]
        };

        if (window.UIController) {
            window.UIController.openBattleOverlay();
        }
    },

    executePlayerMove(moveId) {
        if (!this.activeBattle) return;
        const b = this.activeBattle;
        const p = b.playerMon;
        const e = b.enemyMon;

        const moveObj = MOVES_DATABASE[moveId] || MOVES_DATABASE.tackle;

        // Element Effectiveness
        let mult = 1.0;
        if (ELEMENT_TYPES[moveObj.type]) {
            const mType = ELEMENT_TYPES[moveObj.type];
            if (mType.strong === e.element) mult = 1.6;
            if (mType.weak === e.element) mult = 0.6;
        }

        const rawDmg = Math.max(8, Math.floor((p.atk * (moveObj.power / 40) - e.def * 0.25) * mult));
        const dmg = Math.floor(rawDmg * (0.85 + Math.random() * 0.3));

        e.hp = Math.max(0, e.hp - dmg);
        b.log.unshift(`⚔️ ${p.name}の「${moveObj.name}」！ ${e.name}に ${dmg} ダメージ！${mult > 1 ? ' (効果は抜群だ！)' : ''}`);

        // Check Enemy KO
        if (e.hp <= 0) {
            b.log.unshift(`🎉 野生の ${e.name} は倒れた！ 勝利！`);

            // Register to Dex
            gameEngine.dex[e.speciesId] = true;
            
            // EXP Gain
            const expGained = e.level * 32;
            p.exp += expGained;
            b.log.unshift(`🌟 ${p.name}は ${expGained} EXP を獲得！`);

            // Level Up Check
            while (p.exp >= p.maxExp) {
                p.exp -= p.maxExp;
                p.level += 1;
                p.maxExp = p.level * p.level * 8;
                p.maxHp += 10;
                p.hp = p.maxHp;
                p.atk += 6;
                p.def += 5;
                p.spd += 5;
                b.log.unshift(`✨ おめでとう！ ${p.name}は Lv.${p.level} へレベルアップ！`);

                // Evolution Check
                const spec = MONSTERS_DATABASE[p.speciesId];
                if (spec && spec.nextEvo && p.level >= spec.evoLevel) {
                    const nextSpec = MONSTERS_DATABASE[spec.nextEvo];
                    if (nextSpec) {
                        p.speciesId = nextSpec.id;
                        p.name = nextSpec.name;
                        gameEngine.dex[nextSpec.id] = true;
                        b.log.unshift(`✨ 進化！！ ${p.name}へ姿が大きく進化した！`);
                    }
                }
            }

            if (b.isGym && b.gym) {
                gameEngine.player.badgeCount = Math.min(8, (gameEngine.player.badgeCount || 0) + 1);
                gameEngine.player.money += b.gym.prize;
                b.log.unshift(`🏆 【${b.gym.badgeName}】を獲得！ 賞金 ${b.gym.prize} G を手に入れた！`);
            }

            gameEngine.saveState();
            setTimeout(() => {
                if (window.UIController) window.UIController.closeBattleOverlay();
            }, 1800);
            return;
        }

        // Enemy Counter Attack
        this.executeEnemyMove();
    },

    executeEnemyMove() {
        const b = this.activeBattle;
        const p = b.playerMon;
        const e = b.enemyMon;

        const enemyMoveId = e.moves[Math.floor(Math.random() * e.moves.length)];
        const moveObj = MOVES_DATABASE[enemyMoveId] || MOVES_DATABASE.tackle;

        const rawDmg = Math.max(6, Math.floor((e.atk * (moveObj.power / 40) - p.def * 0.25)));
        const dmg = Math.floor(rawDmg * (0.85 + Math.random() * 0.3));

        p.hp = Math.max(0, p.hp - dmg);
        b.log.unshift(`💥 ${e.name}の「${moveObj.name}」！ ${p.name}は ${dmg} ダメージを受けた！`);

        if (p.hp <= 0) {
            b.log.unshift(`💀 ${p.name}は倒れてしまった... ポケタマセンターで回復しましょう。`);
            gameEngine.saveState();
            setTimeout(() => {
                if (window.UIController) window.UIController.closeBattleOverlay();
            }, 1800);
        }
    },

    useItem(itemType) {
        if (!this.activeBattle) return;
        const b = this.activeBattle;

        if (itemType === 'potion') {
            if (gameEngine.player.items.potion <= 0) {
                alert('キズぐすりがありません！');
                return;
            }
            gameEngine.player.items.potion--;
            b.playerMon.hp = Math.min(b.playerMon.maxHp, b.playerMon.hp + 45);
            b.log.unshift(`🧪 キズぐすりを使用！ ${b.playerMon.name}のHPが 45 回復した！`);
            gameEngine.saveState();
            this.executeEnemyMove();
        } else if (itemType === 'pokeball') {
            if (b.isGym) {
                alert('ジムリーダーのポケタマは捕まえられません！');
                return;
            }
            if (gameEngine.player.items.pokeball <= 0) {
                alert('モンスターボールがありません！');
                return;
            }
            gameEngine.player.items.pokeball--;
            b.log.unshift(`⚾ モンスターボールを投げた！`);

            // Catch Chance
            const catchRate = (b.enemyMon.maxHp - b.enemyMon.hp) / b.enemyMon.maxHp + 0.4;
            if (Math.random() < catchRate) {
                b.log.unshift(`🎉 やったー！ 野生の「${b.enemyMon.name}」(図鑑#${b.enemyMon.dexNo}) を捕まえた！`);
                gameEngine.addPoketamaToParty(b.enemyMon);
                
                const dexProgress = gameEngine.getDexProgress();
                b.log.unshift(`📖 全100種図鑑に登録！ （現在: ${dexProgress.caughtCount} / 100 種類）`);

                setTimeout(() => {
                    if (window.UIController) window.UIController.closeBattleOverlay();
                }, 1800);
            } else {
                b.log.unshift(`❌ あと少し！ ボールから逃げ出された！`);
                this.executeEnemyMove();
            }
        }
    },

    runAway() {
        if (!this.activeBattle) return;
        if (this.activeBattle.isGym) {
            alert('ジム戦からは逃げられない！');
            return;
        }
        if (window.UIController) {
            window.UIController.closeBattleOverlay();
        }
    }
};

window.BattleModule = BattleModule;
