/**
 * Monster Breeder Championship - Core Game Engine & State Manager
 */

class BreederGameEngine {
    constructor() {
        this.activeMonster = null;
        this.monsterBox = [];
        this.breeder = {
            name: 'ブリーダー',
            rank: 'E',
            trophies: 0,
            gold: 500,
            energy: 100,
            maxEnergy: 100
        };
        this.dex = {};
        this.STORAGE_KEY = 'poketama_breeder_save_v1';
    }

    init() {
        const saved = this.loadState();
        if (saved) {
            this.breeder = saved.breeder || this.breeder;
            this.monsterBox = saved.monsterBox || [];
            this.activeMonster = saved.activeMonster || (this.monsterBox.length > 0 ? this.monsterBox[0] : null);
            this.dex = saved.dex || {};
        }
    }

    createNewMonster(speciesId, name = null) {
        const spec = MONSTERS_DATABASE[speciesId] || MONSTERS_DATABASE.fire_1;
        const newMon = {
            uid: 'mon_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            speciesId: spec.id,
            nickname: name || spec.name,
            stage: spec.stage,
            element: spec.element,
            level: 1,
            exp: 0,
            maxExp: 100,
            
            // Battle Parameters
            hp: spec.baseHp,
            maxHp: spec.baseHp,
            atk: spec.baseAtk,
            def: spec.baseDef,
            spd: spec.baseSpd,
            sp: 0,
            maxSp: 100,
            moves: [...spec.moves],

            // Breeder Conditioning Vitals
            fatigue: 0, // 0 to 100 (high fatigue = tired)
            condition: '絶好調', // 絶好調, 普通, パテ気
            wins: 0,
            losses: 0
        };

        this.monsterBox.push(newMon);
        this.activeMonster = newMon;
        this.dex[spec.id] = true;
        this.saveState();
        return newMon;
    }

    saveState() {
        const data = {
            breeder: this.breeder,
            monsterBox: this.monsterBox,
            activeMonster: this.activeMonster,
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

const gameEngine = new BreederGameEngine();
