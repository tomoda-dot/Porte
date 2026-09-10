/**
 * Pokemon-Style 2D RPG - Core Game Engine & Party Manager
 */

class PokemonGameEngine {
    constructor() {
        this.player = {
            name: 'サトシ',
            money: 1000,
            badgeCount: 0,
            items: {
                pokeball: 5,
                potion: 3
            }
        };
        this.party = []; // Max 6 Pokemon
        this.pcBox = [];
        this.dex = {};
        this.STORAGE_KEY = 'poketama_rpg_save_v1';
    }

    init() {
        const saved = this.loadState();
        if (saved) {
            this.player = saved.player || this.player;
            this.party = saved.party || [];
            this.pcBox = saved.pcBox || [];
            this.dex = saved.dex || {};
        }
    }

    createPokemonInstance(speciesId, level = 5) {
        const base = MONSTERS_DATABASE[speciesId] || MONSTERS_DATABASE.fire_1;
        const scale = 1 + (level - 1) * 0.12;

        const maxHp = Math.floor(base.baseHp * scale);
        const atk = Math.floor(base.baseAtk * scale);
        const def = Math.floor(base.baseDef * scale);
        const spd = Math.floor(base.baseSpd * scale);

        const moves = base.moves.map(mId => {
            const mObj = MOVES_DATABASE[mId] || MOVES_DATABASE.tackle;
            return { id: mObj.id, name: mObj.name, pp: mObj.maxPp, maxPp: mObj.maxPp };
        });

        const mon = {
            uid: 'pk_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            speciesId: base.id,
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

    addPokemonToPartyOrPC(pokemon) {
        if (this.party.length < 6) {
            this.party.push(pokemon);
        } else {
            this.pcBox.push(pokemon);
        }
        this.saveState();
    }

    saveState() {
        const data = {
            player: this.player,
            party: this.party,
            pcBox: this.pcBox,
            dex: this.dex
        };
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('Failed to save game', e);
        }
    }

    loadState() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            console.error('Failed to load game', e);
            return null;
        }
    }
}

const gameEngine = new PokemonGameEngine();
