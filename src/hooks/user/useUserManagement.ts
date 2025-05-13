
import { useState } from 'react';
import { User } from './types';
import { useUsers } from './useUsers';
import { useUserUpdate } from './useUserUpdate';
import { useUserCreate } from './useUserCreate';
import { useUserDelete } from './useUserDelete';
import { createMemberRefreshFunction } from '@/components/members/MembersPageRefactor';

// Re-export the User type
export type { User };

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  
  // Use the individual hooks
  const { 
    fetchUsers, 
    isLoading, 
    error, 
    userCount,
    getUserCount,
    getUserById
  } = useUsers();
  
  // Create a wrapper function for refreshUsers that returns void
  const refreshUsers = createMemberRefreshFunction(fetchUsers);
  
  const { updateUser, updateUserStatus } = useUserUpdate(fetchUsers);
  const { addUser } = useUserCreate(setUsers);
  const { deleteUser } = useUserDelete(setUsers);
  
  // Initialize users from the useUsers hook
  if (users.length === 0) {
    fetchUsers().then(fetchedUsers => {
      setUsers(fetchedUsers);
    });
  }

  return {
    users,
    isLoading,
    error,
    fetchUsers,
    deleteUser,
    getUserCount,
    userCount,
    getUserById,
    updateUser,
    updateUserStatus,
    addUser
  };
};
