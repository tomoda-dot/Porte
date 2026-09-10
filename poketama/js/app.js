/**
 * app.js
 * Application Controller & Canvas Renderer Loop for Mobile Cyber Neon Tetris
 */

class TetrisApp {
    constructor() {
        this.engine = new TetrisEngine();
        this.controls = new InputController(this.engine);
        this.showGhost = true;

        this.canvas = document.getElementById('tetris-canvas');
        this.ctx = this.canvas.getContext('2d');

        this.holdCanvas = document.getElementById('hold-canvas');
        this.holdCtx = this.holdCanvas.getContext('2d');

        this.nextCanvas = document.getElementById('next-canvas');
        this.nextCtx = this.nextCanvas.getContext('2d');

        this.lastTime = 0;
        this.dropCounter = 0;

        // Effect Banner timer handle
        this.bannerTimeout = null;
    }

    init() {
        this.controls.init();

        // Attach effect banner callback from engine
        this.engine.onEffectTrigger = (lines, combo) => this.showEffectBanner(lines, combo);

        // Bind Modal & Header Controls
        document.getElementById('btn-pause').addEventListener('click', () => this.togglePause());
        document.getElementById('btn-resume').addEventListener('click', () => this.togglePause());
        document.getElementById('btn-restart-pause').addEventListener('click', () => {
            this.togglePause();
            this.restartGame();
        });
        document.getElementById('btn-play-again').addEventListener('click', () => {
            document.getElementById('modal-gameover').classList.remove('active');
            this.restartGame();
        });

        // Settings Toggles
        const soundToggle = document.getElementById('setting-sound');
        soundToggle.addEventListener('change', (e) => {
            if (window.soundEngine) window.soundEngine.enabled = e.target.checked;
        });

        document.getElementById('btn-sound-toggle').addEventListener('click', () => {
            if (window.soundEngine) {
                window.soundEngine.enabled = !window.soundEngine.enabled;
                soundToggle.checked = window.soundEngine.enabled;
                document.getElementById('btn-sound-toggle').textContent = window.soundEngine.enabled ? '🔊' : '🔇';
            }
        });

        document.getElementById('setting-haptics').addEventListener('change', (e) => {
            this.controls.hapticsEnabled = e.target.checked;
        });

        document.getElementById('setting-ghost').addEventListener('change', (e) => {
            this.showGhost = e.target.checked;
        });

        // Start animation loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    restartGame() {
        this.engine.reset();
        this.updateUI();
    }

    togglePause() {
        if (this.engine.isGameOver) return;
        this.engine.isPaused = !this.engine.isPaused;
        const modal = document.getElementById('modal-pause');
        if (this.engine.isPaused) {
            modal.classList.add('active');
        } else {
            modal.classList.remove('active');
        }
    }

    showEffectBanner(lines, combo) {
        const banner = document.getElementById('effect-banner');
        const textMap = ['', 'SINGLE!', 'DOUBLE!!', 'TRIPLE!!!', '⚡ TETRIS! ⚡'];
        
        let msg = textMap[lines] || '';
        if (combo > 0) {
            msg += ` (${combo + 1}x COMBO)`;
        }

        banner.textContent = msg;
        banner.classList.add('active');

        if (lines === 4) {
            const wrap = document.getElementById('board-wrap');
            wrap.classList.add('shake');
            setTimeout(() => wrap.classList.remove('shake'), 300);
        }

        if (this.bannerTimeout) clearTimeout(this.bannerTimeout);
        this.bannerTimeout = setTimeout(() => {
            banner.classList.remove('active');
        }, 1200);
    }

    gameLoop(time = 0) {
        if (!this.lastTime) this.lastTime = time;
        const deltaTime = time - this.lastTime;
        this.lastTime = time;

        if (!this.engine.isPaused && !this.engine.isGameOver) {
            this.dropCounter += deltaTime;

            if (this.dropCounter > this.engine.getDropInterval()) {
                this.engine.drop(false);
                this.dropCounter = 0;
            }

            this.engine.updateParticles(deltaTime / 1000);
        }

        // Handle Game Over transition
        if (this.engine.isGameOver) {
            const modal = document.getElementById('modal-gameover');
            if (!modal.classList.contains('active')) {
                document.getElementById('final-score-val').textContent = this.engine.score.toLocaleString();
                document.getElementById('final-lines-val').textContent = this.engine.lines;
                document.getElementById('final-level-val').textContent = this.engine.level;

                const newRecBadge = document.getElementById('new-record-badge');
                if (this.engine.score > 0 && this.engine.score >= this.engine.highScore) {
                    newRecBadge.style.display = 'flex';
                } else {
                    newRecBadge.style.display = 'none';
                }

                modal.classList.add('active');
            }
        }

        // Render Frame
        this.renderMainBoard();
        this.renderHold();
        this.renderNextQueue();
        this.updateUI();

        requestAnimationFrame((t) => this.gameLoop(t));
    }

    updateUI() {
        document.getElementById('score-val').textContent = this.engine.score.toLocaleString();
        document.getElementById('hi-score-val').textContent = this.engine.highScore.toLocaleString();
        document.getElementById('level-val').textContent = this.engine.level;
        document.getElementById('lines-val').textContent = this.engine.lines;

        const comboEl = document.getElementById('combo-indicator');
        if (this.engine.combo > 0) {
            comboEl.textContent = `${this.engine.combo + 1}x COMBO`;
        } else {
            comboEl.textContent = '';
        }
    }

    renderMainBoard() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const cellSize = width / BOARD_COLS;

        this.ctx.clearRect(0, 0, width, height);

        // 1. Draw Grid Lines
        this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
        this.ctx.lineWidth = 1;

