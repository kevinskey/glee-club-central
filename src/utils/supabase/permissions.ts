
import { supabase } from '@/integrations/supabase/client';
import { PermissionName, UserPermissions, UserTitle } from '@/types/permissions';
import { toast } from 'sonner';

export async function fetchUserPermissions(userId: string): Promise<UserPermissions | null> {
  try {
    if (!userId) {
      return null;
    }

    // First check if the user is a super admin in the profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('is_super_admin, role')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching profile data:', profileError);
      return null;
    }

    // If the user is a super admin or has admin role, grant all permissions
    if (profileData?.is_super_admin || 
        profileData?.role === 'admin' || 
        profileData?.role === 'administrator') {
      
      // Return all permissions as granted
      const fullPermissions: UserPermissions = {};
      const permissionNames: PermissionName[] = [
        'can_view_financials', 'can_edit_financials', 'can_upload_sheet_music',
        'can_view_sheet_music', 'can_edit_attendance', 'can_view_attendance',
        'can_view_wardrobe', 'can_edit_wardrobe', 'can_upload_media',
        'can_manage_tour', 'can_manage_stage', 'can_view_prayer_box',
        'can_post_announcements', 'can_manage_users', 'can_manage_archives',
        'can_post_social', 'can_view_travel_logistics', 'can_manage_spiritual_events',
        'can_grade_submissions', 'can_upload_documents', 'can_view_events',
        'can_submit_absence_form'
      ];
      
      permissionNames.forEach(permission => {
        fullPermissions[permission] = true;
      });
      
      console.log('User is super admin or has admin role, granting all permissions');
      return fullPermissions;
    }

    // If not a super admin, try to fetch specific permissions
    try {
      // Check if the function exists before calling it
      const { data, error } = await supabase
        .from('role_permissions')
        .select('permission, granted')
        .eq('role_id', profileData?.role || 'student');

      if (error) {
        console.error('Error fetching user permissions:', error);
        
        // Fallback: If the query fails, check if the user has specific roles that should have permissions
        if (profileData?.role) {
          const basicPermissions: UserPermissions = {};
          if (['section_leader', 'director', 'president'].includes(profileData.role)) {
            basicPermissions['can_view_attendance'] = true;
            basicPermissions['can_view_sheet_music'] = true;
          }
          
          return basicPermissions;
        }
        
        return {};
      }

      // Transform the data to a permissions object
      const permissions: UserPermissions = {};
      
      if (data && Array.isArray(data)) {
        data.forEach((item: { permission: PermissionName; granted: boolean }) => {
          permissions[item.permission] = item.granted;
        });
      }

      return permissions;
    } catch (error) {
      console.error('Error in permissions query:', error);
      return {};
    }
  } catch (error) {
    console.error('Error in fetchUserPermissions:', error);
    return null;
  }
}

export async function hasPermission(
  userId: string | undefined, 
  permission: PermissionName
): Promise<boolean> {
  try {
    if (!userId) {
      return false;
    }

    // First check if user is super admin
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('is_super_admin, role')
      .eq('id', userId)
      .single();
      
    if (profileError) {
      console.error('Error checking super admin status:', profileError);
    } else if (profileData?.is_super_admin || 
              profileData?.role === 'admin' || 
              profileData?.role === 'administrator') {
      console.log('User is super admin or admin, has all permissions');
      return true;
    }

    // If not super admin, check specific permission from role_permissions table
    try {
      const { data, error } = await supabase
        .from('role_permissions')
        .select('granted')
        .eq('role_id', profileData?.role || '')
        .eq('permission', permission)
        .maybeSingle();

      if (error) {
        console.error('Error checking permission:', error);
        return false;
      }

      return data?.granted ?? false;
    } catch (error) {
      console.error('Error in permission check query:', error);
      return false;
    }
  } catch (error) {
    console.error('Error in hasPermission:', error);
    return false;
  }
}

export async function updateUserTitle(userId: string, title: UserTitle): Promise<boolean> {
  try {
    console.log(`Updating user ${userId} title to ${title}`);
    
    const { error } = await supabase
      .from('profiles')
      .update({ title })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user title:', error);
      toast.error('Failed to update user title');
      return false;
    }

    console.log('User title updated successfully');
    return true;
  } catch (error) {
    console.error('Error in updateUserTitle:', error);
    return false;
  }
}

export async function toggleSuperAdmin(userId: string, isSuperAdmin: boolean): Promise<boolean> {
  try {
    console.log(`Setting user ${userId} super admin status to ${isSuperAdmin}`);
    
    const { error } = await supabase
      .from('profiles')
      .update({ is_super_admin: isSuperAdmin })
      .eq('id', userId);

    if (error) {
      console.error('Error updating super admin status:', error);
      toast.error('Failed to update admin status');
      return false;
    }

    console.log(`User ${isSuperAdmin ? 'promoted to' : 'removed from'} Super Admin`);
    return true;
  } catch (error) {
    console.error('Error in toggleSuperAdmin:', error);
    return false;
  }
}
