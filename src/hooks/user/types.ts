
// Common types for user management hooks
export interface User {
  id: string;
  email?: string | null;
  first_name?: string; // Made optional to match Profile interface
  last_name?: string;  // Made optional to match Profile interface
  phone?: string | null;
  voice_part: string | null;
  avatar_url?: string | null;
  status: string;
  last_login?: string | null;
  last_sign_in_at?: string | null;
  created_at: string;
  updated_at?: string | null;
  is_super_admin?: boolean;
  class_year?: string;
  join_date?: string;
  notes?: string;
  dues_paid?: boolean;
  // Add missing fields from profiles table
  role?: string; // Kept for backward compatibility
  personal_title?: string;
  title?: string;
  special_roles?: string;
}

// Basic hook response type with loading and error states
export interface BaseHookResponse {
  isLoading: boolean;
  error: string | null;
}
