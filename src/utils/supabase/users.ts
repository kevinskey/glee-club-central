import { supabase } from '@/integrations/supabase/client';

// Define explicit interface for user profile to avoid recursive type instantiation
export interface UserSafe {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  voice_part: string | null;
  role: string;
  role_display_name: string | null;
  voice_part_display: string | null;
  avatar_url: string | null;
  status: string;
  join_date: string | null;
  class_year: string | null;
  dues_paid: boolean | null;
  special_roles: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
  last_sign_in_at: string | null;
}

// Use Profile type from AuthContext but export it here to prevent circular dependencies
export type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  voice_part: string | null;
  role: string;
  status: string;
  join_date: string | null;
  class_year: string | null;
  dues_paid: boolean | null;
  special_roles: string | null;
  notes: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at?: string | null;
  last_sign_in_at?: string | null;
  role_display_name?: string | null;
  voice_part_display?: string | null;
};

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

// Search users by email with explicit return type to prevent infinite type recursion
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

    // Define result explicitly with UserSafe type to avoid deep inference
    const userSafe: UserSafe = {
      id: data.id,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
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
      last_sign_in_at: data.last_sign_in_at || null
    };

    return userSafe;
  } catch (error) {
    console.error('Error in searchUserByEmail:', error);
    return null;
  }
};

// Helper functions to format display names
function getRoleDisplayName(role: string): string {
  if (!role) return "Unknown";
  
  switch (role) {
    case "administrator": return "Administrator";
    case "section_leader": return "Section Leader";
    case "singer": return "Singer";
    case "student_conductor": return "Student Conductor";
    case "accompanist": return "Accompanist";
    case "non_singer": return "Non-Singer";
    default: return role.charAt(0).toUpperCase() + role.slice(1).replace(/_/g, ' ');
  }
}

function getVoicePartDisplay(voicePart: string | null): string {
  if (!voicePart) return "Not set";
  
  switch (voicePart) {
    case "soprano_1": return "Soprano 1";
    case "soprano_2": return "Soprano 2";
    case "alto_1": return "Alto 1";
    case "alto_2": return "Alto 2";
    case "tenor": return "Tenor";
    case "bass": return "Bass";
    default: return voicePart;
  }
}
