
import { Profile } from '@/types/auth';

// Define the User type to match what profile components expect
export interface User extends Omit<Profile, 'created_at'> {
  // Adding created_at as required to match Profile
  created_at: string;
  // Additional fields that might be needed by the components but not in Profile
  email?: string | null;
  last_sign_in_at?: string | null;
}

// Simple hook to provide the User type
export const useUserManagement = () => {
  return {
    users: [] as User[],
    isLoading: false,
    error: null,
    fetchUsers: async () => {},
    updateUser: async () => {},
    deleteUser: async () => {},
  };
};
