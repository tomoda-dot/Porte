/**
 * PokéTama Multi-Party Battle Engine Module (Classic FF Style 3v3)
 */

class BattleEngine {
    constructor() {
        this.inBattle = false;
        this.playerParty = []; // Array of active player monsters
        this.enemyGroup = [];  // Array of 1~3 enemy monsters
        this.currentActorIndex = 0; // Which player party member is selecting command
        this.queuedCommands = []; // Moves queued for current round: [{ memberIndex, moveIndex, targetIndex }]
        this.battleLog = [];
        this.isBossBattle = false;
        this.selectedTargetIndex = 0;
    }

    startPartyBattle(partyList, enemySpeciesList, isBoss = false) {
        const validParty = (partyList || []).filter(m => m && m.hp > 0);
        if (validParty.length === 0) {
            return { success: false, message: '出撃できるパートナーのHPがありません！お世話をして回復させてください。' };
        }

        this.playerParty = validParty.map((m, idx) => ({
            ...m,
            partyIndex: idx,
            isFainted: false
        }));

        this.enemyGroup = (enemySpeciesList || ['fire_1']).map((specId, idx) => {
            const base = MONSTERS_DATABASE[specId] || MONSTERS_DATABASE.fire_1;
            const avgLevel = Math.max(1, Math.floor(this.playerParty.reduce((acc, m) => acc + m.level, 0) / this.playerParty.length));
            const levelScale = avgLevel + (isBoss ? 2 : 0);
            const maxHp = Math.floor(base.maxHp * (1.1 + levelScale * 0.2));

            return {
                groupIndex: idx,
                id: base.id,
                nickname: (isBoss && idx === 0 ? '【ボス】' : '') + base.name + (enemySpeciesList.length > 1 ? ` ${String.fromCharCode(65 + idx)}` : ''),
                speciesId: base.id,
                level: levelScale,
                hp: maxHp,
                maxHp: maxHp,
                atk: Math.floor(base.atk * (0.75 + levelScale * 0.1)),
                def: Math.floor(base.def * (0.75 + levelScale * 0.1)),
                spd: Math.floor(base.spd * (0.75 + levelScale * 0.1)),
                element: base.element,
                stage: base.stage,
                moves: [...base.moves],
                isBoss,
                isFainted: false
            };
        });

        this.inBattle = true;
        this.isBossBattle = isBoss;
        this.currentActorIndex = 0;
        this.queuedCommands = [];
        this.selectedTargetIndex = 0;

        const enemyNames = this.enemyGroup.map(e => e.nickname).join('・');
        this.battleLog = [`⚔️ 【戦闘開始】 野生のモンスター軍団 (${enemyNames}) が現れた！`];
        this.battleLog.push(`コマンドを選択して仲間パーティに命令を出してください！`);

        return {
            success: true,
            playerParty: this.playerParty,
            enemyGroup: this.enemyGroup,
            log: this.battleLog
        };
    }

    getCurrentActor() {
        if (!this.inBattle) return null;
        while (this.currentActorIndex < this.playerParty.length) {
            const member = this.playerParty[this.currentActorIndex];
            if (member && member.hp > 0 && !member.isFainted) {
                return member;
            }
            this.currentActorIndex++;
        }
        return null;
    }

    selectMemberMove(moveIndex, targetEnemyIndex = 0) {
        if (!this.inBattle) return null;
        const actor = this.getCurrentActor();
        if (!actor) return null;

        // Auto correct target index if fainted
        let targetIdx = targetEnemyIndex;
        if (!this.enemyGroup[targetIdx] || this.enemyGroup[targetIdx].isFainted) {
            targetIdx = this.enemyGroup.findIndex(e => !e.isFainted);
            if (targetIdx === -1) targetIdx = 0;
        }

        this.queuedCommands.push({
            memberIndex: this.currentActorIndex,
            moveIndex,
            targetEnemyIndex: targetIdx
        });

        this.currentActorIndex++;

        // Check if all active members queued their moves
        const nextActor = this.getCurrentActor();
        if (!nextActor) {
            // All party members entered commands! Execute full round!
            return this.executeRound();
        }

        return {
            status: 'queued',
            nextActor: nextActor,
            log: this.battleLog
        };
    }

