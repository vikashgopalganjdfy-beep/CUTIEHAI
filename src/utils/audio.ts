/**
 * Web Audio API synthesizer & Crystal-Clear Natural Hindi Voice Manager
 * Features:
 * - Natural, clear Hindi speech (alien/robotic pitch distortion removed)
 * - Custom voice profiles: Clear Natural, Cute Cat, Deep Spooky Monster
 * - Sound effects: Cat meows, purrs, bell, spooky laugh, police whistle, munching food
 */

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private currentLullabyTimer: number | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    if (!enabled) {
      this.stopLullaby();
    }
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  /**
   * Playful natural cat meow
   */
  public playMeow() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.exponentialRampToValueAtTime(620, now + 0.14);
    osc.frequency.exponentialRampToValueAtTime(460, now + 0.42);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.28, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.48);
  }

  /**
   * Cat Purring sound
   */
  public playPurr() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(48, now);

    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(22, now);

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(0.12, now);
    lfo.connect(lfoGain.gain);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.75);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    lfo.start(now);
    osc.start(now);
    lfo.stop(now + 0.8);
    osc.stop(now + 0.8);
  }

  /**
   * Cute collar bell chime
   */
  public playBell() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = [1760, 2349, 3136];
    freqs.forEach(f => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.55);
    });
  }

  /**
   * Cheerful kid giggle
   */
  public playCatGiggle() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const pitches = [500, 650, 800, 680, 850];
    pitches.forEach((freq, idx) => {
      if (!this.ctx) return;
      const start = this.ctx.currentTime + idx * 0.065;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.15, start + 0.05);

      gain.gain.setValueAtTime(0.2, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(start);
      osc.stop(start + 0.065);
    });
  }

  /**
   * Spooky funny laugh for the feeding monster
   */
  public playSpookyLaugh() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const freqs = [160, 140, 120, 100];
    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const start = this.ctx.currentTime + idx * 0.16;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, start);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.75, start + 0.14);

      gain.gain.setValueAtTime(0.25, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(start);
      osc.stop(start + 0.16);
    });
  }

  /**
   * Police whistle sound
   */
  public playPoliceWhistle() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [0, 0.2, 0.4].forEach(offset => {
      if (!this.ctx) return;
      const start = now + offset;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2600, start);
      osc.frequency.linearRampToValueAtTime(2900, start + 0.1);
      gain.gain.setValueAtTime(0.18, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + 0.14);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(start);
      osc.stop(start + 0.15);
    });
  }

  /**
   * Munching / Eating food sound (Nom Nom Nom)
   */
  public playMunch() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [0, 0.12, 0.24].forEach(offset => {
      if (!this.ctx) return;
      const start = now + offset;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, start);
      osc.frequency.exponentialRampToValueAtTime(140, start + 0.08);
      gain.gain.setValueAtTime(0.3, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + 0.09);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(start);
      osc.stop(start + 0.1);
    });
  }

  /**
   * Funny cartoon sneeze
   */
  public playFunnySneeze() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.frequency.setValueAtTime(300, now);
    osc1.frequency.linearRampToValueAtTime(500, now + 0.25);
    gain1.gain.setValueAtTime(0.1, now);
    gain1.gain.exponentialRampToValueAtTime(0.25, now + 0.25);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.26);

    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(750, now + 0.26);
    osc2.frequency.exponentialRampToValueAtTime(120, now + 0.55);
    gain2.gain.setValueAtTime(0.35, now + 0.26);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(now + 0.26);
    osc2.stop(now + 0.6);
  }

  /**
   * Celebratory chime
   */
  public playCheerChime() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const start = this.ctx.currentTime + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.28, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(start);
      osc.stop(start + 0.5);
    });
  }

  /**
   * Playful pop sound
   */
  public playPop() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.07);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  /**
   * Lullaby music box
   */
  public playLullabyMelody(onEnd?: () => void) {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    this.stopLullaby();

    const melody: { freq: number; dur: number }[] = [
      { freq: 392.00, dur: 0.4 },
      { freq: 392.00, dur: 0.4 },
      { freq: 440.00, dur: 0.5 },
      { freq: 493.88, dur: 0.7 },
      { freq: 523.25, dur: 0.5 },
      { freq: 493.88, dur: 0.5 },
      { freq: 440.00, dur: 0.6 },
      { freq: 392.00, dur: 0.5 },
      { freq: 329.63, dur: 0.5 },
      { freq: 392.00, dur: 0.5 },
      { freq: 440.00, dur: 0.9 },
      { freq: 523.25, dur: 0.6 },
      { freq: 659.25, dur: 0.6 },
      { freq: 587.33, dur: 0.9 },
      { freq: 523.25, dur: 1.2 },
    ];

    let offset = 0;
    melody.forEach(item => {
      if (!this.ctx) return;
      const start = this.ctx.currentTime + offset;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(item.freq * 1.5, start);

      gain.gain.setValueAtTime(0.2, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + item.dur * 0.95);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(start);
      osc.stop(start + item.dur);

      offset += item.dur;
    });

    this.currentLullabyTimer = window.setTimeout(() => {
      if (onEnd) onEnd();
    }, offset * 1000);
  }

  public stopLullaby() {
    if (this.currentLullabyTimer) {
      clearTimeout(this.currentLullabyTimer);
      this.currentLullabyTimer = null;
    }
  }
}

