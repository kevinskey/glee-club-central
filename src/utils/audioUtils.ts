
// Emergency audioUtils replacement - force module reload
console.log('Loading audioUtils.ts with timestamp:', Date.now());

// All audio functionality has been removed from the application
console.warn('Audio functionality completely disabled');

export const getNoteFrequency = (note?: string): number => {
  console.warn('getNoteFrequency called - audio functionality removed');
  return 440; // Default A4 frequency
};

export const playNote = (frequency?: number, duration?: number): void => {
  console.warn('playNote called - audio functionality removed');
};

export const stopAllAudio = (): void => {
  console.warn('stopAllAudio called - audio functionality removed');
};

export const createOscillator = () => {
  console.warn('createOscillator called - audio functionality removed');
  return null;
};

export const initializeAudioContext = () => {
  console.warn('initializeAudioContext called - audio functionality removed');
  return null;
};

// Ensure all exports are available
export default {
  getNoteFrequency,
  playNote,
  stopAllAudio,
  createOscillator,
  initializeAudioContext
};

// Log all exports to verify they exist
console.log('audioUtils exports:', {
  getNoteFrequency,
  playNote,
  stopAllAudio,
  createOscillator,
  initializeAudioContext
});
