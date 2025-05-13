
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserFormValues } from '@/components/members/form/userFormSchema';

export interface User {
  id: string;
  email?: string | null;
  first_name: string;
  last_name: string;
  phone?: string | null;
  voice_part: string | null;
  avatar_url?: string | null;
  status: string;
  join_date?: string;
  class_year?: string;
  dues_paid?: boolean;
  notes?: string;
  created_at: string;
  updated_at?: string | null;
  last_sign_in_at?: string | null;
  is_super_admin?: boolean;
}

export const userManagementService = {
  async getUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('last_name', { ascending: true });
      
      if (error) throw error;
      
      return data as User[];
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load user data');
      return [];
    }
  },
  
  async getUserById(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      return data as User;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },
  
  async createUser(userData: UserFormValues): Promise<boolean> {
    try {
      // Create auth user first
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password || 'TemporaryPassword123!',
        options: {
          data: {
            first_name: userData.first_name,
            last_name: userData.last_name
          }
        }
      });
      
      if (authError) throw authError;
      if (!authData.user?.id) throw new Error('User creation failed');
      
      // Then update the profile with additional data
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          phone: userData.phone,
          voice_part: userData.voice_part,
          status: userData.status || 'active',
          class_year: userData.class_year,
          notes: userData.notes,
          dues_paid: userData.dues_paid || false,
          join_date: userData.join_date || new Date().toISOString().split('T')[0],
        })
        .eq('id', authData.user.id);
      
      if (profileError) throw profileError;
      
      toast.success(`Added ${userData.first_name} ${userData.last_name}`);
      return true;
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error(error?.message || 'Failed to create user');
      return false;
    }
  },
  
  async updateUser(userId: string, userData: Partial<User>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(userData)
        .eq('id', userId);
      
      if (error) throw error;
      
      toast.success('User updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
      return false;
    }
  },
  
  async deleteUser(userId: string): Promise<boolean> {
    try {
      // Mark as deleted in the profile
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'deleted' })
        .eq('id', userId);
      
      if (error) throw error;
      
      toast.success('User deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
      return false;
    }
  }
};
