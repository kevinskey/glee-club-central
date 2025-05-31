
import { AuthUser, Profile } from '@/types/auth';

export interface AuthState {
  user: AuthUser | null;
  profile: Profile | null;
  isLoading: boolean;
  isInitialized: boolean;
  permissions: { [key: string]: boolean };
}

export interface UseAuthStateReturn extends AuthState {
  refreshUserData: () => Promise<void>;
}
