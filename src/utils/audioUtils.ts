
import { toast } from "sonner";

// Types for audio system
export interface AudioSystemState {
  initialized: boolean;
  microphonePermission: 'granted' | 'denied' | 'prompt' | 'unsupported';
  outputDevices: MediaDeviceInfo[];
  inputDevices: MediaDeviceInfo[];
  currentInputDevice: MediaDeviceInfo | null;
  currentOutputDevice: MediaDeviceInfo | null;
  audioContext: AudioContext | null;
  stream: MediaStream | null;
}

// Create a logger specifically for audio-related logs
export const audioLogger = {
  log: (message: string, ...args: any[]) => {
    console.log(`[Audio System] ${message}`, ...args);
  },
  error: (message: string, ...args: any[]) => {
    console.error(`[Audio System] ${message}`, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`[Audio System] ${message}`, ...args);
  },
  debug: (message: string, data?: any) => {
    console.debug(`[Audio System Debug] ${message}`, data);
  },
};

// Initial state for the audio system
const initialState: AudioSystemState = {
  initialized: false,
  microphonePermission: 'prompt',
  outputDevices: [],
  inputDevices: [],
  currentInputDevice: null,
  currentOutputDevice: null,
  audioContext: null,
  stream: null,
};

// Singleton audio system state
let audioSystemState = { ...initialState };

/**
 * Initialize the audio system and request permissions
 */
export const initializeAudioSystem = async (): Promise<AudioSystemState> => {
  audioLogger.log('Initializing audio system...');

  if (!navigator.mediaDevices) {
    audioLogger.error('MediaDevices API not supported in this browser');
    toast.error("Audio system not supported by your browser");
    audioSystemState.microphonePermission = 'unsupported';
    return audioSystemState;
  }

  try {
    // Check if permissions API is available to query permission state
    if (navigator.permissions) {
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        audioSystemState.microphonePermission = permissionStatus.state as any;
        audioLogger.log(`Current microphone permission: ${permissionStatus.state}`);
        
        // Listen for permission changes
        permissionStatus.addEventListener('change', () => {
          audioSystemState.microphonePermission = permissionStatus.state as any;
          audioLogger.log(`Microphone permission changed to: ${permissionStatus.state}`);
        });
      } catch (error) {
        audioLogger.warn('Could not query microphone permission status', error);
      }
    }

    // Initialize audio context with safety for different browsers
    if (!audioSystemState.audioContext) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioSystemState.audioContext = new AudioContext();
      
      // iOS Safari and some browsers require user interaction first
      if (audioSystemState.audioContext.state === 'suspended') {
        audioLogger.warn('AudioContext is suspended. Will resume on user interaction.');
      }
    }
    
    // Enumerate and log available devices
    await updateAudioDevices();

    audioSystemState.initialized = true;
    audioLogger.log('Audio system initialized successfully');
    
    return audioSystemState;
  } catch (error) {
    audioLogger.error('Failed to initialize audio system', error);
    toast.error("Failed to initialize audio system");
    return audioSystemState;
  }
};

/**
 * Update the list of available audio devices
 */
export const updateAudioDevices = async (): Promise<void> => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    
    // Filter and map devices
    const inputDevices = devices.filter(device => device.kind === 'audioinput');
    const outputDevices = devices.filter(device => device.kind === 'audiooutput');
    
    audioSystemState.inputDevices = inputDevices;
    audioSystemState.outputDevices = outputDevices;
    
    audioLogger.debug('Available audio devices updated', { 
      inputs: inputDevices.length, 
      outputs: outputDevices.length 
    });
    
    // Log detailed device information
    inputDevices.forEach((device, index) => {
      audioLogger.debug(`Input device ${index + 1}:`, {
        id: device.deviceId,
        label: device.label || 'Unnamed device'
      });
    });
    
    outputDevices.forEach((device, index) => {
      audioLogger.debug(`Output device ${index + 1}:`, {
        id: device.deviceId,
        label: device.label || 'Unnamed device'
      });
    });
  } catch (error) {
    audioLogger.error('Error enumerating audio devices', error);
  }
};

/**
 * Request access to microphone
 */
export const requestMicrophoneAccess = async (constraints: MediaStreamConstraints = { 
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true
  } 
}): Promise<MediaStream | null> => {
  audioLogger.log('Requesting microphone access...');
  
  try {
    // Ensure we release any previous stream
    releaseMicrophone();
    
    // Request the stream with specified constraints
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    audioSystemState.stream = stream;
    audioSystemState.microphonePermission = 'granted';
    
    // Get the audio tracks for logging
    const audioTracks = stream.getAudioTracks();
    
    audioLogger.log(`Microphone access granted: ${audioTracks.length} track(s) available`);
    audioLogger.debug('Audio track settings:', audioTracks[0]?.getSettings());
    
    // Find which input device is being used
    const devices = await navigator.mediaDevices.enumerateDevices();
    const inputDevices = devices.filter(device => device.kind === 'audioinput');
    
    // Look for a device that matches the track's device ID
    const trackSettings = audioTracks[0]?.getSettings();
    if (trackSettings && trackSettings.deviceId) {
      audioSystemState.currentInputDevice = inputDevices.find(
        device => device.deviceId === trackSettings.deviceId
      ) || null;
    }
    
    toast.success("Microphone activated successfully");
    return stream;
  } catch (error: any) {
    audioSystemState.microphonePermission = 'denied';
    audioLogger.error('Error accessing microphone', error);
    
    // Provide more descriptive error message to user
    let errorMessage = "Could not access microphone";
    
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      errorMessage = "Microphone access denied. Please allow microphone access in your browser settings.";
    } else if (error.name === 'NotFoundError') {
      errorMessage = "No microphone found. Please connect a microphone and try again.";
    } else if (error.name === 'NotReadableError' || error.name === 'AbortError') {
      errorMessage = "Could not start microphone. It may be in use by another application.";
    }
    
    toast.error(errorMessage, {
      duration: 5000,
    });
    
    return null;
  }
};

