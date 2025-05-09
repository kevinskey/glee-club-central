
export interface AuthUser {
  id: string;
  email?: string;
  role: 'administrator' | 'section_leader' | 'singer' | 'student_conductor' | 'accompanist' | 'non_singer';
  [key: string]: any; // allow additional properties
}

export type UserRole = 'administrator' | 'section_leader' | 'singer' | 'student_conductor' | 'accompanist' | 'non_singer';
export type MemberStatus = 'active' | 'inactive' | 'pending' | 'alumni' | 'on_leave' | 'deleted';
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
  join_date?: string | null;
  created_at: string;
  updated_at?: string | null;
  class_year?: string | null;
  dues_paid?: boolean | null;
  special_roles?: string | null;
  notes?: string | null;
  last_sign_in_at?: string | null;
  voice_part_display?: string | null;
  role_display_name?: string | null;
  title?: string | null;
  is_super_admin?: boolean | null;
}

export interface ProfileOverviewTabProps {
  profile: Profile;
  isEditable?: boolean;
}

export interface ParticipationTabProps {
  memberId: string;
  canEdit?: boolean;
}

export interface MusicAccessTabProps {
  memberId: string;
  voicePart: string | null;
  canEdit?: boolean;
}

export interface WardrobeTabProps {
  profile: Profile;
  canEdit?: boolean;
}

export interface FinancialInfoTabProps {
  memberId: string;
  canEdit?: boolean;
}

export interface MediaConsentTabProps {
  profile: Profile;
  canEdit?: boolean;
}

export type EditableProfileFields = Partial<Profile>;

export interface AuthContextType {
  user: AuthUser | null;
  userProfile: Profile | null;
  permissions: any | null;
  loading: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  profile: Profile | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: any, data: any }>;
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
  hasPermission: (permission: string) => boolean;
  updatePassword?: (newPassword: string) => Promise<void>;
  signInWithGoogle?: () => void;
  signInWithApple?: () => void;
  refreshPermissions?: () => Promise<void>;
}
