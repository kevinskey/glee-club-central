
import { supabase } from '@/integrations/supabase/client';
import { UserTitle } from '@/types/permissions';

export async function fetchUserPermissions(userId: string) {
  try {
    if (!userId) {
      console.warn('No user ID provided to fetchUserPermissions');
      return null;
    }
    
    // Check if the userId is a valid UUID before making the request
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
      console.warn(`Invalid user ID format: ${userId}`);
      return null;
    }
    
    console.log('Fetching permissions for user:', userId);
    
    // First check if user is a super admin
    const { data: profileData } = await supabase
      .from('profiles')
      .select('is_super_admin, role')
      .eq('id', userId)
      .single();
      
    // If user is super admin, grant all permissions
    if (profileData?.is_super_admin) {
      console.log("User is super admin, granting all permissions");
      
      // Fetch all available permissions to grant them
      const { data: allPermissions } = await supabase
        .from('role_permissions')
        .select('permission');
        
      if (allPermissions) {
        // Create a Set to ensure unique permissions
        const uniquePermissions = new Set();
        const permissionsMap: Record<string, boolean> = {};
        
        allPermissions.forEach((item) => {
          // Only add each permission once
          if (!uniquePermissions.has(item.permission)) {
            uniquePermissions.add(item.permission);
            permissionsMap[item.permission] = true;
          }
        });
        
        console.log("Granted permissions for super admin:", Object.keys(permissionsMap).length);
        return permissionsMap;
      }
      
      // Fallback to empty permissions map
      return {};
    }
    
    // For regular users, fetch their permissions based on role
    try {
      const { data, error } = await supabase.rpc('get_user_permissions', {
        p_user_id: userId
      });

      if (error) {
        console.error("Error fetching permissions:", error);
        
        // Fallback: if the user has an admin-like role, grant permissions
        if (profileData?.role === 'admin' || profileData?.role === 'director') {
          console.log("User is admin or has admin role, granting all permissions");
          
          // Return a permissions map with all permissions granted
          return {
            can_view_financials: true,
            can_edit_financials: true,
            can_upload_sheet_music: true,
            can_view_sheet_music: true,
            can_edit_attendance: true,
            can_view_attendance: true,
            can_view_wardrobe: true,
            can_edit_wardrobe: true,
            can_upload_media: true,
            can_manage_tour: true,
            can_manage_stage: true,
            can_view_prayer_box: true,
            can_post_announcements: true,
            can_manage_users: true
          };
        }
        
        return {};
      }

      if (!data || data.length === 0) {
        console.warn("No permissions returned for user:", userId);
        return {};
      }

      // Convert array of permission objects to a simple map
      const permissionsMap: Record<string, boolean> = {};
      
      if (Array.isArray(data)) {
        data.forEach((item: any) => {
          // Handle different response formats
          if (item && typeof item === 'object' && 'permission' in item && 'granted' in item) {
            permissionsMap[item.permission] = item.granted;
          } else if (typeof item === 'string') {
            permissionsMap[item] = true;
          }
        });
      }

      console.log("User permissions loaded:", Object.keys(permissionsMap).length);
      return permissionsMap;
    } catch (error) {
      console.error("Error in permissions RPC:", error);
      
      // Fallback for admin users
      if (profileData?.role === 'admin' || profileData?.role === 'director') {
        console.log("User has admin role, granting permissions via fallback");
        return {
          can_view_financials: true,
          can_edit_financials: true,
          can_upload_sheet_music: true,
          can_view_sheet_music: true,
          can_edit_attendance: true,
          can_view_attendance: true,
          can_view_wardrobe: true,
          can_edit_wardrobe: true,
          can_upload_media: true,
          can_manage_tour: true,
          can_manage_stage: true,
          can_view_prayer_box: true,
          can_post_announcements: true,
          can_manage_users: true
        };
      }
      
      return {};
    }
  } catch (error) {
    console.error("Unexpected error fetching permissions:", error);
    return {};
  }
}

/**
 * Updates a user's title in the profiles table
 * @param userId The ID of the user to update
 * @param title The new title to set for the user
 * @returns True if successful, false otherwise
 */
export async function updateUserTitle(userId: string, title: UserTitle): Promise<boolean> {
  try {
    if (!userId) {
      console.warn('No user ID provided to updateUserTitle');
      return false;
    }
    
    // Check if the userId is a valid UUID before making the request
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
      console.warn(`Invalid user ID format: ${userId}`);
      return false;
    }
    
    const { error } = await supabase
      .from('profiles')
      .update({ title })
      .eq('id', userId);
    
    if (error) {
      console.error("Error updating user title:", error);
      return false;
    }
    
    console.log(`User ${userId} title updated to ${title}`);
    return true;
  } catch (error) {
    console.error("Error updating user title:", error);
    return false;
  }
}

/**
 * Toggles the super admin status for a user
 * @param userId The ID of the user to update
 * @param isAdmin Boolean indicating if the user should be a super admin
 * @returns True if successful, false otherwise
 */
export async function toggleSuperAdmin(userId: string, isAdmin: boolean): Promise<boolean> {
  try {
    if (!userId) {
      console.warn('No user ID provided to toggleSuperAdmin');
      return false;
    }
    
    // Check if the userId is a valid UUID before making the request
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
      console.warn(`Invalid user ID format: ${userId}`);
      return false;
    }
    
    const { error } = await supabase
      .from('profiles')
      .update({ is_super_admin: isAdmin })
      .eq('id', userId);
    
    if (error) {
      console.error("Error toggling super admin status:", error);
      return false;
    }
    
    console.log(`User ${userId} super admin status set to ${isAdmin}`);
    return true;
  } catch (error) {
    console.error("Error toggling super admin status:", error);
    return false;
  }
}
