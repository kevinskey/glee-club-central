
import { useState, useCallback, useRef } from 'react';

interface LoadingState {
  [key: string]: boolean;
}

export const useLoadingCoordinator = () => {
  const [loadingStates, setLoadingStates] = useState<LoadingState>({});
  const timeoutRef = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const debounceRef = useRef<NodeJS.Timeout>();

  const setLoading = useCallback((key: string, isLoading: boolean, delay = 0) => {
    // Clear existing timeout for this key
    if (timeoutRef.current[key]) {
      clearTimeout(timeoutRef.current[key]);
    }

    // Clear any pending debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const updateState = () => {
      setLoadingStates(prev => {
        const newState = { ...prev };
        if (isLoading) {
          newState[key] = true;
        } else {
          delete newState[key];
        }
        return newState;
      });
    };

    if (delay > 0) {
      timeoutRef.current[key] = setTimeout(() => {
        updateState();
        delete timeoutRef.current[key];
      }, delay);
    } else if (isLoading) {
      // Immediate loading state
      updateState();
    } else {
      // Much shorter debounce to prevent flickering
      debounceRef.current = setTimeout(() => {
        updateState();
      }, 50); // Reduced from 100ms to 50ms
    }
  }, []);

  const isAnyLoading = Object.values(loadingStates).some(Boolean);
  const isReady = !isAnyLoading;

  const clearLoading = useCallback((key: string) => {
    if (timeoutRef.current[key]) {
      clearTimeout(timeoutRef.current[key]);
      delete timeoutRef.current[key];
    }
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
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
