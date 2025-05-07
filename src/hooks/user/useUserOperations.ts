
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
    console.log(`Updating user state for ${userId} with:`, updates);
    
    // Update users list
    setUsers(prevUsers => prevUsers.map(user => 
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
      console.log(`useUserOperations: Changing role for user ${userId} to ${role}`);
      const success = await updateUserRole(userId, role);
      if (success) {
        // Update local state with the new role and appropriate display name
        const roleDisplayName = getDisplayRole(role);
        console.log(`Role updated successfully to ${role}, display name: ${roleDisplayName}`);
        
        updateUserState(userId, { 
          role,
          role_display_name: roleDisplayName
        });
        toast.success(`User role updated to ${roleDisplayName}`);
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
   * Get display name for role
   */
  const getDisplayRole = (role: string): string => {
    switch (role) {
      case "administrator": return "Administrator";
      case "section_leader": return "Section Leader";
      case "singer": return "Singer";
      case "student_conductor": return "Student Conductor";
      case "accompanist": return "Accompanist";
      case "non_singer": return "Non-Singer";
      default: return role.charAt(0).toUpperCase() + role.slice(1).replace(/_/g, ' ');
    }
  };

  /**
   * Update user status
   */
  const changeUserStatus = async (userId: string, status: string) => {
    setIsUpdating(true);
    setError(null);
    try {
      console.log(`Changing status for user ${userId} to ${status}`);
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
