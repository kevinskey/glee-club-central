
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
