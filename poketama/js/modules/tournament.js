/**
 * Monster Breeder Championship - Tournament & 1v1 Battle Engine
 */

const TOURNAMENTS_DATABASE = {
    E: { rank: 'E', name: 'E級 ビギナー杯', minLevel: 1, prizeGold: 300, trophy: 1, enemies: ['fire_1', 'water_1', 'grass_1'] },
    D: { rank: 'D', name: 'D級 ルーキー杯', minLevel: 5, prizeGold: 700, trophy: 2, enemies: ['fire_1', 'water_2', 'grass_2'] },
    C: { rank: 'C', name: 'C級 チャレンジャー杯', minLevel: 10, prizeGold: 1500, trophy: 3, enemies: ['fire_2', 'water_2', 'grass_2'] },
    B: { rank: 'B', name: 'B級 マスターズ杯', minLevel: 18, prizeGold: 3000, trophy: 4, enemies: ['fire_3', 'water_3', 'grass_3'] },
    A: { rank: 'A', name: 'A級 覇王決定戦', minLevel: 25, prizeGold: 6000, trophy: 5, enemies: ['fire_3', 'water_3', 'grass_3'] },
    S: { rank: 'S', name: 'S級 世界チャンピオン杯', minLevel: 35, prizeGold: 12000, trophy: 10, enemies: ['fire_4', 'water_4', 'grass_4'] }
};

const TournamentModule = {
    currentBattle: null,

    startMatch(rankKey) {
        const tourney = TOURNAMENTS_DATABASE[rankKey] || TOURNAMENTS_DATABASE.E;
        const playerMon = gameEngine.activeMonster;

        if (!playerMon) return { success: false, message: 'パートナーモンスターが選択されていません' };
        if (playerMon.fatigue >= 90) return { success: false, message: `${playerMon.nickname}は疲労しきっています！休養させてから大会に挑みましょう。` };

        // Pick random enemy species from rank pool
        const enemyId = tourney.enemies[Math.floor(Math.random() * tourney.enemies.length)];
        const spec = MONSTERS_DATABASE[enemyId] || MONSTERS_DATABASE.fire_1;

        // Scale enemy stats to rank difficulty
        const scaleMult = rankKey === 'E' ? 0.9 : (rankKey === 'D' ? 1.2 : (rankKey === 'C' ? 1.8 : (rankKey === 'B' ? 2.8 : (rankKey === 'A' ? 4.2 : 6.0))));
        
        const enemyMon = {
            nickname: `ライバル [${spec.name}]`,
            speciesId: spec.id,
            stage: spec.stage,
            element: spec.element,
            hp: Math.floor(spec.baseHp * scaleMult),
            maxHp: Math.floor(spec.baseHp * scaleMult),
            atk: Math.floor(spec.baseAtk * scaleMult),
            def: Math.floor(spec.baseDef * scaleMult),
            spd: Math.floor(spec.baseSpd * scaleMult),
            sp: 0,
            maxSp: 100,
            moves: [...spec.moves]
        };

        this.currentBattle = {
            rankKey,
            tourney,
            player: { ...playerMon, currentHp: playerMon.hp, currentSp: playerMon.sp || 0 },
            enemy: enemyMon,
            turn: 1,
            log: [`🏆 ${tourney.name} 試合開始！ VS ${enemyMon.nickname}`]
        };

        return {
            success: true,
            battle: this.currentBattle
        };
    },

    executeTurn(playerMoveId) {
        if (!this.currentBattle) return null;

        const b = this.currentBattle;
        const p = b.player;
        const e = b.enemy;

        const moveObj = MOVES_DATABASE[playerMoveId] || MOVES_DATABASE.tackle;

        // 1. Calculate Player Damage
        let elemMult = 1.0;
        if (ELEMENT_TYPES[moveObj.type]) {
            const mElem = ELEMENT_TYPES[moveObj.type];
            if (mElem.strong === e.element) elemMult = 1.5;
            if (mElem.weak === e.element) elemMult = 0.7;
        }

        const rawDmg = Math.max(10, Math.floor((p.atk * (moveObj.power / 40) - e.def * 0.3) * elemMult));
        const finalDmg = Math.floor(rawDmg * (0.9 + Math.random() * 0.2));

        e.currentHp = Math.max(0, e.currentHp - finalDmg);
        p.currentSp = Math.min(p.maxSp, p.currentSp + 25);

        b.log.unshift(`⚔️ ${p.nickname}の「${moveObj.name}」！ ${e.nickname}に ${finalDmg} ダメージ！${elemMult > 1 ? ' (効果は抜群だ！)' : ''}`);

        // Check Enemy KO
        if (e.currentHp <= 0) {
            b.log.unshift(`🎉 ${e.nickname}は倒れた！ ${p.nickname}の完全勝利！`);
            
            // Give Rewards
            const prize = b.tourney.prizeGold;
            gameEngine.breeder.gold += prize;
            gameEngine.breeder.trophies += b.tourney.trophy;

            // Update Monster Stats & Wins
            gameEngine.activeMonster.wins += 1;
            gameEngine.activeMonster.exp += 50;

            // Check Rank Upgrade
            if (gameEngine.breeder.rank === b.rankKey) {
                const ranks = ['E', 'D', 'C', 'B', 'A', 'S'];
                const curIdx = ranks.indexOf(b.rankKey);
                if (curIdx !== -1 && curIdx < ranks.length - 1) {
                    gameEngine.breeder.rank = ranks[curIdx + 1];
                    b.log.unshift(`🌟 ブリーダーランクが【${gameEngine.breeder.rank}級】へ昇格しました！`);
                }
            }

            gameEngine.saveState();
            return { result: 'victory', battle: b, prize };
        }

        // 2. Enemy Counter Attack
        const enemyMoveId = e.moves[Math.floor(Math.random() * e.moves.length)];
        const eMoveObj = MOVES_DATABASE[enemyMoveId] || MOVES_DATABASE.tackle;

        const eDmg = Math.max(8, Math.floor((e.atk * (eMoveObj.power / 40) - p.def * 0.3)));
        p.currentHp = Math.max(0, p.currentHp - eDmg);
        gameEngine.activeMonster.hp = p.currentHp;

        b.log.unshift(`💥 ${e.nickname}の反撃「${eMoveObj.name}」！ ${p.nickname}は ${eDmg} ダメージを受けた！`);

        // Check Player KO
        if (p.currentHp <= 0) {
            b.log.unshift(`💀 ${p.nickname}は倒れてしまった... 試合敗北。`);
            gameEngine.activeMonster.losses += 1;
            gameEngine.saveState();
            return { result: 'defeat', battle: b };
        }

        b.turn += 1;
        return { result: 'continue', battle: b };
    }
};
