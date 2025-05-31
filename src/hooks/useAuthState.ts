
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
  
  const mountedRef = useRef(true);
  const initializationRef = useRef(false);
  
  // Create fallback profile when fetch fails
  const createFallbackProfile = useCallback((userId: string): Profile => ({
    id: userId,
    first_name: 'User',
    last_name: '',
    role: 'member',
    status: 'active',
    is_super_admin: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }), []);
  
  // Simplified fetch user data function
  const fetchUserData = useCallback(async (userId: string) => {
    if (!mountedRef.current) return;
    
    console.log(`Fetching user data for: ${userId}`);
    
    // Set basic state first
    setState(prev => ({ 
      ...prev, 
      isLoading: true,
      isInitialized: true 
    }));
    
    let profile: Profile | null = null;
    let permissions = {};
    
    try {
      // Quick profile fetch with timeout
      const profilePromise = getProfile(userId);
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Profile timeout')), 1000);
      });
      
      profile = await Promise.race([profilePromise, timeoutPromise]);
      console.log('Profile fetched:', profile);
    } catch (error) {
      console.warn('Profile fetch failed, using fallback:', error);
      profile = createFallbackProfile(userId);
    }
    
    try {
      // Quick permissions fetch
      const permissionsPromise = fetchUserPermissions(userId);
      const permissionsTimeout = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Permissions timeout')), 500);
      });
      
      permissions = await Promise.race([permissionsPromise, permissionsTimeout]);
      console.log('Permissions fetched:', permissions);
    } catch (error) {
      console.warn('Permissions fetch failed, using defaults:', error);
      permissions = {
        'view_sheet_music': true,
        'view_calendar': true,
        'view_announcements': true
      };
    }
    
    if (mountedRef.current) {
      setState(prev => ({
        ...prev,
        profile,
        permissions,
        isLoading: false,
        isInitialized: true
      }));
    }
  }, [createFallbackProfile]);
  
  // Initialize auth state
  useEffect(() => {
    if (initializationRef.current) return;
    initializationRef.current = true;
    
    console.log('Initializing auth state...');
    
    // Set hard timeout for initialization
    const initTimeout = setTimeout(() => {
      console.log('Auth initialization timeout reached');
      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isInitialized: true
        }));
      }
    }, 2000);
    
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          clearTimeout(initTimeout);
          setState({
            user: null,
            profile: null,
            permissions: {},
            isLoading: false,
            isInitialized: true
          });
          return;
        }
        
        if (session?.user && mountedRef.current) {
          console.log('Found session for user:', session.user.id);
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
          
          clearTimeout(initTimeout);
          
          // Defer data fetching to prevent blocking
          setTimeout(() => {
            if (mountedRef.current) {
              fetchUserData(session.user.id);
            }
          }, 0);
        } else {
          console.log('No session found');
          clearTimeout(initTimeout);
          setState({
            user: null,
            profile: null,
            permissions: {},
            isLoading: false,
            isInitialized: true
          });
        }
        
      } catch (error) {
        console.error('Auth initialization error:', error);
        clearTimeout(initTimeout);
        if (mountedRef.current) {
          setState({
            user: null,
            profile: null,
            permissions: {},
            isLoading: false,
            isInitialized: true
          });
        }
      }
    };
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mountedRef.current) return;
        
        console.log('Auth state change:', event, session?.user?.id);
        
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
          
          // Defer data fetching
          setTimeout(() => {
            if (mountedRef.current) {
              fetchUserData(session.user.id);
            }
          }, 0);
          
        } else if (event === 'SIGNED_OUT') {
          setState({
            user: null,
            profile: null,
            permissions: {},
            isLoading: false,
            isInitialized: true
          });
        }
      }
    );
    
    initializeAuth();
    
    return () => {
      mountedRef.current = false;
      clearTimeout(initTimeout);
      subscription.unsubscribe();
    };
  }, [fetchUserData]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);
  
  // Refresh user data function
  const refreshUserData = useCallback(async () => {
    if (state.user?.id && mountedRef.current) {
      setState(prev => ({ ...prev, isLoading: true }));
      await fetchUserData(state.user.id);
    }
  }, [state.user?.id, fetchUserData]);
  
  return {
    ...state,
    refreshUserData
  };
};
