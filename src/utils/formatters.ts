
/**
 * Utility functions for formatting data for display
 */

/**
 * Format a phone number to display consistently
 * @param phone Phone number string to format
 * @returns Formatted phone number string
 */
export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return "";
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if we have a valid 10-digit number
  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6, 10)}`;
  } else if (cleaned.length > 10) {
    // Handle longer numbers (with country code)
    return `+${cleaned.substring(0, cleaned.length - 10)} (${cleaned.substring(cleaned.length - 10, cleaned.length - 7)}) ${cleaned.substring(cleaned.length - 7, cleaned.length - 4)}-${cleaned.substring(cleaned.length - 4)}`;
  }
  
  // If it doesn't match expected formats, return as-is
  return phone;
}

/**
 * Format a date string for display
 * @param dateString Date string to format
 * @returns Formatted date string
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "Not set";
  
  try {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    return "Invalid date";
  }
}

/**
 * Format user's role for display
 * @param role Role string from database
 * @returns Formatted role string for display
 */
export function formatRole(role: string | null | undefined): string {
  if (!role) return "Member";
  
  // Capitalize first letter and replace underscores with spaces
  return role.charAt(0).toUpperCase() + role.slice(1).replace(/_/g, ' ');
}

/**
 * Format user's voice part for display
 * @param voicePart Voice part string from database
 * @returns Formatted voice part string for display
 */
export function formatVoicePart(voicePart: string | null | undefined): string {
  if (!voicePart) return "Not assigned";
  
  switch (voicePart) {
    case "soprano_1": return "Soprano 1";
    case "soprano_2": return "Soprano 2";
    case "alto_1": return "Alto 1";
    case "alto_2": return "Alto 2";
    case "tenor": return "Tenor";
    case "bass": return "Bass";
    default: return voicePart.charAt(0).toUpperCase() + voicePart.slice(1).replace(/_/g, ' ');
  }
}
