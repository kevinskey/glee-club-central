
/**
 * Formats a phone number string to (123) 456-7890 format
 * @param phoneNumberString Phone number as string
 * @returns Formatted phone number string
 */
export const formatPhoneNumber = (phoneNumberString?: string | null): string => {
  if (!phoneNumberString) return "";
  
  // Strip all non-numeric characters
  const cleaned = phoneNumberString.replace(/\D/g, "");
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6, 10)}`;
  } else if (cleaned.length > 10) {
    return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6, 10)} x${cleaned.substring(10)}`;
  }
  
  // If the number doesn't match standard format, return the original
  return phoneNumberString;
};

/**
 * Formats a date string to localized date format
 * @param dateString Date as string
 * @returns Formatted date string
 */
export const formatDate = (dateString?: string | null): string => {
  if (!dateString) return "Not set";
  return new Date(dateString).toLocaleDateString();
};
