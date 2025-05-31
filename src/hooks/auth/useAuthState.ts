
import { useState, useEffect, useCallback, useRef } from 'react';
import { AuthState, UseAuthStateReturn } from './types';
import { useAuthInitialization } from './useAuthInitialization';
import { useUserDataFetching } from './useUserDataFetching';

export const useAuthState = (): UseAuthStateReturn => {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
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
