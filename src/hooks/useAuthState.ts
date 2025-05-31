
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
  const initTimeoutRef = useRef<NodeJS.Timeout>();
  
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
  
  // Fetch user data with improved error handling and debugging
  const fetchUserData = useCallback(async (userId: string) => {
    if (!mountedRef.current) return;
    
    console.log(`🔍 useAuthState: Fetching user data for: ${userId}`);
    
    let profile: Profile | null = null;
    let permissions = {};
    
    try {
      console.log('📋 useAuthState: Fetching profile...');
      // Fetch profile with timeout
      profile = await Promise.race([
        getProfile(userId),
        new Promise<null>((_, reject) => {
          setTimeout(() => reject(new Error('Profile timeout')), 5000);
        })
      ]);
      console.log('📋 useAuthState: Profile fetch result:', {
        hasProfile: !!profile,
        profileRole: profile?.role,
        profileIsAdmin: profile?.is_super_admin,
        profileStatus: profile?.status
      });
    } catch (error) {
      console.warn('⚠️ useAuthState: Profile fetch failed, using fallback:', error);
      profile = createFallbackProfile(userId);
    }
    
    try {
      console.log('🔑 useAuthState: Fetching permissions...');
      // Fetch permissions with timeout
      permissions = await Promise.race([
        fetchUserPermissions(userId),
        new Promise<{}>((_, reject) => {
          setTimeout(() => reject(new Error('Permissions timeout')), 3000);
        })
      ]);
      console.log('🔑 useAuthState: Permissions fetch result:', {
        permissionCount: Object.keys(permissions).length,
        permissions: Object.keys(permissions)
      });
    } catch (error) {
      console.warn('⚠️ useAuthState: Permissions fetch failed, using defaults:', error);
      permissions = {
        'view_sheet_music': true,
        'view_calendar': true,
        'view_announcements': true
      };
    }
    
    if (mountedRef.current) {
      console.log('✅ useAuthState: Updating state with fetched data');
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
    console.log('🚀 useAuthState: Initializing auth state...');
    
    // Clear any existing timeout
    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current);
    }
    
    // Hard timeout for initialization
    initTimeoutRef.current = setTimeout(() => {
      console.log('⏰ useAuthState: Auth initialization timeout reached');
      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isInitialized: true
        }));
      }
    }, 10000); // 10 second timeout
    
    const initializeAuth = async () => {
      try {
        console.log('🔄 useAuthState: Getting current session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('🔄 useAuthState: Session check result:', {
          hasSession: !!session,
          hasUser: !!session?.user,
          userId: session?.user?.id,
          userEmail: session?.user?.email,
          error: error?.message
        });
        
        if (error) {
          console.error('❌ useAuthState: Session error:', error);
          if (initTimeoutRef.current) clearTimeout(initTimeoutRef.current);
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
          console.log('✅ useAuthState: Found session for user:', session.user.id);
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
          
          if (initTimeoutRef.current) clearTimeout(initTimeoutRef.current);
          
          // Fetch additional data in background
          console.log('📡 useAuthState: Scheduling user data fetch...');
          setTimeout(() => {
            if (mountedRef.current) {
              fetchUserData(session.user.id);
            }
          }, 100);
        } else {
          console.log('ℹ️ useAuthState: No session found');
          if (initTimeoutRef.current) clearTimeout(initTimeoutRef.current);
          setState({
            user: null,
            profile: null,
            permissions: {},
            isLoading: false,
            isInitialized: true
          });
        }
        
      } catch (error) {
        console.error('💥 useAuthState: Auth initialization error:', error);
        if (initTimeoutRef.current) clearTimeout(initTimeoutRef.current);
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
        
        console.log('🔔 useAuthState: Auth state change:', {
          event,
          hasSession: !!session,
          userId: session?.user?.id,
          userEmail: session?.user?.email
        });
        
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
          console.log('📡 useAuthState: Scheduling user data fetch after sign in...');
          setTimeout(() => {
            if (mountedRef.current) {
              fetchUserData(session.user.id);
            }
          }, 100);
          
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 useAuthState: User signed out');
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
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
      subscription.unsubscribe();
    };
  }, [fetchUserData]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
    };
  }, []);
  
  // Refresh user data function
  const refreshUserData = useCallback(async () => {
    if (state.user?.id && mountedRef.current) {
      console.log('🔄 useAuthState: Refreshing user data for:', state.user.id);
      await fetchUserData(state.user.id);
    }
  }, [state.user?.id, fetchUserData]);
  
  return {
    ...state,
    refreshUserData
  };
};
