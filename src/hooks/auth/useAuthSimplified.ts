
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser, Profile } from '@/types/auth';
import { ensureProfileExists } from '@/utils/supabase/profiles';

interface UseAuthSimplifiedResponse {
  user: AuthUser | null;
  profile: Profile | null;
  isLoading: boolean;
  isInitialized: boolean;
  refreshProfile: () => Promise<void>;
}

export const useAuthSimplified = (): UseAuthSimplifiedResponse => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    try {
      console.log('🔄 useAuthSimplified: Refreshing profile for user:', user.id);
      const userProfile = await ensureProfileExists(user.id, user.email, user.user_metadata);
      setProfile(userProfile);
      console.log('✅ useAuthSimplified: Profile refreshed successfully');
    } catch (error) {
      console.error('❌ useAuthSimplified: Error refreshing profile:', error);
      setProfile(null);
    }
  }, [user]);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('🚀 useAuthSimplified: Initializing auth state...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ useAuthSimplified: Session error:', error);
        }

        if (mounted) {
          const sessionUser = session?.user ?? null;
          setUser(sessionUser);
          
          if (sessionUser) {
            const userProfile = await ensureProfileExists(sessionUser.id, sessionUser.email, sessionUser.user_metadata);
            setProfile(userProfile);
          } else {
            setProfile(null);
          }
          
          setIsLoading(false);
          setIsInitialized(true);
          console.log('✅ useAuthSimplified: Auth initialization complete');
        }
      } catch (error) {
        console.error('❌ useAuthSimplified: Initialization error:', error);
        if (mounted) {
          setIsLoading(false);
          setIsInitialized(true);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 useAuthSimplified: Auth state change:', event, !!session);
      
      if (!mounted) return;

      const sessionUser = session?.user ?? null;
      setUser(sessionUser);
      
      if (sessionUser && event === 'SIGNED_IN') {
        setTimeout(async () => {
          if (mounted) {
            const userProfile = await ensureProfileExists(sessionUser.id, sessionUser.email, sessionUser.user_metadata);
            setProfile(userProfile);
          }
        }, 0);
      } else {
        setProfile(null);
      }
      
      setIsLoading(false);
      setIsInitialized(true);
    });

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    profile,
    isLoading,
    isInitialized,
    refreshProfile
  };
};
