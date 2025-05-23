
import { supabase } from '@/integrations/supabase/client';

export const fetchUserPermissions = async (userId: string): Promise<{ [key: string]: boolean }> => {
  try {
    // This is a placeholder implementation. In a real application, you would fetch
    // user permissions from your Supabase database
    const { data, error } = await supabase
      .from('user_permissions')
      .select('permission_name')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching permissions:', error);
      return {};
    }
    
    // Convert the array of permission names to an object with boolean values
    const permissions: { [key: string]: boolean } = {};
    if (data) {
      data.forEach(item => {
        permissions[item.permission_name] = true;
      });
    }
    
    return permissions;
  } catch (error) {
    console.error('Unexpected error fetching permissions:', error);
    return {};
  }
};

// Function to check if a user has a specific permission
export const hasPermission = (permissions: { [key: string]: boolean }, permissionName: string): boolean => {
  return !!permissions[permissionName];
};
