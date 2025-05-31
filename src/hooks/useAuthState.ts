
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
  const mountedRef = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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
  
  // Simplified fetch user data function with better error handling
  const fetchUserData = useCallback(async (userId: string) => {
    if (!mountedRef.current) return;
    
    try {
      console.log(`Fetching user data for: ${userId}`);
      
      // Set a hard timeout for profile fetch
      let profile: Profile | null = null;
      try {
        const profilePromise = getProfile(userId);
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Profile fetch timeout')), 2000);
        });
        
        profile = await Promise.race([profilePromise, timeoutPromise]);
        console.log('Successfully fetched user profile:', profile);
      } catch (profileError) {
        console.warn('Profile fetch failed, using fallback:', profileError);
        profile = createFallbackProfile(userId);
      }
      
      // Fetch permissions with shorter timeout
      let permissions = {};
      try {
        const permissionsPromise = fetchUserPermissions(userId);
        const permissionsTimeout = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Permissions timeout')), 1500);
        });
        
        permissions = await Promise.race([permissionsPromise, permissionsTimeout]);
        console.log('Successfully fetched permissions:', permissions);
      } catch (permError) {
        console.warn('Failed to fetch permissions, using defaults:', permError);
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
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          profile: createFallbackProfile(userId),
          permissions: {
            'view_sheet_music': true,
            'view_calendar': true,
            'view_announcements': true
          },
          isLoading: false,
          isInitialized: true
        }));
      }
    }
  }, [createFallbackProfile]);
  
  // Initialize auth state with better timeout handling
  useEffect(() => {
    if (initializationRef.current) return;
    initializationRef.current = true;
    
    let authSubscription: any = null;
    
    // Set a maximum timeout for initialization
    timeoutRef.current = setTimeout(() => {
      console.log('Auth initialization timeout reached, setting initialized state');
      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isInitialized: true
        }));
      }
    }, 3000); // 3 second max timeout
    
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth state...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          setState({
            user: null,
            profile: null,
            permissions: {},
            isLoading: false,
            isInitialized: true
          });
          return;
        }
        
        if (!mountedRef.current) return;
        
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
            isLoading: true,
            isInitialized: true
          }));
          
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          await fetchUserData(session.user.id);
        } else {
          console.log('No existing session found');
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
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
        if (mountedRef.current) {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
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
    authSubscription = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mountedRef.current) return;
        
        console.log('Auth state change event:', event, 'user:', session?.user?.id);
        
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
          
          // Use setTimeout to prevent blocking
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
          
        } else if (event === 'SIGNED_OUT') {
          console.log('Processing SIGNED_OUT event');
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
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (authSubscription?.data?.subscription) {
        authSubscription.data.subscription.unsubscribe();
      }
    };
  }, [fetchUserData]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
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
