
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
  aud?: string;
  created_at?: string;
}

export type UserType = 'member' | 'admin' | 'fan';

export interface Profile {
  id: string;
  user_id?: string;
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
  special_roles?: string;
  join_date?: string;
  created_at?: string;
  updated_at?: string;
  last_sign_in_at?: string;
  notes?: string;
  dues_paid?: boolean;
  is_super_admin?: boolean;
  user_type?: UserType;
  // Add backward compatibility fields 
  role?: string; // Add for backward compatibility
  title?: string; // Add for backward compatibility
  personal_title?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: () => boolean;
  isMember: () => boolean;
  isFan: () => boolean;
  getUserType: () => UserType | null;
  login: (email: string, password: string) => Promise<{ error: any } | void>;
  logout: () => Promise<{ error: any } | void>;
  resetPassword: (email: string) => Promise<{ error: any } | void>;
  signOut?: () => Promise<{ error: any } | void>;
  signIn?: (email: string, password: string) => Promise<any>;
  signUp?: (email: string, password: string, firstName: string, lastName: string, userType?: UserType) => Promise<any>;
  updatePassword?: (newPassword: string) => Promise<{ error: any } | null>;
  session: any;
  // Add backward compatibility methods
  refreshPermissions?: () => Promise<void>; // Add for backward compatibility
}
