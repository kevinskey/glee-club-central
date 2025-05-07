
// Update an existing user
import { supabase } from '@/integrations/supabase/client';
import { UpdateUserData } from './types';

export const updateUser = async (data: UpdateUserData) => {
  try {
    console.log("Updating user with data:", data);
    
    if (!data.id) {
      console.error('Invalid user ID provided');
      throw new Error('Invalid user ID');
    }
    
    // Prepare profile update
    const profileUpdate: Record<string, any> = {
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone,
      role: data.role,
      status: data.status,
      voice_part: data.voice_part,
      class_year: data.class_year,
      join_date: data.join_date,
      dues_paid: data.dues_paid,
      notes: data.notes,
      special_roles: data.special_roles
    };
    
    // Filter out undefined values
    Object.keys(profileUpdate).forEach(key => {
      if (profileUpdate[key] === undefined) {
        delete profileUpdate[key];
      }
    });
    
    // Update the profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update(profileUpdate)
      .eq('id', data.id);
    
    if (profileError) {
      console.error('Error updating user profile:', profileError);
      throw profileError;
    }
    
    // Check if we need to update email or password
    if (data.email || data.password) {
      const authUpdate: Record<string, any> = {};
      
      if (data.email) authUpdate.email = data.email;
      if (data.password) authUpdate.password = data.password;
      
      const { error: authError } = await supabase.auth.admin.updateUserById(
        data.id,
        authUpdate
      );
      
      if (authError) {
        console.error('Error updating auth user:', authError);
        throw authError;
      }
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Error updating user:', error);
    throw new Error(error.message || 'Failed to update user');
  }
};
