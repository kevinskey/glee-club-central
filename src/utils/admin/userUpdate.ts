
import { supabase } from '@/integrations/supabase/client';
import { UpdateUserData } from './types';

// Update an existing user
export const updateUser = async (userData: UpdateUserData) => {
  try {
    console.log("Updating user with data:", userData);
    
    // First check if the user exists
    const { data: userCheck, error: userCheckError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userData.id)
      .single();
    
    if (userCheckError || !userCheck) {
      console.error("User not found:", userCheckError);
      throw new Error("User not found");
    }
    
    // Use the standard update methods
    if (userData.password || userData.email) {
      const updateData: any = {};
      
      if (userData.password) {
        updateData.password = userData.password;
      }
      
      if (userData.email) {
        updateData.email = userData.email;
      }
      
      // Use the standard updateUser method
      const { data, error } = await supabase.auth.admin.updateUserById(
        userData.id,
        updateData
      );
      
      if (error) {
        console.error("Auth update error:", error);
        throw error;
      }
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
    if (userData.section_id !== undefined) profileData.section_id = userData.section_id === 'none' ? null : userData.section_id;
    
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
    
    return { success: true };
  } catch (error: any) {
    console.error('Error updating user:', error);
    throw new Error(error.message || 'Failed to update user');
  }
};
