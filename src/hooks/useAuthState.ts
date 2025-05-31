
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
  const lastEventRef = useRef<string>('');
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();
  
  // Debug logging
  console.log('useAuthState current state:', {
    hasUser: !!state.user,
    hasProfile: !!state.profile,
    userRole: state.profile?.role,
    isAdmin: state.profile?.is_super_admin,
    isLoading: state.isLoading,
    isInitialized: state.isInitialized
  });
  
  // Fetch user data function - simplified and cached
  const fetchUserData = useCallback(async (userId: string) => {
    try {
      console.log('Fetching user data for:', userId);
      
      const [profile, permissions] = await Promise.all([
        getProfile(userId),
        fetchUserPermissions(userId)
      ]);
      
      console.log('Fetched user profile:', profile);
      
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
          console.log('Found existing session for user:', session.user.id);
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
          console.log('No existing session found');
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
    
    // Set up auth state listener with better debouncing
    authSubscription = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        // Prevent duplicate events
        const eventKey = `${event}-${session?.user?.id || 'null'}`;
        if (lastEventRef.current === eventKey) {
          console.log('Ignoring duplicate auth event:', event);
          return;
        }
        lastEventRef.current = eventKey;
        
        console.log('Auth state change event:', event, 'user:', session?.user?.id);
        
        // Clear any pending auth changes
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }
        
        // Debounce auth state changes to prevent rapid updates
        debounceTimeoutRef.current = setTimeout(async () => {
          if (!mounted) return;
          
          if (event === 'SIGNED_IN' && session?.user) {
            console.log('Processing SIGNED_IN event for user:', session.user.id);
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
            }, 200);
            
          } else if (event === 'SIGNED_OUT') {
            console.log('Processing SIGNED_OUT event');
            setState({
              user: null,
              profile: null,
              permissions: {},
              isLoading: false,
              isInitialized: true
            });
            isLoadingRef.current = false;
          }
        }, 300);
      }
    );
    
    // Initialize
    initializeAuth();
    
    return () => {
      mounted = false;
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
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
