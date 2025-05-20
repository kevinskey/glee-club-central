
// Audio utility functions for Glee Tools

// Logger for audio debugging
export const audioLogger = {
  log: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔊', ...args);
    }
  },
  error: (...args: any[]) => {
    console.error('🔊 ERROR:', ...args);
  },
  debug: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔊 DEBUG:', ...args);
    }
  },
  warn: (...args: any[]) => {
    console.warn('🔊 WARNING:', ...args);
  }
};

// Notes with their frequencies in Hz (C4 to B5)
export const NOTE_FREQUENCIES: Record<string, number> = {
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
  'C5': 523.25,
  'C#5': 554.37,
  'D5': 587.33,
  'D#5': 622.25,
  'E5': 659.26,
  'F5': 698.46,
  'F#5': 739.99,
  'G5': 783.99,
  'G#5': 830.61,
  'A5': 880.00,
  'A#5': 932.33,
  'B5': 987.77
};

// Get the note frequency with transposition
export const getTransposedFrequency = (note: string, octaveShift: number = 0): number => {
  const [noteName, octaveStr] = note.split('');
  const octave = parseInt(octaveStr, 10);
  const newOctave = octave + octaveShift;
  const newNote = `${noteName}${newOctave}`;
  
  return NOTE_FREQUENCIES[newNote] || NOTE_FREQUENCIES[note];
};

// Safe way to resume AudioContext (needed for mobile browsers)
export const resumeAudioContext = async (audioContext: AudioContext): Promise<void> => {
  if (audioContext.state === 'suspended') {
    try {
      await audioContext.resume();
      audioLogger.log('AudioContext resumed successfully');
    } catch (error) {
      audioLogger.error('Failed to resume AudioContext:', error);
      throw error;
    }
  }
};

// Create a metronome click sound buffer
export const createClickBuffer = (audioContext: AudioContext): AudioBuffer => {
  // Create a short click sound (100ms)
  const sampleRate = audioContext.sampleRate;
  const bufferSize = sampleRate * 0.1; // 100ms buffer
  const buffer = audioContext.createBuffer(1, bufferSize, sampleRate);
  const data = buffer.getChannelData(0);
  
  // Create a quick attack, quick decay envelope
  for (let i = 0; i < bufferSize; i++) {
    const t = i / sampleRate;
    if (t < 0.001) {
      // Quick attack (first 1ms)
      data[i] = (i / (0.001 * sampleRate));
    } else {
      // Exponential decay
      data[i] = Math.exp(-10 * t);
    }
  }
  
  return buffer;
};

// Create a stronger accent click for first beat
export const createAccentClickBuffer = (audioContext: AudioContext): AudioBuffer => {
  const sampleRate = audioContext.sampleRate;
  const bufferSize = sampleRate * 0.1; // 100ms buffer
  const buffer = audioContext.createBuffer(1, bufferSize, sampleRate);
  const data = buffer.getChannelData(0);
  
  // Create a stronger, slightly longer click
  for (let i = 0; i < bufferSize; i++) {
    const t = i / sampleRate;
    if (t < 0.002) {
      // Slightly longer attack (2ms)
      data[i] = (i / (0.002 * sampleRate));
    } else {
      // Slower decay for accent note
      data[i] = Math.exp(-8 * t);
    }
  }
  
  return buffer;
};

// Function to format a keyboard shortcut for display
export const formatKeyboardShortcut = (key: string): string => {
  return key.length === 1 ? key.toUpperCase() : key;
};

// Function to register a keyboard shortcut
export const registerKeyboardShortcut = (
  key: string,
  handler: () => void,
  active: boolean = true
): () => void => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (!active) return;
    if (event.key.toLowerCase() === key.toLowerCase() && 
        !event.ctrlKey && 
        !event.altKey && 
        !event.metaKey) {
      event.preventDefault();
      handler();
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
};

// Function to reset the audio system
export const resetAudioSystem = async (): Promise<void> => {
  audioLogger.log('Resetting audio system...');
  
  try {
    // This is a placeholder implementation 
    // In a full implementation, this would close existing audio contexts,
    // release any media streams, and reset audio state
    
    return Promise.resolve();
  } catch (error) {
    audioLogger.error('Error resetting audio system:', error);
    return Promise.reject(error);
  }
};

// Initialize audio system and check permissions
export const initializeAudioSystem = (): { initialized: boolean; microphonePermission: 'granted' | 'denied' | 'prompt' | 'unsupported' } => {
  // Check if browser supports audio API
  const hasAudioAPI = typeof AudioContext !== 'undefined' || typeof (window as any).webkitAudioContext !== 'undefined';
  
  // Check if browser supports getUserMedia
  const hasGetUserMedia = navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
  
  if (!hasAudioAPI) {
    audioLogger.warn('Web Audio API not supported in this browser');
    return { initialized: false, microphonePermission: 'unsupported' };
  }
  
  if (!hasGetUserMedia) {
    audioLogger.warn('getUserMedia not supported in this browser');
    return { initialized: false, microphonePermission: 'unsupported' };
  }
  
  // Return basic initialized state, actual permission will need to be requested later
  return { initialized: true, microphonePermission: 'prompt' };
};

// Request microphone access
export const requestMicrophoneAccess = async (constraints: MediaStreamConstraints = { audio: true }): Promise<MediaStream | null> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    audioLogger.log('Microphone access granted');
    return stream;
  } catch (error) {
    if ((error as Error).name === 'NotAllowedError') {
      audioLogger.warn('Microphone access denied by user');
    } else {
      audioLogger.error('Error accessing microphone:', error);
    }
    return null;
  }
};

// Release microphone
export const releaseMicrophone = (stream: MediaStream | null): void => {
  if (stream) {
    const tracks = stream.getTracks();
    tracks.forEach(track => {
      track.stop();
    });
    audioLogger.log('Microphone released');
  }
};
