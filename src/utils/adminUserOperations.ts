
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

// Create a Supabase client with the service role key for admin operations
// This should be used only on the server side, but for this demo we're using it in the frontend
// In a production environment, these operations should be handled via a secure backend service

// Using the supabase client directly for RLS operations, and API calls for admin operations
const adminSupabase = {
  auth: {
    admin: {
      createUser: async (options: any) => {
        try {
          // For development purposes, we'll just use the regular supabase client
          // In production, this should be handled by a secure backend service
          const { data, error } = await supabase.auth.signUp({
            email: options.email,
            password: options.password || "",
            options: {
              data: options.user_metadata || {}
            }
          });
          
          if (error) throw error;
          return { user: data.user };
        } catch (error: any) {
          console.error("Error creating user:", error);
          throw error;
        }
      },
      
      updateUserById: async (userId: string, attributes: any) => {
        try {
          // For password updates in development, we'll need to implement a workaround
          // In production, this should be handled by a secure backend
          
          // For email and metadata updates we can use the admin functions 
          // which should work with the authenticated user having the right permissions
          const { data, error } = await supabase.auth.updateUser({
            email: attributes.email,
            data: attributes.user_metadata
          });
          
          if (error) throw error;
          return data;
        } catch (error: any) {
          console.error("Error updating user:", error);
          throw error;
        }
      },
      
      deleteUser: async (userId: string) => {
        // In development, we'll handle this differently
        // In production, this should be handled by a secure backend service
        try {
          // For demo purposes, we'll just disable the user by updating their status
          const { error } = await supabase
            .from('profiles')
            .update({ status: 'deleted' })
            .eq('id', userId);
            
          if (error) throw error;
          
          return { success: true };
        } catch (error: any) {
          console.error("Error deleting user:", error);
          throw error;
        }
      },
      
      getUserById: async (userId: string) => {
        try {
          // Get user data from profiles table
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
            
          if (error) throw error;
          
          return { user: data };
        } catch (error: any) {
          console.error("Error getting user:", error);
          throw error;
        }
      }
    }
  }
};

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
    // First create the auth user using the standard signup flow
    const { data: authData } = await adminSupabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password || "",
      user_metadata: {
        first_name: userData.first_name,
        last_name: userData.last_name
      }
    });

    if (!authData || !authData.user) throw new Error('Failed to create user');
    
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
      const { data, error } = await supabase.auth.updateUser(updateData);
      
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

// Delete a user (for development, this just updates their status)
export const deleteUser = async (userId: string) => {
  try {
    // For development, we'll just update the status to 'deleted'
    const { error } = await supabase
      .from('profiles')
      .update({ status: 'deleted' })
      .eq('id', userId);
      
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
    // Get profile data
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError) throw profileError;
    
    // Get auth user data
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) throw userError;
    
    // Only return the profile data for users that aren't the current user
    if (userData.user && userData.user.id === userId) {
      return {
        ...userData.user,
        ...profileData
      };
    } else {
      return profileData;
    }
  } catch (error: any) {
    console.error('Error getting user details:', error);
    throw new Error(error.message || 'Failed to get user details');
  }
};
