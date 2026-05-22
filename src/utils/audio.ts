// Web Audio API Birthday Music Box Synthesizer with beautiful chime sounds

interface Note {
  pitch: number; // Hz
  duration: number; // in beats
}

const NOTES: Record<string, number> = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.00,
  A4: 440.00,
  Bb4: 466.16,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
};

// Happy Birthday melody in terms of notes and beat durations
const MELODY: Note[] = [
  { pitch: NOTES.C4, duration: 0.75 },
  { pitch: NOTES.C4, duration: 0.25 },
  { pitch: NOTES.D4, duration: 1 },
  { pitch: NOTES.C4, duration: 1 },
  { pitch: NOTES.F4, duration: 1 },
  { pitch: NOTES.E4, duration: 2 },
  
  { pitch: NOTES.C4, duration: 0.75 },
  { pitch: NOTES.C4, duration: 0.25 },
  { pitch: NOTES.D4, duration: 1 },
  { pitch: NOTES.C4, duration: 1 },
  { pitch: NOTES.G4, duration: 1 },
  { pitch: NOTES.F4, duration: 2 },
  
  { pitch: NOTES.C4, duration: 0.75 },
  { pitch: NOTES.C4, duration: 0.25 },
  { pitch: NOTES.C5, duration: 1 },
  { pitch: NOTES.A4, duration: 1 },
  { pitch: NOTES.F4, duration: 1 },
  { pitch: NOTES.E4, duration: 1 },
  { pitch: NOTES.D4, duration: 2 },
  
  { pitch: NOTES.Bb4, duration: 0.75 },
  { pitch: NOTES.Bb4, duration: 0.25 },
  { pitch: NOTES.A4, duration: 1 },
  { pitch: NOTES.F4, duration: 1 },
  { pitch: NOTES.G4, duration: 1 },
  { pitch: NOTES.F4, duration: 2.5 },
];

export class BirthdayMusicBox {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentTimeout: any = null;
  private noteIndex: number = 0;
  private tempo: number = 135; // Beats per minute
  private onStateChange: (isPlaying: boolean) => void = () => {};

  constructor(onStateChange?: (isPlaying: boolean) => void) {
    if (onStateChange) {
      this.onStateChange = onStateChange;
    }
  }

  private initAudio() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  public togglePlay() {
    this.initAudio();
    if (this.isPlaying) {
      this.stop();
    } else {
      this.play();
    }
  }

  public play() {
    this.initAudio();
    if (this.isPlaying) return;
    
    this.isPlaying = true;
    this.noteIndex = 0;
    this.onStateChange(true);
    
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    
    this.playNextNote();
  }

  public stop() {
    this.isPlaying = false;
    this.onStateChange(false);
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
  }

  private playNextNote() {
    if (!this.isPlaying || !this.ctx) return;

    const note = MELODY[this.noteIndex];
    const beatDuration = 60 / this.tempo;
    const duration = note.duration * beatDuration;

    this.playChime(note.pitch, duration);

    this.noteIndex = (this.noteIndex + 1) % MELODY.length;

    // Schedule next note with a little overlap/spacing
    this.currentTimeout = setTimeout(() => {
      this.playNextNote();
    }, duration * 1000);
  }

  private playChime(frequency: number, duration: number) {
    if (!this.ctx) return;
    
    const now = this.ctx.currentTime;
    
    // Main Oscillator (Sine wave for sweet pure bell sound)
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(frequency, now);

    // Subharmonic/Warmth Oscillator (Triangle wave tuned an octave lower)
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(frequency / 2, now);

    // Overtone Oscillator (Sine wave tuned 1.5x frequency - perfect fifth)
    const osc3 = this.ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(frequency * 1.5, now);

    // Create a beautiful envelope for bell/chime decay
    const gainNode1 = this.ctx.createGain();
    const gainNode2 = this.ctx.createGain();
    const gainNode3 = this.ctx.createGain();
    const masterGain = this.ctx.createGain();

    // Volume distribution
    gainNode1.gain.setValueAtTime(0.5, now); // Main note
    gainNode2.gain.setValueAtTime(0.12, now); // Warm base
    gainNode3.gain.setValueAtTime(0.08, now); // Bright chime overtone

    // Master Envelope (Rapid attack, sweet slow decay)
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.linearRampToValueAtTime(0.3, now + 0.04);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration + 0.2);

    // Soft Lowpass Filter to cut out harsh frequencies
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, now);

    // Connections
    osc1.connect(gainNode1);
    osc2.connect(gainNode2);
    osc3.connect(gainNode3);

    gainNode1.connect(masterGain);
    gainNode2.connect(masterGain);
    gainNode3.connect(masterGain);

    masterGain.connect(filter);
    filter.connect(this.ctx.destination);

    // Start oscillators
    osc1.start(now);
    osc2.start(now);
    osc3.start(now);

    // Stop after note completion
    osc1.stop(now + duration + 0.5);
    osc2.stop(now + duration + 0.5);
    osc3.stop(now + duration + 0.5);
  }

  // Play a single high-pitched celebratory chime sparkler
  public playSpark() {
    this.initAudio();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    const randomPitch = 600 + Math.random() * 800; // Bright spark note
    osc.frequency.setValueAtTime(randomPitch, now);
    osc.frequency.exponentialRampToValueAtTime(randomPitch + 200, now + 0.15);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  // Play a beautiful flame extinguish pop
  public playFlamePop() {
    this.initAudio();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }
}
