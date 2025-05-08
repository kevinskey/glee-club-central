
// Permissions
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

// Define permissions for each role
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
    canEditCalendar: false,
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
    canUploadMusic: false,
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
  // Default to member role permissions if role not found
  return rolePermissions[role] || rolePermissions.singer;
}

// Define a clean interface for UserSafe to avoid recursive type issues
export interface UserSafe {
  id: string;
  email?: string | null;
  first_name: string | null;
  last_name: string | null;
  phone?: string | null;
  voice_part: string | null;
  voice_part_display?: string | null;
  role: string;
  role_display_name?: string;
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
}

// Note type to track member notes
export interface MemberNote {
  id: string;
  member_id: string;
  created_by: string;
  note: string;
  created_at: string;
}
