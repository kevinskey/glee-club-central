
// Types
export interface NoteEvent {
  note: string;
  frequency: number;
  timestamp: number;
  waveform?: OscillatorType;
  duration?: number;
  volume?: number;
}

export interface RecordingData {
  audioBlob?: Blob;
  duration: number;
  timestamps?: NoteEvent[];
  events: NoteEvent[];
  totalDuration?: number;
  createdAt?: string;
}

// Simple logger for audio-related operations
export const audioLogger = {
  log: (message: string, ...args: any[]) => {
    console.log(`[Audio] ${message}`, ...args);
  },
  error: (message: string, ...args: any[]) => {
    console.error(`[Audio Error] ${message}`, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`[Audio Warning] ${message}`, ...args);
  }
};

// Function to create a new audio context with optimal settings
export const createAudioContext = (): AudioContext => {
  try {
    // Try to use the modern constructor with options for lower latency
    return new (window.AudioContext || (window as any).webkitAudioContext)({
      latencyHint: 'interactive',
      sampleRate: 48000
    });
  } catch (e) {
    // Fall back to standard constructor if options aren't supported
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  }
};

// Function to resume audio context (useful for mobile browsers)
export const resumeAudioContext = async (audioContext: AudioContext): Promise<boolean> => {
  if (audioContext.state === 'suspended') {
    try {
      await audioContext.resume();
      audioLogger.log('Audio context resumed successfully');
      return true;
    } catch (error) {
      audioLogger.error('Failed to resume audio context:', error);
      return false;
    }
  }
  return audioContext.state === 'running';
};

// Function to request microphone access
export const requestMicrophoneAccess = async (): Promise<MediaStream> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      } 
    });
    
    audioLogger.log('Microphone access granted');
    return stream;
  } catch (error) {
    audioLogger.error('Error accessing microphone:', error);
    throw new Error('Could not access microphone. Please check your permissions.');
  }
};

// Function to properly release microphone resources
export const releaseMicrophone = (stream: MediaStream): void => {
  try {
    const tracks = stream.getTracks();
    
    tracks.forEach(track => {
      track.stop();
      audioLogger.log(`Track ${track.kind} stopped and released`);
    });
  } catch (error) {
    audioLogger.error('Error releasing microphone:', error);
  }
};

// Function to play a click sound (useful for metronome or UI feedback)
export const playClick = async (
  audioContext: AudioContext, 
  isAccent: boolean = false,
  volume: number = 0.5
): Promise<void> => {
  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Configure sound
    oscillator.type = isAccent ? 'triangle' : 'sine';
    oscillator.frequency.setValueAtTime(isAccent ? 1000 : 800, audioContext.currentTime);
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    
    // Envelope
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
    
    // Play
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
  } catch (error) {
    audioLogger.error('Error playing click sound:', error);
  }
};

// Function to play a tone at a specific frequency with waveform type
export const playTone = (
  audioContext: AudioContext, 
  frequency: number, 
  waveform: OscillatorType = 'sine',
  duration: number = 1, 
  volume: number = 0.7
): OscillatorNode => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.type = waveform;
  oscillator.frequency.value = frequency;
  gainNode.gain.value = volume;
  
  oscillator.start();
  
  if (duration > 0) {
    // Fade out towards the end
    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(volume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
    
    // Stop after duration
    setTimeout(() => {
      oscillator.stop();
      oscillator.disconnect();
      gainNode.disconnect();
    }, duration * 1000);
  }
  
  return oscillator;
};

// Utility to create waveform visualization data from audio buffer
export const createWaveformData = (buffer: AudioBuffer, numPoints: number): number[] => {
  const data = buffer.getChannelData(0);
  const blockSize = Math.floor(data.length / numPoints);
  const result = [];
  
  for (let i = 0; i < numPoints; i++) {
    const blockStart = blockSize * i;
    let sum = 0;
    
    for (let j = 0; j < blockSize; j++) {
      sum += Math.abs(data[blockStart + j] || 0);
    }
    
    result.push(sum / blockSize);
  }
  
  return result;
};

// Function to register keyboard shortcuts
export const registerKeyboardShortcut = (key: string, callback: () => void): (() => void) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key.toLowerCase() === key.toLowerCase()) {
      callback();
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
};

// Function to create a regular click sound buffer
export const createClickBuffer = (audioContext: AudioContext): AudioBuffer => {
  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, sampleRate * 0.1, sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < data.length; i++) {
    const t = i / sampleRate;
    // Simple sine wave with exponential decay
    data[i] = Math.sin(2 * Math.PI * 800 * t) * Math.exp(-30 * t);
  }
  
  return buffer;
};

// Function to create an accented click sound buffer
export const createAccentClickBuffer = (audioContext: AudioContext): AudioBuffer => {
  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, sampleRate * 0.1, sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < data.length; i++) {
    const t = i / sampleRate;
    // Higher frequency and slower decay for accented clicks
    data[i] = Math.sin(2 * Math.PI * 1000 * t) * Math.exp(-20 * t);
  }
  
  return buffer;
};
