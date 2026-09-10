/**
 * controls.js
 * Gesture & Keyboard Input Controller for Mobile Cyber Neon Tetris
 * Tap & Drag & Flick Gestures for Smartphone (Keyboard for PC)
 */
class InputController {
    constructor(engine) {
        this.engine = engine;
        this.hapticsEnabled = true;

        // Gesture tracking variables
        this.startX = 0;
        this.startY = 0;
        this.lastX = 0;
        this.lastY = 0;
        this.startTime = 0;
        
        this.accumulatedX = 0;
        this.accumulatedY = 0;

        // Touch sensitivity thresholds
        this.dragThresholdX = 24; // Drag distance (px) per horizontal mino step
        this.dragThresholdY = 22; // Drag distance (px) per soft drop mino step
        this.flickVelocityY = 0.85; // Speed threshold for hard drop flick

        this.lastTapTime = 0;
    }

    init() {
        this.bindTouchGestures();
        this.bindHoldTap();
        this.bindKeyboard();
    }

    triggerHaptic(ms = 15) {
        if (this.hapticsEnabled && window.navigator && window.navigator.vibrate) {
            try { window.navigator.vibrate(ms); } catch (e) {}
        }
    }

    bindHoldTap() {
        // Tapping the HOLD box triggers hold
        const holdBox = document.getElementById('hold-box');
        if (holdBox) {
            holdBox.style.cursor = 'pointer';
            holdBox.addEventListener('click', () => {
                this.triggerHaptic(20);
                this.engine.hold();
            });
            holdBox.addEventListener('touchstart', (e) => {
                e.stopPropagation();
                this.triggerHaptic(20);
                this.engine.hold();
            }, { passive: true });
        }
    }

    bindTouchGestures() {
        const board = document.getElementById('board-wrap') || document.getElementById('app-container');
        if (!board) return;

        board.addEventListener('touchstart', (e) => {
            if (this.engine.isGameOver || this.engine.isPaused) return;

            // Two-finger tap -> Rotate CCW
            if (e.touches.length === 2) {
                e.preventDefault();
                this.triggerHaptic(18);
                this.engine.rotate(false);
                return;
            }

            if (e.touches.length === 1) {
                const touch = e.touches[0];
                this.startX = touch.clientX;
                this.startY = touch.clientY;
                this.lastX = touch.clientX;
                this.lastY = touch.clientY;
                this.startTime = Date.now();

                this.accumulatedX = 0;
                this.accumulatedY = 0;
            }
        }, { passive: false });

        board.addEventListener('touchmove', (e) => {
            if (this.engine.isGameOver || this.engine.isPaused) return;
            if (e.touches.length !== 1) return;

            e.preventDefault(); // Prevent page scrolling during game gesture

            const touch = e.touches[0];
            const dx = touch.clientX - this.lastX;
            const dy = touch.clientY - this.lastY;

            this.lastX = touch.clientX;
            this.lastY = touch.clientY;

            this.accumulatedX += dx;
            this.accumulatedY += dy;

            // Horizontal step movement
            while (Math.abs(this.accumulatedX) >= this.dragThresholdX) {
                if (this.accumulatedX > 0) {
                    if (this.engine.moveRight()) this.triggerHaptic(8);
                    this.accumulatedX -= this.dragThresholdX;
                } else {
                    if (this.engine.moveLeft()) this.triggerHaptic(8);
                    this.accumulatedX += this.dragThresholdX;
                }
            }

            // Downward soft drop step
            while (this.accumulatedY >= this.dragThresholdY) {
                if (this.engine.softDrop()) this.triggerHaptic(5);
                this.accumulatedY -= this.dragThresholdY;
            }
        }, { passive: false });

        board.addEventListener('touchend', (e) => {
            if (this.engine.isGameOver || this.engine.isPaused) return;

            const touchDuration = Date.now() - this.startTime;
            const totalDx = this.lastX - this.startX;
            const totalDy = this.lastY - this.startY;

            // Calculate swipe velocity (px / ms)
            const velocityY = totalDy / Math.max(1, touchDuration);

            // 1. Fast Flick Down -> Hard Drop
            if (totalDy > 60 && velocityY > this.flickVelocityY) {
                this.triggerHaptic(30);
                this.engine.hardDrop();
                return;
            }

            // 2. Single / Double Tap Check
            if (Math.abs(totalDx) < 12 && Math.abs(totalDy) < 12 && touchDuration < 280) {
                const now = Date.now();
                if (now - this.lastTapTime < 250) {
                    // Double Tap -> Rotate CCW
                    this.triggerHaptic(18);
                    this.engine.rotate(false);
                    this.lastTapTime = 0;
                } else {
                    // Single Tap -> Rotate CW
                    this.triggerHaptic(15);
                    this.engine.rotate(true);
                    this.lastTapTime = now;
                }
            }
        }, { passive: true });
    }

    bindKeyboard() {
        document.addEventListener('keydown', (e) => {
            if (this.engine.isGameOver || this.engine.isPaused) return;

            switch(e.code) {
                case 'ArrowLeft':
                case 'KeyA':
                    this.engine.moveLeft();
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.engine.moveRight();
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.engine.softDrop();
                    break;
                case 'ArrowUp':
                case 'KeyX':
                    this.engine.rotate(true);
                    break;
                case 'KeyZ':
                    this.engine.rotate(false);
                    break;
                case 'Space':
                    e.preventDefault();
                    this.engine.hardDrop();
                    break;
                case 'KeyC':
                case 'ShiftLeft':
                    this.engine.hold();
                    break;
                case 'KeyP':
                case 'Escape':
                    if (window.app) window.app.togglePause();
                    break;
            }
        });
    }
}

window.InputController = InputController;
