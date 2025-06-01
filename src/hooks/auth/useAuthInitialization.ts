
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
    console.log('🚀 useAuthInitialization: Starting simplified auth initialization...');
    
    let initComplete = false;
    
    const completeInit = (user: AuthUser | null = null) => {
      if (initComplete || !mountedRef.current) return;
      initComplete = true;
      
      console.log('✅ useAuthInitialization: Initialization complete with user:', user?.id);
      setState(prev => ({
        ...prev,
        user,
        isLoading: false,
        isInitialized: true
      }));
    };
    
    // Simple timeout - don't wait too long
    const timeout = setTimeout(() => {
      console.log('⏰ useAuthInitialization: Timeout reached, completing initialization');
      completeInit();
    }, 2000);
    
    const initialize = async () => {
      try {
        console.log('🔄 useAuthInitialization: Checking session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ useAuthInitialization: Session error:', error);
          completeInit();
          return;
        }
        
        if (session?.user && mountedRef.current) {
          console.log('✅ useAuthInitialization: Found valid session for:', session.user.id);
          
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            app_metadata: session.user.app_metadata,
            user_metadata: session.user.user_metadata,
            aud: session.user.aud,
            created_at: session.user.created_at
          };
          
          completeInit(authUser);
          
          // Background profile fetch - don't block initialization
          setTimeout(() => {
            if (mountedRef.current && !fetchingRef.current) {
              console.log('📡 useAuthInitialization: Background profile fetch');
              fetchUserData(session.user.id, session.user.email, session.user.user_metadata);
            }
          }, 200);
          
        } else {
          console.log('ℹ️ useAuthInitialization: No valid session found');
          completeInit();
        }
        
      } catch (error) {
        console.error('💥 useAuthInitialization: Error during initialization:', error);
        completeInit();
      }
    };
    
    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mountedRef.current) return;
        
        console.log('🔔 useAuthInitialization: Auth event:', {
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
          
          // Background profile fetch
          setTimeout(() => {
            if (mountedRef.current && !fetchingRef.current) {
              fetchUserData(session.user.id, session.user.email, session.user.user_metadata);
            }
          }, 200);
          
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
    
    // Start initialization
    initialize();
    
    return () => {
      console.log('🔄 useAuthInitialization: Cleanup');
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [setState, fetchUserData, mountedRef, fetchingRef]);
};
