
import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser } from '@/types/auth';
import { AuthState } from './types';

export const useAuthInitialization = (
  setState: React.Dispatch<React.SetStateAction<AuthState>>,
  fetchUserData: (userId: string) => Promise<void>,
  mountedRef: React.MutableRefObject<boolean>
) => {
  const initTimeoutRef = useRef<NodeJS.Timeout>();

  const initializeAuth = useCallback(async () => {
    try {
      console.log('Getting current session...');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session error:', error);
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
          isLoading: false,
          isInitialized: true
        }));
        
        if (initTimeoutRef.current) clearTimeout(initTimeoutRef.current);
        
        // Fetch additional data in background
        setTimeout(() => {
          if (mountedRef.current) {
            fetchUserData(session.user.id);
          }
        }, 100);
      } else {
        console.log('No session found');
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
      console.error('Auth initialization error:', error);
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
  }, [setState, fetchUserData, mountedRef]);

  // Initialize auth state
  useEffect(() => {
    console.log('Initializing auth state...');
    
    // Clear any existing timeout
    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current);
    }
    
    // Hard timeout for initialization
    initTimeoutRef.current = setTimeout(() => {
      console.log('Auth initialization timeout reached');
      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isInitialized: true
        }));
      }
    }, 10000); // 10 second timeout
    
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
          }, 100);
          
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
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
      subscription.unsubscribe();
    };
  }, [initializeAuth]);

  return { initTimeoutRef };
};
