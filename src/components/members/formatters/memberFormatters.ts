
/**
 * Formats a phone number in a standardized way (xxx) xxx-xxxx
 * @param input Phone number input string
 * @returns Formatted phone number string
 */
export const formatPhoneNumber = (input: string): string => {
  // Strip all non-numeric characters
  const digits = input.replace(/\D/g, '');
  
  // Format as (xxx) xxx-xxxx if 10 digits
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  
  // Return cleaned digits if not 10 digits
  return digits;
};

/**
 * Formats a voice part for display
 * @param voicePart Voice part identifier string
 * @returns Formatted voice part string
 */
export const formatVoicePart = (voicePart: string | null): string => {
  if (!voicePart) return 'Not Assigned';
  
  const voicePartMap: Record<string, string> = {
    'soprano_1': 'Soprano 1',
    'soprano_2': 'Soprano 2',
    'alto_1': 'Alto 1',
    'alto_2': 'Alto 2',
    'tenor': 'Tenor',
    'bass': 'Bass'
  };
  
  return voicePartMap[voicePart] || voicePart;
};

/**
 * Formats a role for display
 * @param role Role identifier string
 * @returns Formatted role string
 */
export const formatRole = (role: string | null): string => {
  if (!role) return 'Not Assigned';
  
  const roleMap: Record<string, string> = {
    'admin': 'Admin',
    'student': 'Student',
    'section_leader': 'Section Leader',
    'staff': 'Staff',
    'guest': 'Guest',
    'administrator': 'Administrator',
    'singer': 'Singer',
    'director': 'Director',
    'non_singer': 'Non-Singer',
    'student_conductor': 'Student Conductor',
    'accompanist': 'Accompanist'
  };
  
  return roleMap[role] || role;
};
