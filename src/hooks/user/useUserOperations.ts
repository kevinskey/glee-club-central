
import { useState } from "react";
import { toast } from "sonner";
import { updateUserRole, updateUserStatus } from "@/utils/supabase/users";
import { User } from "./useUserData";

export function useUserOperations(
  users: User[], 
  setUsers: React.Dispatch<React.SetStateAction<User[]>>,
  selectedUser: User | null,
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>
) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Update user state after a successful operation
   */
  const updateUserState = (userId: string, updates: Partial<User>) => {
    // Update users list
    setUsers(users.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    ));
    
    // Update selected user if it's the one being modified
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser({ ...selectedUser, ...updates });
    }
  };

  /**
   * Handle operation errors
   */
  const handleOperationError = (error: any, message: string) => {
    const errorMessage = error.message || message;
    setError(errorMessage);
    toast.error(errorMessage);
    return false;
  };

  /**
   * Update user role
   */
  const changeUserRole = async (userId: string, role: string) => {
    setIsUpdating(true);
    setError(null);
    try {
      const success = await updateUserRole(userId, role);
      if (success) {
        toast.success(`User role updated to ${role}`);
        updateUserState(userId, { role });
        return true;
      } else {
        throw new Error("Failed to update user role");
      }
    } catch (err: any) {
      return handleOperationError(err, "Failed to update user role");
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Update user status
   */
  const changeUserStatus = async (userId: string, status: string) => {
    setIsUpdating(true);
    setError(null);
    try {
      const success = await updateUserStatus(userId, status);
      if (success) {
        toast.success(`User status updated to ${status}`);
        updateUserState(userId, { status });
        return true;
      } else {
        throw new Error("Failed to update user status");
      }
    } catch (err: any) {
      return handleOperationError(err, "Failed to update user status");
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Activate a pending user
   */
  const activateUser = async (userId: string) => {
    return await changeUserStatus(userId, 'active');
  };

  return {
    isUpdating,
    error,
    changeUserRole,
    changeUserStatus,
    activateUser
  };
}
