
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
  const fetchingRef = useRef(false); // Prevent concurrent fetches
  
  const { fetchUserData } = useUserDataFetching(setState, mountedRef, fetchingRef);
  
  useAuthInitialization(setState, fetchUserData, mountedRef, fetchingRef);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      fetchingRef.current = false;
    };
  }, []);
  
  // Enhanced refresh function with concurrency protection
  const refreshUserData = useCallback(async () => {
    if (state.user?.id && mountedRef.current && !fetchingRef.current) {
      console.log('🔄 useAuthState: Refreshing user data for:', state.user.id);
      
      fetchingRef.current = true;
      setState(prev => ({ ...prev, isLoading: true }));
      
      try {
        await fetchUserData(state.user.id, state.user.email);
      } catch (error) {
        console.error('❌ useAuthState: Refresh failed:', error);
        if (mountedRef.current) {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } finally {
        fetchingRef.current = false;
      }
    }
  }, [state.user?.id, state.user?.email, fetchUserData]);
  
  return {
    ...state,
    refreshUserData
  };
};