        for (let c = 0; c <= BOARD_COLS; c++) {
            this.ctx.beginPath();
            this.ctx.moveTo(c * cellSize, 0);
            this.ctx.lineTo(c * cellSize, height);
            this.ctx.stroke();
        }
        for (let r = 0; r <= BOARD_ROWS; r++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, r * cellSize);
            this.ctx.lineTo(width, r * cellSize);
            this.ctx.stroke();
        }

        // 2. Draw Locked Blocks
        for (let r = 0; r < BOARD_ROWS; r++) {
            for (let c = 0; c < BOARD_COLS; c++) {
                if (this.engine.board[r][c]) {
                    this.drawBlock(this.ctx, c, r, cellSize, this.engine.board[r][c].color, this.engine.board[r][c].glow);
                }
            }
        }

        // 3. Draw Ghost Piece
        if (this.showGhost && this.engine.currentPiece && !this.engine.isGameOver && !this.engine.isPaused) {
            const ghost = this.engine.getGhostPosition();
            if (ghost) {
                const matrix = this.engine.getPieceMatrix(this.engine.currentPiece.type, this.engine.currentPiece.rotation);
                for (let r = 0; r < matrix.length; r++) {
                    for (let c = 0; c < matrix[r].length; c++) {
                        if (matrix[r][c]) {
                            this.drawGhostBlock(this.ctx, ghost.x + c, ghost.y + r, cellSize, this.engine.currentPiece.color);
                        }
                    }
                }
            }
        }

        // 4. Draw Active Piece
        if (this.engine.currentPiece && !this.engine.isGameOver && !this.engine.isPaused) {
            const matrix = this.engine.getPieceMatrix(this.engine.currentPiece.type, this.engine.currentPiece.rotation);
            for (let r = 0; r < matrix.length; r++) {
                for (let c = 0; c < matrix[r].length; c++) {
                    if (matrix[r][c]) {
                        this.drawBlock(this.ctx, this.engine.currentPiece.x + c, this.engine.currentPiece.y + r, cellSize, this.engine.currentPiece.color, this.engine.currentPiece.glow);
                    }
                }
            }
        }

        // 5. Draw Particle Effects
        this.engine.particles.forEach(p => {
            this.ctx.save();
            this.ctx.globalAlpha = p.alpha;
            this.ctx.fillStyle = p.color;
            this.ctx.shadowColor = p.color;
            this.ctx.shadowBlur = 8;
            this.ctx.beginPath();
            this.ctx.arc(p.x * cellSize, p.y * cellSize, p.size * cellSize, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    drawBlock(ctx, col, row, size, color, glowColor) {
        const x = col * size;
        const y = row * size;
        const pad = 2;
        const radius = 4;

        ctx.save();
        ctx.shadowColor = glowColor || color;
        ctx.shadowBlur = 10;

        // Outer Neon Box
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(x + pad, y + pad, size - pad * 2, size - pad * 2, radius);
        ctx.fill();

        // Inner Bevel Highlight
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.roundRect(x + pad + 2, y + pad + 2, size - pad * 2 - 4, (size - pad * 2) / 3, radius / 2);
        ctx.fill();

        ctx.restore();
    }

    drawGhostBlock(ctx, col, row, size, color) {
        const x = col * size;
        const y = row * size;
        const pad = 2;

        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.45;
        ctx.setLineDash([3, 3]);

        ctx.beginPath();
        ctx.roundRect(x + pad, y + pad, size - pad * 2, size - pad * 2, 4);
        ctx.stroke();

        ctx.restore();
    }

    renderHold() {
        const width = this.holdCanvas.width;
        const height = this.holdCanvas.height;
        this.holdCtx.clearRect(0, 0, width, height);

        if (this.engine.holdPiece) {
            const type = this.engine.holdPiece;
            const def = window.PIECES[type];
            const matrix = def.shapes[0];
            const cellSize = 22;

            const offsetX = (width - matrix[0].length * cellSize) / 2;
            const offsetY = (height - matrix.length * cellSize) / 2;

            this.holdCtx.save();
            if (!this.engine.canHold) {
                this.holdCtx.globalAlpha = 0.4;
            }

            for (let r = 0; r < matrix.length; r++) {
                for (let c = 0; c < matrix[r].length; c++) {
                    if (matrix[r][c]) {
                        this.drawMiniBlock(this.holdCtx, offsetX + c * cellSize, offsetY + r * cellSize, cellSize, def.color);
                    }
                }
            }
            this.holdCtx.restore();
        }
    }

    renderNextQueue() {
        const width = this.nextCanvas.width;
        const height = this.nextCanvas.height;
        this.nextCtx.clearRect(0, 0, width, height);

        const cellSize = 20;
        let startY = 12;

        for (let i = 0; i < Math.min(3, this.engine.nextQueue.length); i++) {
            const type = this.engine.nextQueue[i];
            const def = window.PIECES[type];
            const matrix = def.shapes[0];

            const offsetX = (width - matrix[0].length * cellSize) / 2;

            for (let r = 0; r < matrix.length; r++) {
                for (let c = 0; c < matrix[r].length; c++) {
                    if (matrix[r][c]) {
                        this.drawMiniBlock(this.nextCtx, offsetX + c * cellSize, startY + r * cellSize, cellSize, def.color);
                    }
                }
            }
            startY += matrix.length * cellSize + 16;
        }
    }

    drawMiniBlock(ctx, x, y, size, color) {
        const pad = 1;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(x + pad, y + pad, size - pad * 2, size - pad * 2, 3);
        ctx.fill();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new TetrisApp();
    window.app.init();
});
