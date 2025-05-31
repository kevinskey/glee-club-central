
import { supabase } from '@/integrations/supabase/client';

export const fetchUserPermissions = async (userId: string) => {
  try {
    console.log('🔑 fetchUserPermissions: Fetching permissions for user:', userId);
    
    const { data, error } = await supabase
      .rpc('get_user_permissions', { p_user_id: userId });
    
    console.log('🔑 fetchUserPermissions: RPC response:', {
      hasData: !!data,
      dataLength: data?.length,
      error: error?.message
    });
    
    if (error) {
      console.error('❌ fetchUserPermissions: Error fetching permissions:', error);
      return {};
    }
    
    const permissionsMap: { [key: string]: boolean } = {};
    data?.forEach((perm: any) => {
      permissionsMap[perm.permission] = perm.granted;
    });
    
    console.log('✅ fetchUserPermissions: Permissions processed:', {
      permissionCount: Object.keys(permissionsMap).length,
      permissions: Object.keys(permissionsMap)
    });
    
    return permissionsMap;
  } catch (error) {
    console.error('💥 fetchUserPermissions: Error fetching permissions:', error);
    return {};
  }
};

export const initializeUserPermissions = async (userId: string) => {
  try {
    console.log('🏗️ initializeUserPermissions: Initializing permissions for user:', userId);
    
    const { error } = await supabase
      .rpc('initialize_user_permissions', { p_user_id: userId });
    
    console.log('🏗️ initializeUserPermissions: RPC response:', { error: error?.message });
    
    if (error) {
      console.error('❌ initializeUserPermissions: Error initializing permissions:', error);
      return false;
    }
    
    console.log('✅ initializeUserPermissions: Permissions initialized successfully');
    return true;
  } catch (error) {
    console.error('💥 initializeUserPermissions: Error initializing permissions:', error);
    return false;
  }
};
