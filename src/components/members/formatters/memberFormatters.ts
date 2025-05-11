
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
