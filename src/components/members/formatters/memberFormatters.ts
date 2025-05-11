
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
