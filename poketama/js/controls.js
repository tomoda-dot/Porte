/**
 * controls.js
 * Mobile Input Controller with DAS/ARR Long-Press, Touch Swipe Gestures, Haptics & Keyboard Support
 */
class InputController {
    constructor(engine) {
        this.engine = engine;
        this.hapticsEnabled = true;

        // DAS / ARR Timers for smooth button holding
        this.dasDelay = 160;  // Initial delay before auto-repeat starts (ms)
        this.arrInterval = 40; // Speed of auto-repeat once active (ms)
        this.repeatTimers = {};

        // Touch Gesture tracking
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchStartTime = 0;
        this.minSwipeDist = 25;
    }

    init() {
        this.bindTouchButtons();
        this.bindCanvasGestures();
        this.bindKeyboard();
    }

    triggerHaptic(ms = 15) {
        if (this.hapticsEnabled && window.navigator && window.navigator.vibrate) {
            try { window.navigator.vibrate(ms); } catch (e) {}
        }
    }

    bindButton(btnId, actionFn, allowAutoRepeat = false) {
        const btn = document.getElementById(btnId);
        if (!btn) return;

        const startHandler = (e) => {
            e.preventDefault();
            btn.classList.add('pressed');
            this.triggerHaptic(12);

            actionFn();

            if (allowAutoRepeat) {
                this.stopAutoRepeat(btnId);
                this.repeatTimers[btnId] = setTimeout(() => {
                    this.repeatTimers[btnId] = setInterval(() => {
                        actionFn();
                    }, this.arrInterval);
                }, this.dasDelay);
            }
        };

        const endHandler = (e) => {
            e.preventDefault();
            btn.classList.remove('pressed');
            this.stopAutoRepeat(btnId);
        };

        btn.addEventListener('touchstart', startHandler, { passive: false });
        btn.addEventListener('touchend', endHandler, { passive: false });
        btn.addEventListener('touchcancel', endHandler, { passive: false });

        btn.addEventListener('mousedown', startHandler);
        btn.addEventListener('mouseup', endHandler);
        btn.addEventListener('mouseleave', endHandler);
    }

    stopAutoRepeat(btnId) {
        if (this.repeatTimers[btnId]) {
            clearTimeout(this.repeatTimers[btnId]);
            clearInterval(this.repeatTimers[btnId]);
            delete this.repeatTimers[btnId];
        }
    }

    bindTouchButtons() {
        this.bindButton('btn-left', () => this.engine.moveLeft(), true);
        this.bindButton('btn-right', () => this.engine.moveRight(), true);
        this.bindButton('btn-down', () => this.engine.softDrop(), true);
        this.bindButton('btn-rot-cw', () => this.engine.rotate(true), false);
        this.bindButton('btn-rot-ccw', () => this.engine.rotate(false), false);
        this.bindButton('btn-hard-drop', () => {
            this.triggerHaptic(30);
            this.engine.hardDrop();
        }, false);
        this.bindButton('btn-hold', () => this.engine.hold(), false);
    }

    bindCanvasGestures() {
        const canvas = document.getElementById('tetris-canvas');
        if (!canvas) return;

        canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                this.touchStartX = touch.clientX;
                this.touchStartY = touch.clientY;
                this.touchStartTime = Date.now();
            }
        }, { passive: true });

        canvas.addEventListener('touchend', (e) => {
            if (e.changedTouches.length === 1) {
                const touch = e.changedTouches[0];
                const dx = touch.clientX - this.touchStartX;
                const dy = touch.clientY - this.touchStartY;
                const dt = Date.now() - this.touchStartTime;

                // Tap for Rotate
                if (Math.abs(dx) < 15 && Math.abs(dy) < 15 && dt < 250) {
                    this.triggerHaptic(15);
                    this.engine.rotate(true);
                    return;
                }

                // Horizontal Swipe
                if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > this.minSwipeDist) {
                    this.triggerHaptic(12);
                    if (dx > 0) this.engine.moveRight();
                    else this.engine.moveLeft();
                }
                // Vertical Swipe Down (Hard Drop)
                else if (dy > this.minSwipeDist * 1.5 && Math.abs(dy) > Math.abs(dx)) {
                    this.triggerHaptic(30);
                    this.engine.hardDrop();
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
