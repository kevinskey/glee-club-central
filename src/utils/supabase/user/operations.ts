
/**
 * Higher-level operations for user management
 */
import { supabase } from "@/integrations/supabase/client";
import { UserSafe } from "./types";
import { fetchUserById } from "./queries";

/**
 * Update user role
 */
export async function updateUserRole(userId: string, role: string): Promise<boolean> {
  try {
    // Call RPC function to update user role
    const { error } = await supabase
      .rpc('handle_user_role', {
        p_user_id: userId,
        p_role: role
      });
      
    if (error) {
      console.error("Error updating user role:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception updating user role:", error);
    return false;
  }
}

/**
 * Update user status
 */
export async function updateUserStatus(userId: string, status: string): Promise<boolean> {
  try {
    // Call RPC function to update user status
    const { error } = await supabase
      .rpc('update_user_status', {
        p_user_id: userId,
        p_status: status
      });
      
    if (error) {
      console.error("Error updating user status:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception updating user status:", error);
    return false;
  }
}

/**
 * Add a note to a member
 */
export async function addMemberNote(memberId: string, note: string): Promise<boolean> {
  try {
    // Get current user's ID
    const { data: userData } = await supabase.auth.getUser();
    const currentUserId = userData.user?.id;
    
    if (!currentUserId) {
      console.error("Cannot add note: No authenticated user");
      return false;
    }
    
    const { error } = await supabase
      .from('member_notes')
      .insert({
        member_id: memberId,
        created_by: currentUserId,
        note
      });
      
    if (error) {
      console.error("Error adding member note:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception adding member note:", error);
    return false;
  }
}

/**
 * Get member notes
 */
export async function getMemberNotes(memberId: string): Promise<any[] | null> {
  try {
    const { data, error } = await supabase
      .from('member_notes')
      .select('*, profiles:created_by(first_name, last_name)')
      .eq('member_id', memberId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error getting member notes:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Exception getting member notes:", error);
    return null;
  }
}
