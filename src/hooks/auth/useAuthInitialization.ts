
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser } from '@/types/auth';
import { AuthState } from './types';

export const useAuthInitialization = (
  setState: React.Dispatch<React.SetStateAction<AuthState>>,
  fetchUserData: (userId: string, userEmail?: string, userMetadata?: any) => Promise<void>,
  mountedRef: React.MutableRefObject<boolean>
) => {
  useEffect(() => {
    console.log('🚀 useAuthInitialization: Starting auth initialization...');
    
    const initializeAuth = async () => {
      try {
        console.log('🔄 useAuthInitialization: Getting current session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('🔄 useAuthInitialization: Session check result:', {
          hasSession: !!session,
          hasUser: !!session?.user,
          userId: session?.user?.id,
          userEmail: session?.user?.email,
          error: error?.message
        });
        
        if (error) {
          console.error('❌ useAuthInitialization: Session error:', error);
          if (mountedRef.current) {
            setState({
              user: null,
              profile: null,
              permissions: {},
              isLoading: false,
              isInitialized: true
            });
          }
          return;
        }
        
        if (session?.user && mountedRef.current) {
          console.log('✅ useAuthInitialization: Found session for user:', session.user.id);
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
          
          // Fetch profile data immediately with user metadata
          console.log('📡 useAuthInitialization: Fetching user profile data...');
          await fetchUserData(session.user.id, session.user.email, session.user.user_metadata);
        } else {
          console.log('ℹ️ useAuthInitialization: No session found');
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
        
      } catch (error) {
        console.error('💥 useAuthInitialization: Auth initialization error:', error);
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
        
        console.log('🔔 useAuthInitialization: Auth state change:', {
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
            isLoading: true, // Keep loading until profile is fetched
            isInitialized: true
          }));
          
          // Fetch profile data immediately after sign in with metadata
          console.log('📡 useAuthInitialization: Fetching profile after sign in...');
          await fetchUserData(session.user.id, session.user.email, session.user.user_metadata);
          
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 useAuthInitialization: User signed out');
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
    
    // Initialize auth
    initializeAuth();
    
    return () => {
      console.log('🔄 useAuthInitialization: Cleaning up auth state listener');
      subscription.unsubscribe();
    };
  }, [setState, fetchUserData, mountedRef]);
};
