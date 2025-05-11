
/**
 * Format voice part for display
 */
export const formatVoicePart = (voicePart: string | null): string => {
  if (!voicePart) return "N/A";
  
  const parts: {[key: string]: string} = {
    soprano_1: "Soprano 1",
    soprano_2: "Soprano 2",
    alto_1: "Alto 1",
    alto_2: "Alto 2",
    tenor: "Tenor",
    bass: "Bass"
  };
  
  return parts[voicePart] || voicePart;
};

/**
 * Format role for display
 */
export const formatRole = (role: string): string => {
  const roles: {[key: string]: string} = {
    administrator: "Administrator",
    director: "Director",
    section_leader: "Section Leader",
    singer: "Singer",
    student_conductor: "Student Conductor",
    accompanist: "Accompanist",
    non_singer: "Non-Singer",
    admin: "Admin"
  };
  
  return roles[role] || role;
};

/**
 * Format phone number for display with the pattern (XXX) XXX-XXXX
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  // Strip all non-digits
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check if the input is valid
  if (cleaned.length < 10) {
    return phoneNumber; // Return original if not enough digits
  }
  
  // Get the matches
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    // Format as (XXX) XXX-XXXX
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  // Return original if not matched
  return phoneNumber;
};