    executeRound() {
        // --- PHASE 1: Player Party Turn Resolution ---
        for (const cmd of this.queuedCommands) {
            const attacker = this.playerParty[cmd.memberIndex];
            if (!attacker || attacker.hp <= 0 || attacker.isFainted) continue;

            let target = this.enemyGroup[cmd.targetEnemyIndex];
            // If target already fainted by previous member, redirect to first alive enemy
            if (!target || target.isFainted) {
                target = this.enemyGroup.find(e => !e.isFainted);
            }
            if (!target) break; // All enemies defeated!

            const moveId = attacker.moves[cmd.moveIndex] || attacker.moves[0] || 'tackle';
            const move = MOVES_DATABASE[moveId] || MOVES_DATABASE.tackle;

            const res = calculateBattleDamage(attacker, target, move, attacker.friendship);
            target.hp = Math.max(0, target.hp - res.damage);

            let logText = `⚔️ ${attacker.nickname} の 【${res.moveName}】！ `;
            if (res.isCrit) logText += '急所に当たった！ ';
            if (res.typeMult > 1.0) logText += 'ばつぐんだ！ ';
            if (res.typeMult < 1.0) logText += 'いまひとつのようだ... ';
            logText += `${target.nickname} に ${res.damage} ダメージ！`;

            this.battleLog.push(logText);

            if (res.isCrit) audioFX.playCrit();
            else audioFX.playHit();

            if (target.hp <= 0) {
                target.isFainted = true;
                this.battleLog.push(`💥 ${target.nickname} は倒れた！`);
            }
        }

        // Check Victory
        const aliveEnemies = this.enemyGroup.filter(e => !e.isFainted);
        if (aliveEnemies.length === 0) {
            return this.handlePartyVictory();
        }

        // --- PHASE 2: Enemy Group Counterattack Turn ---
        for (const enemy of aliveEnemies) {
            const aliveParty = this.playerParty.filter(p => p.hp > 0 && !p.isFainted);
            if (aliveParty.length === 0) break; // All party members fainted!

            // Pick random alive party member
            const targetPartyMember = aliveParty[Math.floor(Math.random() * aliveParty.length)];
            const randomMoveId = enemy.moves[Math.floor(Math.random() * enemy.moves.length)];
            const move = MOVES_DATABASE[randomMoveId] || MOVES_DATABASE.tackle;

            const res = calculateBattleDamage(enemy, targetPartyMember, move);
            targetPartyMember.hp = Math.max(0, targetPartyMember.hp - res.damage);

            let logText = `⚡ 敵の ${enemy.nickname} の 【${res.moveName}】！ `;
            if (res.isCrit) logText += '急所に当たった！ ';
            logText += `${targetPartyMember.nickname} に ${res.damage} ダメージ！`;

            this.battleLog.push(logText);
            audioFX.playHit();

            if (targetPartyMember.hp <= 0) {
                targetPartyMember.isFainted = true;
                this.battleLog.push(`💔 ${targetPartyMember.nickname} は倒れてしまった...`);
            }
        }

        // Check Defeat
        const alivePartyFinal = this.playerParty.filter(p => p.hp > 0 && !p.isFainted);
        if (alivePartyFinal.length === 0) {
            this.inBattle = false;
            this.battleLog.push(`💀 パーティ全員が倒れてしまった...`);
            return {
                status: 'defeat',
                log: this.battleLog
            };
        }

        // Reset turn command queue for next round
        this.currentActorIndex = 0;
        this.queuedCommands = [];

        return {
            status: 'round_complete',
            nextActor: this.getCurrentActor(),
            log: this.battleLog
        };
    }

    useBattleItem(itemId, targetMemberIndex = 0) {
        if (!this.inBattle) return null;

        const item = ITEMS_DATABASE[itemId];
        if (!item || item.type !== 'medicine') {
            return { success: false, message: 'バトルで使用できないアイテムです。' };
        }

        if (gameEngine.inventory[itemId] <= 0) {
            return { success: false, message: '所持数が足りません。' };
        }

        const targetMember = this.playerParty[targetMemberIndex] || this.getCurrentActor();
        if (!targetMember) return null;

        gameEngine.inventory[itemId]--;

        if (item.hpRestore) {
            targetMember.hp = Math.min(targetMember.maxHp, targetMember.hp + item.hpRestore);
            targetMember.isFainted = false;
            this.battleLog.push(`🧪 ${item.name} を使用！ ${targetMember.nickname} のHPが ${item.hpRestore} 回復した！`);
        }

        audioFX.playFeed();

        // Advance command turn
        this.currentActorIndex++;
        const nextActor = this.getCurrentActor();
        if (!nextActor) {
            return this.executeRound();
        }

        return {
            status: 'queued',
            nextActor: nextActor,
            log: this.battleLog
        };
    }

    flee() {
        if (!this.inBattle) return null;
        this.inBattle = false;
        this.battleLog.push('🏃 うまく逃げ切れた！');
        return {
            status: 'fled',
            log: this.battleLog
        };
    }

    handlePartyVictory() {
        this.inBattle = false;

        const totalEnemyLevel = this.enemyGroup.reduce((acc, e) => acc + e.level, 0);
        const expGained = Math.floor(30 * totalEnemyLevel * (this.isBossBattle ? 2.5 : 1.0));
        const goldGained = Math.floor(40 * totalEnemyLevel * (this.isBossBattle ? 2.0 : 1.0));

        gameEngine.gold += goldGained;

        const evoCandidates = [];

        // Distribute EXP to all surviving party members
        this.playerParty.forEach(member => {
            if (member.hp > 0 && !member.isFainted) {
                const expRes = TamagotchiModule.addExp(member, expGained);
                this.battleLog.push(`🌟 ${member.nickname}: EXP +${expGained}`);
                if (expRes.leveledUp) {
                    this.battleLog.push(`✨ ${member.nickname} は Lv.${member.level} にレベルアップ！`);
                }
                if (expRes.canEvolve) {
                    evoCandidates.push({ member, nextEvoId: expRes.nextEvoId });
                }
            }
        });

        this.battleLog.push(`🎉 勝利！ ゴールド +${goldGained}G 獲得！`);

        // Egg Drop Chance
        let eggDropped = null;
        if (Math.random() < (this.isBossBattle ? 0.9 : 0.4)) {
            const firstElem = this.enemyGroup[0].element || 'fire';
            const eggMapping = { fire: 'egg_fire', water: 'egg_water', grass: 'egg_grass', cyber: 'egg_cyber' };
            const targetEggId = eggMapping[firstElem] || 'egg_fire';
            const eggRes = IncubatorModule.addNewEggToIncubator(targetEggId);
            if (eggRes.success) {
                eggDropped = EGGS_DATABASE[targetEggId];
                this.battleLog.push(`🥚 探検報酬として「${eggDropped.name}」を発見した！孵化室に追加されました！`);
            }
        }

        return {
            status: 'victory',
            goldGained,
            expGained,
            evoCandidates,
            eggDropped,
            log: this.battleLog
        };
    }
}

const battleEngine = new BattleEngine();
