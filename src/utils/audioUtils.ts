
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
export const playClick = async (audioContext?: AudioContext): Promise<void> => {
  const context = audioContext || new (window.AudioContext || (window as any).webkitAudioContext)();
  
  try {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    // Configure sound
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, context.currentTime);
    gainNode.gain.setValueAtTime(0.5, context.currentTime);
    
    // Envelope
    gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.1);
    
    // Play
    oscillator.start();
    oscillator.stop(context.currentTime + 0.1);
  } catch (error) {
    audioLogger.error('Error playing click sound:', error);
  }
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
