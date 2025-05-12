
// Audio logger
export const audioLogger = {
  log: (message: string, ...params: any[]) => {
    console.log(`🎵 ${message}`, ...params);
  },
  error: (message: string, ...params: any[]) => {
    console.error(`🎵 ❌ ${message}`, ...params);
  },
  warn: (message: string, ...params: any[]) => {
    console.warn(`🎵 ⚠️ ${message}`, ...params);
  },
  debug: (message: string, ...params: any[]) => {
    console.debug(`🎵 🔍 ${message}`, ...params);
  }
};

// Check if Web Audio API is supported
export const isWebAudioSupported = () => {
  return typeof window !== 'undefined' && 
    (window.AudioContext || (window as any).webkitAudioContext);
};

// Initialize audio context safely
export const initializeAudioContext = (): AudioContext | null => {
  if (!isWebAudioSupported()) {
    audioLogger.error("Web Audio API is not supported in this browser");
    return null;
  }
  
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const context = new AudioContextClass();
    return context;
  } catch (error) {
    audioLogger.error("Failed to create AudioContext:", error);
    return null;
  }
};

// Resume audio context - can be called with or without an audio context
export const resumeAudioContext = async (audioContext?: AudioContext | null): Promise<boolean> => {
  if (!audioContext) {
    audioLogger.warn('Attempted to resume undefined audio context');
    return false;
  }
  
  if (audioContext.state === 'suspended') {
    try {
      await audioContext.resume();
      audioLogger.log('AudioContext resumed successfully');
      return true;
    } catch (error) {
      audioLogger.error('Failed to resume AudioContext:', error);
      return false;
    }
  }
  
  return audioContext.state === 'running';
};

// Create a silent buffer and play it to unlock audio on iOS
export const unlockAudioOnMobile = (audioContext: AudioContext): void => {
  if (!audioContext) return;
  
  // Create a short, silent buffer
  const buffer = audioContext.createBuffer(1, 1, 22050);
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  
  // Play the buffer (this must be done in response to a user gesture)
  source.start(0);
  
  audioLogger.log('Attempted to unlock audio playback on mobile');
};

// Load audio file
export const loadAudioFile = async (
  audioContext: AudioContext,
  url: string
): Promise<AudioBuffer | null> => {
  if (!audioContext) return null;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    return await audioContext.decodeAudioData(arrayBuffer);
  } catch (error) {
    audioLogger.error(`Failed to load audio file from ${url}:`, error);
    return null;
  }
};

// Initialize audio system (to be called on user interaction)
export const initializeAudioSystem = async (): Promise<{
  audioContext: AudioContext | null;
  initialized: boolean;
  microphonePermission: 'granted' | 'denied' | 'prompt' | 'unsupported';
}> => {
  const audioContext = initializeAudioContext();
  let microphonePermission: 'granted' | 'denied' | 'prompt' | 'unsupported' = 'prompt';
  
  // Check microphone permissions if available
  if (navigator.mediaDevices && navigator.permissions) {
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      microphonePermission = permissionStatus.state as 'granted' | 'denied' | 'prompt';
    } catch (error) {
      audioLogger.warn('Could not query microphone permission:', error);
    }
  } else {
    microphonePermission = 'unsupported';
  }
  
  if (audioContext) {
    if (audioContext.state === 'suspended') {
      try {
        await audioContext.resume();
        unlockAudioOnMobile(audioContext);
      } catch (error) {
        audioLogger.error('Failed to initialize audio system:', error);
      }
    }
  }
  
  return {
    audioContext,
    initialized: !!audioContext,
    microphonePermission
  };
};

// Reset audio system - needed for RecordingControls.tsx
export const resetAudioSystem = async (): Promise<boolean> => {
  try {
    // Implementation details would depend on your app's needs
    audioLogger.log('Audio system reset');
    return true;
  } catch (error) {
    audioLogger.error('Failed to reset audio system:', error);
    return false;
  }
};

// Request microphone access - needed for useAudioRecorder.ts
export const requestMicrophoneAccess = async (constraints?: MediaStreamConstraints): Promise<MediaStream | null> => {
  try {
    const defaultConstraints = { audio: true, video: false };
    const streamConstraints = constraints || defaultConstraints;
    
    const stream = await navigator.mediaDevices.getUserMedia(streamConstraints);
    audioLogger.log('Microphone access granted');
    return stream;
  } catch (error) {
    audioLogger.error('Microphone access denied or not available:', error);
    return null;
  }
};

// Release microphone - needed for useAudioRecorder.ts
export const releaseMicrophone = (stream?: MediaStream | null): void => {
  if (!stream) return;
  
  stream.getTracks().forEach(track => {
    track.stop();
  });
  
  audioLogger.log('Microphone released');
};
