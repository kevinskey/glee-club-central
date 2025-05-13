
/**
 * Utility functions to format member data for display
 */

/**
 * Format voice part for display
 */
export const formatVoicePart = (voicePart: string | null): string => {
  if (!voicePart) return 'Not assigned';
  
  switch (voicePart.toLowerCase()) {
    case 'soprano_1':
    case 'soprano1':
      return 'Soprano 1';
    case 'soprano_2':
    case 'soprano2':
      return 'Soprano 2';
    case 'alto_1':
    case 'alto1':
      return 'Alto 1';
    case 'alto_2':
    case 'alto2':
      return 'Alto 2';
    case 'tenor':
      return 'Tenor';
    case 'bass':
      return 'Bass';
    default:
      return voicePart;
  }
};

/**
 * Format role for display
 */
export const formatRole = (role: string | null): string => {
  if (!role) return 'Member';
  
  switch (role.toLowerCase()) {
    case 'admin':
    case 'administrator':
      return 'Administrator';
    case 'section_leader':
      return 'Section Leader';
    case 'student_conductor':
      return 'Student Conductor';
    case 'accompanist':
      return 'Accompanist';
    default:
      return role;
  }
};

/**
 * Format user status for display
 */
export const formatStatus = (status: string | null): string => {
  if (!status) return 'Unknown';
  
  switch (status.toLowerCase()) {
    case 'active':
      return 'Active';
    case 'inactive':
      return 'Inactive';
    case 'pending':
      return 'Pending';
    case 'alumni':
      return 'Alumni';
    default:
      return status;
  }
};
