/**
 * PokéTama Story RPG - Game Engine & Save Manager
 */

class PoketamaGameEngine {
    constructor() {
        this.hasSeenIntro = false;
        this.player = {
            name: '主人公',
            money: 1000,
            badgeCount: 0, // 0 to 8 Gym Badges
            items: {
                pokeball: 10,
                potion: 5
            }
        };
        this.party = []; // Max 6 Poketama
        this.pcBox = [];
        this.dex = {}; // e.g. dex['fire_1'] = true
        this.STORAGE_KEY = 'poketama_story_rpg_save_v2';
    }

    init() {
        const saved = this.loadState();
        if (saved) {
            this.hasSeenIntro = saved.hasSeenIntro || false;
            this.player = saved.player || this.player;
            this.party = saved.party || [];
            this.pcBox = saved.pcBox || [];
            this.dex = saved.dex || {};
        }
    }

    createPoketamaInstance(speciesId, level = 5) {
        const base = MONSTERS_DATABASE[speciesId] || MONSTERS_DATABASE.fire_1;
        const scale = 1 + (level - 1) * 0.14;

        const maxHp = Math.floor(base.baseHp * scale);
        const atk = Math.floor(base.baseAtk * scale);
        const def = Math.floor(base.baseDef * scale);
        const spd = Math.floor(base.baseSpd * scale);

        const moves = base.moves.map(mId => {
            const mObj = MOVES_DATABASE[mId] || MOVES_DATABASE.tackle;
            return { id: mObj.id, name: mObj.name, pp: mObj.maxPp, maxPp: mObj.maxPp };
        });

        const mon = {
            uid: 'mon_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            speciesId: base.id,
            dexNo: base.dexNo || 1,
            name: base.name,
            element: base.element,
            stage: base.stage,
            level,
            exp: 0,
            maxExp: level * level * 8,
            hp: maxHp,
            maxHp,
            atk,
            def,
            spd,
            moves
        };

        this.dex[base.id] = true;
        return mon;
    }

    addPoketamaToParty(poketama) {
        if (this.party.length < 6) {
            this.party.push(poketama);
        } else {
            this.pcBox.push(poketama);
        }
        this.dex[poketama.speciesId] = true;
        this.saveState();
    }

    getDexProgress() {
        const caughtCount = Object.keys(this.dex).length;
        return {
            caughtCount,
            totalCount: 100,
            percent: Math.min(100, Math.floor((caughtCount / 100) * 100))
        };
    }

    saveState() {
        const data = {
            hasSeenIntro: this.hasSeenIntro,
            player: this.player,
            party: this.party,
            pcBox: this.pcBox,
            dex: this.dex
        };
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('Failed to save game state', e);
        }
    }

    loadState() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            console.error('Failed to load game state', e);
            return null;
        }
    }
}

const gameEngine = new PoketamaGameEngine();
window.gameEngine = gameEngine;
