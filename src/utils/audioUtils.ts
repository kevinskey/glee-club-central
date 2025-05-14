
// Audio utilities for the application

// Logger for audio-related operations
export const audioLogger = {
  log: (...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔊', ...args);
    }
  },
  error: (...args: any[]) => {
    console.error('🔊 ERROR:', ...args);
  }
};

// Function to check and resume AudioContext (needed for iOS Safari)
export const resumeAudioContext = async (audioContext: AudioContext): Promise<boolean> => {
  if (!audioContext) return false;
  
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

// Initialize audio system with proper browser checks
export const initializeAudioSystem = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    window.AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContext();
    audioLogger.log('Audio system initialized');
    return audioContext;
  } catch (error) {
    audioLogger.error('Failed to initialize audio system:', error);
    return null;
  }
};
