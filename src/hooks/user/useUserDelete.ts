
import { useCallback } from 'react';
import { deleteUser as deleteUserUtil } from '@/utils/admin/userDelete';

interface UseUserDeleteResponse {
  deleteUser: (userId: string) => Promise<boolean>;
}

export const useUserDelete = (
  setUsers?: React.Dispatch<React.SetStateAction<any[]>>
): UseUserDeleteResponse => {
  const deleteUser = useCallback(async (userId: string) => {
    try {
      console.log(`Deleting user ${userId}`);
      
      // Use the utility function to mark the user as deleted
      const success = await deleteUserUtil(userId);
      
      if (success) {
        console.log('User marked as deleted successfully');
        
        // Update local state to remove the deleted user from the UI immediately
        if (setUsers) {
          setUsers(currentUsers => 
            currentUsers.map(user => 
              user.id === userId 
                ? { ...user, status: 'deleted' }
                : user
            )
          );
        }
        
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error('Unexpected error deleting user:', err);
      return false;
    }
  }, [setUsers]);

  return { deleteUser };
};
