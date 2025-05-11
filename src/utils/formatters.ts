
/**
 * Formats a phone number in a standardized way (xxx) xxx-xxxx
 * @param input Phone number input string
 * @returns Formatted phone number string
 */
export const formatPhoneNumber = (input?: string | null): string => {
  if (!input) return "";
  
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
 * Formats a date to a more readable format
 * @param date Date string or Date object
 * @param options Intl.DateTimeFormatOptions for customizing format
 * @returns Formatted date string
 */
export const formatDate = (date?: string | Date | null, options?: Intl.DateTimeFormatOptions): string => {
  if (!date) return "Not set";
  
  try {
    const dateObject = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', options || {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(dateObject);
  } catch (e) {
    console.error("Error formatting date:", e);
    return "Invalid date";
  }
};
