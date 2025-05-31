
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
  
  // Fetch user data function
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
        permissions
      }));
      
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, []);
  
  // Initialize auth state
  useEffect(() => {
    if (initializationRef.current) return;
    initializationRef.current = true;
    
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth state...');
        
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
          
          setState(prev => ({ 
            ...prev, 
            user: authUser,
            isLoading: false,
            isInitialized: true
          }));
          
          // Fetch additional user data
          await fetchUserData(session.user.id);
        } else {
          setState(prev => ({
            ...prev,
            user: null,
            profile: null,
            permissions: {},
            isLoading: false,
            isInitialized: true
          }));
        }
        
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setState(prev => ({ 
            ...prev, 
            isLoading: false,
            isInitialized: true
          }));
        }
      }
    };
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state change:', event);
        
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
          
          // Fetch user data
          setTimeout(() => {
            if (mounted) {
              fetchUserData(session.user.id);
            }
          }, 100);
          
        } else if (event === 'SIGNED_OUT') {
          setState(prev => ({
            ...prev,
            user: null,
            profile: null,
            permissions: {},
            isLoading: false,
            isInitialized: true
          }));
        }
      }
    );
    
    // Initialize
    initializeAuth();
    
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserData]);
  
  // Refresh user data function
  const refreshUserData = useCallback(async () => {
    if (state.user?.id) {
      await fetchUserData(state.user.id);
    }
  }, [state.user?.id, fetchUserData]);
  
  return {
    ...state,
    refreshUserData
  };
};
