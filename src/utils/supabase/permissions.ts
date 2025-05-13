
import { supabase } from '@/integrations/supabase/client';
import { UserTitle, PermissionName } from '@/types/permissions';

export async function fetchUserPermissions(userId: string) {
  try {
    // Fetch user permissions
    const { data: userPermissions, error: permissionsError } = await supabase
      .from('user_permissions_view')
      .select('permission_name')
      .eq('user_id', userId);

    if (permissionsError) {
      throw permissionsError;
    }

    // Fetch user title
    const { data: userTitleData, error: titleError } = await supabase
      .from('profiles')
      .select('title')
      .eq('id', userId)
      .single();

    if (titleError) {
      throw titleError;
    }

    const permissions = userPermissions.map(p => p.permission_name);
    const title = userTitleData?.title || null;

    return { permissions, title };
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    throw error;
  }
}

export async function updateUserTitle(userId: string, title: UserTitle) {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ title })
      .eq('id', userId);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error updating user title:', error);
    throw error;
  }
}
