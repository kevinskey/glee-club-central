
import { useState, useEffect, useCallback, useRef } from 'react';
import { AuthState, UseAuthStateReturn } from './types';
import { useAuthInitialization } from './useAuthInitialization';
import { useUserDataFetching } from './useUserDataFetching';

export const useAuthState = (): UseAuthStateReturn => {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: false, // Start with false to prevent loading flicker
    isInitialized: false,
    permissions: {}
  });
  
  const mountedRef = useRef(true);
  const initializationRef = useRef(false);
  
  const { fetchUserData } = useUserDataFetching(setState, mountedRef);
  
  // Only initialize once
  useEffect(() => {
    if (initializationRef.current) return;
    initializationRef.current = true;
    
    // Set loading only when actually starting initialization
    setState(prev => ({ ...prev, isLoading: true }));
  }, []);
  
  useAuthInitialization(setState, fetchUserData, mountedRef);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);
  
  // Enhanced refresh function with coordination
  const refreshUserData = useCallback(async () => {
    if (state.user?.id && mountedRef.current) {
      console.log('🔄 useAuthState: Coordinated refresh for user:', state.user.id);
      
      // Set loading state during refresh
      setState(prev => ({
        ...prev,
        isLoading: true
      }));
      
      try {
        await fetchUserData(state.user.id, state.user.email);
      } catch (error) {
        console.error('❌ useAuthState: Refresh failed:', error);
        // Ensure loading state is cleared even on error
        setState(prev => ({
          ...prev,
          isLoading: false
        }));
      }
    }
  }, [state.user?.id, state.user?.email, fetchUserData]);
  
  return {
    ...state,
    refreshUserData
  };
};
