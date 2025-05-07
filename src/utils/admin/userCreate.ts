
// Create a new user with enhanced fields for Glee Club
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { CreateUserData } from "./types";

export const createUser = async (data: CreateUserData) => {
  try {
    // First, create the auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        first_name: data.first_name,
        last_name: data.last_name,
      }
    });

    if (authError) {
      console.error("Error creating user auth:", authError);
      throw new Error(authError.message);
    }

    const userId = authData.user?.id;

    if (!userId) {
      throw new Error("Failed to create user: No user ID returned");
    }

    // Now update the profile with additional fields
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        first_name: data.first_name,
        last_name: data.last_name,
        role: data.role,
        status: data.status,
        voice_part: data.voice_part,
        phone: data.phone,
        class_year: data.class_year,
        join_date: data.join_date,
        dues_paid: data.dues_paid,
        notes: data.notes,
        special_roles: data.special_roles
      })
      .eq('id', userId);

    if (profileError) {
      console.error("Error updating user profile:", profileError);
      throw new Error(profileError.message);
    }

    return {
      success: true,
      userId,
    };
  } catch (error: any) {
    console.error("Error in createUser:", error);
    throw new Error(error.message || "Failed to create user");
  }
};
