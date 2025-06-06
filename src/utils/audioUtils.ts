
// NUCLEAR AUDIO UTILS REBUILD - Complete elimination of audio functionality
console.log('NUCLEAR REBUILD: Loading audioUtils.ts with complete cache invalidation at:', Date.now());

// Force log to ensure this new version is loaded
console.warn('🚨 AUDIO FUNCTIONALITY COMPLETELY REMOVED FROM APPLICATION 🚨');

// Stub functions to prevent any import errors
export const getNoteFrequency = (note?: string): number => {
  console.warn('🚨 getNoteFrequency called - audio functionality completely removed');
  return 440; // Default A4 frequency
};

export const playNote = (frequency?: number, duration?: number): void => {
  console.warn('🚨 playNote called - audio functionality completely removed');
};

export const stopAllAudio = (): void => {
  console.warn('🚨 stopAllAudio called - audio functionality completely removed');
};

export const createOscillator = () => {
  console.warn('🚨 createOscillator called - audio functionality completely removed');
  return null;
};

export const initializeAudioContext = () => {
  console.warn('🚨 initializeAudioContext called - audio functionality completely removed');
  return null;
};

// Additional exports that might be needed by any cached components
export const playSound = () => {
  console.warn('🚨 playSound called - audio functionality completely removed');
};

export const stopSound = () => {
  console.warn('🚨 stopSound called - audio functionality completely removed');
};

export const createAudioContext = () => {
  console.warn('🚨 createAudioContext called - audio functionality completely removed');
  return null;
};

// Force default export
export default {
  getNoteFrequency,
  playNote,
  stopAllAudio,
  createOscillator,
  initializeAudioContext,
  playSound,
  stopSound,
  createAudioContext
};

// Log all exports with timestamp to verify new version is loaded
console.log('🚨 NUCLEAR REBUILD audioUtils exports verified at:', Date.now(), {
  getNoteFrequency: typeof getNoteFrequency,
  playNote: typeof playNote,
  stopAllAudio: typeof stopAllAudio,
  createOscillator: typeof createOscillator,
  initializeAudioContext: typeof initializeAudioContext,
  playSound: typeof playSound,
  stopSound: typeof stopSound,
  createAudioContext: typeof createAudioContext
});

// Force module to be recognized as completely new
(window as any).__AUDIO_UTILS_REBUILD__ = Date.now();
console.log('🚨 audioUtils.ts NUCLEAR REBUILD COMPLETE');
