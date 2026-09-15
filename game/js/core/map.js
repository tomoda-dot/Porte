/**
 * Pokemon-Style 2D RPG - Tile Map & Player Movement Engine
 */

const TILE_SIZE = 16;
const VIEWPORT_TILES = 20; // 20x20 tiles = 320x320 pixels

const TILE_TYPES = {
    GROUND: 0,
    GRASS: 1,
    TREE: 2,
    CENTER: 3,
    GYM: 4,
    PORTAL: 5
};

// 20x20 Grid Map Definition for Pallet Town (はじまりの町)
const MAP_PALLET = {
    id: 'pallet',
    name: 'はじまりの町',
    width: 20,
    height: 20,
    // 0: Path, 1: Grass, 2: Tree/Wall, 3: Center, 4: Gym, 5: Portal
    grid: [
        [2,2,2,2,2,2,2,2,2,5,5,2,2,2,2,2,2,2,2,2],
        [2,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,2],
        [2,0,3,3,0,2,0,0,0,0,0,0,0,2,0,4,4,0,0,2],
        [2,0,3,3,0,2,0,0,0,0,0,0,0,2,0,4,4,0,0,2],
        [2,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,2],
        [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
        [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
        [2,2,2,2,0,0,2,2,2,2,2,2,2,2,0,0,2,2,2,2],
        [2,1,1,1,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,2],
        [2,1,1,1,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,2],
        [2,1,1,1,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,2],
        [2,2,2,2,0,0,2,2,2,2,2,2,2,2,0,0,2,2,2,2],
        [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
        [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
        [2,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,2],
        [2,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,2],
        [2,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,2],
        [2,2,2,2,2,2,2,2,0,0,0,0,2,2,2,2,2,2,2,2],
        [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
        [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
    ]
};

const MapEngine = {
    currentMap: MAP_PALLET,
    playerX: 9,
    playerY: 14,
    facing: 'down',
    isMoving: false,
    canvas: null,
    ctx: null,

    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
            this.canvas.width = 320;
            this.canvas.height = 320;
        }
        this.render();
    },

    move(dir) {
        if (this.isMoving) return;
        this.facing = dir;

        let dx = 0;
        let dy = 0;
        if (dir === 'up') dy = -1;
        if (dir === 'down') dy = 1;
        if (dir === 'left') dx = -1;
        if (dir === 'right') dx = 1;

        const nextX = this.playerX + dx;
        const nextY = this.playerY + dy;

        // Check bounds & collision
        if (nextX < 0 || nextX >= 20 || nextY < 0 || nextY >= 20) return;

        const tileType = this.currentMap.grid[nextY][nextX];
        if (tileType === TILE_TYPES.TREE) return; // Blocked by Tree/Wall

        this.playerX = nextX;
        this.playerY = nextY;
        this.render();

        // Check Tile Events
        if (tileType === TILE_TYPES.GRASS) {
            // 22% chance of wild encounter in tall grass!
            if (Math.random() < 0.22) {
                if (window.BattleModule) {
                    window.BattleModule.startWildEncounter();
                }
            }
        }
    },

    interactA() {
        const tileType = this.currentMap.grid[this.playerY][this.playerX];
        
        // Check facing tile or standing tile
        let frontX = this.playerX;
        let frontY = this.playerY;
        if (this.facing === 'up') frontY--;
        if (this.facing === 'down') frontY++;
        if (this.facing === 'left') frontX--;
        if (this.facing === 'right') frontX++;

        let targetTile = tileType;
        if (frontX >= 0 && frontX < 20 && frontY >= 0 && frontY < 20) {
            const fTile = this.currentMap.grid[frontY][frontX];
            if (fTile === TILE_TYPES.CENTER || fTile === TILE_TYPES.GYM) {
                targetTile = fTile;
            }
        }

        if (targetTile === TILE_TYPES.CENTER) {
            // Heal all party Pokemon
            if (window.gameEngine) {
                window.gameEngine.party.forEach(p => { p.hp = p.maxHp; });
                window.gameEngine.saveState();
                alert('🏥 モンスターセンター：手持ちのポケモンが全員全回復しました！');
                if (window.UIController) window.UIController.renderAll();
            }
        } else if (targetTile === TILE_TYPES.GYM) {
            // Gym Leader Battle Event
            if (window.BattleModule) {
                window.BattleModule.startGymBattle();
            }
        }
    },

    render() {
        if (!this.ctx) return;
        const ctx = this.ctx;
        ctx.clearRect(0, 0, 320, 320);

        // 1. Draw 20x20 Tile Map
        for (let y = 0; y < 20; y++) {
            for (let x = 0; x < 20; x++) {
                const tile = this.currentMap.grid[y][x];
                const px = x * 16;
                const py = y * 16;

                if (tile === TILE_TYPES.GROUND) {
                    ctx.fillStyle = '#8bc34a'; // Light Green Path
                    ctx.fillRect(px, py, 16, 16);
                    ctx.fillStyle = '#7cb342';
                    ctx.fillRect(px + 2, py + 2, 4, 4);
                } else if (tile === TILE_TYPES.GRASS) {
                    ctx.fillStyle = '#4caf50'; // Tall Grass
                    ctx.fillRect(px, py, 16, 16);
                    ctx.fillStyle = '#2e7d32'; // Dark Grass Tufts
                    ctx.fillRect(px + 2, py + 2, 4, 12);
                    ctx.fillRect(px + 10, py + 4, 4, 10);
                } else if (tile === TILE_TYPES.TREE) {
                    ctx.fillStyle = '#1b5e20'; // Forest Tree
                    ctx.fillRect(px, py, 16, 16);
                    ctx.fillStyle = '#388e3c';
                    ctx.fillRect(px + 3, py + 3, 10, 10);
                } else if (tile === TILE_TYPES.CENTER) {
                    ctx.fillStyle = '#e91e63'; // Pokemon Center Pink Roof
                    ctx.fillRect(px, py, 16, 16);
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(px + 4, px + 4, 8, 8);
                } else if (tile === TILE_TYPES.GYM) {
                    ctx.fillStyle = '#ff9800'; // Gym Orange Castle Roof
                    ctx.fillRect(px, py, 16, 16);
                    ctx.fillStyle = '#ffd54f';
                    ctx.fillRect(px + 4, py + 4, 8, 8);
                } else {
                    ctx.fillStyle = '#9e9e9e';
                    ctx.fillRect(px, py, 16, 16);
                }

                // Grid lines for crisp Game Boy feel
                ctx.strokeStyle = 'rgba(0,0,0,0.08)';
                ctx.strokeRect(px, py, 16, 16);
            }
        }

        // 2. Draw Player Red/Hat Hero Avatar
        const playerPx = this.playerX * 16;
        const playerPy = this.playerY * 16;

        // Player Red Body & Hat
        ctx.fillStyle = '#ff1744'; // Red Cap/Shirt
        ctx.fillRect(playerPx + 3, playerPy + 1, 10, 14);
        ctx.fillStyle = '#ffcc80'; // Face Skin Tone
        ctx.fillRect(playerPx + 4, playerPy + 5, 8, 5);
        ctx.fillStyle = '#000000'; // Eyes
        ctx.fillRect(playerPx + 5, playerPy + 6, 2, 2);
        ctx.fillRect(playerPx + 9, playerPy + 6, 2, 2);
        ctx.fillStyle = '#29b6f6'; // Blue Pants
        ctx.fillRect(playerPx + 4, playerPy + 11, 8, 4);
    }
};
