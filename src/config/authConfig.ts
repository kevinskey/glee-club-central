
// Admin configuration
export const ADMIN_EMAILS = ['kevinskey@mac.com'];

export const isAdminEmail = (email?: string): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
};
