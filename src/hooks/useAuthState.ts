
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
  const profileFetchAttempts = useRef(0);
  const maxProfileAttempts = 3;
  
  // Debug logging
  console.log('useAuthState current state:', {
    hasUser: !!state.user,
    hasProfile: !!state.profile,
    userRole: state.profile?.role,
    isAdmin: state.profile?.is_super_admin,
    isLoading: state.isLoading,
    isInitialized: state.isInitialized,
    profileFetchAttempts: profileFetchAttempts.current
  });
  
  // Fetch user data function with improved retry logic
  const fetchUserData = useCallback(async (userId: string) => {
    if (!mountedRef.current) return;
    
    profileFetchAttempts.current += 1;
    
    try {
      console.log(`Fetching user data for: ${userId} (attempt ${profileFetchAttempts.current})`);
      
      // Try to fetch profile first
      let profile = null;
      try {
        profile = await getProfile(userId);
        console.log('Successfully fetched user profile:', profile);
      } catch (profileError) {
        console.error('Profile fetch failed:', profileError);
        
        // Only retry if we haven't exceeded max attempts
        if (profileFetchAttempts.current < maxProfileAttempts) {
          console.log('Retrying profile fetch in 2 seconds...');
          setTimeout(() => {
            if (mountedRef.current) {
              fetchUserData(userId);
            }
          }, 2000);
          return;
        }
        
        console.log('Max profile fetch attempts reached, using fallback');
        // Create a minimal fallback profile after max attempts
        profile = {
          id: userId,
          first_name: 'User',
          last_name: '',
          role: 'member',
          status: 'active',
          is_super_admin: false
        } as Profile;
      }
      
      // Fetch permissions in parallel
      let permissions = {};
      try {
        permissions = await fetchUserPermissions(userId);
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
          isLoading: false
        }));
      }
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (mountedRef.current) {
        // Set minimal state even on error
        setState(prev => ({
          ...prev,
          profile: {
            id: userId,
            first_name: 'User',
            last_name: '',
            role: 'member',
            status: 'active',
            is_super_admin: false
          } as Profile,
          permissions: {
            'view_sheet_music': true,
            'view_calendar': true,
            'view_announcements': true
          },
          isLoading: false
        }));
      }
    }
  }, []);
  
  // Initialize auth state
  useEffect(() => {
    if (initializationRef.current) return;
    initializationRef.current = true;
    
    let authSubscription: any = null;
    
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth state...');
        
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
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
            isLoading: true, // Keep loading until profile is fetched
            isInitialized: true
          }));
          
          // Reset attempts for existing session
          profileFetchAttempts.current = 0;
          
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
        }
        
      } catch (error) {
        console.error('Auth initialization error:', error);
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
          
          // Reset fetch attempts for new user
          profileFetchAttempts.current = 0;
          
          setState(prev => ({ 
            ...prev, 
            user: authUser,
            isLoading: true,
            isInitialized: true
          }));
          
          // Fetch user data
          await fetchUserData(session.user.id);
          
        } else if (event === 'SIGNED_OUT') {
          console.log('Processing SIGNED_OUT event');
          profileFetchAttempts.current = 0;
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
    
    // Initialize
    initializeAuth();
    
    return () => {
      mountedRef.current = false;
      if (authSubscription?.data?.subscription) {
        authSubscription.data.subscription.unsubscribe();
      }
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
      profileFetchAttempts.current = 0; // Reset attempts on manual refresh
      await fetchUserData(state.user.id);
    }
  }, [state.user?.id, fetchUserData]);
  
  return {
    ...state,
    refreshUserData
  };
};
