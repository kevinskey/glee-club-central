
import { supabase } from '@/integrations/supabase/client';

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

    // Convert array of permission objects to a simple map of permission names to boolean values
    const permissionsMap: Record<string, boolean> = {};
    
    data.forEach((item: { permission: string, granted: boolean }) => {
      permissionsMap[item.permission] = item.granted;
    });

    console.log("User permissions loaded:", permissionsMap);
    return permissionsMap;
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return null;
  }
}
