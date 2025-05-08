// This file contains user query functions for Supabase

import { supabase } from "@/integrations/supabase/client";
import type { UserPermissions } from "@/utils/supabase/types";
import { UserSafe } from "./types";

// Define type for user search results
export interface UserSearchResult {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  role: string | null;
  status: string | null;
  voice_part: string | null;
}

/**
 * Search for a user by their email address
 */
export async function searchUserByEmail(email: string): Promise<UserSearchResult | null> {
  try {
    // Use auth.getUser() to directly query for a user by email
    const { data: authData, error: authError } = await supabase.auth.admin.getUserByEmail(email);
    
    if (authError || !authData) {
      console.error("Error finding user with email:", email, authError);
      return null;
    }

    const userId = authData.user.id;
    
    // Now fetch the profile using the user ID
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, role, status, voice_part')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      return null;
    }
    
    if (!profileData) {
      return null;
    }
    
    return {
      id: profileData.id,
      email: authData.user.email,
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      role: profileData.role,
      status: profileData.status,
      voice_part: profileData.voice_part
    };
  } catch (error) {
    console.error("Exception searching for user by email:", error);
    return null;
  }
}

/**
 * Fetch a user's profile by their ID.
 */
export async function fetchUserById(userId: string): Promise<UserSafe | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Error fetching user by ID:", error);
      return null;
    }

    return data ? {
      ...data,
      created_at: data.created_at,
      updated_at: data.updated_at || null,
    } : null;
  } catch (error) {
    console.error("Exception fetching user by ID:", error);
    return null;
  }
}

/**
 * Update a user's profile data.
 */
export async function updateUserProfile(userId: string, updates: Partial<UserSafe>): Promise<UserSafe | null> {
  try {
    // Omit created_at and updated_at from updates to prevent them from being directly modified
    const { created_at, updated_at, ...allowedUpdates } = updates;

    const { data, error } = await supabase
      .from('profiles')
      .update(allowedUpdates)
      .eq('id', userId)
      .select('*')
      .single();

    if (error) {
      console.error("Error updating user profile:", error);
      return null;
    }

    return data ? {
      ...data,
      created_at: data.created_at,
      updated_at: data.updated_at || null,
    } : null;
  } catch (error) {
    console.error("Exception updating user profile:", error);
    return null;
  }
}

/**
 * Fetch all users from the database.
 */
export async function fetchAllUsers(): Promise<UserSafe[] | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) {
      console.error("Error fetching all users:", error);
      return null;
    }

    return data ? data.map(user => ({
      ...user,
      created_at: user.created_at,
      updated_at: user.updated_at || null,
    })) : null;
  } catch (error) {
    console.error("Exception fetching all users:", error);
    return null;
  }
}

/**
 * Fetch users by role.
 */
export async function fetchUsersByRole(role: string): Promise<UserSafe[] | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', role);

    if (error) {
      console.error("Error fetching users by role:", error);
      return null;
    }

    return data ? data.map(user => ({
      ...user,
      created_at: user.created_at,
      updated_at: user.updated_at || null,
    })) : null;
  } catch (error) {
    console.error("Exception fetching users by role:", error);
    return null;
  }
}

/**
 * Fetch user permissions by user ID.
 */
export async function fetchUserPermissions(userId: string): Promise<UserPermissions | null> {
  try {
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error("Error fetching user role:", userError);
      return null;
    }

    if (!user) {
      console.log("User not found for ID:", userId);
      return null;
    }

    const role = user.role;

    // Define permissions based on the user's role
    let permissions: UserPermissions = {
      canReadUsers: false,
      canEditUsers: false,
      canCreateUsers: false,
      canDeleteUsers: false,
    };

    switch (role) {
      case 'administrator':
        permissions = {
          canReadUsers: true,
          canEditUsers: true,
          canCreateUsers: true,
          canDeleteUsers: true,
        };
        break;
      case 'section_leader':
        permissions = {
          canReadUsers: true,
          canEditUsers: false,
          canCreateUsers: false,
          canDeleteUsers: false,
        };
        break;
      case 'singer':
        permissions = {
          canReadUsers: false,
          canEditUsers: false,
          canCreateUsers: false,
          canDeleteUsers: false,
        };
        break;
      default:
        console.warn("Unknown role:", role);
        break;
    }

    return permissions;
  } catch (error) {
    console.error("Error fetching user permissions:", error);
    return null;
  }
}
