export type UserType = 'admin' | 'member';

export interface AuthUser {
  id: string;
  email?: string;
  email_confirmed_at?: string | null;
  created_at?: string;
  updated_at?: string;
  user_metadata?: any;
}

export interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar_url?: string;
  role?: string;
  status?: string;
  phone?: string;
  voice_part?: string;
  join_date?: string;
  created_at?: string;
  class_year?: string;
  dues_paid?: boolean;
  notes?: string;
  is_super_admin?: boolean;
  user_type?: UserType;
  personal_title?: string;
  title?: string;
  special_roles?: string[];
  role_tags?: string[];
  updated_at?: string;
  last_sign_in_at?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  session: any;
  supabaseClient: any;
  login: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  signUp: (email: string, password: string, firstName: string, lastName: string, userType?: UserType) => Promise<{ error: any, data: any }>;
  isAdmin: () => boolean;
  isMember: () => boolean;
  getUserType: () => UserType;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  permissions: { [key: string]: boolean };
  refreshPermissions: () => Promise<void>;
  resetAuthSystem: () => Promise<{ success: boolean }>;
  createFallbackProfile?: () => Promise<void>;
  refreshUserData?: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}
