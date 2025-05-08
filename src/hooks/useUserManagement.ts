
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { fetchAllUsers, updateUserRole, updateUserStatus, fetchUserById, UserSafe } from "@/utils/supabase/users";

export type User = UserSafe;

export function useUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all users - using useCallback to prevent unnecessary re-renders
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAllUsers();
      console.log("Fetched users data:", data); // Debug log
      setUsers(data as User[]);
    } catch (err: any) {
      setError(err.message || "Failed to load users");
      toast.error("Failed to load users");
      // Still set users to empty array on error to prevent UI from being stuck
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load users on mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Get user details
  const getUserDetails = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await fetchUserById(userId);
      setSelectedUser(user as User);
      return user;
    } catch (err: any) {
      setError(err.message || "Failed to load user details");
      toast.error("Failed to load user details");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update user role
  const changeUserRole = async (userId: string, role: string) => {
    setIsUpdating(true);
    setError(null);
    try {
      const success = await updateUserRole(userId, role);
      if (success) {
        toast.success(`User role updated to ${role}`);
        
        // Update local state
        setUsers(users.map(user => 
          user.id === userId ? { ...user, role } : user
        ));
        
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser({ ...selectedUser, role });
        }
        
        return true;
      } else {
        throw new Error("Failed to update user role");
      }
    } catch (err: any) {
      setError(err.message || "Failed to update user role");
      toast.error("Failed to update user role");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Update user status
  const changeUserStatus = async (userId: string, status: string) => {
    setIsUpdating(true);
    setError(null);
    try {
      const success = await updateUserStatus(userId, status);
      if (success) {
        toast.success(`User status updated to ${status}`);
        
        // Update local state
        setUsers(users.map(user => 
          user.id === userId ? { ...user, status } : user
        ));
        
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser({ ...selectedUser, status });
        }
        
        return true;
      } else {
        throw new Error("Failed to update user status");
      }
    } catch (err: any) {
      setError(err.message || "Failed to update user status");
      toast.error("Failed to update user status");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Activate a pending user
  const activateUser = async (userId: string) => {
    return await changeUserStatus(userId, 'active');
  };

  // Format voice part for display - now we can use the voice_part_display field from database
  const formatVoicePart = (voicePart: string | null): string => {
    if (!voicePart) return "Not set";
    return voicePart;
  };

  return {
    users,
    selectedUser,
    setSelectedUser,
    isLoading,
    isUpdating,
    error,
    fetchUsers,
    getUserDetails,
    changeUserRole,
    changeUserStatus,
    activateUser,
    formatVoicePart
  };
}
