
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
}

export const useLoadingCoordinator = create<LoadingCoordinator>((set, get) => ({
  loadingStates: {
    auth: true,
    permissions: true,
    calendar: true,
    profile: true,
  },
  
  setLoading: (key, loading) => {
    set(state => ({
      loadingStates: {
        ...state.loadingStates,
        [key]: loading
      }
    }));
  },
  
  isAnyLoading: () => {
    const states = get().loadingStates;
    return Object.values(states).some(loading => loading);
  },
  
  isReady: () => {
    const states = get().loadingStates;
    return Object.values(states).every(loading => !loading);
  },
  
  reset: () => {
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
