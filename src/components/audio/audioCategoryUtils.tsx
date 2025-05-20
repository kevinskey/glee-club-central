
// Audio category definitions and helper functions

// Define possible audio categories
export enum AudioCategory {
  MY_TRACKS = "my_tracks",
  PRACTICE_RECORDINGS = "practice_recordings",
  PERFORMANCES = "performances",
  VOICE_MEMOS = "voice_memos",
  REHEARSALS = "rehearsals",
  TRAINING = "training"
}

// Labels for audio categories (for display purposes)
export const audioCategoryLabels: Record<string, string> = {
  [AudioCategory.MY_TRACKS]: "My Tracks",
  [AudioCategory.PRACTICE_RECORDINGS]: "Practice Recordings",
  [AudioCategory.PERFORMANCES]: "Performances",
  [AudioCategory.VOICE_MEMOS]: "Voice Memos",
  [AudioCategory.REHEARSALS]: "Rehearsals",
  [AudioCategory.TRAINING]: "Training Materials"
};

// Get category label from category value
export const getCategoryLabel = (category: string): string => {
  return audioCategoryLabels[category] || "Uncategorized";
};

// Get all available categories as options for select inputs
export const getCategoryOptions = () => {
  return Object.entries(audioCategoryLabels).map(([value, label]) => ({
    value,
    label
  }));
};

