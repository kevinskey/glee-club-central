
import { Database } from "@/integrations/supabase/types";

export interface Profile {
  id: string;  // Already required
  first_name: string;  // Already required
  last_name: string;  // Changed from optional to required
  avatar_url?: string;
  phone?: string;
  email?: string;
  role?: string;
  status?: string;
  join_date?: string;
  class_year?: string;
  voice_part?: string;
  robe_number?: number;
  is_super_admin?: boolean;
  created_at: string;
  updated_at?: string;
  dues_paid?: boolean;
  standing?: string;
  notes?: string;
  last_sign_in_at?: string;
  title?: Database["public"]["Enums"]["user_title"];
  special_roles?: string;
  last_login?: string;
}

export type UserRole = 'admin' | 'director' | 'general' | 'administrator' | 'section_leader' | 'singer' | 'student_conductor' | 'accompanist' | 'non_singer';
export type MemberStatus = 'active' | 'inactive';
export type VoicePart = 'soprano_1' | 'soprano_2' | 'alto_1' | 'alto_2' | 'tenor' | 'bass' | null;

export interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions?: Record<string, boolean>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: any, data: any }>;
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
  updatePassword?: (newPassword: string) => Promise<void>;
  refreshPermissions?: () => Promise<void>;
}

export interface AuthUser {
  id: string;
  email?: string;
  role: UserRole;
  [key: string]: any; 
}

export interface User {
  id: string;
  email?: string | null;
  first_name: string | null;
  last_name: string | null;
  phone?: string | null;
  voice_part: string | null;
  role: string;
  avatar_url?: string | null;
  status: string;
  last_login?: string | null;
  last_sign_in_at?: string | null;
  created_at: string;
  updated_at?: string | null;
  is_super_admin?: boolean;
  title?: string;
  class_year?: string;
  join_date?: string;
  special_roles?: string;
  dues_paid?: boolean;
}
