
// Format voice part for display
export const formatVoicePart = (voicePart: string | null): string => {
  if (!voicePart) return "Not set";
  return voicePart;
};

// Format date for display (moved from the original file)
export const formatDate = (dateString?: string | null) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString();
};
