
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser, Profile } from '@/types/auth';
import { ensureProfileExists } from '@/utils/supabase/profiles';

interface AuthState {
  user: AuthUser | null;
  profile: Profile | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

export const useAuthManager = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
    isInitialized: false,
    error: null
  });
  
  const mountedRef = useRef(true);
  const initializingRef = useRef(false);

  const logAuthEvent = useCallback((event: string, data?: any) => {
    console.log(`🔐 AuthManager: ${event}`, data);
  }, []);

  const createFallbackProfile = useCallback((user: AuthUser): Profile => {
    const isKnownAdmin = user.email === 'kevinskey@mac.com';
    return {
      id: user.id,
      first_name: user.email?.split('@')[0] || 'User',
      last_name: '',
      role: isKnownAdmin ? 'admin' : 'member',
      status: 'active',
      is_super_admin: isKnownAdmin,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }, []);

  const loadUserProfile = useCallback(async (user: AuthUser) => {
    if (!mountedRef.current || !user.id) return;

    try {
      logAuthEvent('Loading profile for user', { userId: user.id, email: user.email });
      
      // For known admin, use fallback immediately
      if (user.email === 'kevinskey@mac.com') {
        const fallbackProfile = createFallbackProfile(user);
        setState(prev => ({ 
          ...prev, 
          profile: fallbackProfile, 
          isLoading: false,
          error: null
        }));
        logAuthEvent('Using admin fallback profile', { role: fallbackProfile.role });
        return;
      }
      
      // Try to get profile with shorter timeout for non-admin users
      const profilePromise = ensureProfileExists(user.id, user.email, user.user_metadata);
      const timeoutPromise = new Promise<Profile>((_, reject) => 
        setTimeout(() => reject(new Error('Profile loading timeout')), 3000)
      );

      const profile = await Promise.race([profilePromise, timeoutPromise]);
      
      if (!mountedRef.current) return;

      if (profile) {
        setState(prev => ({ 
          ...prev, 
          profile, 
          isLoading: false,
          error: null
        }));
        logAuthEvent('Profile loaded successfully', { role: profile.role });
      } else {
        // Use fallback profile
        const fallbackProfile = createFallbackProfile(user);
        setState(prev => ({ 
          ...prev, 
          profile: fallbackProfile, 
          isLoading: false,
          error: null
        }));
        logAuthEvent('Using fallback profile', { role: fallbackProfile.role });
      }
    } catch (error) {
      logAuthEvent('Profile loading failed, using fallback', { error: error.message });
      
      if (mountedRef.current) {
        const fallbackProfile = createFallbackProfile(user);
        setState(prev => ({ 
          ...prev, 
          profile: fallbackProfile, 
          isLoading: false,
          error: null
        }));
      }
    }
  }, [createFallbackProfile, logAuthEvent]);

  const handleAuthStateChange = useCallback((event: string, session: any) => {
    if (!mountedRef.current) return;

    logAuthEvent('Auth state change', { event, hasSession: !!session });

    if (session?.user) {
      setState(prev => ({ 
        ...prev, 
        user: session.user, 
        isInitialized: true,
        error: null
      }));
      
      // Load profile immediately
      loadUserProfile(session.user);
    } else {
      setState({
        user: null,
        profile: null,
        isLoading: false,
        isInitialized: true,
        error: null
      });
      logAuthEvent('User signed out');
    }
  }, [loadUserProfile, logAuthEvent]);

  const refreshProfile = useCallback(async () => {
    if (state.user?.id && mountedRef.current) {
      setState(prev => ({ ...prev, isLoading: true }));
      await loadUserProfile(state.user);
    }
  }, [state.user, loadUserProfile]);

  // Initialize auth state
  useEffect(() => {
    if (initializingRef.current) return;
    initializingRef.current = true;

    logAuthEvent('Initializing auth manager');

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        logAuthEvent('Session check failed', { error: error.message });
      }
      
      if (mountedRef.current) {
        handleAuthStateChange('INITIAL_SESSION', session);
      }
    });

    return () => {
      subscription.unsubscribe();
      initializingRef.current = false;
    };
  }, [handleAuthStateChange, logAuthEvent]);

  // Cleanup
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    ...state,
    refreshProfile,
    isAuthenticated: !!state.user,
    isAdmin: () => {
      if (!state.profile) return false;
      return state.profile.is_super_admin || state.profile.role === 'admin' || state.user?.email === 'kevinskey@mac.com';
    },
    isMember: () => {
      if (!state.profile) return false;
      return ['member', 'admin'].includes(state.profile.role || '');
    }
  };
};
