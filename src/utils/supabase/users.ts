
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
    // Make sure we're sending the exact value expected by the database
    const normalizedRole = role === "admin" ? "administrator" : role;
    
    console.log(`Calling handle_user_role with user_id: ${userId}, role: ${normalizedRole}`);
    
    // Validate against allowed roles
    const validRoles = ["administrator", "section_leader", "singer", "student_conductor", "accompanist", "non_singer"];
    if (!validRoles.includes(normalizedRole)) {
      console.error(`Invalid role value: ${normalizedRole}`);
      throw new Error(`Invalid role: ${normalizedRole}. Must be one of: ${validRoles.join(", ")}`);
    }
    
    // Call the RPC function with the provided parameters
    const { data, error } = await supabase.rpc('handle_user_role', { 
      p_user_id: userId, 
      p_role: normalizedRole 
    });
    
    if (error) {
      console.error('Error from handle_user_role RPC:', error);
      throw error;
    }
    
    console.log('Role update success, response:', data);
    return true;
  } catch (error: any) {
    console.error('Error updating user role:', error);
    throw error; // Rethrow so it can be caught by the caller
  }
};

/**
 * Update user status through RLS bypassing function
 */
export const updateUserStatus = async (userId: string, status: string): Promise<boolean> => {
  try {
    console.log(`Calling update_user_status with user_id: ${userId}, status: ${status}`);
    
    // Validate status
    if (!["active", "inactive", "pending", "alumni", "deleted"].includes(status)) {
      console.error(`Invalid status value: ${status}`);
      throw new Error(`Invalid status: ${status}`);
    }
    
    const { data, error } = await supabase.rpc('update_user_status', { 
      p_user_id: userId, 
      p_status: status 
    });
    
    if (error) {
      console.error('Error from update_user_status RPC:', error);
      throw error;
    }
    
    console.log('Status update success, response:', data);
    return true;
  } catch (error: any) {
    console.error('Error updating user status:', error);
    throw error; // Rethrow so it can be caught by the caller
  }
};
