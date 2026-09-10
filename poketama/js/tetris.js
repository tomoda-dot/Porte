/**
 * tetris.js
 * Core Tetris Engine featuring SRS Rotation, 7-Bag Generator, Ghost Piece, Hold, and Scoring
 */

const BOARD_COLS = 10;
const BOARD_ROWS = 20;

// Tetrimino Definitions & SRS Shapes
const PIECES = {
    I: {
        color: '#00f0ff',
        glow: 'rgba(0, 240, 255, 0.8)',
        shapes: [
            [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]],
            [[0,0,1,0], [0,0,1,0], [0,0,1,0], [0,0,1,0]],
            [[0,0,0,0], [0,0,0,0], [1,1,1,1], [0,0,0,0]],
            [[0,1,0,0], [0,1,0,0], [0,1,0,0], [0,1,0,0]]
        ]
    },
    J: {
        color: '#2b55ff',
        glow: 'rgba(43, 85, 255, 0.8)',
        shapes: [
            [[1,0,0], [1,1,1], [0,0,0]],
            [[0,1,1], [0,1,0], [0,1,0]],
            [[0,0,0], [1,1,1], [0,0,1]],
            [[0,1,0], [0,1,0], [1,1,0]]
        ]
    },
    L: {
        color: '#ffaa00',
        glow: 'rgba(255, 170, 0, 0.8)',
        shapes: [
            [[0,0,1], [1,1,1], [0,0,0]],
            [[0,1,0], [0,1,0], [0,1,1]],
            [[0,0,0], [1,1,1], [1,0,0]],
            [[1,1,0], [0,1,0], [0,1,0]]
        ]
    },
    O: {
        color: '#ffe600',
        glow: 'rgba(255, 230, 0, 0.8)',
        shapes: [
            [[1,1], [1,1]]
        ]
    },
    S: {
        color: '#00ff66',
        glow: 'rgba(0, 255, 102, 0.8)',
        shapes: [
            [[0,1,1], [1,1,0], [0,0,0]],
            [[0,1,0], [0,1,1], [0,0,1]],
            [[0,0,0], [0,1,1], [1,1,0]],
            [[1,0,0], [1,1,0], [0,1,0]]
        ]
    },
    T: {
        color: '#b827ff',
        glow: 'rgba(184, 39, 255, 0.8)',
        shapes: [
            [[0,1,0], [1,1,1], [0,0,0]],
            [[0,1,0], [0,1,1], [0,1,0]],
            [[0,0,0], [1,1,1], [0,1,0]],
            [[0,1,0], [1,1,0], [0,1,0]]
        ]
    },
    Z: {
        color: '#ff2a6d',
        glow: 'rgba(255, 42, 109, 0.8)',
        shapes: [
            [[1,1,0], [0,1,1], [0,0,0]],
            [[0,0,1], [0,1,1], [0,1,0]],
            [[0,0,0], [1,1,0], [0,1,1]],
            [[0,1,0], [1,1,0], [1,0,0]]
        ]
    }
};

// SRS Wall Kick Data Tables
const WALLKICK_JLSTZ = {
    '0-1': [[0,0], [-1,0], [-1,1], [0,-2], [-1,-2]],
    '1-0': [[0,0], [1,0], [1,-1], [0,2], [1,2]],
    '1-2': [[0,0], [1,0], [1,-1], [0,2], [1,2]],
    '2-1': [[0,0], [-1,0], [-1,1], [0,-2], [-1,-2]],
    '2-3': [[0,0], [1,0], [1,1], [0,-2], [1,-2]],
    '3-2': [[0,0], [-1,0], [-1,-1], [0,2], [-1,2]],
    '3-0': [[0,0], [-1,0], [-1,-1], [0,2], [-1,2]],
    '0-3': [[0,0], [1,0], [1,1], [0,-2], [1,-2]]
};

const WALLKICK_I = {
    '0-1': [[0,0], [-2,0], [1,0], [-2,-1], [1,2]],
    '1-0': [[0,0], [2,0], [-1,0], [2,1], [-1,-2]],
    '1-2': [[0,0], [-1,0], [2,0], [-1,2], [2,-1]],
    '2-1': [[0,0], [1,0], [-2,0], [1,-2], [-2,1]],
    '2-3': [[0,0], [2,0], [-1,0], [2,1], [-1,-2]],
    '3-2': [[0,0], [-2,0], [1,0], [-2,-1], [1,2]],
    '3-0': [[0,0], [1,0], [-2,0], [1,-2], [-2,1]],
    '0-3': [[0,0], [-1,0], [2,0], [-1,2], [2,-1]]
};

