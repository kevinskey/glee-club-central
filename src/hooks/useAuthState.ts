
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
  
  // Create fallback profile
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
  
  // Fetch user data with simplified error handling
  const fetchUserData = useCallback(async (userId: string) => {
    if (!mountedRef.current) return;
    
    console.log(`Fetching user data for: ${userId}`);
    
    let profile: Profile | null = null;
    let permissions = {};
    
    try {
      // Try to fetch profile quickly
      profile = await Promise.race([
        getProfile(userId),
        new Promise<null>((_, reject) => {
          setTimeout(() => reject(new Error('Profile timeout')), 800);
        })
      ]);
      console.log('Profile fetched:', profile);
    } catch (error) {
      console.warn('Profile fetch failed, using fallback:', error);
      profile = createFallbackProfile(userId);
    }
    
    try {
      // Try to fetch permissions quickly
      permissions = await Promise.race([
        fetchUserPermissions(userId),
        new Promise<{}>((_, reject) => {
          setTimeout(() => reject(new Error('Permissions timeout')), 500);
        })
      ]);
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
    console.log('Initializing auth state...');
    
    // Hard timeout for initialization
    const initTimeout = setTimeout(() => {
      console.log('Auth initialization timeout reached');
      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isInitialized: true
        }));
      }
    }, 1500); // Reduced to 1.5 seconds
    
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
            isLoading: false, // Set to false immediately for faster UX
            isInitialized: true
          }));
          
          clearTimeout(initTimeout);
          
          // Fetch additional data in background
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
            isLoading: false,
            isInitialized: true
          }));
          
          // Fetch additional data in background
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
      await fetchUserData(state.user.id);
    }
  }, [state.user?.id, fetchUserData]);
  
  return {
    ...state,
    refreshUserData
  };
};
