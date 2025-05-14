
import { useState } from 'react';
import { User } from './types';
import { useUsers } from './useUsers';
import { useUserUpdate } from './useUserUpdate';
import { useUserCreate } from './useUserCreate';
import { useUserDelete } from './useUserDelete';

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
  
  // Create a wrapper function for refreshUsers
  const refreshUsers = async () => {
    const fetchedUsers = await fetchUsers();
    if (fetchedUsers) {
      setUsers(fetchedUsers);
      return fetchedUsers;
    }
    return [];
  };
  
  const { updateUser, updateUserStatus } = useUserUpdate(refreshUsers);
  const { addUser } = useUserCreate(setUsers);
  const { deleteUser } = useUserDelete(setUsers);
  
  // Initialize users from the useUsers hook if not loaded yet
  if (users.length === 0 && !isLoading) {
    fetchUsers().then(fetchedUsers => {
      if (fetchedUsers) {
        setUsers(fetchedUsers);
      }
    });
  }

  return {
    users,
    isLoading,
    error,
    fetchUsers,
    refreshUsers,
    deleteUser,
    getUserCount,
    userCount,
    getUserById,
    updateUser,
    updateUserStatus,
    addUser
  };
};
