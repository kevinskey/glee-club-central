
import { useState, useEffect, useCallback, useRef } from 'react';
import { AuthState, UseAuthStateReturn } from './types';
import { useAuthInitialization } from './useAuthInitialization';
import { useUserDataFetching } from './useUserDataFetching';

export const useAuthState = (): UseAuthStateReturn => {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: false,
    isInitialized: false,
    permissions: {}
  });
  
  const mountedRef = useRef(true);
  
  const { fetchUserData } = useUserDataFetching(setState, mountedRef);
  
  useAuthInitialization(setState, fetchUserData, mountedRef);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);
  
  // Enhanced refresh function
  const refreshUserData = useCallback(async () => {
    if (state.user?.id && mountedRef.current) {
      console.log('🔄 useAuthState: Refreshing user data for:', state.user.id);
      
      setState(prev => ({ ...prev, isLoading: true }));
      
      try {
        await fetchUserData(state.user.id, state.user.email);
      } catch (error) {
        console.error('❌ useAuthState: Refresh failed:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    }
  }, [state.user?.id, state.user?.email, fetchUserData]);
  
  return {
    ...state,
    refreshUserData
  };
};
