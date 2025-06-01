
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
        console.error(`❌ getProfile: Profile fetch failed for user ${userId} - No profile found`);
      } else {
        console.error('❌ getProfile: Error fetching profile:', error);
      }
      return null;
    }
    
    if (!data.role) {
      console.warn(`⚠️ getProfile: Role undefined for profile ${data.id}`);
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

export const createFallbackProfile = async (userId: string, userEmail?: string): Promise<Profile | null> => {
  try {
    console.log('🔧 createFallbackProfile: Creating profile for user:', userId);
    
    // Determine if this should be an admin based on email
    const isAdmin = userEmail === 'kevinskey@mac.com';
    const role = isAdmin ? 'admin' : 'member';
    
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        first_name: 'User',
        last_name: '',
        role: role,
        is_super_admin: isAdmin,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    console.log('🔧 createFallbackProfile: Creation result:', { 
      error: error?.message,
      created: !!data,
      role: data?.role 
    });
    
    if (error) {
      console.error('❌ createFallbackProfile: Error creating profile:', error);
      return null;
    }
    
    console.log('✅ createFallbackProfile: Profile created successfully');
    return data as Profile;
  } catch (error) {
    console.error('💥 createFallbackProfile: Error creating profile:', error);
    return null;
  }
};
