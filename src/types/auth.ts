
export interface AuthUser {
  id: string;
  email?: string;
  role: 'admin' | 'general';
  [key: string]: any; 
}

export type UserRole = 'admin' | 'general';
export type MemberStatus = 'active' | 'inactive';
export type VoicePart = 'soprano_1' | 'soprano_2' | 'alto_1' | 'alto_2' | 'tenor' | 'bass' | null;

export interface Profile {
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
  created_at: string;
  updated_at?: string | null;
}

export interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: any, data: any }>;
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
  updatePassword?: (newPassword: string) => Promise<void>;
}
