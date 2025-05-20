
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
 * Resume audio context (for browsers that suspend it)
 */
export const resumeAudioContext = async (audioContext: AudioContext): Promise<boolean> => {
  if (audioContext.state === 'suspended') {
    try {
      await audioContext.resume();
      return true;
    } catch (err) {
      console.error('Failed to resume audio context:', err);
      return false;
    }
  }
  return audioContext.state === 'running';
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

// Create an AudioBuffer for a click sound
export const createClickBuffer = (audioContext: AudioContext): AudioBuffer => {
  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, sampleRate * 0.1, sampleRate);
  const channelData = buffer.getChannelData(0);
  
  // Create a simple click sound
  for (let i = 0; i < buffer.length; i++) {
    const t = i / sampleRate;
    // Exponential decay
    channelData[i] = Math.sin(2 * Math.PI * 800 * t) * Math.exp(-10 * t);
  }
  
  return buffer;
};

// Create an AudioBuffer for an accented click sound
export const createAccentClickBuffer = (audioContext: AudioContext): AudioBuffer => {
  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, sampleRate * 0.1, sampleRate);
  const channelData = buffer.getChannelData(0);
  
  // Create a simple accented click sound (higher frequency)
  for (let i = 0; i < buffer.length; i++) {
    const t = i / sampleRate;
    // Exponential decay with higher frequency
    channelData[i] = Math.sin(2 * Math.PI * 1200 * t) * Math.exp(-8 * t);
  }
  
  return buffer;
};

// Simple logging utility for audio operations
export const audioLogger = {
  log: (message: string, ...args: any[]) => {
    console.log(`[AudioSystem] ${message}`, ...args);
  },
  error: (message: string, ...args: any[]) => {
    console.error(`[AudioSystem Error] ${message}`, ...args);
  }
};

// Microphone access functions
export const requestMicrophoneAccess = async (): Promise<MediaStream> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioLogger.log('Microphone access granted');
    return stream;
  } catch (error) {
    audioLogger.error('Error accessing microphone:', error);
    throw error;
  }
};

export const releaseMicrophone = (stream: MediaStream): void => {
  if (stream) {
    stream.getTracks().forEach(track => {
      track.stop();
    });
    audioLogger.log('Microphone released');
  }
};

// Initialize and reset audio system
export const initializeAudioSystem = (): AudioContext => {
  const ctx = createAudioContext();
  audioLogger.log('Audio system initialized');
  return ctx;
};

export const resetAudioSystem = (audioContext: AudioContext): void => {
  if (audioContext && audioContext.state !== 'closed') {
    audioContext.close().catch(console.error);
    audioLogger.log('Audio system reset');
  }
};
