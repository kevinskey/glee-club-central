
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const roleResetService = {
  async resetUserRoles(): Promise<boolean> {
    try {
      console.log('🔄 Starting role reset process...');
      
      // Reset all profiles to member role except super admin
      const { error: resetError } = await supabase
        .from('profiles')
        .update({
          role: 'member',
          is_super_admin: false,
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .neq('id', '278d0e47-fbb7-4ab5-a1b5-c7e3ba6183da'); // kevinskey@mac.com user ID
      
      if (resetError) throw resetError;
      
      // Set the designated super admin
      const { error: adminError } = await supabase
        .from('profiles')
        .update({
          role: 'admin',
          is_super_admin: true,
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', '278d0e47-fbb7-4ab5-a1b5-c7e3ba6183da');
      
      if (adminError) throw adminError;
      
      console.log('✅ Role reset completed successfully');
      toast.success('User roles have been reset successfully');
      return true;
    } catch (error) {
      console.error('❌ Role reset failed:', error);
      toast.error('Failed to reset user roles');
      return false;
    }
  },

  async cleanupPermissions(): Promise<boolean> {
    try {
      console.log('🧹 Cleaning up permissions...');
      
      // Delete all existing user permissions
      const { error: deleteError } = await supabase
        .from('user_permissions')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
      
      if (deleteError) throw deleteError;
      
      // Get all user IDs
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id');
      
      if (usersError) throw usersError;
      
      // Initialize basic member permissions for all users
      const basicPermissions = ['view_sheet_music', 'view_calendar', 'view_announcements'];
      
      for (const user of users) {
        for (const permission of basicPermissions) {
          await supabase
            .from('user_permissions')
            .insert({
              user_id: user.id,
              permission_name: permission,
              granted: true
            });
        }
      }
      
      console.log('✅ Permissions cleanup completed');
      return true;
    } catch (error) {
      console.error('❌ Permissions cleanup failed:', error);
      return false;
    }
  }
};
