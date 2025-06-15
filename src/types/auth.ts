
export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: any;
  app_metadata?: any;
  aud?: string;
  confirmation_sent_at?: string;
  recovery_sent_at?: string;
  email_change_sent_at?: string;
  new_email?: string;
  invited_at?: string;
  action_link?: string;
  email_confirmed_at?: string;
  phone_confirmed_at?: string;
  confirmed_at?: string;
  last_sign_in_at?: string;
  role?: string;
  updated_at?: string;
  created_at?: string;
}

export interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role?: string;
  voice_part?: string;
  avatar_url?: string;
  status?: string;
  class_year?: string;
  notes?: string;
  special_roles?: string;
  is_super_admin?: boolean;
  title?: string;
  disabled?: boolean;
  updated_at?: string;
  join_date?: string;
  dues_paid?: boolean;
  role_tags?: string[];
  created_at?: string;
  // New e-commerce fields
  ecommerce_enabled?: boolean;
  design_history_ids?: string[];
  current_cart_id?: string;
  default_shipping_address?: string;
  account_balance?: number;
  // Executive Board fields
  is_exec_board?: boolean; // <--- added
  exec_board_role?: string; // <--- added
}

export type UserType = 'admin' | 'member' | 'fan';

export interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  session: any;
  supabaseClient: any;
  login: (email: string, password: string) => Promise<{ data?: any; error?: any }>;
  logout: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ data?: any; error?: any }>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string, userType?: UserType) => Promise<{ data?: any; error?: any }>;
  isAdmin: () => boolean;
  isMember: () => boolean;
  getUserType: () => UserType;
  updatePassword: (password: string) => Promise<{ error?: any }>;
  resetPassword: (email: string) => Promise<{ error?: any }>;
  permissions: { [key: string]: boolean };
  refreshPermissions: () => Promise<void>;
  resetAuthSystem: () => Promise<{ success: boolean }>;
  refreshProfile: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

