
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
    return new AudioContextClass();
  } catch (error) {
    audioLogger.error("Failed to create AudioContext:", error);
    return null;
  }
};

// Resume audio context with user interaction
export const resumeAudioContext = async (audioContext: AudioContext | null): Promise<boolean> => {
  if (!audioContext) return false;
  
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
export const initializeAudioSystem = async (): Promise<AudioContext | null> => {
  const audioContext = initializeAudioContext();
  
  if (audioContext) {
    const success = await resumeAudioContext(audioContext);
    if (success) {
      unlockAudioOnMobile(audioContext);
      return audioContext;
    }
  }
  
  return null;
};
