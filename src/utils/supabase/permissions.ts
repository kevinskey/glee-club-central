
import { supabase } from '@/integrations/supabase/client';

export const fetchUserPermissions = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .rpc('get_user_permissions', { p_user_id: userId });
    
    if (error) {
      console.error('Error fetching permissions:', error);
      return {};
    }
    
    const permissionsMap: { [key: string]: boolean } = {};
    data?.forEach((perm: any) => {
      permissionsMap[perm.permission] = perm.granted;
    });
    
    return permissionsMap;
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return {};
  }
};

export const initializeUserPermissions = async (userId: string) => {
  try {
    const { error } = await supabase
      .rpc('initialize_user_permissions', { p_user_id: userId });
    
    if (error) {
      console.error('Error initializing permissions:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing permissions:', error);
    return false;
  }
};
