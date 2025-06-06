
// Temporary file to resolve import errors
// This should be removed once we find what's importing it

export const getNoteFrequency = (note: string): number => {
  console.log('audioUtils.ts: This file should not be used - audio functionality removed');
  return 440; // A4 frequency as fallback
};

export const playNote = (frequency: number): void => {
  console.log('audioUtils.ts: Audio functionality has been removed');
};
