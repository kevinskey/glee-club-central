
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
    calendar: true,
    profile: true,
  },
  
  setLoading: (key, loading) => {
    set(state => {
      const newState = {
        ...state.loadingStates,
        [key]: loading
      };
      
      console.log(`Loading coordinator: ${key} = ${loading}`, newState);
      
      return {
        loadingStates: newState
      };
    });
  },
  
  isAnyLoading: () => {
    const states = get().loadingStates;
    return Object.values(states).some(loading => loading);
  },
  
  isReady: () => {
    const states = get().loadingStates;
    const ready = Object.values(states).every(loading => !loading);
    
    if (ready) {
      console.log('Loading coordinator: All systems ready');
    }
    
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
        calendar: true,
        profile: true,
      }
    });
  }
}));
