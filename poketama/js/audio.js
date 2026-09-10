/**
 * audio.js
 * Web Audio API Sound Generator for Mobile Tetris
 * Zero external audio file dependencies.
 */
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx) {
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) {
                    this.ctx = new AudioContext();
                }
            } catch (e) {
                console.warn("AudioContext initialization failed:", e);
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            try {
                this.ctx.resume();
            } catch (e) {}
        }
    }

    playMove() {
        if (!this.enabled) return;
        try {
            this.init();
            if (!this.ctx) return;

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(140, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.04);

            gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.04);
        } catch(e) {}
    }

    playRotate() {
        if (!this.enabled) return;
        try {
            this.init();
            if (!this.ctx) return;

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(300, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.06);

            gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.06);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.06);
        } catch(e) {}
    }

    playHardDrop() {
        if (!this.enabled) return;
        try {
            this.init();
            if (!this.ctx) return;

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(180, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.12);

            gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.12);
        } catch(e) {}
    }

    playLineClear(linesCount) {
        if (!this.enabled) return;
        try {
            this.init();
            if (!this.ctx) return;

            const notes = linesCount === 4 
                ? [523.25, 659.25, 783.99, 1046.50]
                : [440, 554.37, 659.25];

            notes.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = linesCount === 4 ? 'square' : 'sine';
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.06);

                gain.gain.setValueAtTime(0.15, this.ctx.currentTime + idx * 0.06);
                gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.06 + 0.2);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(this.ctx.currentTime + idx * 0.06);
                osc.stop(this.ctx.currentTime + idx * 0.06 + 0.2);
            });
        } catch(e) {}
    }

    playHold() {
        if (!this.enabled) return;
        try {
            this.init();
            if (!this.ctx) return;

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(450, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(350, this.ctx.currentTime + 0.08);

            gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.08);
        } catch(e) {}
    }

    playGameOver() {
        if (!this.enabled) return;
        try {
            this.init();
            if (!this.ctx) return;

            const freqs = [400, 350, 300, 250, 180];
            freqs.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.12);

                gain.gain.setValueAtTime(0.2, this.ctx.currentTime + idx * 0.12);
                gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.12 + 0.25);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(this.ctx.currentTime + idx * 0.12);
                osc.stop(this.ctx.currentTime + idx * 0.12 + 0.25);
            });
        } catch(e) {}
    }
}

window.soundEngine = new SoundEngine();