/**
 * Release microphone resources
 */
export const releaseMicrophone = (): void => {
  if (audioSystemState.stream) {
    audioLogger.log('Releasing microphone resources');
    audioSystemState.stream.getTracks().forEach(track => {
      track.stop();
      audioLogger.debug(`Stopped track: ${track.kind}`);
    });
    audioSystemState.stream = null;
  }
};

/**
 * Get current audio system state
 */
export const getAudioSystemState = (): AudioSystemState => {
  return { ...audioSystemState };
};

/**
 * Reset audio system to initial state
 */
export const resetAudioSystem = async (): Promise<void> => {
  audioLogger.log('Resetting audio system...');
  
  // Clean up existing resources
  releaseMicrophone();
  
  if (audioSystemState.audioContext) {
    try {
      await audioSystemState.audioContext.close();
      audioLogger.log('Audio context closed');
    } catch (error) {
      audioLogger.error('Error closing audio context', error);
    }
  }
  
  // Reset to initial state
  audioSystemState = { ...initialState };
  
  // Re-initialize the system
  await initializeAudioSystem();
  
  audioLogger.log('Audio system has been reset');
  toast.success("Audio system has been reset");
};

/**
 * Play a test sound through the audio system
 */
export const playTestSound = async (): Promise<void> => {
  if (!audioSystemState.audioContext) {
    await initializeAudioSystem();
  }
  
  const context = audioSystemState.audioContext;
  if (!context) {
    toast.error("Audio system is not available");
    return;
  }
  
  try {
    // Resume the audio context if suspended
    if (context.state === 'suspended') {
      await context.resume();
    }
    
    audioLogger.log('Playing test sound...');
    
    // Create an oscillator for a simple beep
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 440; // A4 note
    gainNode.gain.value = 0.1; // Quiet volume
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.start();
    
    // Stop after 0.5 seconds
    setTimeout(() => {
      oscillator.stop();
      audioLogger.log('Test sound completed');
    }, 500);
    
    toast.success("Audio output test successful");
  } catch (error) {
    audioLogger.error('Error playing test sound', error);
    toast.error("Failed to play test sound");
  }
};

/**
 * Load and decode an audio file from a URL
 */
export const loadAudioFile = async (
  url: string, 
  context: AudioContext = audioSystemState.audioContext!
): Promise<AudioBuffer> => {
  audioLogger.log(`Loading audio file: ${url}`);
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await context.decodeAudioData(arrayBuffer);
    
    audioLogger.log(`Successfully loaded audio file: ${url}`);
    return audioBuffer;
  } catch (error) {
    audioLogger.error(`Failed to load audio file: ${url}`, error);
    throw error;
  }
};

/**
 * Preload common audio files used throughout the app
 */
export const preloadAudioFiles = async (
  fileUrls: string[]
): Promise<Map<string, AudioBuffer>> => {
  if (!audioSystemState.initialized) {
    await initializeAudioSystem();
  }
  
  if (!audioSystemState.audioContext) {
    throw new Error("Audio context not available");
  }
  
  const audioBuffers = new Map<string, AudioBuffer>();
  const context = audioSystemState.audioContext;
  
  audioLogger.log(`Preloading ${fileUrls.length} audio files...`);
  
  try {
    // Load all files in parallel
    const bufferPromises = fileUrls.map(async (url) => {
      try {
        const buffer = await loadAudioFile(url, context);
        return { url, buffer };
      } catch (error) {
        audioLogger.error(`Failed to preload audio file: ${url}`, error);
        return { url, error };
      }
    });
    
    const results = await Promise.all(bufferPromises);
    
    // Store successful loads in the map
    let successCount = 0;
    for (const result of results) {
      if ('buffer' in result) {
        audioBuffers.set(result.url, result.buffer);
        successCount++;
      }
    }
    
    audioLogger.log(`Preloaded ${successCount}/${fileUrls.length} audio files successfully`);
    
    if (successCount < fileUrls.length) {
      toast.warning(`Some audio files failed to load (${fileUrls.length - successCount}/${fileUrls.length})`);
    }
    
    return audioBuffers;
  } catch (error) {
    audioLogger.error('Error during audio preloading', error);
    toast.error("Failed to preload audio files");
    throw error;
  }
};

// Initialize the audio system when this module loads
initializeAudioSystem().catch(error => {
  audioLogger.error('Failed to initialize audio system on load', error);
});
