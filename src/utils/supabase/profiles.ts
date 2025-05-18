
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';

/**
 * Fetch a user's profile by ID
 */
export async function getProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    return data as Profile;
  } catch (error) {
    console.error('Unexpected error fetching profile:', error);
    return null;
  }
}
