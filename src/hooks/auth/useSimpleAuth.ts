
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser, Profile } from '@/types/auth';

interface SimpleAuthState {
  user: AuthUser | null;
  profile: Profile | null;
  isLoading: boolean;
  isInitialized: boolean;
}

export const useSimpleAuth = () => {
  const [state, setState] = useState<SimpleAuthState>({
    user: null,
    profile: null,
    isLoading: true,
    isInitialized: false
  });

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      console.log('🔍 useSimpleAuth: Fetching profile for user:', userId);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('❌ useSimpleAuth: Profile fetch error:', error);
        return null;
      }

      if (!profile) {
        console.warn('⚠️ useSimpleAuth: No profile found, creating fallback');
        // Create a fallback profile if none exists
        const fallback: Profile = {
          id: userId,
          first_name: 'User',
          last_name: '',
          role: 'member',
          status: 'active',
          is_super_admin: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        return fallback;
      }

      console.log('✅ useSimpleAuth: Profile loaded:', {
        id: profile.id,
        role: profile.role,
        is_super_admin: profile.is_super_admin,
        status: profile.status
      });

      return profile as Profile;
    } catch (error) {
      console.error('💥 useSimpleAuth: Profile fetch failed:', error);
      return null;
    }
  }, []);

  const updateAuthState = useCallback(async (session: any) => {
    if (session?.user) {
      const authUser: AuthUser = {
        id: session.user.id,
        email: session.user.email || '',
        app_metadata: session.user.app_metadata,
        user_metadata: session.user.user_metadata,
        aud: session.user.aud,
        created_at: session.user.created_at
      };

      console.log('🔄 useSimpleAuth: Setting user state:', authUser.id);
      setState(prev => ({ ...prev, user: authUser, isLoading: false, isInitialized: true }));

      // Fetch profile in background
      const profile = await fetchProfile(session.user.id);
      setState(prev => ({ ...prev, profile }));
    } else {
      console.log('👋 useSimpleAuth: Clearing auth state');
      setState({
        user: null,
        profile: null,
        isLoading: false,
        isInitialized: true
      });
    }
  }, [fetchProfile]);

  useEffect(() => {
    console.log('🚀 useSimpleAuth: Initializing...');

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔔 useSimpleAuth: Auth event:', event, !!session);
        await updateAuthState(session);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('❌ useSimpleAuth: Session error:', error);
        setState(prev => ({ ...prev, isLoading: false, isInitialized: true }));
      } else {
        updateAuthState(session);
      }
    });

    // Timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setState(prev => ({ ...prev, isLoading: false, isInitialized: true }));
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [updateAuthState]);

  const refreshProfile = useCallback(async () => {
    if (state.user?.id) {
      const profile = await fetchProfile(state.user.id);
      setState(prev => ({ ...prev, profile }));
    }
  }, [state.user?.id, fetchProfile]);

  return {
    ...state,
    refreshProfile
  };
};