export const soundEffects = new SoundSynthesizer();

/**
 * Natural, Clear Hindi Speech Manager
 * (Fixed alien-pitch distortion: default pitch set to natural 1.0 - 1.1)
 */
class HindiSpeechManager {
  private lastSpokenTime: number = 0;
  private minIntervalMs: number = 2400;
  public isSpeaking: boolean = false;

  public speak(
    hindiText: string,
    options: {
      pitch?: number;
      rate?: number;
      force?: boolean;
      voiceType?: 'natural' | 'cat' | 'monster';
      onStart?: () => void;
      onEnd?: () => void;
    } = {}
  ) {
    if (!('speechSynthesis' in window)) {
      if (options.onEnd) options.onEnd();
      return;
    }

    const now = Date.now();
    if (!options.force && now - this.lastSpokenTime < this.minIntervalMs) {
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(hindiText);
      utterance.lang = 'hi-IN';
      utterance.volume = 1.0;

      // Select pitch & rate according to voice type to avoid alien distortion:
      if (options.voiceType === 'monster') {
        // Deep booming scary/funny monster voice
        utterance.pitch = options.pitch ?? 0.65;
        utterance.rate = options.rate ?? 0.90;
      } else if (options.voiceType === 'cat') {
        // Playful clear cat voice (moderated pitch 1.12 instead of 1.8 to prevent robotic alien artifacts)
        utterance.pitch = options.pitch ?? 1.12;
        utterance.rate = options.rate ?? 1.02;
      } else {
        // Natural, clear, sweet Hindi voice
        utterance.pitch = options.pitch ?? 1.05;
        utterance.rate = options.rate ?? 0.98;
      }

      // Best Hindi Voice Selection
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Prioritize natural Hindi voices (Google Hindi, Lekha, Kalpana, etc.)
        const hindiVoice = voices.find(
          v =>
            (v.lang.toLowerCase().includes('hi') || v.lang.toLowerCase().includes('in')) &&
            (v.name.toLowerCase().includes('google') ||
              v.name.toLowerCase().includes('natural') ||
              v.name.toLowerCase().includes('hindi'))
        ) || voices.find(v => v.lang.toLowerCase().includes('hi'));

        if (hindiVoice) {
          utterance.voice = hindiVoice;
        }
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
        if (options.onStart) options.onStart();
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        if (options.onEnd) options.onEnd();
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        if (options.onEnd) options.onEnd();
      };

      this.lastSpokenTime = now;
      window.speechSynthesis.speak(utterance);
    } catch {
      this.isSpeaking = false;
      if (options.onEnd) options.onEnd();
    }
  }

  public stop() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }
}

export const cartoonVoice = new HindiSpeechManager();
