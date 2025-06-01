
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';

export const getProfile = async (userId: string): Promise<Profile | null> => {
  try {
    console.log('📋 getProfile: Fetching profile for user:', userId);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    console.log('📋 getProfile: Database response:', {
      hasData: !!data,
      error: error?.message,
      errorCode: error?.code,
      profileRole: data?.role,
      profileIsAdmin: data?.is_super_admin,
      profileStatus: data?.status
    });
      
    if (error) {
      if (error.code === 'PGRST116') {
        console.log(`ℹ️ getProfile: No profile found for user ${userId}`);
      } else {
        console.error('❌ getProfile: Error fetching profile:', error);
      }
      return null;
    }
    
    if (!data.role) {
      console.warn(`⚠️ getProfile: Role undefined for profile ${data.id}, setting default`);
      data.role = 'member';
    }
    
    console.log('✅ getProfile: Profile fetched successfully:', {
      id: data.id,
      role: data.role,
      is_super_admin: data.is_super_admin,
      status: data.status
    });
    
    return data as Profile;
  } catch (error) {
    console.error(`💥 getProfile: Profile fetch failed for user ${userId}:`, error);
    return null;
  }
};

export const createProfile = async (userId: string, userEmail?: string, metadata?: any): Promise<Profile | null> => {
  try {
    console.log('🔧 createProfile: Creating profile for user:', userId);
    
    const profileData = {
      id: userId,
      first_name: metadata?.first_name || 'User',
      last_name: metadata?.last_name || '',
      role: 'member',
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
      return null;
    }
    
    console.log('✅ createProfile: Profile created successfully:', data);
    return data as Profile;
  } catch (error) {
    console.error('💥 createProfile: Unexpected error creating profile:', error);
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
    
    console.log('📝 updateProfile: Update response:', { error: error?.message });
      
    if (error) {
      console.error('❌ updateProfile: Error updating profile:', error);
      return { success: false, error };
    }
    
    console.log('✅ updateProfile: Profile updated successfully');
    return { success: true };
  } catch (error) {
    console.error('💥 updateProfile: Unexpected error updating profile:', error);
    return { success: false, error };
  }
};

// Enhanced function to wait for profile creation with retries
export const waitForProfile = async (userId: string, maxRetries: number = 3, retryDelay: number = 1000): Promise<Profile | null> => {
  console.log(`⏳ waitForProfile: Waiting for profile creation for user ${userId}`);
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`🔄 waitForProfile: Attempt ${attempt}/${maxRetries}`);
    
    const profile = await getProfile(userId);
    if (profile) {
      console.log(`✅ waitForProfile: Profile found on attempt ${attempt}`);
      return profile;
    }
    
    if (attempt < maxRetries) {
      console.log(`⏳ waitForProfile: Profile not found, waiting ${retryDelay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      retryDelay = Math.min(retryDelay * 1.2, 3000);
    }
  }
  
  console.error(`❌ waitForProfile: Profile not found after ${maxRetries} attempts`);
  return null;
};

// Main function to ensure profile exists - creates if missing
export const ensureProfileExists = async (userId: string, userEmail?: string, userMetadata?: any): Promise<Profile | null> => {
  console.log('🔍 ensureProfileExists: Checking profile for user:', userId);
  
  // First try to get existing profile
  let profile = await getProfile(userId);
  
  if (!profile) {
    console.log('🔧 ensureProfileExists: No profile found, creating new profile...');
    // Create profile if it doesn't exist
    profile = await createProfile(userId, userEmail, userMetadata);
    
    if (!profile) {
      console.log('⏳ ensureProfileExists: Profile creation failed, waiting for trigger...');
      // If manual creation failed, wait a bit for the trigger
      await new Promise(resolve => setTimeout(resolve, 1000));
      profile = await waitForProfile(userId);
    }
  }
  
  if (profile) {
    console.log('✅ ensureProfileExists: Profile ensured for user:', userId, 'role:', profile.role);
  } else {
    console.error('❌ ensureProfileExists: Failed to ensure profile for user:', userId);
  }
  
  return profile;
};
