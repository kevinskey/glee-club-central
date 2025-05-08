
import { PermissionSet, rolePermissions } from "@/utils/supabase/user/types";

// Helper function to check if a user has permission based on their role
export function checkPermission(userRole: string | undefined, permission: keyof PermissionSet): boolean {
  if (!userRole) return false;
  
  const permissions = rolePermissions[userRole] || rolePermissions.singer;
  return !!permissions[permission];
}

// Helper function to check if a user can edit another user
export function canEditUser(editorRole: string | undefined, targetUserId: string, currentUserId: string): boolean {
  if (!editorRole || !currentUserId) return false;
  
  // Administrators can edit anyone
  if (editorRole === 'administrator') return true;
  
  // Section leaders can edit singers in their section
  if (editorRole === 'section_leader') {
    // We would need to check if this user is in their section
    // This would require additional data we don't have here
    // For now, returning false for editing other users
    return currentUserId === targetUserId;
  }
  
  // Self-editing is allowed for all roles
  return currentUserId === targetUserId;
}

// Helper to check if a user can view another user's details
export function canViewUserDetails(viewerRole: string | undefined, targetUserId: string, currentUserId: string): boolean {
  if (!viewerRole || !currentUserId) return false;
  
  // Admins, section leaders and conductors can view all members
  if (['administrator', 'section_leader', 'student_conductor'].includes(viewerRole)) {
    return true;
  }
  
  // Self-viewing is always allowed
  return currentUserId === targetUserId;
}

// Get full permission set for a role
export function getPermissionsForRole(role: string): PermissionSet {
  return rolePermissions[role] || rolePermissions.singer;
}
