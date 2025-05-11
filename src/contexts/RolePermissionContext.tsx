
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

// Define explicit permission types to avoid deep recursion issues
type PermissionName = 
  | 'can_view_financials' 
  | 'can_edit_financials'
  | 'can_upload_sheet_music'
  | 'can_view_sheet_music'
  | 'can_edit_attendance'
  | 'can_view_attendance'
  | 'can_view_wardrobe'
  | 'can_edit_wardrobe'
  | 'can_upload_media'
  | 'can_manage_tour'
  | 'can_manage_stage'
  | 'can_view_prayer_box'
  | 'can_post_announcements'
  | 'can_manage_users'
  | 'can_manage_archives'
  | 'can_post_social'
  | 'can_view_travel_logistics'
  | 'can_manage_spiritual_events'
  | 'can_grade_submissions'
  | 'can_upload_documents'
  | 'can_view_events'
  | 'can_submit_absence_form'
  | string; // Allow other string values for extensibility

// Define allowed user roles
const validRoles = [
  'member',
  'admin', 
  'administrator', 
  'director', 
  'section_leader', 
  'singer', 
  'student_conductor', 
  'accompanist', 
  'non_singer'
];

interface RolePermissionContextType {
  userRole: string | null;
  hasPermission: (permission: PermissionName) => boolean;
  isLoading: boolean;
}

// Create context with default values
const defaultContext: RolePermissionContextType = {
  userRole: null,
  hasPermission: () => false,
  isLoading: true
};

const RolePermissionContext = createContext<RolePermissionContextType>(defaultContext);

export const useRolePermissions = () => useContext(RolePermissionContext);

interface RolePermissionProviderProps {
  children: React.ReactNode;
}

export const RolePermissionProvider: React.FC<RolePermissionProviderProps> = ({ children }) => {
  const { profile, isLoading: authLoading, permissions } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Update userRole when the profile changes
  useEffect(() => {
    if (!authLoading && profile) {
      // Get the user's role from the profile
      const role = profile.role || 'member';

      // Validate role against known values
      setUserRole(validRoles.includes(role) ? role : 'member');
      setIsLoading(false);
    } else if (!authLoading) {
      // No profile, not loading
      setUserRole(null);
      setIsLoading(false);
    }
  }, [profile, authLoading]);

  // Function to check if a user has a specific permission
  const hasPermission = (permission: PermissionName): boolean => {
    // Super admins have all permissions
    if (profile?.is_super_admin) {
      return true;
    }

    // Admin roles have all permissions
    if (userRole === 'admin' || userRole === 'administrator' || userRole === 'director') {
      return true;
    }

    // Check specific permission
    return permissions ? !!permissions[permission] : false;
  };

  return (
    <RolePermissionContext.Provider value={{ userRole, hasPermission, isLoading }}>
      {children}
    </RolePermissionContext.Provider>
  );
};
