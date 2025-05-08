
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

// Search users by email - using a simple interface to avoid recursive type issues
interface SimpleUserData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  voice_part: string | null;
  role: string;
  avatar_url: string | null;
  status: string;
  join_date: string | null;
  class_year: string | null;
  dues_paid: boolean | null;
  special_roles: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
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
    
    // Convert data to UserSafe type
    const userProfile = data as SimpleUserData;
    
    // Create a safe user object without recursive type issues
    const userSafe: UserSafe = {
      id: userProfile.id,
      first_name: userProfile.first_name,
      last_name: userProfile.last_name,
      email,
      phone: userProfile.phone,
      voice_part: userProfile.voice_part,
      role: userProfile.role || 'singer',
      role_display_name: getRoleDisplayName(userProfile.role || 'singer'),
      voice_part_display: getVoicePartDisplay(userProfile.voice_part),
      avatar_url: userProfile.avatar_url,
      status: userProfile.status || 'pending',
      join_date: userProfile.join_date,
      class_year: userProfile.class_year,
      dues_paid: userProfile.dues_paid,
      special_roles: userProfile.special_roles,
      notes: userProfile.notes,
      created_at: userProfile.created_at,
      updated_at: userProfile.updated_at || null,
      last_sign_in_at: null // Since this comes from auth.users, not profiles
    };

    return userSafe;
  } catch (error) {
    console.error('Error in searchUserByEmail:', error);
    return null;
  }
};
