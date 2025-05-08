
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

// Define permission set for each role type
export interface PermissionSet {
  canEditUsers: boolean;
  canDeleteUsers: boolean;
  canEditMusic: boolean;
  canUploadMusic: boolean;
  canEditCalendar: boolean;
  canTakeAttendance: boolean;
  canManagePayments: boolean;
  canEditOwnProfile: boolean;
  canViewMemberDetails: boolean;
  canManageWardrobe: boolean;
  canAccessAdminFeatures: boolean;
}

// Create role-based permission mapping
export const rolePermissions: Record<string, PermissionSet> = {
  administrator: {
    canEditUsers: true,
    canDeleteUsers: true,
    canEditMusic: true,
    canUploadMusic: true,
    canEditCalendar: true,
    canTakeAttendance: true,
    canManagePayments: true,
    canEditOwnProfile: true,
    canViewMemberDetails: true,
    canManageWardrobe: true,
    canAccessAdminFeatures: true
  },
  section_leader: {
    canEditUsers: false,
    canDeleteUsers: false,
    canEditMusic: true,
    canUploadMusic: true,
    canEditCalendar: false,
    canTakeAttendance: true,
    canManagePayments: false,
    canEditOwnProfile: true,
    canViewMemberDetails: true,
    canManageWardrobe: false,
    canAccessAdminFeatures: false
  },
  singer: {
    canEditUsers: false,
    canDeleteUsers: false,
    canEditMusic: false,
    canUploadMusic: false,
    canEditCalendar: false,
    canTakeAttendance: false,
    canManagePayments: false,
    canEditOwnProfile: true,
    canViewMemberDetails: false,
    canManageWardrobe: false,
    canAccessAdminFeatures: false
  },
  student_conductor: {
    canEditUsers: false,
    canDeleteUsers: false,
    canEditMusic: true,
    canUploadMusic: true,
    canEditCalendar: true,
    canTakeAttendance: true,
    canManagePayments: false,
    canEditOwnProfile: true,
    canViewMemberDetails: true,
    canManageWardrobe: false,
    canAccessAdminFeatures: false
  },
  accompanist: {
    canEditUsers: false,
    canDeleteUsers: false,
    canEditMusic: true,
    canUploadMusic: true,
    canEditCalendar: false,
    canTakeAttendance: false,
    canManagePayments: false,
    canEditOwnProfile: true,
    canViewMemberDetails: false,
    canManageWardrobe: false,
    canAccessAdminFeatures: false
  },
  non_singer: {
    canEditUsers: false,
    canDeleteUsers: false,
    canEditMusic: false,
    canUploadMusic: false,
    canEditCalendar: false,
    canTakeAttendance: false,
    canManagePayments: false,
    canEditOwnProfile: true,
    canViewMemberDetails: false,
    canManageWardrobe: false,
    canAccessAdminFeatures: false
  }
};

// Helper function to get permissions for a role
export function getUserPermissions(role: string): PermissionSet {
  return rolePermissions[role] || rolePermissions.singer; // Default to singer permissions
}
