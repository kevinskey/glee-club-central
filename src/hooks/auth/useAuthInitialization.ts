
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser } from '@/types/auth';
import { AuthState } from './types';

export const useAuthInitialization = (
  setState: React.Dispatch<React.SetStateAction<AuthState>>,
  fetchUserData: (userId: string, userEmail?: string, userMetadata?: any) => Promise<void>,
  mountedRef: React.MutableRefObject<boolean>,
  fetchingRef: React.MutableRefObject<boolean>
) => {
  useEffect(() => {
    console.log('🚀 useAuthInitialization: Starting auth initialization...');
    
    let initializationComplete = false;
    
    const completeInitialization = (user: AuthUser | null = null) => {
      if (initializationComplete || !mountedRef.current) return;
      
      initializationComplete = true;
      console.log('✅ useAuthInitialization: Completing initialization with user:', user?.id);
      
      setState(prev => ({
        ...prev,
        user,
        isLoading: false,
        isInitialized: true
      }));
    };
    
    // Much shorter timeout - force completion quickly
    const forceTimeout = setTimeout(() => {
      console.log('⏰ useAuthInitialization: Force completing initialization after timeout');
      completeInitialization();
    }, 1000); // Reduced from 3000ms to 1000ms
    
    const initializeAuth = async () => {
      try {
        console.log('🔄 useAuthInitialization: Getting current session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ useAuthInitialization: Session error:', error);
          completeInitialization();
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
          
          completeInitialization(authUser);
          
          // Very quick background profile fetch
          setTimeout(() => {
            if (mountedRef.current && !fetchingRef.current) {
              console.log('📡 useAuthInitialization: Starting quick background profile fetch...');
              fetchUserData(session.user.id, session.user.email, session.user.user_metadata);
            }
          }, 100); // Reduced delay
          
        } else {
          console.log('ℹ️ useAuthInitialization: No session found');
          completeInitialization();
        }
        
      } catch (error) {
        console.error('💥 useAuthInitialization: Auth initialization error:', error);
        completeInitialization();
      }
    };
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mountedRef.current) return;
        
        console.log('🔔 useAuthInitialization: Auth state change:', {
          event,
          hasSession: !!session,
          userId: session?.user?.id
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
          
          // Quick background profile fetch after sign in
          setTimeout(() => {
            if (mountedRef.current && !fetchingRef.current) {
              fetchUserData(session.user.id, session.user.email, session.user.user_metadata);
            }
          }, 100); // Reduced delay
          
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 useAuthInitialization: User signed out');
          fetchingRef.current = false;
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
    
    // Initialize auth immediately
    initializeAuth();
    
    return () => {
      console.log('🔄 useAuthInitialization: Cleaning up auth state listener');
      clearTimeout(forceTimeout);
      subscription.unsubscribe();
    };
  }, [setState, fetchUserData, mountedRef, fetchingRef]);
};
