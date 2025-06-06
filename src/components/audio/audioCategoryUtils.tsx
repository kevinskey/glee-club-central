
// Audio category definitions and helper functions

// Define possible audio categories as string literals for consistent usage
export type AudioCategory = "my_tracks" | "practice_recordings" | "performances" | 
                         "voice_memos" | "rehearsals" | "training" | "recordings" | "part_tracks";

// Labels for audio categories (for display purposes)
export const audioCategoryLabels: Record<string, string> = {
  "my_tracks": "My Tracks",
  "practice_recordings": "Practice Recordings",
  "performances": "Performances",
  "voice_memos": "Voice Memos",
  "rehearsals": "Rehearsals",
  "training": "Training Materials",
  "recordings": "Recordings",
  "part_tracks": "Part Tracks"
};

// Category descriptions for UI display
export const audioCategoryDescriptions: Record<string, string> = {
  "my_tracks": "Your personal recordings",
  "practice_recordings": "Recordings for practice sessions",
  "performances": "Live performance recordings",
  "voice_memos": "Quick voice memos",
  "rehearsals": "Rehearsal recordings",
  "training": "Training and learning materials",
  "recordings": "General recordings",
  "part_tracks": "Individual part recordings"
};

// Category icons (placeholders - to be used with Lucide icons)
export const audioCategoryIcons: Record<string, React.ReactNode> = {
  "my_tracks": null,
  "practice_recordings": null, 
  "performances": null,
  "voice_memos": null,
  "rehearsals": null,
  "training": null,
  "recordings": null,
  "part_tracks": null
};

// Get category label from category value
export const getCategoryLabel = (category: string): string => {
  return audioCategoryLabels[category] || "Uncategorized";
};

// Alias for compatibility with existing code
export const getCategoryName = getCategoryLabel;

// Get all available categories as options for select inputs
export const getCategoryOptions = () => {
  return Object.entries(audioCategoryLabels).map(([value, label]) => ({
    value,
    label
  }));
};

// Get categories info for components that expect it
export const getCategoriesInfo = () => {
  return Object.entries(audioCategoryLabels).map(([value, label]) => ({
    id: value,
    name: label,
    description: audioCategoryDescriptions[value] || "",
    icon: audioCategoryIcons[value]
  }));
};
