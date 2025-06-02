
import { useState, useCallback } from 'react';
import { User } from './types';
import { userManagementService } from '@/services/userManagement';
import { UserFormValues } from '@/components/members/form/userFormSchema';
import { toast } from 'sonner';

interface UseUserManagementReturn {
  users: User[];
  isLoading: boolean;
  error: string | null;
  refreshUsers: () => Promise<void>;
  updateUser: (userId: string, userData: Partial<User>) => Promise<boolean>;
  addUser: (userData: UserFormValues) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
}

export const useUserManagement = (): UseUserManagementReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedUsers = await userManagementService.getUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (userId: string, userData: Partial<User>): Promise<boolean> => {
    try {
      // Filter out email field since it's not in the profiles table
      const { email, ...profileData } = userData as any;
      
      console.log('Updating user with data:', profileData);
      const success = await userManagementService.updateUser(userId, profileData);
      
      if (success) {
        await refreshUsers();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating user:', err);
      toast.error('Failed to update user');
      return false;
    }
  }, [refreshUsers]);

  const addUser = useCallback(async (userData: UserFormValues): Promise<boolean> => {
    try {
      const success = await userManagementService.createUser(userData);
      
      if (success) {
        await refreshUsers();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error adding user:', err);
      toast.error('Failed to add user');
      return false;
    }
  }, [refreshUsers]);

  const deleteUser = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const success = await userManagementService.deleteUser(userId);
      
      if (success) {
        await refreshUsers();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error('Failed to delete user');
      return false;
    }
  }, [refreshUsers]);

  return {
    users,
    isLoading,
    error,
    refreshUsers,
    updateUser,
    addUser,
    deleteUser,
  };
};

// Export the User type for convenience
export type { User };
