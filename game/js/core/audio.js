/**
 * PokéTama Web Audio API Synth Sound Effects
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.muted = false;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    }

    playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.1) {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

            gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            // Audio context error fallback
        }
    }

    playClick() {
        this.playTone(600, 'square', 0.05, 0.08);
    }

    playFeed() {
        this.playTone(400, 'sine', 0.08, 0.1);
        setTimeout(() => this.playTone(600, 'sine', 0.08, 0.1), 90);
        setTimeout(() => this.playTone(800, 'sine', 0.1, 0.1), 180);
    }

    playPet() {
        this.playTone(523.25, 'triangle', 0.1, 0.08); // C5
        setTimeout(() => this.playTone(659.25, 'triangle', 0.12, 0.08), 100); // E5
        setTimeout(() => this.playTone(783.99, 'triangle', 0.15, 0.08), 200); // G5
    }

    playHatch() {
        // Dramatic Hatching chimes
        const notes = [440, 554, 659, 880, 1108, 1318];
        notes.forEach((freq, index) => {
            setTimeout(() => this.playTone(freq, 'triangle', 0.2, 0.12), index * 120);
        });
    }

    playHit() {
        this.playTone(150, 'sawtooth', 0.12, 0.15);
    }

    playCrit() {
        this.playTone(300, 'square', 0.08, 0.15);
        setTimeout(() => this.playTone(600, 'square', 0.15, 0.15), 70);
    }

    playLevelUp() {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((n, i) => {
            setTimeout(() => this.playTone(n, 'square', 0.15, 0.1), i * 100);
        });
    }

    playEvolutionFanfare() {
        const notes = [440, 554.37, 659.25, 880, 880, 880, 1108.73];
        const times = [0, 150, 300, 450, 600, 750, 950];
        notes.forEach((n, i) => {
            setTimeout(() => this.playTone(n, 'triangle', 0.25, 0.12), times[i]);
        });
    }
}

const audioFX = new SoundEngine();
