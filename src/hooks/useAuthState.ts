
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser, Profile } from '@/types/auth';
import { getProfile } from '@/utils/supabase/profiles';
import { fetchUserPermissions } from '@/utils/supabase/permissions';

interface AuthState {
  user: AuthUser | null;
  profile: Profile | null;
  isLoading: boolean;
  isInitialized: boolean;
  permissions: { [key: string]: boolean };
}

// Auth cache to prevent redundant API calls
const authCache = {
  profile: null as Profile | null,
  permissions: {} as { [key: string]: boolean },
  lastFetch: 0,
  userId: null as string | null
};

const CACHE_DURATION = 30000; // Reduced to 30 seconds
const LOADING_DEBOUNCE = 100; // Reduced debounce for faster response

export const useAuthState = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
    isInitialized: false,
    permissions: {}
  });
  
  const loadingTimeoutRef = useRef<NodeJS.Timeout>();
  const isLoadingRef = useRef(false);
  const initializationRef = useRef(false);
  
  // Debounced loading state setter
  const setLoadingState = useCallback((loading: boolean) => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    
    if (loading) {
      setState(prev => ({ ...prev, isLoading: true }));
    } else {
      loadingTimeoutRef.current = setTimeout(() => {
        setState(prev => ({ ...prev, isLoading: false }));
      }, LOADING_DEBOUNCE);
    }
  }, []);
  
  // Cached profile and permissions fetcher
  const fetchUserData = useCallback(async (userId: string, forceRefresh = false) => {
    if (isLoadingRef.current && !forceRefresh) return;
    
    const now = Date.now();
    
    // Use cache if valid and for same user
    if (!forceRefresh && 
        authCache.userId === userId && 
        authCache.lastFetch && 
        (now - authCache.lastFetch) < CACHE_DURATION &&
        authCache.profile) {
      console.log('Using cached auth data for user:', userId);
      setState(prev => ({
        ...prev,
        profile: authCache.profile,
        permissions: authCache.permissions
      }));
      return;
    }
    
    // Prevent concurrent requests
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    
    try {
      console.log('Fetching fresh auth data for user:', userId);
      
      // Fetch profile and permissions in parallel
      const [profile, permissions] = await Promise.all([
        getProfile(userId),
        fetchUserPermissions(userId)
      ]);
      
      // Update cache only if we got valid data
      if (profile) {
        authCache.profile = profile;
        authCache.permissions = permissions;
        authCache.lastFetch = now;
        authCache.userId = userId;
        
        setState(prev => ({
          ...prev,
          profile,
          permissions
        }));
      }
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Don't clear existing data on error, just log it
    } finally {
      isLoadingRef.current = false;
    }
  }, []);
  
  // Initialize auth state
  useEffect(() => {
    let mounted = true;
    
    // Prevent multiple initializations
    if (initializationRef.current) return;
    initializationRef.current = true;
    
    const initializeAuth = async () => {
      try {
        setLoadingState(true);
        
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (session?.user) {
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            app_metadata: session.user.app_metadata,
            user_metadata: session.user.user_metadata,
            aud: session.user.aud,
            created_at: session.user.created_at
          };
          
          setState(prev => ({ ...prev, user: authUser }));
          await fetchUserData(session.user.id);
        } else {
          // Clear cache for signed out state
          authCache.profile = null;
          authCache.permissions = {};
          authCache.userId = null;
          authCache.lastFetch = 0;
          
          setState(prev => ({
            ...prev,
            user: null,
            profile: null,
            permissions: {}
          }));
        }
        
        setState(prev => ({ ...prev, isInitialized: true }));
        
      } catch (error) {
        console.error('Auth initialization error:', error);
        setState(prev => ({ ...prev, isInitialized: true }));
      } finally {
        if (mounted) {
          setLoadingState(false);
        }
      }
    };
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state change:', event, session?.user?.id);
        
        // Only handle specific events to prevent redundant calls
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          if (session?.user) {
            const authUser: AuthUser = {
              id: session.user.id,
              email: session.user.email || '',
              app_metadata: session.user.app_metadata,
              user_metadata: session.user.user_metadata,
              aud: session.user.aud,
              created_at: session.user.created_at
            };
            
            setState(prev => ({ ...prev, user: authUser }));
            
            // Defer user data fetching to prevent conflicts
            setTimeout(() => {
              if (mounted) {
                fetchUserData(session.user.id, true); // Force refresh on sign in
              }
            }, 50);
          } else {
            // Clear everything on sign out
            authCache.profile = null;
            authCache.permissions = {};
            authCache.userId = null;
            authCache.lastFetch = 0;
            
            setState(prev => ({
              ...prev,
              user: null,
              profile: null,
              permissions: {}
            }));
          }
        }
      }
    );
    
    // Initialize
    initializeAuth();
    
    return () => {
      mounted = false;
      subscription.unsubscribe();
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [fetchUserData, setLoadingState]);
  
  // Refresh user data function
  const refreshUserData = useCallback(async () => {
    if (state.user?.id) {
      await fetchUserData(state.user.id, true);
    }
  }, [state.user?.id, fetchUserData]);
  
  return {
    ...state,
    refreshUserData
  };
};
