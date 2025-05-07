
import { supabase } from '@/integrations/supabase/client';
import { UpdateUserData } from './types';

// Update an existing user
export const updateUser = async (userData: UpdateUserData) => {
  try {
    console.log("Updating user with data:", userData);
    
    // First check if the user exists using get_user_by_id function instead of profiles lookup
    const { data: userCheck, error: userCheckError } = await supabase.rpc('get_user_by_id', {
      p_user_id: userData.id
    });
    
    if (userCheckError) {
      console.error("Error checking if user exists:", userCheckError);
      throw new Error(userCheckError.message || "Failed to check user existence");
    }
    
    if (!userCheck || userCheck.length === 0) {
      console.error("User not found with ID:", userData.id);
      throw new Error("User not found");
    }
    
    // Update profile data
    const profileData: any = {};
    
    // Only add fields that are defined
    if (userData.first_name !== undefined) profileData.first_name = userData.first_name;
    if (userData.last_name !== undefined) profileData.last_name = userData.last_name;
    if (userData.role !== undefined) profileData.role = userData.role;
    if (userData.status !== undefined) profileData.status = userData.status;
    if (userData.voice_part !== undefined) profileData.voice_part = userData.voice_part;
    if (userData.phone !== undefined) profileData.phone = userData.phone;
    
    // Only update if there are profile fields to update
    if (Object.keys(profileData).length > 0) {
      console.log("Updating profile with:", profileData);
      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userData.id);
      
      if (profileError) {
        console.error("Profile update error:", profileError);
        throw profileError;
      }
    }
    
    // Note: We've removed the email/password update part since it requires admin privileges
    // If email/password updates are needed, they should be handled through a server-side 
    // function with appropriate permissions
    
    return { success: true };
  } catch (error: any) {
    console.error('Error updating user:', error);
    throw new Error(error.message || 'Failed to update user');
  }
};
