
import { supabase } from '@/integrations/supabase/client';

export const fetchUserPermissions = async (userId: string): Promise<{ [key: string]: boolean }> => {
  try {
    console.log('Fetching permissions for user:', userId);
    
    // Use the updated get_user_permissions function
    const { data, error } = await supabase.rpc('get_user_permissions', {
      p_user_id: userId
    });
    
    if (error) {
      console.error('Error fetching permissions:', error);
      return {};
    }
    
    console.log('Raw permissions data:', data);
    
    // Convert the array of permission objects to an object with boolean values
    const permissions: { [key: string]: boolean } = {};
    if (Array.isArray(data)) {
      data.forEach(item => {
        if (item && typeof item === 'object' && 'permission' in item && 'granted' in item) {
          permissions[item.permission] = item.granted;
        }
      });
    }
    
    console.log('Processed permissions:', permissions);
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

// Function to initialize permissions for existing users who might not have them
export const initializeUserPermissions = async (userId: string): Promise<boolean> => {
  try {
    console.log('Initializing permissions for user:', userId);
    
    const { error } = await supabase.rpc('initialize_user_permissions', {
      p_user_id: userId
    });
    
    if (error) {
      console.error('Error initializing permissions:', error);
      return false;
    }
    
    console.log('Permissions initialized successfully for user:', userId);
    return true;
  } catch (error) {
    console.error('Unexpected error initializing permissions:', error);
    return false;
  }
};
