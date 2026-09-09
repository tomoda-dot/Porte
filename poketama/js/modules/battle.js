/**
 * PokéTama Battle Engine Module
 */

class BattleEngine {
    constructor() {
        this.inBattle = false;
        this.playerMon = null;
        this.enemyMon = null;
        this.turn = 'player'; // 'player' | 'enemy'
        this.battleLog = [];
        this.onBattleEnd = null;
    }

    startBattle(playerMonster, enemySpeciesId, isBoss = false) {
        if (!playerMonster || playerMonster.hp <= 0) {
            return { success: false, message: 'パートナーのHPがありません！お世話をして回復させてください。' };
        }

        const enemyBase = MONSTERS_DATABASE[enemySpeciesId] || MONSTERS_DATABASE.fire_2;
        
        // Scale enemy stats to player level for exciting multi-turn battles
        const levelScale = Math.max(1, playerMonster.level + (isBoss ? 2 : 0));
        const enemyHp = Math.floor(enemyBase.maxHp * (1.3 + levelScale * 0.22));
        
        this.enemyMon = {
            id: enemyBase.id,
            nickname: (isBoss ? '【ボス】' : '') + enemyBase.name,
            speciesId: enemyBase.id,
            level: levelScale,
            hp: enemyHp,
            maxHp: enemyHp,
            atk: Math.floor(enemyBase.atk * (0.8 + levelScale * 0.12)),
            def: Math.floor(enemyBase.def * (0.8 + levelScale * 0.12)),
            spd: Math.floor(enemyBase.spd * (0.8 + levelScale * 0.12)),
            element: enemyBase.element,
            stage: enemyBase.stage,
            moves: [...enemyBase.moves],
            isBoss
        };

        this.playerMon = playerMonster;
        this.inBattle = true;
        this.turn = this.playerMon.spd >= this.enemyMon.spd ? 'player' : 'enemy';
        this.battleLog = [`野生の ${this.enemyMon.nickname} (Lv.${this.enemyMon.level}) があらわれた！`];

        if (this.turn === 'enemy') {
            this.battleLog.push(`${this.enemyMon.nickname} の方がすばやい！`);
        }

        return {
            success: true,
            player: this.playerMon,
            enemy: this.enemyMon,
            firstTurn: this.turn,
            log: this.battleLog
        };
    }

    playerExecuteMove(moveIndex) {
        if (!this.inBattle || this.turn !== 'player') return null;

        const moveId = this.playerMon.moves[moveIndex];
        const move = MOVES_DATABASE[moveId] || MOVES_DATABASE.tackle;

        // Execute damage
        const res = calculateBattleDamage(this.playerMon, this.enemyMon, move, this.playerMon.friendship);
        this.enemyMon.hp = Math.max(0, this.enemyMon.hp - res.damage);

        let logText = `${this.playerMon.nickname} の ${res.moveName}！ `;
        if (res.isCrit) logText += '急所に当たった！ ';
        if (res.typeMult > 1.0) logText += 'こうかは　ばつぐんだ！ ';
        if (res.typeMult < 1.0) logText += 'こうかは　いまひとつのようだ... ';
        logText += `${this.enemyMon.nickname} に ${res.damage} ダメージ！`;

        this.battleLog.push(logText);

        if (res.isCrit) audioFX.playCrit();
        else audioFX.playHit();

        // Check if enemy defeated
        if (this.enemyMon.hp <= 0) {
            return this.handlePlayerVictory(res);
        }

        // Enemy turn
        this.turn = 'enemy';
        return {
            status: 'ongoing',
            result: res,
            log: this.battleLog
        };
    }

