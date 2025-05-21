
// Logger for audio operations
export const audioLogger = {
  log: (...args: any[]) => console.log('[Audio]', ...args),
  error: (...args: any[]) => console.error('[Audio]', ...args),
  warn: (...args: any[]) => console.warn('[Audio]', ...args),
};

// Request microphone access with proper error handling
export const requestMicrophoneAccess = async (): Promise<MediaStream> => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('Media devices API not available in this browser');
  }

  try {
    // Request access to the microphone
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
      video: false,
    });
    
    return stream;
  } catch (error) {
    // Handle specific media access errors
    if ((error as DOMException).name === 'NotAllowedError') {
      throw new Error('Microphone access denied. Please allow microphone access in your browser.');
    } else if ((error as DOMException).name === 'NotFoundError') {
      throw new Error('No microphone found. Please connect a microphone and try again.');
    } else {
      throw error;
    }
  }
};

// Release microphone resources
export const releaseMicrophone = (stream: MediaStream) => {
  if (stream) {
    stream.getTracks().forEach(track => {
      track.stop();
    });
  }
};

// Audio processing utilities
export interface NoteEvent {
  note: string;
  frequency: number;
  timestamp: number;
  duration: number;
  volume: number;
  waveform: OscillatorType;
}

export interface RecordingData {
  events: NoteEvent[];
  totalDuration: number;
  createdAt: string;
}

// Get frequency for a musical note
export const getNoteFrequency = (note: string, octave: number): number => {
  const notes = { 'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11 };
  const baseFreq = 440; // A4 frequency
  const baseNote = 'A';
  const baseOctave = 4;
  
  // Get the semitone offset from A4
  const noteOffset = notes[note as keyof typeof notes];
  const baseOffset = notes[baseNote as keyof typeof notes];
  const octaveOffset = (octave - baseOctave) * 12;
  const semitonesFromA4 = noteOffset - baseOffset + octaveOffset;
  
  // Calculate frequency using the formula f = f0 * 2^(n/12)
  return baseFreq * Math.pow(2, semitonesFromA4 / 12);
};

// Play a tone
export const playTone = (
  context: AudioContext,
  frequency: number, 
  waveform: OscillatorType = 'sine', 
  duration: number = 1, 
  volume: number = 0.5
) => {
  try {
    // Create oscillator
    const oscillator = context.createOscillator();
    oscillator.type = waveform;
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    
    // Create gain node for volume control
    const gainNode = context.createGain();
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, context.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + duration);
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    // Start and stop oscillator
    oscillator.start();
    oscillator.stop(context.currentTime + duration);
    
    return oscillator;
  } catch (error) {
    audioLogger.error('Error playing tone:', error);
    return null;
  }
};

// Function to check if audio context can be created
export const canCreateAudioContext = (): boolean => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) {
      return false;
    }
    
    const tempContext = new AudioContext();
    tempContext.close();
    return true;
  } catch (error) {
    return false;
  }
};

// Create and configure an AudioContext with fallbacks for different browsers
export const createAudioContext = (): AudioContext => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) {
      throw new Error('AudioContext not supported in this browser');
    }
    
    return new AudioContextClass();
  } catch (error) {
    audioLogger.error('Failed to create audio context:', error);
    throw new Error('Failed to initialize audio system');
  }
};

// Resume AudioContext (needed for browsers with autoplay policies)
export const resumeAudioContext = async (context: AudioContext): Promise<boolean> => {
  if (context.state === 'suspended') {
    try {
      await context.resume();
      audioLogger.log('Audio context resumed');
      return true;
    } catch (error) {
      audioLogger.error('Failed to resume audio context:', error);
      return false;
    }
  }
  return context.state === 'running';
};

// Play a metronome click sound
export const playClick = (
  audioContext: AudioContext, 
  isAccent: boolean = false, 
  volume: number = 0.5
): void => {
  try {
    // Create oscillator for click sound
    const osc = audioContext.createOscillator();
    osc.type = isAccent ? 'triangle' : 'square';
    osc.frequency.value = isAccent ? 1800 : 1600;
    
    // Create gain node for volume control
    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume;
    
    // Create an envelope for the click
    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(volume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05); // Quick decay
    
    // Connect and play
    osc.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    osc.start();
    osc.stop(now + 0.1);
  } catch (error) {
    audioLogger.error('Error playing click:', error);
  }
};

// Create audio buffer for regular metronome click
export const createClickBuffer = (audioContext: AudioContext): AudioBuffer => {
  // Create a short buffer for click sound (1/10th of a second)
  const sampleRate = audioContext.sampleRate;
  const bufferSize = sampleRate * 0.1; 
  const buffer = audioContext.createBuffer(1, bufferSize, sampleRate);
  
  // Fill the buffer with a click sound (simple square wave with decay)
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    // Initial higher amplitude click that decays quickly
    const t = i / sampleRate;
    const decay = Math.exp(-30 * t);
    data[i] = (Math.random() * 0.5 + 0.5) * decay * (i % 2 ? 1 : -1);
  }
  
  return buffer;
};

// Create audio buffer for accented metronome click
export const createAccentClickBuffer = (audioContext: AudioContext): AudioBuffer => {
  // Create a short buffer for accent click (slightly longer than regular click)
  const sampleRate = audioContext.sampleRate;
  const bufferSize = sampleRate * 0.12;
  const buffer = audioContext.createBuffer(1, bufferSize, sampleRate);
  
  // Fill the buffer with an accented click sound (different tone and longer decay)
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    const t = i / sampleRate;
    const decay = Math.exp(-20 * t); // Slower decay than regular click
    const freq = 1800; // Higher frequency for accent
    data[i] = Math.sin(2 * Math.PI * freq * t) * decay;
  }
  
  return buffer;
};

// Register keyboard shortcut
export const registerKeyboardShortcut = (
  key: string, 
  callback: () => void
): () => void => {
  const handleKeyDown = (event: KeyboardEvent) => {
    // Only trigger if no input elements are focused
    const isInputFocused = 
      document.activeElement instanceof HTMLInputElement || 
      document.activeElement instanceof HTMLTextAreaElement ||
      document.activeElement instanceof HTMLSelectElement;
    
    if (!isInputFocused && event.key === key) {
      callback();
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
};

// Reset audio system (useful for recovering from errors)
export const resetAudioSystem = async (): Promise<AudioContext | null> => {
  try {
    // Close any existing audio contexts that might be in a bad state
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) {
      return null;
    }
    
    // Create and resume a new context
    const newContext = new AudioContextClass();
    
    if (newContext.state === 'suspended') {
      await newContext.resume();
    }
    
    return newContext;
  } catch (error) {
    audioLogger.error('Error resetting audio system:', error);
    return null;
  }
};
