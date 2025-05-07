
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch all users with RLS bypassing function
 */
export async function fetchAllUsers() {
  try {
    const { data, error } = await supabase.rpc('get_all_users');
    
    if (error) {
      console.error('Error in fetchAllUsers:', error);
      throw error;
    }
    
    console.log("fetchAllUsers raw data:", data); // Debug log
    return data || [];
  } catch (error) {
    console.error('Error fetching all users:', error);
    return [];
  }
}

/**
 * Fetch user by ID with RLS bypassing function
 */
export async function fetchUserById(userId: string) {
  try {
    const { data, error } = await supabase.rpc('get_user_by_id', {
      p_user_id: userId
    });
    
    if (error) throw error;
    
    // This RPC returns an array with one item, so we need to return the first item
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error);
    return null;
  }
}

/**
 * Update user role through RLS bypassing function
 */
export const updateUserRole = async (userId: string, role: string): Promise<boolean> => {
  try {
    console.log(`Calling handle_user_role with user_id: ${userId}, role: ${role}`);
    // Check if role is valid against the database constraints
    if (!["administrator", "section_leader", "singer", "student_conductor", "accompanist", "non_singer"].includes(role)) {
      console.error(`Invalid role value: ${role}`);
      return false;
    }
    
    // Call the RPC function with the provided parameters
    const { data, error } = await supabase.rpc('handle_user_role', { 
      p_user_id: userId, 
      p_role: role 
    });
    
    if (error) {
      console.error('Error from handle_user_role RPC:', error);
      return false;
    }
    
    console.log('Role update success, response:', data);
    return true;
  } catch (error: any) {
    console.error('Error updating user role:', error);
    return false;
  }
};

/**
 * Update user status through RLS bypassing function
 */
export const updateUserStatus = async (userId: string, status: string): Promise<boolean> => {
  try {
    console.log(`Calling update_user_status with user_id: ${userId}, status: ${status}`);
    
    const { data, error } = await supabase.rpc('update_user_status', { 
      p_user_id: userId, 
      p_status: status 
    });
    
    if (error) {
      console.error('Error from update_user_status RPC:', error);
      return false;
    }
    
    console.log('Status update success, response:', data);
    return true;
  } catch (error: any) {
    console.error('Error updating user status:', error);
    return false;
  }
};
