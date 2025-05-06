
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

interface CreateUserData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string;
  status: string;
  voice_part?: string | null;
  phone?: string | null;
  section_id?: string | null;
}

interface UpdateUserData {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  status?: string;
  voice_part?: string | null;
  phone?: string | null;
  section_id?: string | null;
  password?: string;
}

// Create a new user
export const createUser = async (userData: CreateUserData) => {
  try {
    // First create the auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password || undefined,
      email_confirm: true,
      user_metadata: {
        first_name: userData.first_name,
        last_name: userData.last_name
      }
    });

    if (authError) throw authError;
    
    // The profile should be created automatically via trigger,
    // but we update it with the additional fields
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        role: userData.role,
        status: userData.status,
        voice_part: userData.voice_part,
        phone: userData.phone,
        section_id: userData.section_id,
        first_name: userData.first_name,
        last_name: userData.last_name
      })
      .eq('id', authData.user.id);
    
    if (profileError) throw profileError;
    
    return { success: true, userId: authData.user.id };
  } catch (error: any) {
    console.error('Error creating user:', error);
    throw new Error(error.message || 'Failed to create user');
  }
};

// Update an existing user
export const updateUser = async (userData: UpdateUserData) => {
  try {
    console.log("Updating user with data:", userData);
    
    // If password is provided, update it
    if (userData.password) {
      const { error: passwordError } = await supabase.auth.admin.updateUserById(
        userData.id,
        { password: userData.password }
      );
      
      if (passwordError) throw passwordError;
    }
    
    // If email is provided, update it
    if (userData.email) {
      const { error: emailError } = await supabase.auth.admin.updateUserById(
        userData.id,
        { email: userData.email }
      );
      
      if (emailError) throw emailError;
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

// Delete a user
export const deleteUser = async (userId: string) => {
  try {
    const { error } = await supabase.auth.admin.deleteUser(userId);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting user:', error);
    throw new Error(error.message || 'Failed to delete user');
  }
};

// Get additional user details that might not be in the main user list
export const getUserDetails = async (userId: string) => {
  try {
    // Get auth user data
    const { data: authData, error: authError } = await supabase.auth.admin.getUserById(userId);
    
    if (authError) throw authError;
    
    // Get profile data
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError) throw profileError;
    
    // Combine the data
    return {
      ...authData.user,
      ...profileData
    };
  } catch (error: any) {
    console.error('Error getting user details:', error);
    throw new Error(error.message || 'Failed to get user details');
  }
};
