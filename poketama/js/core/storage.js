/**
 * PokéTama LocalStorage Save & Load Manager
 */

const SAVE_KEY = 'POKETAMA_SAVE_DATA_V1';

const StorageManager = {
    saveGame(gameState) {
        try {
            const jsonStr = JSON.stringify(gameState);
            localStorage.setItem(SAVE_KEY, jsonStr);
            return true;
        } catch (e) {
            console.error('Failed to save game data', e);
            return false;
        }
    },

    loadGame() {
        try {
            const dataStr = localStorage.getItem(SAVE_KEY);
            if (!dataStr) return null;
            return JSON.parse(dataStr);
        } catch (e) {
            console.error('Failed to load save data', e);
            return null;
        }
    },

    clearSave() {
        localStorage.removeItem(SAVE_KEY);
    }
};
