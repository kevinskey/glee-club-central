
// Audio utility functions for audio tools

// Audio logging utility
export const audioLogger = {
  log: (message: string, data?: any) => {
    console.log(`[Audio] ${message}`, data);
  },
  error: (message: string, error?: any) => {
    console.error(`[Audio Error] ${message}`, error);
  },
  warn: (message: string, data?: any) => {
    console.warn(`[Audio Warning] ${message}`, data);
  }
};

// Global AudioContext instance to prevent multiple contexts
let globalAudioContext: AudioContext | null = null;

// Get or create AudioContext singleton
export function getAudioContext(): AudioContext {
  if (!globalAudioContext) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) {
      throw new Error('AudioContext not supported in this browser');
    }
    globalAudioContext = new AudioContextClass();
    audioLogger.log('Global AudioContext created');
  }
  
  return globalAudioContext;
}

// Resume audio context with user interaction handling
export async function resumeAudioContext(audioContext?: AudioContext): Promise<AudioContext> {
  const ctx = audioContext || getAudioContext();
  
  if (ctx.state === 'suspended') {
    try {
      await ctx.resume();
      audioLogger.log('AudioContext resumed successfully');
    } catch (error) {
      audioLogger.error('Failed to resume AudioContext:', error);
      throw error;
    }
  }
  
  return ctx;
}

// Initialize audio system with user interaction
export async function initializeAudioSystem(): Promise<AudioContext> {
  try {
    const audioContext = getAudioContext();
    await resumeAudioContext(audioContext);
    audioLogger.log('Audio system initialized successfully');
    return audioContext;
  } catch (error) {
    audioLogger.error('Failed to initialize audio system:', error);
    throw error;
  }
}

// Note frequency calculation for pitch pipe
export function getNoteFrequency(note: string, octave: number = 4): number {
  audioLogger.log('getNoteFrequency called with:', { note, octave });
  
  const noteMap: { [key: string]: number } = {
    'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5,
    'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
  };
  
  const semitone = noteMap[note];
  if (semitone === undefined) {
    throw new Error(`Invalid note: ${note}`);
  }
  
  // A4 = 440 Hz
  const A4 = 440;
  const A4_OCTAVE = 4;
  const A4_SEMITONE = 9; // A is the 9th semitone in the chromatic scale
  
  const semitonesFromA4 = (octave - A4_OCTAVE) * 12 + (semitone - A4_SEMITONE);
  const frequency = A4 * Math.pow(2, semitonesFromA4 / 12);
  
  audioLogger.log('Calculated frequency:', frequency);
  return frequency;
}

// Play note function for pitch pipe functionality - now uses global context
export async function playNote(frequency: number, duration: number = 1000): Promise<void> {
  audioLogger.log('playNote called with:', { frequency, duration });
  
  try {
    const audioContext = await initializeAudioSystem();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
    
    audioLogger.log('Note played successfully');
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, duration);
    });
  } catch (error) {
    audioLogger.error('Error playing note:', error);
    throw error;
  }
}

// Click sound for metronome - now accepts optional AudioContext
export async function playClick(audioContext?: AudioContext): Promise<void> {
  try {
    const ctx = audioContext || await initializeAudioSystem();
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
    
    audioLogger.log('Click played successfully');
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 100);
    });
  } catch (error) {
    audioLogger.error('Error playing click:', error);
    throw error;
  }
}

// Create click buffer for metronome
export function createClickBuffer(audioContext: AudioContext): AudioBuffer {
  const sampleRate = audioContext.sampleRate;
  const duration = 0.1; // 100ms
  const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.sin(2 * Math.PI * 800 * i / sampleRate) * 0.3;
  }
  
  return buffer;
}

// Create accent click buffer for metronome
export function createAccentClickBuffer(audioContext: AudioContext): AudioBuffer {
  const sampleRate = audioContext.sampleRate;
  const duration = 0.1; // 100ms
  const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.sin(2 * Math.PI * 1200 * i / sampleRate) * 0.5;
  }
  
  return buffer;
}

