
// Simple audio utility for pitch pipe functionality
export const getNoteFrequency = (note: string): number => {
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
};
