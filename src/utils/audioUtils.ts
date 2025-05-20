
// Function to check if web audio is supported
export function isWebAudioSupported(): boolean {
  return typeof AudioContext !== 'undefined' || typeof (window as any).webkitAudioContext !== 'undefined';
}

// Function to create an audio context with fallback
export function createAudioContext(): AudioContext | null {
  if (!isWebAudioSupported()) {
    console.error('Web Audio API is not supported in this browser');
    return null;
  }
  
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    return new AudioCtx();
  } catch (error) {
    console.error('Failed to create audio context:', error);
    return null;
  }
}

// Resume audio context (needed for mobile browsers)
export function resumeAudioContext(audioContext: AudioContext): Promise<void> {
  if (audioContext.state === 'suspended') {
    return audioContext.resume();
  }
  return Promise.resolve();
}

// Audio logging utility
export const audioLogger = {
  log: (...args: any[]) => console.log('[Audio]', ...args),
  error: (...args: any[]) => console.error('[Audio Error]', ...args),
  warn: (...args: any[]) => console.warn('[Audio Warning]', ...args)
};

// Function to register keyboard shortcuts
export function registerKeyboardShortcut(key: string, callback: () => void): () => void {
  const handleKeyDown = (event: KeyboardEvent) => {
    // Only trigger if not typing in an input, textarea, or contentEditable element
    const target = event.target as HTMLElement;
    const isTyping = target.tagName === 'INPUT' || 
                    target.tagName === 'TEXTAREA' || 
                    target.getAttribute('contenteditable') === 'true';
    
    if (!isTyping && event.key.toLowerCase() === key.toLowerCase()) {
      callback();
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
  
  // Return a cleanup function
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}

// Create an oscillator for pitch pipe
export function createOscillator(
  audioContext: AudioContext,
  frequency: number,
  type: OscillatorType = 'sine'
): [OscillatorNode, GainNode] {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  return [oscillator, gainNode];
}

// Play a tone with envelope
export function playTone(
  audioContext: AudioContext,
  frequency: number,
  duration: number = 1,
  volume: number = 0.5,
  type: OscillatorType = 'sine'
): void {
  const [oscillator, gainNode] = createOscillator(audioContext, frequency, type);
  
  // Apply volume
  gainNode.gain.value = 0;
  
  // Attack
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.02);
  
  // Decay and sustain
  gainNode.gain.setValueAtTime(volume, audioContext.currentTime + duration - 0.05);
  
  // Release
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
  
  // Start and stop the oscillator
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
}

// Note frequencies (A4 = 440Hz standard)
export const NOTE_FREQUENCIES: Record<string, number> = {
  // Octave 3
  'C3': 130.81,
  'C#3': 138.59,
  'D3': 146.83,
  'D#3': 155.56,
  'E3': 164.81,
  'F3': 174.61,
  'F#3': 185.00,
  'G3': 196.00,
  'G#3': 207.65,
  'A3': 220.00,
  'A#3': 233.08,
  'B3': 246.94,
  
  // Octave 4
  'C4': 261.63,
  'C#4': 277.18,
  'D4': 293.66,
  'D#4': 311.13,
  'E4': 329.63,
  'F4': 349.23,
  'F#4': 369.99,
  'G4': 392.00,
  'G#4': 415.30,
  'A4': 440.00, // A440 standard concert pitch
  'A#4': 466.16,
  'B4': 493.88,
  
  // Octave 5
  'C5': 523.25,
  'C#5': 554.37,
  'D5': 587.33,
  'D#5': 622.25,
  'E5': 659.25,
  'F5': 698.46,
  'F#5': 739.99,
  'G5': 783.99,
  'G#5': 830.61,
  'A5': 880.00,
  'A#5': 932.33,
  'B5': 987.77,
  
  // Octave 6
  'C6': 1046.50
};

// Metronome click buffer generation
export function createClickBuffer(audioContext: AudioContext): AudioBuffer {
  const sampleRate = audioContext.sampleRate;
  const bufferSize = sampleRate * 0.1; // 100ms buffer
  const buffer = audioContext.createBuffer(1, bufferSize, sampleRate);
  const channelData = buffer.getChannelData(0);
  
  // Create a simple click sound
  const attackTime = 0.002; // 2ms attack
  const decayTime = 0.05; // 50ms decay
  
  const attackSamples = Math.floor(attackTime * sampleRate);
  const decaySamples = Math.floor(decayTime * sampleRate);
  
  // Attack phase
  for (let i = 0; i < attackSamples; i++) {
    channelData[i] = (i / attackSamples) * 0.5;
  }
  
  // Decay phase
  for (let i = 0; i < decaySamples; i++) {
    channelData[i + attackSamples] = 0.5 * Math.pow(1 - (i / decaySamples), 2);
  }
  
  return buffer;
}

// Create an accented click for the first beat
export function createAccentClickBuffer(audioContext: AudioContext): AudioBuffer {
  const sampleRate = audioContext.sampleRate;
  const bufferSize = sampleRate * 0.1; // 100ms buffer
  const buffer = audioContext.createBuffer(1, bufferSize, sampleRate);
  const channelData = buffer.getChannelData(0);
  
  // Create a higher-pitched accented click
  const attackTime = 0.001; // 1ms attack (faster)
  const decayTime = 0.07; // 70ms decay (longer)
  
  const attackSamples = Math.floor(attackTime * sampleRate);
  const decaySamples = Math.floor(decayTime * sampleRate);
  
  // Attack phase - higher amplitude for accent
  for (let i = 0; i < attackSamples; i++) {
    channelData[i] = (i / attackSamples) * 0.8; // Higher amplitude
  }
  
  // Decay phase
  for (let i = 0; i < decaySamples; i++) {
    channelData[i + attackSamples] = 0.8 * Math.pow(1 - (i / decaySamples), 1.8);
  }
  
  return buffer;
}

// Audio system initialization and management
export function initializeAudioSystem(): {
  audioContext: AudioContext | null;
  isInitialized: boolean;
} {
  const audioContext = createAudioContext();
  return {
    audioContext,
    isInitialized: audioContext !== null
  };
}

// Reset audio system 
export function resetAudioSystem(audioContext: AudioContext | null): void {
  if (audioContext) {
    if (audioContext.state === 'running') {
      audioContext.suspend().catch(console.error);
    }
  }
}

// Request microphone access
export async function requestMicrophoneAccess(): Promise<MediaStream | null> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });
    return stream;
  } catch (error) {
    audioLogger.error('Error accessing microphone:', error);
    return null;
  }
}

// Release microphone
export function releaseMicrophone(stream: MediaStream | null): void {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
}

