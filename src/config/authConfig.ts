export const ADMIN_EMAILS: string[] = (import.meta.env.VITE_ADMIN_EMAILS as string | undefined || '')
  .split(',')
  .map(e => e.trim())
  .filter(Boolean);

export const isAdminEmail = (email?: string | null): boolean => {
  return !!email && ADMIN_EMAILS.includes(email);
};
