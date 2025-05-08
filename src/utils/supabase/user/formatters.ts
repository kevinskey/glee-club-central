
/**
 * Utility functions for formatting user data
 */

/**
 * Format a user's voice part for display
 */
export function formatVoicePart(voicePart: string | null): string {
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
}

/**
 * Format a user's role for display
 */
export function formatRole(role: string | null): string {
  if (!role) return "Not set";
  
  // Convert from technical name to display name
  switch (role) {
    case "administrator": return "Administrator";
    case "section_leader": return "Section Leader";
    case "singer": return "Singer";
    case "student_conductor": return "Student Conductor";
    case "accompanist": return "Accompanist";
    case "non_singer": return "Non-Singer";
    default: return role.charAt(0).toUpperCase() + role.slice(1).replace(/_/g, ' ');
  }
}

/**
 * Format a user's status for display
 */
export function formatStatus(status: string | null): string {
  if (!status) return "Unknown";
  
  // Convert from technical name to display name
  switch (status) {
    case "active": return "Active";
    case "inactive": return "Inactive";
    case "pending": return "Pending";
    case "alumni": return "Alumni";
    case "on_leave": return "On Leave";
    default: return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
  }
}

/**
 * Format a date for display
 */
export function formatDate(date?: string | null): string {
  if (!date) return "N/A";
  
  // Format the date for display
  return new Date(date).toLocaleDateString();
}

/**
 * Get the initials from a user's name
 */
export function getUserInitials(firstName: string | null, lastName: string | null): string {
  let initials = '';
  
  if (firstName && firstName.length > 0) {
    initials += firstName[0].toUpperCase();
  }
  
  if (lastName && lastName.length > 0) {
    initials += lastName[0].toUpperCase();
  }
  
  return initials || '?';
}
