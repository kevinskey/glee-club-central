
import { useState, useCallback, useRef } from 'react';

interface LoadingState {
  [key: string]: boolean;
}

export const useLoadingCoordinator = () => {
  const [loadingStates, setLoadingStates] = useState<LoadingState>({});
  const timeoutRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const setLoading = useCallback((key: string, isLoading: boolean, delay = 0) => {
    // Clear existing timeout for this key
    if (timeoutRef.current[key]) {
      clearTimeout(timeoutRef.current[key]);
    }

    if (delay > 0) {
      timeoutRef.current[key] = setTimeout(() => {
        setLoadingStates(prev => ({
          ...prev,
          [key]: isLoading
        }));
        delete timeoutRef.current[key];
      }, delay);
    } else {
      setLoadingStates(prev => ({
        ...prev,
        [key]: isLoading
      }));
    }
  }, []);

  const isAnyLoading = Object.values(loadingStates).some(Boolean);
  const isReady = !isAnyLoading;

  const clearLoading = useCallback((key: string) => {
    if (timeoutRef.current[key]) {
      clearTimeout(timeoutRef.current[key]);
      delete timeoutRef.current[key];
    }
    setLoadingStates(prev => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  }, []);

  return {
    loadingStates,
    isAnyLoading,
    isReady,
    setLoading,
    clearLoading
  };
};
