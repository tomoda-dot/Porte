/**
 * PokéTama Incubator & Egg Hatching System Module
 */

const IncubatorModule = {
    /**
     * Calculate incubation status and remaining time for an egg
     */
    getEggIncubationState(eggInstance) {
        if (!eggInstance) return null;

        const eggData = EGGS_DATABASE[eggInstance.id] || EGGS_DATABASE.egg_fire;

        if (!eggInstance.isIncubating || !eggInstance.startTime || !eggInstance.totalTimeSeconds) {
            return {
                isIncubating: false,
                isReady: false,
                progressPercent: 0,
                remainingSeconds: 0,
                formattedRemaining: '孵化器未セット',
                eggData
            };
        }

        const now = Date.now();
        const elapsedMs = now - eggInstance.startTime;
        const elapsedSeconds = Math.max(0, Math.floor(elapsedMs / 1000));
        const totalSec = eggInstance.totalTimeSeconds;

        const remainingSec = Math.max(0, totalSec - elapsedSeconds);
        const progressPercent = Math.min(100, Math.floor(((totalSec - remainingSec) / totalSec) * 100));
        const isReady = remainingSec <= 0;

        // Format MM:SS or HH:MM:SS
        let formatted = '';
        if (isReady) {
            formatted = '✨ 孵化可能！';
        } else {
            const minutes = Math.floor(remainingSec / 60);
            const seconds = remainingSec % 60;
            if (minutes >= 60) {
                const hours = Math.floor(minutes / 60);
                const remMins = minutes % 60;
                formatted = `${hours}時間${remMins}分${seconds.toString().padStart(2, '0')}秒`;
            } else {
                formatted = `${minutes.toString().padStart(2, '0')}分${seconds.toString().padStart(2, '0')}秒`;
            }
        }

        return {
            isIncubating: true,
            isReady,
            incubatorType: eggInstance.incubatorType,
            incubatorName: eggInstance.incubatorName || '孵化器',
            totalTimeSeconds: totalSec,
            elapsedSeconds,
            remainingSeconds: remainingSec,
            progressPercent,
            formattedRemaining: formatted,
            eggData
        };
    },

    /**
     * Attach an Incubator item from inventory to an egg to start countdown
     */
    startIncubation(eggIndex, incubatorItemId) {
        if (!gameEngine.incubator || !gameEngine.incubator[eggIndex]) {
            return { success: false, message: 'タマゴが見つかりません。' };
        }

        const eggInstance = gameEngine.incubator[eggIndex];
        if (eggInstance.isIncubating) {
            return { success: false, message: 'すでに孵化器にセットされています！' };
        }

        if (!gameEngine.inventory[incubatorItemId] || gameEngine.inventory[incubatorItemId] <= 0) {
            return { success: false, message: '指定の孵化器を所持していません。ショップで購入してください。' };
        }

        const incubatorData = ITEMS_DATABASE[incubatorItemId];
        if (!incubatorData || incubatorData.type !== 'incubator') {
            return { success: false, message: '無効な孵化器アイテムです。' };
        }

        // Consume 1 incubator item
        gameEngine.inventory[incubatorItemId]--;

        // Set incubation state
        eggInstance.isIncubating = true;
        eggInstance.incubatorType = incubatorItemId;
        eggInstance.incubatorName = incubatorData.name;
        eggInstance.startTime = Date.now();
        eggInstance.totalTimeSeconds = incubatorData.timeSeconds;

        gameEngine.saveState();

        if (window.audioFX && audioFX.playFeed) audioFX.playFeed();

        return {
            success: true,
            message: `✨ 「${incubatorData.name}」をセット！ 孵化を開始しました！（時間: ${Math.floor(incubatorData.timeSeconds / 60)}分）`
        };
    },

    /**
     * Hatch ready egg into monster
     */
    hatchEgg(eggIndex, nicknameInput = null) {
        if (!gameEngine.incubator || !gameEngine.incubator[eggIndex]) {
            return { success: false, message: 'タマゴが見つかりません。' };
        }

        const eggInstance = gameEngine.incubator[eggIndex];
        const state = this.getEggIncubationState(eggInstance);

        if (!state || !state.isReady) {
            return { success: false, message: 'まだ孵化の準備が整っていません。' };
        }

        const eggData = state.eggData;

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

        gameEngine.saveState();

        if (window.audioFX && audioFX.playHatch) audioFX.playHatch();

        return {
            success: true,
            monster: newMonster,
            hatchedName: newMonster.nickname
        };
    },

    /**
     * Add newly acquired egg to incubator room
     */
    addNewEggToIncubator(eggId) {
        const eggData = EGGS_DATABASE[eggId];
        if (!eggData) return false;

        if (gameEngine.incubator.length >= 3) {
            return { success: false, message: '孵化室がいっぱいです（最大3個まで）。まず既存のタマゴを孵化させてください！' };
        }

        gameEngine.incubator.push({
            id: eggId,
            isIncubating: false,
            incubatorType: null,
            incubatorName: null,
            startTime: null,
            totalTimeSeconds: null,
            hatchesTo: eggData.hatchesTo
        });

        gameEngine.dex[eggId] = true;
        gameEngine.saveState();
        return { success: true, message: `新しい「${eggData.name}」を孵化室に追加しました！` };
    }
};
