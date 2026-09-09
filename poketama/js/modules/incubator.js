/**
 * PokéTama Incubator & Egg Hatching System Module
 */

const IncubatorModule = {
    warmEgg(eggIndex, toolId = null) {
        if (!gameEngine.incubator || !gameEngine.incubator[eggIndex]) {
            return { success: false, message: 'タマゴが見つかりません。' };
        }

        const eggInstance = gameEngine.incubator[eggIndex];
        const eggData = EGGS_DATABASE[eggInstance.id];

        let amount = 15;
        if (toolId && gameEngine.inventory[toolId] > 0) {
            const tool = ITEMS_DATABASE[toolId];
            if (tool && tool.warmthAdd) {
                amount = tool.warmthAdd;
                gameEngine.inventory[toolId]--;
            }
        }

        eggInstance.warmth = Math.min(eggData.warmthNeeded, eggInstance.warmth + amount);
        audioFX.playPet();

        const progressPercent = Math.floor((eggInstance.warmth / eggData.warmthNeeded) * 100);

        if (eggInstance.warmth >= eggData.warmthNeeded) {
            return {
                success: true,
                readyToHatch: true,
                eggIndex,
                message: `タマゴが殻を突き破りそう！孵化の準備が整いました！`
            };
        }

        return {
            success: true,
            readyToHatch: false,
            message: `タマゴを温めた！ (温もり度 ${progressPercent}%)`
        };
    },

    hatchEgg(eggIndex, nicknameInput = null) {
        if (!gameEngine.incubator || !gameEngine.incubator[eggIndex]) {
            return { success: false };
        }

        const eggInstance = gameEngine.incubator[eggIndex];
        const eggData = EGGS_DATABASE[eggInstance.id];

        // Create new monster instance
        const newMonster = TamagotchiModule.createNewMonsterInstance(eggData.hatchesTo, nicknameInput);

        // Record Dex
        gameEngine.dex[eggInstance.id] = true;
        gameEngine.dex[newMonster.speciesId] = true;

        // Remove egg from incubator
        gameEngine.incubator.splice(eggIndex, 1);

        // Add to monsterBox master list
        gameEngine.monsterBox.push(newMonster);

        // If no active monster selected, set as active
        if (!gameEngine.activeMonster) {
            gameEngine.activeMonster = newMonster;
        }

        audioFX.playHatch();

        return {
            success: true,
            monster: newMonster,
            hatchedName: newMonster.nickname
        };
    },

    addNewEggToIncubator(eggId) {
        const eggData = EGGS_DATABASE[eggId];
        if (!eggData) return false;

        if (gameEngine.incubator.length >= 3) {
            return { success: false, message: '孵化器がいっぱいです（最大3個まで）。' };
        }

        gameEngine.incubator.push({
            id: eggId,
            warmth: 0,
            hatchesTo: eggData.hatchesTo
        });

        gameEngine.dex[eggId] = true;
        return { success: true, message: `新しい「${eggData.name}」を孵化器にセットしました！` };
    }
};
