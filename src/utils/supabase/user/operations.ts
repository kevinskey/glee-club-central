import { supabase } from '@/integrations/supabase/client';
import { UserSafe } from './types';
import { Profile } from '@/types/auth';

// Update user role
export async function updateUserRole(userId: string, role: string): Promise<boolean> {
  console.log(`Updating role for user ${userId} to ${role}`);
  try {
    const { error } = await supabase
      .rpc('handle_user_role', { p_user_id: userId, p_role: role });
    
    if (error) {
      console.error(`Error updating role:`, error);
      throw error;
    }
    return true;
  } catch (error) {
    console.error(`Error updating role for user ${userId}:`, error);
    return false;
  }
}

// Update user status
export async function updateUserStatus(userId: string, status: string): Promise<boolean> {
  console.log(`Updating status for user ${userId} to ${status}`);
  try {
    const { error } = await supabase
      .rpc('update_user_status', { p_user_id: userId, p_status: status });
    
    if (error) {
      console.error(`Error updating status:`, error);
      throw error;
    }
    return true;
  } catch (error) {
    console.error(`Error updating status for user ${userId}:`, error);
    return false;
  }
}

// Update profile information
export async function updateUserProfile(userId: string, profileData: Partial<Profile>): Promise<boolean> {
  console.log(`Updating profile for user ${userId}:`, profileData);
  try {
    const { error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId);
      
    if (error) {
      console.error(`Error updating profile:`, error);
      throw error;
    }
    console.log(`Profile updated successfully`);
    return true;
  } catch (error) {
    console.error(`Error updating profile for user ${userId}:`, error);
    return false;
  }
}
