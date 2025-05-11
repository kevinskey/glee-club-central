
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
  role?: string;
  aud?: string;
  created_at?: string;
}

export interface Profile {
  id: string;
  user_id: string;
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

export interface UserRole {
  id: string;
  name: string;
  description?: string;
  permissions?: string[];
}

export interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: () => boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut?: () => Promise<void>;
  refreshPermissions?: (userId?: string) => Promise<void>;
}
