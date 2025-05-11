
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
    
    // Modified to use the proper response format from the RPC function
    const { data, error } = await supabase.rpc('get_user_permissions', {
      p_user_id: userId
    });

    if (error) {
      console.error("Error fetching permissions:", error);
      return null;
    }

    if (!data || data.length === 0) {
      console.warn("No permissions returned for user:", userId);
      return {};
    }

    // Convert array of permission objects to a simple map
    const permissionsMap: Record<string, boolean> = {};
    
    // Handle various response formats to ensure compatibility
    if (Array.isArray(data)) {
      // If data is an array of objects with permission and granted properties
      if (data.length > 0 && typeof data[0] === 'object' && 'permission' in data[0] && 'granted' in data[0]) {
        data.forEach((item) => {
          // Explicit casting to ensure TypeScript knows the structure
          const permItem = item as { permission: string, granted: boolean };
          permissionsMap[permItem.permission] = permItem.granted;
        });
      } 
      // If data is an array of permission strings (all granted)
      else if (data.length > 0 && typeof data[0] === 'string') {
        // Use type assertion to tell TypeScript that in this case, data is an array of strings
        (data as string[]).forEach((permission) => {
          permissionsMap[permission] = true;
        });
      }
    }

    console.log("User permissions loaded:", permissionsMap);
    return permissionsMap;
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return null;
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
