
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch user permissions from Supabase
 */
export async function fetchUserPermissions(userId: string): Promise<{ [key: string]: boolean }> {
  try {
    const { data, error } = await supabase
      .rpc('get_user_permissions', { p_user_id: userId });
    
    if (error) {
      console.error('Error fetching permissions:', error);
      return {};
    }
    
    // Convert the array of permission objects to a permissions map
    const permissionsMap: { [key: string]: boolean } = {};
    if (Array.isArray(data)) {
      data.forEach(item => {
        permissionsMap[item.permission] = item.granted;
      });
    }
    
    return permissionsMap;
  } catch (error) {
    console.error('Unexpected error fetching permissions:', error);
    return {};
  }
}
