
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
  full_name?: string;
  avatar_url?: string;
  voice_part?: string;
  section?: string;
  class_year?: string;
  bio?: string;
  updated_at?: string;
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
}
