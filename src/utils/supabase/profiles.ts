
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';

export const getProfile = async (userId: string): Promise<Profile | null> => {
  try {
    console.log('📋 getProfile: Fetching profile for user:', userId);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('❌ getProfile: Error fetching profile:', error);
      return null;
    }
    
    console.log('✅ getProfile: Profile fetched successfully');
    return data as Profile;
  } catch (error) {
    console.error('💥 getProfile: Profile fetch failed:', error);
    return null;
  }
};

export const createProfile = async (userId: string, userEmail?: string, metadata?: any): Promise<Profile | null> => {
  try {
    console.log('🔧 createProfile: Creating profile for user:', userId);
    
    const profileData = {
      id: userId,
      first_name: metadata?.first_name || metadata?.full_name?.split(' ')[0] || userEmail?.split('@')[0] || 'User',
      last_name: metadata?.last_name || metadata?.full_name?.split(' ').slice(1).join(' ') || '',
      role: userEmail === 'kevinskey@mac.com' ? 'admin' : 'member',
      status: 'active',
      is_super_admin: userEmail === 'kevinskey@mac.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single();
    
    if (error) {
      console.error('❌ createProfile: Error creating profile:', error);
      return profileData as Profile; // Return fallback
    }
    
    console.log('✅ createProfile: Profile created successfully');
    return data as Profile;
  } catch (error) {
    console.error('💥 createProfile: Unexpected error:', error);
    return null;
  }
};

export const updateProfile = async (profile: Partial<Profile>): Promise<{ success: boolean, error?: any }> => {
  if (!profile.id) {
    return { success: false, error: 'Profile ID is required' };
  }
  
  try {
    console.log('📝 updateProfile: Updating profile for user:', profile.id);
    
    const { error } = await supabase
      .from('profiles')
      .update({
        ...profile,
        updated_at: new Date().toISOString()
      })
      .eq('id', profile.id);
      
    if (error) {
      console.error('❌ updateProfile: Error updating profile:', error);
      return { success: false, error };
    }
    
    console.log('✅ updateProfile: Profile updated successfully');
    return { success: true };
  } catch (error) {
    console.error('💥 updateProfile: Unexpected error:', error);
    return { success: false, error };
  }
};

// Simplified profile existence check
export const ensureProfileExists = async (userId: string, userEmail?: string, userMetadata?: any): Promise<Profile | null> => {
  console.log('🔍 ensureProfileExists: Checking profile for user:', userId);
  
  // Try to get existing profile
  let profile = await getProfile(userId);
  
  if (!profile) {
    console.log('🔧 ensureProfileExists: Creating new profile...');
    profile = await createProfile(userId, userEmail, userMetadata);
  }
  
  console.log('✅ ensureProfileExists: Profile ensured');
  return profile;
};
