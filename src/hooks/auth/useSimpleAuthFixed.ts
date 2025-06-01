
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser, Profile } from '@/types/auth';
import { User } from '@supabase/supabase-js';

export const useSimpleAuthFixed = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  console.log('🚀 useSimpleAuthFixed: Initializing...');

  // Helper function to convert Supabase User to AuthUser
  const convertToAuthUser = useCallback((supabaseUser: User): AuthUser | null => {
    if (!supabaseUser.email) {
      console.warn('⚠️ useSimpleAuthFixed: User has no email');
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

  // Simplified profile fetching with timeout
  const fetchProfile = useCallback(async (userId: string, userEmail?: string) => {
    try {
      console.log(`👤 useSimpleAuthFixed: Fetching profile for user: ${userId}`);
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timeout')), 5000);
      });

      const fetchPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

      if (error && error.code !== 'PGRST116') {
        console.error('❌ useSimpleAuthFixed: Profile fetch error:', error);
        return null;
      }

      if (!data && userEmail === 'kevinskey@mac.com') {
        console.log('🔧 useSimpleAuthFixed: Creating admin profile for kevinskey@mac.com');
        const fallbackProfile = {
          id: userId,
          first_name: 'Kevin',
          last_name: 'Key',
          role: 'admin',
          is_super_admin: true,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        return fallbackProfile;
      }

      console.log('✅ useSimpleAuthFixed: Profile fetched:', data?.role);
      return data;
    } catch (err) {
      console.error('💥 useSimpleAuthFixed: Profile fetch exception:', err);
      
      // Return fallback profile for admin users on any error
      if (userEmail === 'kevinskey@mac.com') {
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
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user?.id) return;
    
    console.log('🔄 useSimpleAuthFixed: Refreshing profile...');
    const profileData = await fetchProfile(user.id, user.email);
    setProfile(profileData);
  }, [user?.id, user?.email, fetchProfile]);

  // Initialize auth state with proper cleanup
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('🔑 useSimpleAuthFixed: Initializing auth state...');
        
        // Get initial session with timeout
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Session fetch timeout')), 8000);
        });

        const { data: { session }, error } = await Promise.race([sessionPromise, timeoutPromise]) as any;
        
        if (error) {
          console.error('❌ useSimpleAuthFixed: Session error:', error);
        }
        
        if (session?.user && mounted) {
          console.log('✅ useSimpleAuthFixed: Initial session found for user:', session.user.id);
          
          const authUser = convertToAuthUser(session.user);
          if (authUser) {
            setUser(authUser);
            
            // Fetch profile in background
            setTimeout(async () => {
              if (mounted) {
                const profileData = await fetchProfile(session.user.id, session.user.email);
                if (mounted) {
                  setProfile(profileData);
                }
              }
            }, 100);
          }
        }
        
        if (mounted) {
          setIsLoading(false);
          setIsInitialized(true);
        }
      } catch (err) {
        console.error('💥 useSimpleAuthFixed: Init error:', err);
        if (mounted) {
          setIsLoading(false);
          setIsInitialized(true);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔔 useSimpleAuthFixed: Auth state changed:', event);

      if (mounted) {
        if (session?.user) {
          const authUser = convertToAuthUser(session.user);
          if (authUser) {
            setUser(authUser);
            
            // Fetch profile in background with delay to prevent rapid calls
            setTimeout(async () => {
              if (mounted) {
                const profileData = await fetchProfile(session.user.id, session.user.email);
                if (mounted) {
                  setProfile(profileData);
                }
              }
            }, 200);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
        
        setIsLoading(false);
        setIsInitialized(true);
      }
    });

    // Set timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      if (mounted && !isInitialized) {
        console.warn('⚠️ useSimpleAuthFixed: Init timeout, forcing completion');
        setIsLoading(false);
        setIsInitialized(true);
      }
    }, 10000);

    // Initialize
    initializeAuth();

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [convertToAuthUser, fetchProfile, isInitialized]);

  return {
    user,
    profile,
    isLoading,
    isInitialized,
    refreshProfile,
  };
};
