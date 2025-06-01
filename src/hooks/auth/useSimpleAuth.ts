
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser, Profile } from '@/types/auth';

export const useSimpleAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  console.log('🚀 useSimpleAuth: Initializing...');

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      console.log('👤 useSimpleAuth: Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ useSimpleAuth: Profile fetch error:', error);
        
        // Special handling for admin user - create profile if it doesn't exist
        if (error.code === 'PGRST116') { // No rows returned
          const { data: userData } = await supabase.auth.getUser();
          const userEmail = userData.user?.email;
          
          if (userEmail === 'kevinskey@mac.com') {
            console.log('🔧 useSimpleAuth: Creating admin profile for kevinskey@mac.com');
            
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert({
                id: userId,
                first_name: 'Kevin',
                last_name: 'Key',
                role: 'admin',
                is_super_admin: true,
                status: 'active'
              })
              .select()
              .single();
              
            if (createError) {
              console.error('❌ useSimpleAuth: Failed to create admin profile:', createError);
              return null;
            }
            
            console.log('✅ useSimpleAuth: Admin profile created:', newProfile);
            return newProfile;
          }
        }
        
        return null;
      }

      console.log('✅ useSimpleAuth: Profile fetched:', {
        id: data?.id,
        role: data?.role,
        isAdmin: data?.is_super_admin,
        status: data?.status
      });
      
      return data;
    } catch (err) {
      console.error('💥 useSimpleAuth: Profile fetch exception:', err);
      return null;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user?.id) return;
    
    console.log('🔄 useSimpleAuth: Refreshing profile...');
    const profileData = await fetchProfile(user.id);
    setProfile(profileData);
  }, [user?.id, fetchProfile]);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('🔑 useSimpleAuth: Initializing auth state...');
        
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ useSimpleAuth: Session error:', error);
        }
        
        if (session?.user && mounted) {
          console.log('✅ useSimpleAuth: Initial session found for user:', session.user.id);
          setUser(session.user);
          
          // Fetch profile
          const profileData = await fetchProfile(session.user.id);
          if (mounted) {
            setProfile(profileData);
          }
        }
        
        if (mounted) {
          setIsLoading(false);
          setIsInitialized(true);
        }
      } catch (err) {
        console.error('💥 useSimpleAuth: Init error:', err);
        if (mounted) {
          setIsLoading(false);
          setIsInitialized(true);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔔 useSimpleAuth: Auth state changed:', event, {
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id
      });

      if (mounted) {
        if (session?.user) {
          setUser(session.user);
          
          // Fetch profile for authenticated user
          setTimeout(async () => {
            const profileData = await fetchProfile(session.user.id);
            if (mounted) {
              setProfile(profileData);
            }
          }, 0);
        } else {
          setUser(null);
          setProfile(null);
        }
        
        setIsLoading(false);
        setIsInitialized(true);
      }
    });

    // Initialize
    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  return {
    user,
    profile,
    isLoading,
    isInitialized,
    refreshProfile,
  };
};
