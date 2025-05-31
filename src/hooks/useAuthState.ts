
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

export const useAuthState = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
    isInitialized: false,
    permissions: {}
  });
  
  const initializationRef = useRef(false);
  const isLoadingRef = useRef(true);
  
  // Fetch user data function - simplified and cached
  const fetchUserData = useCallback(async (userId: string) => {
    try {
      console.log('Fetching user data for:', userId);
      
      const [profile, permissions] = await Promise.all([
        getProfile(userId),
        fetchUserPermissions(userId)
      ]);
      
      setState(prev => ({
        ...prev,
        profile,
        permissions,
        isLoading: false
      }));
      
      isLoadingRef.current = false;
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      setState(prev => ({
        ...prev,
        isLoading: false
      }));
      isLoadingRef.current = false;
    }
  }, []);
  
  // Initialize auth state with better error handling
  useEffect(() => {
    if (initializationRef.current) return;
    initializationRef.current = true;
    
    let mounted = true;
    let authSubscription: any = null;
    
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth state...');
        
        // Get initial session with timeout
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session timeout')), 5000)
        );
        
        const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]) as any;
        
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
          
          setState(prev => ({ 
            ...prev, 
            user: authUser,
            isLoading: true, // Keep loading until profile is fetched
            isInitialized: true
          }));
          
          // Fetch additional user data
          await fetchUserData(session.user.id);
        } else {
          setState({
            user: null,
            profile: null,
            permissions: {},
            isLoading: false,
            isInitialized: true
          });
          isLoadingRef.current = false;
        }
        
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setState({
            user: null,
            profile: null,
            permissions: {},
            isLoading: false,
            isInitialized: true
          });
          isLoadingRef.current = false;
        }
      }
    };
    
    // Set up auth state listener with debouncing
    let authChangeTimeout: NodeJS.Timeout;
    
    authSubscription = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state change:', event);
        
        // Clear any pending auth changes
        if (authChangeTimeout) {
          clearTimeout(authChangeTimeout);
        }
        
        // Debounce auth state changes to prevent rapid updates
        authChangeTimeout = setTimeout(async () => {
          if (!mounted) return;
          
          if (event === 'SIGNED_IN' && session?.user) {
            const authUser: AuthUser = {
              id: session.user.id,
              email: session.user.email || '',
              app_metadata: session.user.app_metadata,
              user_metadata: session.user.user_metadata,
              aud: session.user.aud,
              created_at: session.user.created_at
            };
            
            setState(prev => ({ 
              ...prev, 
              user: authUser,
              isLoading: true,
              isInitialized: true
            }));
            
            // Defer user data fetching to prevent blocking
            setTimeout(() => {
              if (mounted) {
                fetchUserData(session.user.id);
              }
            }, 100);
            
          } else if (event === 'SIGNED_OUT') {
            setState({
              user: null,
              profile: null,
              permissions: {},
              isLoading: false,
              isInitialized: true
            });
            isLoadingRef.current = false;
          }
        }, 200); // Debounce by 200ms
      }
    );
    
    // Initialize
    initializeAuth();
    
    return () => {
      mounted = false;
      if (authChangeTimeout) {
        clearTimeout(authChangeTimeout);
      }
      if (authSubscription?.data?.subscription) {
        authSubscription.data.subscription.unsubscribe();
      }
    };
  }, [fetchUserData]);
  
  // Refresh user data function
  const refreshUserData = useCallback(async () => {
    if (state.user?.id && !isLoadingRef.current) {
      await fetchUserData(state.user.id);
    }
  }, [state.user?.id, fetchUserData]);
  
  return {
    ...state,
    refreshUserData
  };
};
