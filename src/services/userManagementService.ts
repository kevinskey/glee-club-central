
import { supabase } from '@/integrations/supabase/client';

export interface UserManagementData {
  id: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  email: string;
  role: string;
  status: string;
  disabled: boolean;
  is_super_admin: boolean;
  created_at: string;
  last_sign_in_at?: string;
  phone?: string;
  voice_part?: string;
  avatar_url?: string;
  join_date?: string;
  class_year?: string;
  dues_paid?: boolean;
  notes?: string;
}

export const userManagementService = {
  // Get all users for management
  async getUsers(): Promise<UserManagementData[]> {
    const { data, error } = await supabase
      .from('user_management_view')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }

    return data || [];
  },

  // Update user role
  async updateUserRole(userId: string, newRole: string): Promise<boolean> {
    const { data, error } = await supabase.rpc('admin_update_user_role', {
      target_user_id: userId,
      new_role: newRole
    });

    if (error) {
      console.error('Error updating user role:', error);
      throw error;
    }

    return data;
  },

  // Toggle user disabled status
  async toggleUserStatus(userId: string, isDisabled: boolean): Promise<boolean> {
    const { data, error } = await supabase.rpc('admin_toggle_user_status', {
      target_user_id: userId,
      is_disabled: isDisabled
    });

    if (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }

    return data;
  },

  // Invite new user
  async inviteUser(email: string, role: string, firstName?: string, lastName?: string): Promise<string> {
    const { data, error } = await supabase.rpc('admin_invite_user', {
      user_email: email,
      user_role: role,
      first_name: firstName,
      last_name: lastName
    });

    if (error) {
      console.error('Error inviting user:', error);
      throw error;
    }

    return data;
  }
};