class TetrisEngine {
    constructor() {
        this.board = Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(null));
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.combo = -1;
        this.highScore = parseInt(localStorage.getItem('tetris_high_score') || '0', 10);
        
        this.bag = [];
        this.nextQueue = [];
        this.currentPiece = null;
        this.holdPiece = null;
        this.canHold = true;

        this.isGameOver = false;
        this.isPaused = false;
        this.particles = [];

        this.reset();
    }

    reset() {
        this.board = Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(null));
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.combo = -1;
        this.bag = [];
        this.nextQueue = [];
        this.currentPiece = null;
        this.holdPiece = null;
        this.canHold = true;
        this.isGameOver = false;
        this.isPaused = false;
        this.particles = [];

        // Refill bag & spawn first piece
        this.refillBag();
        for (let i = 0; i < 4; i++) {
            this.nextQueue.push(this.drawFromBag());
        }
        this.spawnNextPiece();
    }

    refillBag() {
        const types = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
        // Shuffle bag
        for (let i = types.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [types[i], types[j]] = [types[j], types[i]];
        }
        this.bag.push(...types);
    }

    drawFromBag() {
        if (this.bag.length === 0) {
            this.refillBag();
        }
        return this.bag.shift();
    }

    spawnNextPiece() {
        const type = this.nextQueue.shift();
        this.nextQueue.push(this.drawFromBag());

        const def = PIECES[type];
        this.currentPiece = {
            type: type,
            rotation: 0,
            x: Math.floor((BOARD_COLS - def.shapes[0][0].length) / 2),
            y: 0,
            color: def.color,
            glow: def.glow
        };

        this.canHold = true;

        // Check spawn game over
        if (this.checkCollision(this.currentPiece.x, this.currentPiece.y, this.currentPiece.rotation)) {
            this.isGameOver = true;
            if (window.soundEngine) window.soundEngine.playGameOver();
        }
    }

    getPieceMatrix(type, rotation) {
        const def = PIECES[type];
        return def.shapes[rotation % def.shapes.length];
    }

    checkCollision(x, y, rotation, type = null) {
        const pieceType = type || this.currentPiece.type;
        const matrix = this.getPieceMatrix(pieceType, rotation);

        for (let r = 0; r < matrix.length; r++) {
            for (let c = 0; c < matrix[r].length; c++) {
                if (matrix[r][c]) {
                    const newX = x + c;
                    const newY = y + r;

                    if (newX < 0 || newX >= BOARD_COLS || newY >= BOARD_ROWS) {
                        return true; // Wall or floor collision
                    }
                    if (newY >= 0 && this.board[newY][newX]) {
                        return true; // Block collision
                    }
                }
            }
        }
        return false;
    }

    moveLeft() {
        if (this.isGameOver || this.isPaused || !this.currentPiece) return false;
        if (!this.checkCollision(this.currentPiece.x - 1, this.currentPiece.y, this.currentPiece.rotation)) {
            this.currentPiece.x--;
            if (window.soundEngine) window.soundEngine.playMove();
            return true;
        }
        return false;
    }

    moveRight() {
        if (this.isGameOver || this.isPaused || !this.currentPiece) return false;
        if (!this.checkCollision(this.currentPiece.x + 1, this.currentPiece.y, this.currentPiece.rotation)) {
            this.currentPiece.x++;
            if (window.soundEngine) window.soundEngine.playMove();
            return true;
        }
        return false;
    }

    softDrop() {
        if (this.isGameOver || this.isPaused || !this.currentPiece) return false;
        if (!this.checkCollision(this.currentPiece.x, this.currentPiece.y + 1, this.currentPiece.rotation)) {
            this.currentPiece.y++;
            this.score += 1;
            return true;
        }
        return false;
    }

    hardDrop() {
        if (this.isGameOver || this.isPaused || !this.currentPiece) return;
        let dropDistance = 0;
        while (!this.checkCollision(this.currentPiece.x, this.currentPiece.y + 1, this.currentPiece.rotation)) {
            this.currentPiece.y++;
            dropDistance++;
        }
        this.score += dropDistance * 2;
        if (window.soundEngine) window.soundEngine.playHardDrop();
        this.lockPiece();
    }

    rotate(clockwise = true) {
        if (this.isGameOver || this.isPaused || !this.currentPiece) return false;

        const type = this.currentPiece.type;
        if (type === 'O') return true; // O piece doesn't rotate

        const oldRotation = this.currentPiece.rotation;
        const newRotation = clockwise ? (oldRotation + 1) % 4 : (oldRotation + 3) % 4;
        const kickKey = `${oldRotation}-${newRotation}`;

        const kickTable = type === 'I' ? WALLKICK_I[kickKey] : WALLKICK_JLSTZ[kickKey];

        if (!kickTable) return false;

        for (let i = 0; i < kickTable.length; i++) {
            const [offsetCols, offsetRows] = kickTable[i];
            const testX = this.currentPiece.x + offsetCols;
            const testY = this.currentPiece.y - offsetRows; // Negative because Y goes down

            if (!this.checkCollision(testX, testY, newRotation)) {
                this.currentPiece.x = testX;
                this.currentPiece.y = testY;
                this.currentPiece.rotation = newRotation;
                if (window.soundEngine) window.soundEngine.playRotate();
                return true;
            }
        }
        return false;
    }

    hold() {
        if (this.isGameOver || this.isPaused || !this.canHold || !this.currentPiece) return;

        const currentType = this.currentPiece.type;
        if (window.soundEngine) window.soundEngine.playHold();

        if (this.holdPiece === null) {
            this.holdPiece = currentType;
            this.spawnNextPiece();
        } else {
            const temp = this.holdPiece;
            this.holdPiece = currentType;
            const def = PIECES[temp];
            this.currentPiece = {
                type: temp,
                rotation: 0,
                x: Math.floor((BOARD_COLS - def.shapes[0][0].length) / 2),
                y: 0,
                color: def.color,
                glow: def.glow
            };
        }
        this.canHold = false;
    }

    getGhostPosition() {
        if (!this.currentPiece) return null;
        let ghostY = this.currentPiece.y;
        while (!this.checkCollision(this.currentPiece.x, ghostY + 1, this.currentPiece.rotation)) {
            ghostY++;
        }
        return { x: this.currentPiece.x, y: ghostY };
    }

    lockPiece() {
        const matrix = this.getPieceMatrix(this.currentPiece.type, this.currentPiece.rotation);
        for (let r = 0; r < matrix.length; r++) {
            for (let c = 0; c < matrix[r].length; c++) {
                if (matrix[r][c]) {
                    const boardY = this.currentPiece.y + r;
                    const boardX = this.currentPiece.x + c;
                    if (boardY >= 0 && boardY < BOARD_ROWS) {
                        this.board[boardY][boardX] = {
                            color: this.currentPiece.color,
                            glow: this.currentPiece.glow
                        };
                    }
                }
            }
        }

        this.clearLines();
        this.spawnNextPiece();
    }

    clearLines() {
        let linesCleared = 0;
        const clearedRowIndices = [];

        for (let r = BOARD_ROWS - 1; r >= 0; r--) {
            if (this.board[r].every(cell => cell !== null)) {
                linesCleared++;
                clearedRowIndices.push(r);
                // Create particle effect
                for (let c = 0; c < BOARD_COLS; c++) {
                    this.createParticles(c, r, this.board[r][c].color);
                }
                this.board.splice(r, 1);
                this.board.unshift(Array(BOARD_COLS).fill(null));
                r++; // Re-check same row index after splice
            }
        }

        if (linesCleared > 0) {
            this.combo++;
            this.lines += linesCleared;
            
            // Score calculation
            const lineScores = [0, 100, 300, 500, 800]; // 1, 2, 3, 4 lines
            let gained = lineScores[linesCleared] * this.level;
            if (this.combo > 0) {
                gained += 50 * this.combo * this.level;
            }
            this.score += gained;

            if (this.score > this.highScore) {
                this.highScore = this.score;
                localStorage.setItem('tetris_high_score', this.highScore.toString());
            }

            // Level progression (level up every 10 lines)
            this.level = Math.floor(this.lines / 10) + 1;

            if (window.soundEngine) window.soundEngine.playLineClear(linesCleared);

            // Screen effect banner trigger callback if attached
            if (this.onEffectTrigger) {
                this.onEffectTrigger(linesCleared, this.combo);
            }
        } else {
            this.combo = -1;
        }
    }

    createParticles(col, row, color) {
        for (let i = 0; i < 6; i++) {
            this.particles.push({
                x: col + 0.5,
                y: row + 0.5,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.8) * 0.4,
                size: Math.random() * 0.3 + 0.1,
                color: color,
                alpha: 1.0,
                life: 1.0
            });
        }
    }

    updateParticles(dt) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= dt * 2.0;
            p.life -= dt;
            if (p.alpha <= 0 || p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    getDropInterval() {
        // Speed formula based on level
        return Math.max(80, 800 - (this.level - 1) * 70);
    }
}

window.TetrisEngine = TetrisEngine;
window.PIECES = PIECES;
