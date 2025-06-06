
// Audio utility functions for the Glee Club application

// Audio logging utility
export const audioLogger = {
  log: (message: string, data?: any) => {
    console.log(`[Audio] ${message}`, data);
  },
  error: (message: string, error?: any) => {
    console.error(`[Audio Error] ${message}`, error);
  }
};

// Note frequency calculation for pitch pipe
export function getNoteFrequency(note: string): number {
  const frequencies: Record<string, number> = {
    'C4': 261.63,
    'D4': 293.66,
    'E4': 329.63,
    'F4': 349.23,
    'G4': 392.00,
    'A4': 440.00,
    'B4': 493.88,
    'C5': 523.25
  };
  return frequencies[note] || 440;
}

// Click sound for UI feedback
export function playClick(audioContext?: AudioContext): Promise<void> {
  return new Promise((resolve) => {
    const context = audioContext || new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.frequency.setValueAtTime(800, context.currentTime);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.1);

    setTimeout(() => {
      resolve();
    }, 100);
  });
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

// Resume audio context
export async function resumeAudioContext(audioContext: AudioContext): Promise<void> {
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }
}

// Request microphone access
export async function requestMicrophoneAccess(): Promise<MediaStream> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioLogger.log('Microphone access granted');
    return stream;
  } catch (error) {
    audioLogger.error('Microphone access denied', error);
    throw error;
  }
}

// Release microphone
export function releaseMicrophone(stream: MediaStream): void {
  stream.getTracks().forEach(track => track.stop());
  audioLogger.log('Microphone released');
}
