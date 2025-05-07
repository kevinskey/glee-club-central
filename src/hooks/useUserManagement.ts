
import { useState } from "react";
import { useUserData } from "./user/useUserData";
import { useUserOperations } from "./user/useUserOperations";
import { formatVoicePart } from "./user/userUtils";

export type { User } from "./user/useUserData";

export function useUserManagement() {
  const {
    users,
    selectedUser,
    setSelectedUser,
    isLoading,
    error: dataError,
    fetchUsers,
    getUserDetails
  } = useUserData();

  const {
    isUpdating,
    error: operationError,
    changeUserRole,
    changeUserStatus,
    activateUser
  } = useUserOperations(users, useState(users)[1], selectedUser, setSelectedUser);

  // Filter out users with 'deleted' status
  const activeUsers = users.filter(user => user.status !== 'deleted');

  return {
    // User data
    users: activeUsers,
    allUsers: users, // In case we need access to deleted users
    selectedUser,
    setSelectedUser,
    isLoading,
    isUpdating,
    error: dataError || operationError,
    
    // Data operations
    fetchUsers,
    getUserDetails,
    
    // User operations
    changeUserRole,
    changeUserStatus,
    activateUser,
    
    // Formatting utilities
    formatVoicePart
  };
}
