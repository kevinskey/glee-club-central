
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
      profileRole: data?.role,
      profileIsAdmin: data?.is_super_admin,
      profileStatus: data?.status
    });
      
    if (error) {
      console.error('❌ getProfile: Error fetching profile:', error);
      return null;
    }
    
    console.log('✅ getProfile: Profile fetched successfully:', {
      id: data.id,
      role: data.role,
      is_super_admin: data.is_super_admin,
      status: data.status
    });
    
    return data as Profile;
  } catch (error) {
    console.error('💥 getProfile: Unexpected error fetching profile:', error);
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
