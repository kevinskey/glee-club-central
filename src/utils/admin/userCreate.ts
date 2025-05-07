
import { supabase } from '@/integrations/supabase/client';
import adminSupabase from './adminSupabase';
import { CreateUserData } from './types';

// Create a new user
export const createUser = async (userData: CreateUserData) => {
  try {
    // First create the auth user using the standard signup flow
    const result = await adminSupabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password || "",
      user_metadata: {
        first_name: userData.first_name,
        last_name: userData.last_name
      }
    });

    // Fix: Access the user object directly from the result instead of through result.data
    if (!result || !result.user) throw new Error('Failed to create user');
    
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
      .eq('id', result.user.id);
    
    if (profileError) throw profileError;
    
    return { success: true, userId: result.user.id };
  } catch (error: any) {
    console.error('Error creating user:', error);
    throw new Error(error.message || 'Failed to create user');
  }
};
