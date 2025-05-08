
/**
 * Format a role for display
 */
export const getRoleDisplayName = (role: string): string => {
  if (!role) return "Unknown";
  
  switch (role) {
    case "administrator": return "Administrator";
    case "section_leader": return "Section Leader";
    case "singer": return "Singer";
    case "student_conductor": return "Student Conductor";
    case "accompanist": return "Accompanist";
    case "non_singer": return "Non-Singer";
    default: return role.charAt(0).toUpperCase() + role.slice(1).replace(/_/g, ' ');
  }
};

/**
 * Format voice part for display
 */
export const getVoicePartDisplay = (voicePart: string | null): string => {
  if (!voicePart) return "Not set";
  
  switch (voicePart) {
    case "soprano_1": return "Soprano 1";
    case "soprano_2": return "Soprano 2";
    case "alto_1": return "Alto 1";
    case "alto_2": return "Alto 2";
    case "tenor": return "Tenor";
    case "bass": return "Bass";
    default: return voicePart; // Return as-is if it doesn't match predefined values
  }
};

/**
 * Format date to localized string
 */
export const formatDate = (date?: string | null): string => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString();
};
