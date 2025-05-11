
import { supabase } from '@/integrations/supabase/client';
import { PermissionName, UserPermissions, UserTitle } from '@/types/permissions';
import { toast } from 'sonner';

export async function fetchUserPermissions(userId: string): Promise<UserPermissions | null> {
  try {
    if (!userId) {
      return null;
    }

    const { data, error } = await supabase
      .rpc('get_user_permissions', { p_user_id: userId });

    if (error) {
      console.error('Error fetching user permissions:', error);
      toast.error('Failed to load user permissions');
      return null;
    }

    // Transform the data to a permissions object
    const permissions: UserPermissions = {};
    
    if (data) {
      data.forEach((item: { permission: PermissionName; granted: boolean }) => {
        permissions[item.permission] = item.granted;
      });
    }

    return permissions;
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

    const { data, error } = await supabase
      .rpc('has_permission', { 
        p_user_id: userId,
        p_permission: permission
      });

    if (error) {
      console.error('Error checking permission:', error);
      return false;
    }

    return !!data;
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
