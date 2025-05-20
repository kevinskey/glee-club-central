
// Audio utility functions for Glee Tools

/**
 * Register a keyboard shortcut
 */
export const registerKeyboardShortcut = (key: string, callback: () => void): (() => void) => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() === key.toLowerCase() && !e.ctrlKey && !e.altKey && !e.metaKey) {
      e.preventDefault();
      callback();
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
};

/**
 * Create an audio context safely
 */
export const createAudioContext = (): AudioContext => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  return new AudioContext();
};

/**
 * Play a note with the given frequency
 */
export const playTone = (
  audioContext: AudioContext, 
  frequency: number, 
  waveform: OscillatorType = 'sine', 
  duration: number = 1,
  volume: number = 0.5
): void => {
  // Create oscillator and gain nodes
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  // Configure oscillator
  oscillator.type = waveform;
  oscillator.frequency.value = frequency;
  
  // Configure gain (volume)
  gainNode.gain.value = volume;
  
  // Connect the nodes
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Schedule the envelope
  const now = audioContext.currentTime;
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(volume, now + 0.01); // Fast attack
  gainNode.gain.linearRampToValueAtTime(0, now + duration); // Smooth release
  
  // Start and stop the oscillator
  oscillator.start(now);
  oscillator.stop(now + duration);
};

/**
 * Get the frequency for a given note
 */
export const getNoteFrequency = (note: string, octave: number): number => {
  // Base notes (C4 to B4)
  const baseNotes: Record<string, number> = {
    'C': 261.63,
    'C#': 277.18,
    'Db': 277.18,
    'D': 293.66,
    'D#': 311.13,
    'Eb': 311.13,
    'E': 329.63,
    'F': 349.23,
    'F#': 369.99,
    'Gb': 369.99,
    'G': 392.00,
    'G#': 415.30,
    'Ab': 415.30,
    'A': 440.00,
    'A#': 466.16,
    'Bb': 466.16,
    'B': 493.88
  };
  
  const noteName = note.replace(/\d+$/, ''); // Remove any existing octave number
  const baseFreq = baseNotes[noteName];
  
  if (!baseFreq) {
    throw new Error(`Invalid note: ${note}`);
  }
  
  // Adjust for octave (C4 is the reference)
  const octaveDiff = octave - 4;
  return baseFreq * Math.pow(2, octaveDiff);
};

/**
 * Create a click sound for metronome
 */
export const playClick = (
  audioContext: AudioContext, 
  isAccent: boolean = false,
  volume: number = 0.5
): void => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  // Use different frequencies for accented and normal beats
  oscillator.type = isAccent ? 'triangle' : 'sine';
  oscillator.frequency.value = isAccent ? 1200 : 800;
  
  gainNode.gain.value = volume;
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  const now = audioContext.currentTime;
  
  // Envelope for a click sound
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(volume, now + 0.001);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
  
  oscillator.start(now);
  oscillator.stop(now + 0.1);
};

// Interfaces for the recording data
export interface NoteEvent {
  note: string;
  frequency: number;
  waveform: OscillatorType;
  timestamp: number; // Relative to recording start
  duration: number;
  volume: number;
}

export interface RecordingData {
  events: NoteEvent[];
  totalDuration: number;
  createdAt: string;
}
