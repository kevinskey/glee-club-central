
// Placeholder audioUtils to prevent import errors
// All audio functionality has been removed from the application

export const getNoteFrequency = (note?: string) => {
  console.warn('Audio functionality has been removed from this application');
  return 440; // Default A4 frequency
};

export const playNote = (frequency?: number, duration?: number) => {
  console.warn('Audio functionality has been removed from this application');
};

export const stopAllAudio = () => {
  console.warn('Audio functionality has been removed from this application');
};

export const createOscillator = () => {
  console.warn('Audio functionality has been removed from this application');
  return null;
};

export const initializeAudioContext = () => {
  console.warn('Audio functionality has been removed from this application');
  return null;
};

// Export default function in case it's being imported that way
export default {
  getNoteFrequency,
  playNote,
  stopAllAudio,
  createOscillator,
  initializeAudioContext
};
