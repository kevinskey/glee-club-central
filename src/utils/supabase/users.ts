
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/contexts/AuthContext';

// Fetch all users from the database
export async function fetchAllUsers() {
  console.log("Fetching all users...");
  try {
    const { data, error } = await supabase
      .rpc('get_all_users');
    
    if (error) {
      console.error("Error in fetchAllUsers:", error);
      throw error;
    }
    
    console.log("Fetched users data:", data);
    return data;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
}

// Fetch a single user by ID
export async function fetchUserById(userId: string) {
  console.log(`Fetching user with ID: ${userId}`);
  try {
    const { data, error } = await supabase
      .rpc('get_user_by_id', { p_user_id: userId });
    
    if (error) {
      console.error(`Error fetching user ${userId}:`, error);
      throw error;
    }
    
    // Return the first (and should be only) result
    const user = data && data.length > 0 ? data[0] : null;
    console.log(`Fetched user data:`, user);
    return user;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }
}

// Update user role
export async function updateUserRole(userId: string, role: string) {
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
export async function updateUserStatus(userId: string, status: string) {
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
export async function updateUserProfile(userId: string, profileData: Partial<Profile>) {
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
