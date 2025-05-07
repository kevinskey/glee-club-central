
import { supabase } from '@/integrations/supabase/client';

// Get additional user details that might not be in the main user list
export const getUserDetails = async (userId: string) => {
  try {
    // Get profile data
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError) throw profileError;
    
    // Get auth user data
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) throw userError;
    
    // Only return the profile data for users that aren't the current user
    if (userData.user && userData.user.id === userId) {
      return {
        ...userData.user,
        ...profileData
      };
    } else {
      return profileData;
    }
  } catch (error: any) {
    console.error('Error getting user details:', error);
    throw new Error(error.message || 'Failed to get user details');
  }
};
