// Halloween Powered By Kapil - Spooky Procedural Web Audio Engine
// Sarlayash Productions

class SpookyAudioEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.ambientOsc1 = null;
        this.ambientOsc2 = null;
        this.ambientGain = null;
        this.isAmbientPlaying = false;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.ambientGain) {
            this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.05, this.ctx ? this.ctx.currentTime : 0);
        }
        return this.isMuted;
    }

    startAmbientDrone() {
        if (this.isAmbientPlaying || this.isMuted) return;
        this.init();

        try {
            const t = this.ctx.currentTime;
            this.ambientGain = this.ctx.createGain();
            this.ambientGain.gain.setValueAtTime(0.04, t);

            // Sub bass drone
            this.ambientOsc1 = this.ctx.createOscillator();
            this.ambientOsc1.type = 'sawtooth';
            this.ambientOsc1.frequency.setValueAtTime(55, t); // A1 note

            // Low-pass filter for ominous rumble
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(140, t);

            // LFO to slowly modulate pitch for eerie haunted feel
            const lfo = this.ctx.createOscillator();
            const lfoGain = this.ctx.createGain();
            lfo.frequency.setValueAtTime(0.15, t); // slow wave
            lfoGain.gain.setValueAtTime(4, t);
            lfo.connect(this.ambientOsc1.frequency);
            lfo.start();

            // High haunting whistle (Ghost wind)
            this.ambientOsc2 = this.ctx.createOscillator();
            this.ambientOsc2.type = 'sine';
            this.ambientOsc2.frequency.setValueAtTime(666, t); // Devil's pitch
            const whistleGain = this.ctx.createGain();
            whistleGain.gain.setValueAtTime(0.008, t);

            const whistleLfo = this.ctx.createOscillator();
            const whistleLfoGain = this.ctx.createGain();
            whistleLfo.frequency.setValueAtTime(0.3, t);
            whistleLfoGain.gain.setValueAtTime(30, t);
            whistleLfo.connect(this.ambientOsc2.frequency);
            whistleLfo.start();

            this.ambientOsc1.connect(filter);
            filter.connect(this.ambientGain);

            this.ambientOsc2.connect(whistleGain);
            whistleGain.connect(this.ambientGain);

            this.ambientGain.connect(this.ctx.destination);

            this.ambientOsc1.start();
            this.ambientOsc2.start();
            this.isAmbientPlaying = true;
        } catch (e) {
            console.warn("Audio ambient drone failed to start:", e);
        }
    }

    playTollBell() {
        if (this.isMuted) return;
        this.init();
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.exponentialRampToValueAtTime(110, t + 2.5);

        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 3.0);
    }

    playHeartbeat() {
        if (this.isMuted) return;
        this.init();
        const t = this.ctx.currentTime;
        
        // Thump 1
        const osc1 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(80, t);
        osc1.frequency.exponentialRampToValueAtTime(40, t + 0.15);
        gain1.gain.setValueAtTime(0.4, t);
        gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        osc1.connect(gain1);
        gain1.connect(this.ctx.destination);
        osc1.start(t);
        osc1.stop(t + 0.16);

        // Thump 2
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(70, t + 0.2);
        osc2.frequency.exponentialRampToValueAtTime(35, t + 0.35);
        gain2.gain.setValueAtTime(0.3, t + 0.2);
        gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc2.connect(gain2);
        gain2.connect(this.ctx.destination);
        osc2.start(t + 0.2);
        osc2.stop(t + 0.36);
    }

    playJumpScare() {
        if (this.isMuted) return;
        this.init();
        const t = this.ctx.currentTime;

        // Dissonant screech cluster
        const freqs = [350, 370, 520, 740, 1100];
        freqs.forEach(f => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(f, t);
            osc.frequency.exponentialRampToValueAtTime(f * 1.5, t + 0.3);

            gain.gain.setValueAtTime(0.12, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.52);
        });
    }

    playCorrect() {
        if (this.isMuted) return;
        this.init();
        const t = this.ctx.currentTime;
        const freqs = [523.25, 659.25, 783.99, 1046.50]; // C Major spooky chime
        freqs.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t + idx * 0.08);

            gain.gain.setValueAtTime(0.15, t + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.08 + 0.4);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t + idx * 0.08);
            osc.stop(t + idx * 0.08 + 0.45);
        });
    }

    playWrong() {
        if (this.isMuted) return;
        this.init();
        const t = this.ctx.currentTime;
        // Low distorted buzzer
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, t);
        osc.frequency.linearRampToValueAtTime(80, t + 0.4);

        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.46);
    }

    playTick() {
        if (this.isMuted) return;
        this.init();
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(1800, t);
        gain.gain.setValueAtTime(0.03, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.05);
    }

    playWheelClick(pitch = 1200) {
        if (this.isMuted) return;
        this.init();
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(pitch, t);
        osc.frequency.exponentialRampToValueAtTime(pitch * 0.5, t + 0.035);
        gain.gain.setValueAtTime(0.09, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.038);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.04);
    }

    playLevelComplete() {
        if (this.isMuted) return;
        this.init();
        const t = this.ctx.currentTime;
        const notes = [440, 554.37, 659.25, 880, 1108.73];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t + idx * 0.12);
            gain.gain.setValueAtTime(0.2, t + idx * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.12 + 0.6);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t + idx * 0.12);
            osc.stop(t + idx * 0.12 + 0.65);
        });
    }
}

window.spookyAudio = new SpookyAudioEngine();
