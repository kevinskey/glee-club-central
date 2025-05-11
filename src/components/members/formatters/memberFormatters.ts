
/**
 * Formats a voice part code into a human-readable string
 * @param voicePart The voice part code from the database
 * @returns Formatted voice part string
 */
export const formatVoicePart = (voicePart: string | null | undefined): string => {
  if (!voicePart) return "Not assigned";
  
  switch (voicePart) {
    case "soprano_1": return "Soprano 1";
    case "soprano_2": return "Soprano 2";
    case "alto_1": return "Alto 1";
    case "alto_2": return "Alto 2";
    case "tenor": return "Tenor";
    case "bass": return "Bass";
    default: return voicePart;
  }
};

/**
 * Formats a role code into a human-readable string
 * @param role The role code from the database
 * @returns Formatted role string
 */
export const formatRole = (role: string | null | undefined): string => {
  if (!role) return "Member";
  
  switch (role) {
    case "administrator": return "Administrator";
    case "section_leader": return "Section Leader";
    case "singer": return "Singer";
    case "student_conductor": return "Student Conductor";
    case "accompanist": return "Accompanist";
    case "non_singer": return "Non-Singer";
    case "director": return "Director";
    default: return role;
  }
};

/**
 * Formats a user status into a human-readable string
 * @param status The status code from the database
 * @returns Formatted status string
 */
export const formatStatus = (status: string | null | undefined): string => {
  if (!status) return "Unknown";
  
  switch (status) {
    case "active": return "Active";
    case "pending": return "Pending";
    case "inactive": return "Inactive";
    case "alumni": return "Alumni";
    case "deleted": return "Deleted";
    default: return status;
  }
};
