
// Audio utilities for the application

// Extended logger for audio-related operations
export const audioLogger = {
  log: (...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔊', ...args);
    }
  },
  error: (...args: any[]) => {
    console.error('🔊 ERROR:', ...args);
  },
  debug: (...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug('🔊 DEBUG:', ...args);
    }
  },
  warn: (...args: any[]) => {
    console.warn('🔊 WARNING:', ...args);
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
export const initializeAudioSystem = (): { 
  audioContext: AudioContext | null; 
  initialized: boolean;
  microphonePermission: 'granted' | 'denied' | 'prompt' | 'unsupported';
} => {
  if (typeof window === 'undefined') {
    return { 
      audioContext: null, 
      initialized: false,
      microphonePermission: 'unsupported'
    };
  }
  
  try {
    window.AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContext();
    audioLogger.log('Audio system initialized');
    
    // Check microphone permission status
    let permissionStatus: 'granted' | 'denied' | 'prompt' | 'unsupported' = 'prompt';
    
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'microphone' as PermissionName })
        .then((result) => {
          permissionStatus = result.state as 'granted' | 'denied' | 'prompt';
        })
        .catch(() => {
          permissionStatus = 'unsupported';
        });
    }
    
    return { 
      audioContext,
      initialized: true,
      microphonePermission: permissionStatus
    };
  } catch (error) {
    audioLogger.error('Failed to initialize audio system:', error);
    return { 
      audioContext: null,
      initialized: false,
      microphonePermission: 'unsupported'
    };
  }
};

// Request access to the microphone
export const requestMicrophoneAccess = async (constraints: MediaStreamConstraints = { audio: true }): Promise<MediaStream | null> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    audioLogger.log('Microphone access granted');
    return stream;
  } catch (error) {
    audioLogger.error('Microphone access denied:', error);
    return null;
  }
};

// Release microphone resources
export const releaseMicrophone = (stream: MediaStream | null = null): void => {
  if (!stream) return;
  
  try {
    const tracks = stream.getTracks();
    tracks.forEach(track => {
      track.stop();
      stream.removeTrack(track);
    });
    audioLogger.log('Microphone released');
  } catch (error) {
    audioLogger.error('Error releasing microphone:', error);
  }
};

// Reset audio system
export const resetAudioSystem = async (): Promise<boolean> => {
  try {
    // Create and immediately close a new AudioContext to reset any stuck contexts
    const tempContext = new AudioContext();
    await tempContext.close();
    
    // Reset microphone if needed
    if (navigator.mediaDevices) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      releaseMicrophone(stream);
    }
    
    audioLogger.log('Audio system reset complete');
    return true;
  } catch (error) {
    audioLogger.error('Failed to reset audio system:', error);
    return false;
  }
};
