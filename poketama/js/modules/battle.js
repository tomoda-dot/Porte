/**
 * PokéTama Multi-Party Battle Engine Module (Classic FF Style 3v3) - v1.6.0
 */

class BattleEngine {
    constructor() {
        this.inBattle = false;
        this.playerParty = []; // Array of active player monsters
        this.enemyGroup = [];  // Array of 1~3 enemy monsters
        this.currentActorIndex = 0; // Which player party member is selecting command
        this.queuedCommands = []; // Moves queued for current round
        this.battleLog = [];
        this.isBossBattle = false;
        this.selectedTargetIndex = 0;
        this.turnCount = 1;
    }

    startPartyBattle(partyList, enemySpeciesList, isBoss = false) {
        const validParty = (partyList || []).filter(m => m && m.hp > 0);
        if (validParty.length === 0) {
            return { success: false, message: '出撃できるパートナーのHPがありません！お世話をして回復させてください。' };
        }

        this.playerParty = validParty.map((m, idx) => {
            const baseSpec = MONSTERS_DATABASE[m.speciesId] || MONSTERS_DATABASE.fire_1;
            let moveList = m.moves || baseSpec.moves;
            
            // Expand to 4 moves if needed
            const defaultPools = {
                fire: ['tackle', 'ember', 'flame_charge', 'fire_breath', 'fire_claw', 'lava_surge'],
                water: ['tackle', 'water_drop', 'bubble_beam', 'aqua_tail', 'surf_wave', 'hydro_pump'],
                grass: ['tackle', 'leaf_shot', 'vine_whip', 'leaf_blade', 'petal_storm', 'solar_beam'],
                cyber: ['tackle', 'spark', 'thunder_bolt', 'laser_claw', 'discharge', 'giga_volt']
            };
            const pool = defaultPools[m.element || baseSpec.element] || defaultPools.fire;
            const expandedIds = [...(moveList.map(moveItem => typeof moveItem === 'string' ? moveItem : moveItem.id))];
            
            pool.forEach(pId => {
                if (expandedIds.length < 4 && !expandedIds.includes(pId)) {
                    expandedIds.push(pId);
                }
            });

            const movesObjList = expandedIds.slice(0, 4).map((mId, moveIdx) => {
                const existing = Array.isArray(m.moves) && typeof m.moves[moveIdx] === 'object' ? m.moves[moveIdx] : null;
                const mData = MOVES_DATABASE[mId] || MOVES_DATABASE.tackle;
                const maxPp = mData.maxPp || 15;
                const currentPp = existing && existing.pp !== undefined ? existing.pp : maxPp;
                return {
                    id: mData.id,
                    name: mData.name,
                    type: mData.type,
                    power: mData.power,
                    accuracy: mData.accuracy,
                    maxPp: maxPp,
                    pp: currentPp
                };
            });

            m.moves = movesObjList;

            return {
                ...m,
                partyIndex: idx,
                isFainted: false
            };
        });

        this.enemyGroup = (enemySpeciesList || ['fire_1']).map((specId, idx) => {
            const base = MONSTERS_DATABASE[specId] || MONSTERS_DATABASE.fire_1;
            const avgLevel = Math.max(1, Math.floor(this.playerParty.reduce((acc, m) => acc + m.level, 0) / this.playerParty.length));
            const levelScale = avgLevel + (isBoss ? 1 : 0);
            
            // Balanced Enemy Max HP so battles are fair and beatable!
            const maxHp = Math.floor(base.maxHp * (isBoss ? (0.85 + levelScale * 0.12) : (0.55 + levelScale * 0.08)));

            return {
                groupIndex: idx,
                id: base.id,
                nickname: (isBoss && idx === 0 ? '【ボス】' : '') + base.name + (enemySpeciesList.length > 1 ? ` ${String.fromCharCode(65 + idx)}` : ''),
                speciesId: base.id,
                level: levelScale,
                hp: maxHp,
                maxHp: maxHp,
                atk: Math.floor(base.atk * (0.65 + levelScale * 0.08)),
                def: Math.floor(base.def * (0.65 + levelScale * 0.08)),
                spd: Math.floor(base.spd * (0.65 + levelScale * 0.08)),
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
        this.turnCount = 1;

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

        const moveObj = actor.moves[moveIndex];
        if (moveObj && moveObj.pp !== undefined && moveObj.pp <= 0) {
            return {
                isError: true,
                message: `⚠️ 【${moveObj.name}】の技回数(PP)が切れています！別の技を選択してください。`
            };
        }

        // Deduct Move PP
        if (moveObj && moveObj.pp > 0) {
            moveObj.pp--;
        }

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

    getEnemyAction(enemy) {
        const aliveParty = this.playerParty.filter(p => p.hp > 0 && !p.isFainted);
        if (aliveParty.length === 0) return null;

        let targetMember = null;

        // Tactical AI Target Selection
        if (enemy.isBoss) {
            targetMember = aliveParty.reduce((prev, curr) => (curr.hp / curr.maxHp) < (prev.hp / prev.maxHp) ? curr : prev, aliveParty[0]);
        } else if (enemy.element === 'fire') {
            targetMember = aliveParty.reduce((prev, curr) => curr.hp < prev.hp ? curr : prev, aliveParty[0]);
        } else if (enemy.element === 'water' || enemy.element === 'grass') {
            targetMember = aliveParty.find(p => ELEMENT_TYPES[p.element]?.weakness === enemy.element) || aliveParty[Math.floor(Math.random() * aliveParty.length)];
        } else {
            targetMember = aliveParty[Math.floor(Math.random() * aliveParty.length)];
        }

        if (!targetMember) targetMember = aliveParty[0];

        // Move Selection Strategy
        let selectedMoveId = enemy.moves[0];
        if (enemy.isBoss && enemy.hp < enemy.maxHp * 0.4) {
            selectedMoveId = enemy.moves.reduce((best, mId) => {
                const p1 = (MOVES_DATABASE[mId] || {}).power || 0;
                const p2 = (MOVES_DATABASE[best] || {}).power || 0;
                return p1 > p2 ? mId : best;
            }, enemy.moves[0]);
        } else {
            selectedMoveId = enemy.moves[Math.floor(Math.random() * enemy.moves.length)];
        }

        const move = MOVES_DATABASE[selectedMoveId] || MOVES_DATABASE.tackle;
        return { targetMember, move };
    }

    executeRound() {
        const steps = [];

        // --- PHASE 1: Player Party Turn Steps ---
        for (const cmd of this.queuedCommands) {
            const attacker = this.playerParty[cmd.memberIndex];
            if (!attacker || attacker.hp <= 0 || attacker.isFainted) continue;

            let target = this.enemyGroup[cmd.targetEnemyIndex];
            if (!target || target.isFainted) {
                target = this.enemyGroup.find(e => !e.isFainted);
            }
            if (!target) break; // All enemies defeated!

            const rawMove = attacker.moves[cmd.moveIndex] || attacker.moves[0] || 'tackle';
            const moveId = typeof rawMove === 'string' ? rawMove : (rawMove ? rawMove.id : 'tackle');
            const move = MOVES_DATABASE[moveId] || MOVES_DATABASE.tackle;

            const res = calculateBattleDamage(attacker, target, move, attacker.friendship);
            target.hp = Math.max(0, target.hp - res.damage);

            let logText = `⚔️ ${attacker.nickname} の 【${res.moveName}】！ `;
            if (res.isCrit) logText += '急所に当たった！ ';
            if (res.typeMult > 1.0) logText += 'ばつぐんだ！ ';
            if (res.typeMult < 1.0) logText += 'いまひとつのようだ... ';
            logText += `${target.nickname} に ${res.damage} ダメージ！`;

            if (target.hp <= 0) {
                target.isFainted = true;
                logText += ` 💥 ${target.nickname} は倒れた！`;
            }

            this.battleLog.push(logText);

            steps.push({
                attackerSide: 'player',
                attackerIndex: cmd.memberIndex,
                attackerName: attacker.nickname,
                targetSide: 'enemy',
                targetIndex: target.groupIndex,
                targetName: target.nickname,
                moveObj: move,
                damage: res.damage,
                isCrit: res.isCrit,
                typeMult: res.typeMult,
                targetHpRemaining: target.hp,
                targetMaxHp: target.maxHp,
                targetFainted: target.isFainted,
                logText
            });
        }

        // Check Victory
        const aliveEnemies = this.enemyGroup.filter(e => !e.isFainted);
        if (aliveEnemies.length === 0) {
            const vicData = this.handlePartyVictory();
            return {
                status: 'victory',
                steps,
                victoryData: vicData,
                log: this.battleLog
            };
        }

        // --- PHASE 2: Enemy Group Tactical Counterattack ---
        for (const enemy of aliveEnemies) {
            const aiAct = this.getEnemyAction(enemy);
            if (!aiAct) break;

            const targetPartyMember = aiAct.targetMember;
            const move = aiAct.move;

            const res = calculateBattleDamage(enemy, targetPartyMember, move);
            targetPartyMember.hp = Math.max(0, targetPartyMember.hp - res.damage);

            let logText = `⚡ 敵の ${enemy.nickname} の 【${res.moveName}】！ `;
            if (res.isCrit) logText += '急所に当たった！ ';
            logText += `${targetPartyMember.nickname} に ${res.damage} ダメージ！`;

            if (targetPartyMember.hp <= 0) {
                targetPartyMember.isFainted = true;
                logText += ` 💔 ${targetPartyMember.nickname} は倒れてしまった...`;
            }

            this.battleLog.push(logText);

            steps.push({
                attackerSide: 'enemy',
                attackerIndex: enemy.groupIndex,
                attackerName: enemy.nickname,
                targetSide: 'player',
                targetIndex: targetPartyMember.partyIndex,
                targetName: targetPartyMember.nickname,
                moveObj: move,
                damage: res.damage,
                isCrit: res.isCrit,
                typeMult: res.typeMult,
                targetHpRemaining: targetPartyMember.hp,
                targetMaxHp: targetPartyMember.maxHp,
                targetFainted: targetPartyMember.isFainted,
                logText
            });
        }

        // Check Defeat
        const alivePartyFinal = this.playerParty.filter(p => p.hp > 0 && !p.isFainted);
        if (alivePartyFinal.length === 0) {
            this.inBattle = false;
            this.battleLog.push(`💀 パーティ全員が倒れてしまった...`);
            return {
                status: 'defeat',
                steps,
                log: this.battleLog
            };
        }

        this.currentActorIndex = 0;
        this.queuedCommands = [];
        this.turnCount++;

        return {
            status: 'round_complete',
            steps,
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

        this.playerParty.forEach(member => {
            if (member.hp > 0 && !member.isFainted) {
                const expRes = TamagotchiModule.addExp(member, expGained);
                this.battleLog.push(`🌟 ${member.nickname}: EXP +${expGained}`);
                if (expRes.leveledUp) {
                    member.leveledUp = true;
                    member.newLevel = member.level;
                    this.battleLog.push(`✨ 🌟 LEVEL UP! ${member.nickname} は Lv.${member.level} にアップ！`);
                }
                if (expRes.canEvolve) {
                    evoCandidates.push({ member, nextEvoId: expRes.nextEvoId });
                }
            }
        });

        this.battleLog.push(`🎉 勝利！ ゴールド +${goldGained}G 獲得！`);

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
