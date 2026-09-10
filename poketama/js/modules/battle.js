/**
 * Pokemon-Style 2D RPG - Turn-based Battle & Catching Module
 */

const BattleModule = {
    activeBattle: null,

    startWildEncounter() {
        if (gameEngine.party.length === 0) return;

        const wildPool = ['wild_bird', 'wild_bug', 'fire_1', 'water_1', 'grass_1'];
        const wildId = wildPool[Math.floor(Math.random() * wildPool.length)];
        const wildLvl = Math.floor(Math.random() * 3) + 2; // Level 2~4

        const enemyMon = gameEngine.createPokemonInstance(wildId, wildLvl);
        const playerMon = gameEngine.party.find(p => p.hp > 0) || gameEngine.party[0];

        this.activeBattle = {
            isGym: false,
            playerMon,
            enemyMon,
            log: [`あせっ！ 野生の「${enemyMon.name}」(Lv.${enemyMon.level}) が飛び出してきた！`]
        };

        if (window.UIController) {
            window.UIController.openBattleOverlay();
        }
    },

    startGymBattle() {
        if (gameEngine.party.length === 0) return;

        const enemyMon = gameEngine.createPokemonInstance('gym_leader_1', 14);
        enemyMon.name = 'ジムリーダー [イワザル]';
        const playerMon = gameEngine.party.find(p => p.hp > 0) || gameEngine.party[0];

        this.activeBattle = {
            isGym: true,
            playerMon,
            enemyMon,
            log: [`🏰 ジムリーダーのイワザルが勝負を仕掛けてきた！`]
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

        // Element effectiveness
        let mult = 1.0;
        if (ELEMENT_TYPES[moveObj.type]) {
            const mType = ELEMENT_TYPES[moveObj.type];
            if (mType.strong === e.element) mult = 1.6;
            if (mType.weak === e.element) mult = 0.6;
        }

        const rawDmg = Math.max(8, Math.floor((p.atk * (moveObj.power / 40) - e.def * 0.25) * mult));
        const dmg = Math.floor(rawDmg * (0.85 + Math.random() * 0.3));

        e.hp = Math.max(0, e.hp - dmg);
        b.log.unshift(`⚔️ ${p.name}の「${moveObj.name}」！ ${e.name}に ${dmg} ダメージ！${mult > 1 ? ' (効果抜群！)' : ''}`);

        // Check Enemy KO
        if (e.hp <= 0) {
            b.log.unshift(`🎉 野生の ${e.name} は倒れた！ 勝利！`);
            
            // EXP Gain
            const expGained = e.level * 28;
            p.exp += expGained;
            b.log.unshift(`🌟 ${p.name}は ${expGained} EXP を獲得した！`);

            // Level Up Check
            while (p.exp >= p.maxExp) {
                p.exp -= p.maxExp;
                p.level += 1;
                p.maxExp = p.level * p.level * 8;
                p.maxHp += 8;
                p.hp = p.maxHp;
                p.atk += 5;
                p.def += 4;
                p.spd += 4;
                b.log.unshift(`✨ おめでとう！ ${p.name}は Lv.${p.level} へレベルアップ！`);

                // Evolution Check
                const spec = MONSTERS_DATABASE[p.speciesId];
                if (spec && spec.nextEvo && p.level >= spec.evoLevel) {
                    const nextSpec = MONSTERS_DATABASE[spec.nextEvo];
                    if (nextSpec) {
                        p.speciesId = nextSpec.id;
                        p.name = nextSpec.name;
                        b.log.unshift(`進化！！ ${p.name}へ進化を遂げた！`);
                    }
                }
            }

            if (b.isGym) {
                gameEngine.player.badgeCount += 1;
                gameEngine.player.money += 2000;
                b.log.unshift(`🏆 ジムバッジを獲得！ 賞金 2000 G を得た！`);
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
            b.log.unshift(`💀 ${p.name}は倒れてしまった... モンスターセンターで回復しましょう。`);
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
            b.playerMon.hp = Math.min(b.playerMon.maxHp, b.playerMon.hp + 40);
            b.log.unshift(`🧪 キズぐすりを使用！ ${b.playerMon.name}のHPが 40 回復した！`);
            gameEngine.saveState();
            this.executeEnemyMove();
        } else if (itemType === 'pokeball') {
            if (b.isGym) {
                alert('ジムリーダーのポケモンは捕まえられません！');
                return;
            }
            if (gameEngine.player.items.pokeball <= 0) {
                alert('モンスターボールがありません！');
                return;
            }
            gameEngine.player.items.pokeball--;
            b.log.unshift(`⚾ モンスターボールを投げた！`);

            // Catch Chance formula
            const catchRate = (b.enemyMon.maxHp - b.enemyMon.hp) / b.enemyMon.maxHp + 0.35;
            if (Math.random() < catchRate) {
                b.log.unshift(`🎉 やったー！ 野生の「${b.enemyMon.name}」を捕まえた！`);
                gameEngine.addPokemonToPartyOrPC(b.enemyMon);
                setTimeout(() => {
                    if (window.UIController) window.UIController.closeBattleOverlay();
                }, 1600);
            } else {
                b.log.unshift(`❌ あと一歩！ モンスターボールから抜け出された！`);
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