    enemyExecuteMove() {
        if (!this.inBattle || this.turn !== 'enemy') return null;

        // Choose random move
        const randomMoveId = this.enemyMon.moves[Math.floor(Math.random() * this.enemyMon.moves.length)];
        const move = MOVES_DATABASE[randomMoveId] || MOVES_DATABASE.tackle;

        const res = calculateBattleDamage(this.enemyMon, this.playerMon, move);
        this.playerMon.hp = Math.max(0, this.playerMon.hp - res.damage);

        let logText = `相手の ${this.enemyMon.nickname} の ${res.moveName}！ `;
        if (res.isCrit) logText += '急所に当たった！ ';
        if (res.typeMult > 1.0) logText += 'こうかは　ばつぐんだ！ ';
        logText += `${this.playerMon.nickname} は ${res.damage} ダメージを受けた！`;

        this.battleLog.push(logText);
        audioFX.playHit();

        // Check if player defeated
        if (this.playerMon.hp <= 0) {
            this.inBattle = false;
            this.battleLog.push(`${this.playerMon.nickname} は倒れてしまった...`);
            this.playerMon.energy = 0;
            return {
                status: 'defeat',
                result: res,
                log: this.battleLog
            };
        }

        this.turn = 'player';
        return {
            status: 'ongoing',
            result: res,
            log: this.battleLog
        };
    }

    useBattleItem(itemId) {
        if (!this.inBattle || this.turn !== 'player') return null;

        const item = ITEMS_DATABASE[itemId];
        if (!item || item.type !== 'medicine') {
            return { success: false, message: 'バトルで使用できないアイテムです。' };
        }

        if (gameEngine.inventory[itemId] <= 0) {
            return { success: false, message: '所持数が足りません。' };
        }

        gameEngine.inventory[itemId]--;

        if (item.hpRestore) {
            this.playerMon.hp = Math.min(this.playerMon.maxHp, this.playerMon.hp + item.hpRestore);
            this.battleLog.push(`${item.name} を使用！ HPが ${item.hpRestore} 回復した。`);
        }

        audioFX.playFeed();
        this.turn = 'enemy';
        return {
            status: 'ongoing',
            log: this.battleLog
        };
    }

    flee() {
        if (!this.inBattle) return null;
        this.inBattle = false;
        this.battleLog.push('うまく逃げ切れた！');
        return {
            status: 'fled',
            log: this.battleLog
        };
    }

    handlePlayerVictory(lastAttackRes) {
        this.inBattle = false;
        
        // Base Rewards
        const expGained = Math.floor(35 * this.enemyMon.level * (this.enemyMon.isBoss ? 2.5 : 1.0));
        const goldGained = Math.floor(50 * this.enemyMon.level * (this.enemyMon.isBoss ? 2.0 : 1.0));

        gameEngine.gold += goldGained;
        
        const expRes = TamagotchiModule.addExp(this.playerMon, expGained);

        this.battleLog.push(`${this.enemyMon.nickname} を倒した！`);
        this.battleLog.push(`経験値 +${expGained}, ゴールド +${goldGained}G 獲得！`);

        if (expRes.leveledUp) {
            this.battleLog.push(`🌟 ${this.playerMon.nickname} は Lv.${this.playerMon.level} にレベルアップした！`);
        }

        // Egg Drop Chance!
        let eggDropped = null;
        const dropRoll = Math.random();
        if (dropRoll < (this.enemyMon.isBoss ? 0.9 : 0.35)) {
            // Pick Egg matching enemy element
            const eggMapping = {
                fire: 'egg_fire',
                water: 'egg_water',
                grass: 'egg_grass',
                cyber: 'egg_cyber'
            };
            const targetEggId = eggMapping[this.enemyMon.element] || 'egg_fire';
            const eggRes = IncubatorModule.addNewEggToIncubator(targetEggId);
            if (eggRes.success) {
                eggDropped = EGGS_DATABASE[targetEggId];
                this.battleLog.push(`🥚 探検報酬として「${eggDropped.name}」を発見した！孵化器に追加されました！`);
            }
        }

        return {
            status: 'victory',
            result: lastAttackRes,
            expGained,
            goldGained,
            leveledUp: expRes.leveledUp,
            canEvolve: expRes.canEvolve,
            nextEvoId: expRes.nextEvoId,
            eggDropped,
            log: this.battleLog
        };
    }
}

const battleEngine = new BattleEngine();
