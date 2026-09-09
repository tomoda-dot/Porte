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
        this.player = {
            gender: 'boy',
            name: '主人公',
            energy: 100,
            maxEnergy: 100
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
        this.player = saved.player || { gender: 'boy', name: '主人公', energy: 100, maxEnergy: 100 };
        this.incubator = saved.incubator || [];
        this.monsterBox = saved.monsterBox || [];
        this.inventory = saved.inventory || this.inventory;
        this.dex = saved.dex || {};
        this.gold = saved.gold || 300;
        this.currentBiome = saved.currentBiome || 'forest';

        // Ensure all monsters have unique uids
        this.monsterBox.forEach((m, idx) => {
            if (m && !m.uid) {
                m.uid = 'mon_' + idx + '_' + (m.speciesId || 'mon') + '_' + Date.now();
            }
        });

        if (saved.activeMonster) {
            if (!saved.activeMonster.uid) {
                saved.activeMonster.uid = 'mon_active_' + Date.now();
            }
            // Find existing instance in monsterBox by uid or reference
            const match = this.monsterBox.find(m => m && (m.uid === saved.activeMonster.uid || (m.speciesId === saved.activeMonster.speciesId && m.nickname === saved.activeMonster.nickname)));
            if (match) {
                this.activeMonster = match;
            } else {
                this.monsterBox.unshift(saved.activeMonster);
                this.activeMonster = saved.activeMonster;
            }
        } else if (this.monsterBox.length > 0) {
            this.activeMonster = this.monsterBox[0];
        } else {
            this.activeMonster = null;
        }

        this.battleParty = saved.battleParty || (this.activeMonster ? [this.activeMonster] : []);
    }

    getAllOwnedMonsters() {
        if (!this.monsterBox || !Array.isArray(this.monsterBox)) {
            this.monsterBox = [];
        }

        // Clean nulls
        this.monsterBox = this.monsterBox.filter(m => m !== null && m !== undefined);

        // Ensure activeMonster is in monsterBox
        if (this.activeMonster && !this.monsterBox.some(m => m === this.activeMonster || (m.uid && m.uid === this.activeMonster.uid))) {
            this.monsterBox.unshift(this.activeMonster);
        }

        // Deduplicate monsterBox by uid or reference
        const unique = [];
        this.monsterBox.forEach(m => {
            if (m && !unique.some(u => u === m || (m.uid && u.uid === m.uid))) {
                unique.push(m);
            }
        });

        this.monsterBox = unique;
        return this.monsterBox;
    }

    switchActiveMonster(direction = 1) {
        const owned = this.getAllOwnedMonsters();
        if (owned.length <= 1) return this.activeMonster;

        let currentIndex = owned.findIndex(m => m === this.activeMonster || (m.uid && m.uid === this.activeMonster?.uid));
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
        let party = (this.battleParty || []).filter(m => m && owned.some(o => o === m || (o.uid && o.uid === m.uid)));
        
        if (party.length === 0 && this.activeMonster) {
            party = [this.activeMonster];
        }

        // Fill up to 3 monsters from owned
        owned.forEach(m => {
            if (party.length < 3 && !party.some(p => p === m || (p.uid && p.uid === m.uid))) {
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
            player: this.player,
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
        // Tick Player Energy (recover +2 every 5 seconds up to maxEnergy)
        if (!this.player) {
            this.player = { gender: 'boy', name: '主人公', energy: 100, maxEnergy: 100 };
        }
        if (this.player.energy === undefined) this.player.energy = 100;
        if (this.player.maxEnergy === undefined) this.player.maxEnergy = 100;

        if (this.player.energy < this.player.maxEnergy) {
            this.player.energy = Math.min(this.player.maxEnergy, this.player.energy + 2);
        }

        // Tick active monster vitals
        if (this.activeMonster && !this.activeMonster.isSleeping) {
            // Hunger drops slowly
            this.activeMonster.hunger = Math.max(0, this.activeMonster.hunger - 1);
            
            // Cleanliness drops over time
            if (Math.random() < 0.15) {
                this.activeMonster.cleanliness = Math.max(0, this.activeMonster.cleanliness - 5);
            }

            if (this.activeMonster.hunger < 20 || this.activeMonster.cleanliness < 20) {
                this.activeMonster.friendship = Math.max(0, this.activeMonster.friendship - 1);
            }
        } else if (this.activeMonster && this.activeMonster.isSleeping) {
            // Sleep recovers player energy faster
            this.player.energy = Math.min(this.player.maxEnergy, this.player.energy + 10);
            if (this.player.energy >= this.player.maxEnergy) {
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
