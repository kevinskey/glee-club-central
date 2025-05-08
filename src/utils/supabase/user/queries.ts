
import { supabase } from '@/integrations/supabase/client';
import { UserSafe } from './types';
import { getRoleDisplayName, getVoicePartDisplay } from './formatters';

// Fetch all users from the database
export async function fetchAllUsers(): Promise<UserSafe[]> {
  console.log("Fetching all users...");
  try {
    const { data, error } = await supabase
      .rpc('get_all_users');
    
    if (error) {
      console.error("Error in fetchAllUsers:", error);
      throw error;
    }
    
    console.log("Fetched users data:", data);
    return data as UserSafe[];
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
}

// Fetch a single user by ID
export async function fetchUserById(userId: string): Promise<UserSafe> {
  console.log(`Fetching user with ID: ${userId}`);
  try {
    const { data, error } = await supabase
      .rpc('get_user_by_id', { p_user_id: userId });
    
    if (error) {
      console.error(`Error fetching user ${userId}:`, error);
      throw error;
    }
    
    // Return the first result from the array
    const user = data && data.length > 0 ? data[0] : null;
    console.log(`Fetched user data:`, user);
    
    if (!user) {
      console.error(`User with ID ${userId} not found`);
      throw new Error(`User with ID ${userId} not found`);
    }
    
    return user as UserSafe;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }
}

// Search users by email without recursive type issues
export const searchUserByEmail = async (email: string): Promise<UserSafe | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error searching for user by email:', error);
      return null;
    }

    if (!data) return null;
    
    // Create a safe user object without recursive type issues
    const userSafe: UserSafe = {
      id: data.id,
      first_name: data.first_name,
      last_name: data.last_name,
      email: email, // Use the email from the query
      phone: data.phone,
      voice_part: data.voice_part,
      role: data.role || 'singer',
      role_display_name: getRoleDisplayName(data.role || 'singer'),
      voice_part_display: getVoicePartDisplay(data.voice_part),
      avatar_url: data.avatar_url,
      status: data.status || 'pending',
      join_date: data.join_date,
      class_year: data.class_year,
      dues_paid: data.dues_paid,
      special_roles: data.special_roles,
      notes: data.notes,
      created_at: data.created_at,
      updated_at: data.updated_at || null,
      last_sign_in_at: null // Since this comes from auth.users, not profiles
    };

    return userSafe;
  } catch (error) {
    console.error('Error in searchUserByEmail:', error);
    return null;
  }
};
