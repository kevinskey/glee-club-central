
/**
 * Format voice part for display
 */
export const formatVoicePart = (voicePart: string | null): string => {
  if (!voicePart) return "Not set";
  
  // Convert from technical name to display name
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

/**
 * Open edit user dialog with selected user
 */
export const openEditUserDialog = (
  user: any, 
  setSelectedUser: React.Dispatch<React.SetStateAction<any>>, 
  setIsEditUserOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setSelectedUser(user);
  setIsEditUserOpen(true);
};
