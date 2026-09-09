/**
 * PokéTama Main Game Core State & Tick Loop
 */

class GameEngine {
    constructor() {
        this.activeMonster = null;
        this.incubator = []; // Eggs being warmed
        this.monsterBox = []; // Raised monsters
        this.inventory = {
            berry_red: 5,
            berry_blue: 3,
            berry_golden: 1,
            meat_roast: 2,
            potion_small: 3,
            egg_blanket: 2
        };
        this.battleParty = []; // Party members for battle (up to 3 monsters)
        this.dex = {};
        this.gold = 300;
        this.currentBiome = 'forest';
        this.tickTimer = null;
        this.autoSaveTimer = null;
    }

    init() {
        const savedData = StorageManager.loadGame();
        if (savedData) {
            this.loadFromState(savedData);
        } else {
            this.setupInitialNewGame();
        }

        this.startTickLoop();
    }

    setupInitialNewGame() {
        // Start player with initial Fire Egg in incubator
        this.incubator = [
            {
                id: 'egg_fire',
                warmth: 80, // Almost ready to hatch!
                hatchesTo: 'fire_1'
            }
        ];
        this.dex['egg_fire'] = true;
        this.saveState();
    }

    loadFromState(saved) {
        this.activeMonster = saved.activeMonster || null;
        this.incubator = saved.incubator || [];
        this.monsterBox = saved.monsterBox || [];
        this.battleParty = saved.battleParty || (this.activeMonster ? [this.activeMonster] : []);
        this.inventory = saved.inventory || this.inventory;
        this.dex = saved.dex || {};
        this.gold = saved.gold || 300;
        this.currentBiome = saved.currentBiome || 'forest';
    }

    getAllOwnedMonsters() {
        let list = [];
        if (this.activeMonster) {
            list.push(this.activeMonster);
        }
        if (this.monsterBox && Array.isArray(this.monsterBox)) {
            this.monsterBox.forEach(m => {
                if (m && !list.some(existing => (existing.id === m.id && existing.nickname === m.nickname) || existing === m)) {
                    list.push(m);
                }
            });
        }
        return list;
    }

    switchActiveMonster(direction = 1) {
        const owned = this.getAllOwnedMonsters();
        if (owned.length <= 1) return this.activeMonster;

        let currentIndex = owned.findIndex(m => m === this.activeMonster || (m.id === this.activeMonster?.id && m.nickname === this.activeMonster?.nickname));
        if (currentIndex === -1) currentIndex = 0;

        let nextIndex = (currentIndex + direction + owned.length) % owned.length;
        this.activeMonster = owned[nextIndex];
        this.saveState();
        return this.activeMonster;
    }

    getBattleParty() {
        const owned = this.getAllOwnedMonsters();
        if (owned.length === 0) return [];

        // Auto-fill battleParty up to 3 members if not fully set
        let party = (this.battleParty || []).filter(m => m && owned.some(o => o === m || (o.id === m.id && o.nickname === m.nickname)));
        
        if (party.length === 0 && this.activeMonster) {
            party = [this.activeMonster];
        }

        // Fill up to 3 monsters from owned
        owned.forEach(m => {
            if (party.length < 3 && !party.some(p => p === m || (p.id === m.id && p.nickname === m.nickname))) {
                party.push(m);
            }
        });

        this.battleParty = party;

        // Guarantee hp initialization and revive members if energy >= 5
        this.battleParty.forEach(m => {
            if (m.maxHp === undefined || m.maxHp === null) m.maxHp = 50;
            if (m.hp === undefined || m.hp === null || m.hp <= 0) {
                if (m.energy === undefined || m.energy >= 5) {
                    m.hp = m.maxHp;
                    m.isFainted = false;
                }
            }
        });

        let alive = this.battleParty.filter(m => m.hp > 0);
        if (alive.length === 0 && this.battleParty.length > 0) {
            this.battleParty[0].hp = this.battleParty[0].maxHp;
            this.battleParty[0].isFainted = false;
        }

        return this.battleParty;
    }

    exportSaveState() {
        return {
            activeMonster: this.activeMonster,
            incubator: this.incubator,
            monsterBox: this.monsterBox,
            battleParty: this.battleParty,
            inventory: this.inventory,
            dex: this.dex,
            gold: this.gold,
            currentBiome: this.currentBiome
        };
    }

    saveState() {
        StorageManager.saveGame(this.exportSaveState());
    }

    startTickLoop() {
        if (this.tickTimer) clearInterval(this.tickTimer);
        // Game tick every 5 seconds
        this.tickTimer = setInterval(() => {
            this.onGameTick();
        }, 5000);

        // Auto save every 20 seconds
        this.autoSaveTimer = setInterval(() => {
            this.saveState();
        }, 20000);
    }

    onGameTick() {
        // Tick active monster vitals
        if (this.activeMonster && !this.activeMonster.isSleeping) {
            // Hunger drops slowly
            this.activeMonster.hunger = Math.max(0, this.activeMonster.hunger - 1);
            
            // Cleanliness drops over time
            if (Math.random() < 0.15) {
                this.activeMonster.cleanliness = Math.max(0, this.activeMonster.cleanliness - 5);
            }

            // Energy drops if hunger low or dirty
            if (this.activeMonster.hunger < 20 || this.activeMonster.cleanliness < 20) {
                this.activeMonster.energy = Math.max(0, this.activeMonster.energy - 2);
                this.activeMonster.friendship = Math.max(0, this.activeMonster.friendship - 1);
            }
        } else if (this.activeMonster && this.activeMonster.isSleeping) {
            // Sleep recovers energy
            this.activeMonster.energy = Math.min(100, this.activeMonster.energy + 10);
            if (this.activeMonster.energy >= 100) {
                this.activeMonster.isSleeping = false;
            }
        }

        // Tick incubator warmth for eggs
        if (this.incubator && this.incubator.length > 0) {
            this.incubator.forEach(egg => {
                const eggData = EGGS_DATABASE[egg.id];
                if (eggData && egg.warmth < eggData.warmthNeeded) {
                    // Gradual warming over time
                    egg.warmth = Math.min(eggData.warmthNeeded, egg.warmth + 1);
                }
            });
        }

        // Trigger UI refresh
        if (window.renderGameUI) {
            window.renderGameUI();
        }
    }
}

const gameEngine = new GameEngine();
