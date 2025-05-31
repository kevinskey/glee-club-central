
import { create } from 'zustand';

interface LoadingState {
  auth: boolean;
  permissions: boolean;
  calendar: boolean;
  profile: boolean;
}

interface LoadingCoordinator {
  loadingStates: LoadingState;
  setLoading: (key: keyof LoadingState, loading: boolean) => void;
  isAnyLoading: () => boolean;
  isReady: () => boolean;
  reset: () => void;
  getLoadingStates: () => LoadingState;
}

export const useLoadingCoordinator = create<LoadingCoordinator>((set, get) => ({
  loadingStates: {
    auth: true,
    permissions: true,
    calendar: false, // Changed to false to reduce initial loading
    profile: true,
  },
  
  setLoading: (key, loading) => {
    set(state => {
      const newState = {
        ...state.loadingStates,
        [key]: loading
      };
      
      // Only log significant state changes to reduce noise
      if (state.loadingStates[key] !== loading) {
        console.log(`Loading coordinator: ${key} = ${loading}`);
      }
      
      return {
        loadingStates: newState
      };
    });
  },
  
  isAnyLoading: () => {
    const states = get().loadingStates;
    // Only consider auth and permissions as critical for readiness
    return states.auth || states.permissions;
  },
  
  isReady: () => {
    const states = get().loadingStates;
    // Only check critical states for readiness
    const ready = !states.auth && !states.permissions && !states.profile;
    
    return ready;
  },
  
  getLoadingStates: () => {
    return get().loadingStates;
  },
  
  reset: () => {
    console.log('Loading coordinator: Resetting all states');
    set({
      loadingStates: {
        auth: true,
        permissions: true,
        calendar: false,
        profile: true,
      }
    });
  }
}));
