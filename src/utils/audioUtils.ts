
// Audio utility functions for audio tools

// Audio logging utility
export const audioLogger = {
  log: (message: string, data?: any) => {
    console.log(`[Audio] ${message}`, data);
  },
  error: (message: string, error?: any) => {
    console.error(`[Audio Error] ${message}`, error);
  }
};

// Global AudioContext instance to prevent multiple contexts
let globalAudioContext: AudioContext | null = null;

// Get or create AudioContext singleton
export function getAudioContext(): AudioContext {
  if (!globalAudioContext) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) {
      throw new Error('AudioContext not supported in this browser');
    }
    globalAudioContext = new AudioContextClass();
    audioLogger.log('Global AudioContext created');
  }
  
  return globalAudioContext;
}

// Resume audio context with user interaction handling
export async function resumeAudioContext(audioContext?: AudioContext): Promise<AudioContext> {
  const ctx = audioContext || getAudioContext();
  
  if (ctx.state === 'suspended') {
    try {
      await ctx.resume();
      audioLogger.log('AudioContext resumed successfully');
    } catch (error) {
      audioLogger.error('Failed to resume AudioContext:', error);
      throw error;
    }
  }
  
  return ctx;
}

// Initialize audio system with user interaction
export async function initializeAudioSystem(): Promise<AudioContext> {
  try {
    const audioContext = getAudioContext();
    await resumeAudioContext(audioContext);
    return audioContext;
  } catch (error) {
    audioLogger.error('Failed to initialize audio system:', error);
    throw error;
  }
}

// Note frequency calculation for pitch pipe
export function getNoteFrequency(note: string, octave: number = 4): number {
  console.log('getNoteFrequency called with:', { note, octave });
  
  const noteMap: { [key: string]: number } = {
    'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5,
    'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
  };
  
  const semitone = noteMap[note];
  if (semitone === undefined) {
    throw new Error(`Invalid note: ${note}`);
  }
  
  // A4 = 440 Hz
  const A4 = 440;
  const A4_OCTAVE = 4;
  const A4_SEMITONE = 9; // A is the 9th semitone in the chromatic scale
  
  const semitonesFromA4 = (octave - A4_OCTAVE) * 12 + (semitone - A4_SEMITONE);
  const frequency = A4 * Math.pow(2, semitonesFromA4 / 12);
  
  console.log('Calculated frequency:', frequency);
  return frequency;
}

// Play note function for pitch pipe functionality - now uses global context
export async function playNote(frequency: number, duration: number = 1000): Promise<void> {
  console.log('playNote called with:', { frequency, duration });
  
  try {
    const audioContext = await initializeAudioSystem();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, duration);
    });
  } catch (error) {
    audioLogger.error('Error playing note:', error);
    throw error;
  }
}

// Click sound for metronome - now accepts optional AudioContext
export async function playClick(audioContext?: AudioContext): Promise<void> {
  try {
    const ctx = audioContext || await initializeAudioSystem();
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 100);
    });
  } catch (error) {
    audioLogger.error('Error playing click:', error);
    throw error;
  }
}

// Create click buffer for metronome
export function createClickBuffer(audioContext: AudioContext): AudioBuffer {
  const sampleRate = audioContext.sampleRate;
  const duration = 0.1; // 100ms
  const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.sin(2 * Math.PI * 800 * i / sampleRate) * 0.3;
  }
  
  return buffer;
}

// Create accent click buffer for metronome
export function createAccentClickBuffer(audioContext: AudioContext): AudioBuffer {
  const sampleRate = audioContext.sampleRate;
  const duration = 0.1; // 100ms
  const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.sin(2 * Math.PI * 1200 * i / sampleRate) * 0.5;
  }
  
  return buffer;
}

// Request microphone access
export async function requestMicrophoneAccess(): Promise<MediaStream> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioLogger.log('Microphone access granted');
    return stream;
  } catch (error) {
    audioLogger.error('Microphone access denied', error);
    throw error;
  }
}

// Release microphone
export function releaseMicrophone(stream: MediaStream): void {
  stream.getTracks().forEach(track => track.stop());
  audioLogger.log('Microphone released');
}

// Cleanup global audio context
export function cleanupAudioSystem(): void {
  if (globalAudioContext) {
    globalAudioContext.close().catch(console.error);
    globalAudioContext = null;
    audioLogger.log('Global AudioContext cleaned up');
  }
}

console.log('audioUtils.ts loaded successfully - all exports available');
