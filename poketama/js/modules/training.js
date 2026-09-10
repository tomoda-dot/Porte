/**
 * Monster Breeder Championship - Training & Conditioning Module
 */

const TrainingModule = {
    train(monster, type) {
        if (!monster) return { success: false, message: 'パートナーが選択されていません' };

        if (monster.fatigue >= 100) {
            return {
                success: false,
                message: `${monster.nickname}は疲労困憊です！「休養・リフレッシュ」させてあげましょう。`
            };
        }

        // Increase Fatigue
        monster.fatigue = Math.min(100, monster.fatigue + 12);
        this.updateCondition(monster);

        let statName = '';
        let gainVal = 0;

        if (type === 'atk') {
            gainVal = Math.floor(Math.random() * 3) + 4; // +4 ~ 6
            monster.atk += gainVal;
            statName = `攻撃力 +${gainVal}`;
        } else if (type === 'def') {
            gainVal = Math.floor(Math.random() * 3) + 3; // +3 ~ 5
            monster.def += gainVal;
            statName = `防御力 +${gainVal}`;
        } else if (type === 'spd') {
            gainVal = Math.floor(Math.random() * 3) + 3; // +3 ~ 5
            monster.spd += gainVal;
            statName = `素早さ +${gainVal}`;
        } else if (type === 'sp') {
            gainVal = 10;
            monster.maxSp = Math.min(150, monster.maxSp + gainVal);
            statName = `SP上限 +${gainVal}`;
        }

        // EXP Gain
        const expGained = 30;
        monster.exp += expGained;
        let leveledUp = false;

        while (monster.exp >= monster.maxExp) {
            monster.exp -= monster.maxExp;
            monster.level += 1;
            monster.maxExp = Math.floor(monster.maxExp * 1.35);
            monster.maxHp += 20;
            monster.hp = monster.maxHp;
            monster.atk += 3;
            monster.def += 2;
            monster.spd += 2;
            leveledUp = true;
        }

        // Check Evolution
        const evoCheck = this.checkEvolution(monster);

        gameEngine.saveState();

        return {
            success: true,
            statName,
            gainVal,
            expGained,
            leveledUp,
            canEvolve: evoCheck.canEvolve,
            nextEvoId: evoCheck.nextEvoId,
            message: `${monster.nickname}の${statName}！(EXP+${expGained}, 疲労度+12)${leveledUp ? ` ✨ Lv.${monster.level}へレベルアップ！` : ''}`
        };
    },

    rest(monster) {
        if (!monster) return { success: false };
        monster.fatigue = 0;
        monster.hp = monster.maxHp;
        monster.condition = '絶好調';
        gameEngine.saveState();
        return {
            success: true,
            message: `${monster.nickname}をしっかり休養させました！疲労度0・HP全回復（絶好調！）`
        };
    },

    updateCondition(monster) {
        if (monster.fatigue < 40) {
            monster.condition = '絶好調';
        } else if (monster.fatigue < 85) {
            monster.condition = '普通';
        } else {
            monster.condition = '疲労困憊';
        }
    },

    checkEvolution(monster) {
        const spec = MONSTERS_DATABASE[monster.speciesId];
        if (!spec || !spec.nextEvolution) return { canEvolve: false };

        const nextSpec = MONSTERS_DATABASE[spec.nextEvolution];
        if (!nextSpec) return { canEvolve: false };

        let criteriaMet = false;
        if (spec.reqAtk && monster.atk >= spec.reqAtk) criteriaMet = true;
        if (spec.reqDef && monster.def >= spec.reqDef) criteriaMet = true;
        if (spec.reqSpd && monster.spd >= spec.reqSpd) criteriaMet = true;

        return { canEvolve: criteriaMet, nextEvoId: spec.nextEvolution };
    },

    evolve(monster) {
        const spec = MONSTERS_DATABASE[monster.speciesId];
        if (!spec || !spec.nextEvolution) return false;

        const nextSpec = MONSTERS_DATABASE[spec.nextEvolution];
        if (!nextSpec) return false;

        const oldName = monster.nickname;
        monster.speciesId = nextSpec.id;
        monster.stage = nextSpec.stage;
        monster.maxHp += 60;
        monster.hp = monster.maxHp;
        monster.atk += 30;
        monster.def += 25;
        monster.spd += 25;
        monster.moves = [...nextSpec.moves];

        if (monster.nickname === spec.name) {
            monster.nickname = nextSpec.name;
        }

        gameEngine.dex[nextSpec.id] = true;
        gameEngine.saveState();

        return {
            success: true,
            oldName,
            newName: monster.nickname,
            nextSpec
        };
    }
};
