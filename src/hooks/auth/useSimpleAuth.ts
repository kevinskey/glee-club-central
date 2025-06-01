
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser, Profile } from '@/types/auth';
import { User } from '@supabase/supabase-js';
import { logMobileAuthDebug } from '@/utils/mobileUtils';

export const useSimpleAuth = () => {
  // Initialize with null to prevent React dispatcher issues
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  console.log('🚀 useSimpleAuth: Initializing...');
  logMobileAuthDebug('useSimpleAuth-init', { 
    timestamp: new Date().toISOString() 
  });

  // Helper function to convert Supabase User to AuthUser
  const convertToAuthUser = useCallback((supabaseUser: User): AuthUser | null => {
    if (!supabaseUser.email) {
      console.warn('⚠️ useSimpleAuth: User has no email, cannot convert to AuthUser');
      return null;
    }
    
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      email_confirmed_at: supabaseUser.email_confirmed_at,
      created_at: supabaseUser.created_at,
      updated_at: supabaseUser.updated_at,
    };
  }, []);

  // Create fallback profile for known admin users
  const createFallbackAdminProfile = useCallback((userId: string, userEmail?: string): Profile | null => {
    if (userEmail === 'kevinskey@mac.com') {
      console.log('🔧 useSimpleAuth: Creating fallback admin profile for kevinskey@mac.com');
      return {
        id: userId,
        first_name: 'Kevin',
        last_name: 'Key',
        role: 'admin',
        is_super_admin: true,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    return null;
  }, []);

  const fetchProfile = useCallback(async (userId: string, userEmail?: string) => {
    try {
      console.log('👤 useSimpleAuth: Fetching profile for user:', userId);
      logMobileAuthDebug('profile-fetch-start', { userId });
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ useSimpleAuth: Profile fetch error:', error);
        logMobileAuthDebug('profile-fetch-error', { error: error.message, code: error.code });
        
        // Handle RLS recursion error with fallback
        if (error.code === '42P17' || error.message.includes('infinite recursion')) {
          console.log('🔄 useSimpleAuth: RLS recursion detected, using fallback profile');
          const fallbackProfile = createFallbackAdminProfile(userId, userEmail);
          if (fallbackProfile) {
            logMobileAuthDebug('fallback-profile-created', { profile: fallbackProfile });
            return fallbackProfile;
          }
        }
        
        // Special handling for admin user - create profile if it doesn't exist
        if (error.code === 'PGRST116') { // No rows returned
          if (userEmail === 'kevinskey@mac.com') {
            console.log('🔧 useSimpleAuth: Creating admin profile for kevinskey@mac.com');
            logMobileAuthDebug('admin-profile-creation', { userEmail });
            
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
              logMobileAuthDebug('admin-profile-creation-error', { error: createError.message });
              // Return fallback profile even if creation fails
              return createFallbackAdminProfile(userId, userEmail);
            }
            
            console.log('✅ useSimpleAuth: Admin profile created:', newProfile);
            logMobileAuthDebug('admin-profile-created', { profile: newProfile });
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
      
      logMobileAuthDebug('profile-fetch-success', { 
        role: data?.role,
        isAdmin: data?.is_super_admin 
      });
      
      return data;
    } catch (err) {
      console.error('💥 useSimpleAuth: Profile fetch exception:', err);
      logMobileAuthDebug('profile-fetch-exception', { error: err });
      
      // Return fallback profile for admin users on any error
      const fallbackProfile = createFallbackAdminProfile(userId, userEmail);
      if (fallbackProfile) {
        console.log('🔄 useSimpleAuth: Using fallback profile due to exception');
        return fallbackProfile;
      }
      
      return null;
    }
  }, [createFallbackAdminProfile]);

  const refreshProfile = useCallback(async () => {
    if (!user?.id) return;
    
    console.log('🔄 useSimpleAuth: Refreshing profile...');
    logMobileAuthDebug('profile-refresh', { userId: user.id });
    const profileData = await fetchProfile(user.id, user.email);
    setProfile(profileData);
  }, [user?.id, user?.email, fetchProfile]);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const initializeAuth = async () => {
      try {
        console.log('🔑 useSimpleAuth: Initializing auth state...');
        logMobileAuthDebug('auth-init-start', {});
        
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ useSimpleAuth: Session error:', error);
          logMobileAuthDebug('session-error', { error: error.message });
        }
        
        if (session?.user && mounted) {
          console.log('✅ useSimpleAuth: Initial session found for user:', session.user.id);
          logMobileAuthDebug('initial-session-found', { 
            userId: session.user.id,
            email: session.user.email 
          });
          
          const authUser = convertToAuthUser(session.user);
          if (authUser) {
            setUser(authUser);
            
            // Fetch profile with enhanced error handling
            try {
              const profileData = await fetchProfile(session.user.id, session.user.email);
              if (mounted) {
                setProfile(profileData);
              }
            } catch (profileError) {
              console.warn('⚠️ useSimpleAuth: Profile fetch failed during init:', profileError);
              // For admin users, set a fallback profile
              if (session.user.email === 'kevinskey@mac.com') {
                const fallbackProfile = createFallbackAdminProfile(session.user.id, session.user.email);
                if (mounted && fallbackProfile) {
                  setProfile(fallbackProfile);
                }
              }
            }
          }
        }
        
        if (mounted) {
          setIsLoading(false);
          setIsInitialized(true);
          logMobileAuthDebug('auth-init-complete', {});
        }
      } catch (err) {
        console.error('💥 useSimpleAuth: Init error:', err);
        logMobileAuthDebug('auth-init-error', { error: err });
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

      logMobileAuthDebug('auth-state-change', {
        event,
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id
      });

      if (mounted) {
        if (session?.user) {
          const authUser = convertToAuthUser(session.user);
          if (authUser) {
            setUser(authUser);
            
            // Fetch profile for authenticated user with enhanced error handling
            setTimeout(async () => {
              try {
                const profileData = await fetchProfile(session.user.id, session.user.email);
                if (mounted) {
                  setProfile(profileData);
                }
              } catch (profileError) {
                console.warn('⚠️ useSimpleAuth: Profile fetch failed during auth change:', profileError);
                // For admin users, set a fallback profile
                if (session.user.email === 'kevinskey@mac.com') {
                  const fallbackProfile = createFallbackAdminProfile(session.user.id, session.user.email);
                  if (mounted && fallbackProfile) {
                    setProfile(fallbackProfile);
                  }
                }
              }
            }, 0);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
        
        setIsLoading(false);
        setIsInitialized(true);
      }
    });

    // Set timeout to prevent hanging (reduced to 5 seconds)
    timeoutId = setTimeout(() => {
      if (mounted && !isInitialized) {
        console.warn('⚠️ useSimpleAuth: Init timeout, forcing completion');
        setIsLoading(false);
        setIsInitialized(true);
      }
    }, 5000);

    // Initialize
    initializeAuth();

    return () => {
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      subscription.unsubscribe();
    };
  }, [fetchProfile, convertToAuthUser, isInitialized, createFallbackAdminProfile]);

  return {
    user,
    profile,
    isLoading,
    isInitialized,
    refreshProfile,
  };
};
