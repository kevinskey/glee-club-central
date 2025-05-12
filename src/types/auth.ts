
export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    name?: string;
    email?: string;
    picture?: string;
  };
  app_metadata?: {
    provider?: string;
    [key: string]: any;
  };
  role?: UserRole;
  aud?: string;
  created_at?: string;
}

export interface Profile {
  id: string;
  user_id?: string;  // Made optional to fix setProfile error
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  voice_part?: string;
  section?: string;
  class_year?: string;
  bio?: string;
  status?: string;
  role?: string;
  title?: string;
  special_roles?: string;
  join_date?: string;
  created_at?: string;
  updated_at?: string;
  last_sign_in_at?: string;
  notes?: string;
  dues_paid?: boolean;
  is_super_admin?: boolean;
  personal_title?: string;
}

// Updated to string literal type union instead of interface
export type UserRole = 'admin' | 'director' | 'section_leader' | 'singer' | 
                      'student_conductor' | 'accompanist' | 'non_singer' | 'general' |
                      'administrator' | 'member';

export interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions?: Record<string, boolean>;
  isAdmin: () => boolean;
  login: (email: string, password: string) => Promise<{ error: any } | void>;
  logout: () => Promise<void>;
  resetPassword?: (email: string) => Promise<{ error: any } | void>;
  signOut?: () => Promise<void>;
  signIn?: (email: string, password: string) => Promise<any>;
  signUp?: (email: string, password: string, firstName: string, lastName: string, role?: string) => Promise<any>;
  refreshPermissions?: (userId?: string) => Promise<void>;
  updatePassword?: (newPassword: string) => Promise<{ error: any } | null>; // Updated return type
}