// Enhanced microphone access with detailed error handling
export async function requestMicrophoneAccess(): Promise<MediaStream> {
  audioLogger.log('🎤 Requesting microphone access...');
  
  // Check if getUserMedia is supported
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    const error = new Error('getUserMedia is not supported in this browser');
    audioLogger.error('🎤 Browser compatibility issue:', error);
    throw error;
  }
  
  // Check if we're on HTTPS (required for microphone access)
  if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    const error = new Error('Microphone access requires HTTPS connection');
    audioLogger.error('🎤 Security requirement not met:', error);
    throw error;
  }
  
  try {
    // Check current permissions
    if ('permissions' in navigator) {
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' as any });
        audioLogger.log('🎤 Current microphone permission status:', permissionStatus.state);
        
        if (permissionStatus.state === 'denied') {
          throw new Error('Microphone permission has been denied. Please enable it in your browser settings.');
        }
      } catch (permError) {
        audioLogger.warn('🎤 Could not check permissions:', permError);
      }
    }
    
    // Request microphone access with specific constraints
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 44100
      }
    });
    
    // Verify we got audio tracks
    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) {
      throw new Error('No audio tracks found in the media stream');
    }
    
    audioLogger.log('🎤 Microphone access granted successfully');
    audioLogger.log('🎤 Audio tracks:', audioTracks.map(track => ({
      label: track.label,
      enabled: track.enabled,
      readyState: track.readyState,
      settings: track.getSettings()
    })));
    
    return stream;
  } catch (error) {
    audioLogger.error('🎤 Microphone access failed:', error);
    
    // Provide more specific error messages
    if (error.name === 'NotAllowedError') {
      throw new Error('Microphone access was denied. Please allow microphone permissions and try again.');
    } else if (error.name === 'NotFoundError') {
      throw new Error('No microphone device found. Please connect a microphone and try again.');
    } else if (error.name === 'NotReadableError') {
      throw new Error('Microphone is already in use by another application.');
    } else if (error.name === 'OverconstrainedError') {
      throw new Error('Microphone constraints could not be satisfied.');
    } else if (error.name === 'SecurityError') {
      throw new Error('Microphone access blocked due to security restrictions.');
    }
    
    throw error;
  }
}

// Release microphone
export function releaseMicrophone(stream: MediaStream): void {
  try {
    const tracks = stream.getTracks();
    tracks.forEach(track => {
      track.stop();
      audioLogger.log(`🎤 Stopped track: ${track.label || track.kind}`);
    });
    audioLogger.log('🎤 Microphone released successfully');
  } catch (error) {
    audioLogger.error('🎤 Error releasing microphone:', error);
  }
}

// Cleanup global audio context
export function cleanupAudioSystem(): void {
  if (globalAudioContext) {
    globalAudioContext.close().catch(console.error);
    globalAudioContext = null;
    audioLogger.log('Global AudioContext cleaned up');
  }
}

// Enhanced debug function to check audio capabilities
export function debugAudioCapabilities(): void {
  audioLogger.log('=== 🔍 AUDIO DEBUG INFO ===');
  
  // Browser support checks
  audioLogger.log('🌐 Browser Support:');
  audioLogger.log('  - AudioContext:', !!(window.AudioContext || (window as any).webkitAudioContext));
  audioLogger.log('  - MediaDevices:', !!navigator.mediaDevices);
  audioLogger.log('  - getUserMedia:', !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia));
  audioLogger.log('  - MediaRecorder:', !!window.MediaRecorder);
  
  // Security context
  audioLogger.log('🔒 Security Context:');
  audioLogger.log('  - Protocol:', location.protocol);
  audioLogger.log('  - Hostname:', location.hostname);
  audioLogger.log('  - Secure context:', window.isSecureContext);
  
  // MediaRecorder support
  if (window.MediaRecorder) {
    audioLogger.log('🎥 MediaRecorder Support:');
    const mimeTypes = [
      'audio/webm',
      'audio/webm;codecs=opus',
      'audio/mp4',
      'audio/wav'
    ];
    mimeTypes.forEach(type => {
      audioLogger.log(`  - ${type}:`, MediaRecorder.isTypeSupported(type));
    });
  }
  
  // AudioContext state
  if (globalAudioContext) {
    audioLogger.log('🎵 Global AudioContext:');
    audioLogger.log('  - State:', globalAudioContext.state);
    audioLogger.log('  - Sample rate:', globalAudioContext.sampleRate);
    audioLogger.log('  - Base latency:', globalAudioContext.baseLatency);
  } else {
    audioLogger.log('🎵 Global AudioContext: Not created yet');
  }
  
  // Test microphone access (without actually requesting)
  audioLogger.log('🎤 Testing microphone requirements...');
  if (!navigator.mediaDevices) {
    audioLogger.error('❌ navigator.mediaDevices not available');
  } else if (!navigator.mediaDevices.getUserMedia) {
    audioLogger.error('❌ getUserMedia not available');
  } else if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    audioLogger.error('❌ HTTPS required for microphone access');
  } else {
    audioLogger.log('✅ Microphone requirements met');
  }
  
  audioLogger.log('=== 🔍 END DEBUG INFO ===');
}

console.log('audioUtils.ts loaded successfully - all exports available');
