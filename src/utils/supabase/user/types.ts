
import { supabase } from '@/integrations/supabase/client';

// Define explicit interface for user profile to avoid recursive type instantiation
export interface UserSafe {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  voice_part: string | null;
  role: string;
  role_display_name: string | null;
  voice_part_display: string | null;
  avatar_url: string | null;
  status: string;
  join_date: string | null;
  class_year: string | null;
  dues_paid: boolean | null;
  special_roles: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
  last_sign_in_at: string | null;
}

// Profile type used throughout the application
export type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  voice_part: string | null;
  role: string;
  status: string;
  join_date: string | null;
  class_year: string | null;
  dues_paid: boolean | null;
  special_roles: string | null;
  notes: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at?: string | null;
  last_sign_in_at?: string | null;
  role_display_name?: string | null;
  voice_part_display?: string | null;
};
