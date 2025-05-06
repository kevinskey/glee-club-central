
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { fetchAllUsers, updateUserRole, updateUserStatus, fetchUserById } from "@/utils/supabaseQueries";

export type User = {
  id: string;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  role: string;
  voice_part?: string | null;
  avatar_url?: string | null;
  status: string;
  section_id?: string | null;
  join_date?: string | null;
  created_at?: string;
  last_sign_in_at?: string | null;
};

export function useUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all users
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAllUsers();
      setUsers(data as User[]);
    } catch (err: any) {
      setError(err.message || "Failed to load users");
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  // Load users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

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

  // Format voice part for display
  const formatVoicePart = (voicePart: string | null): string => {
    if (!voicePart) return "Not set";
    
    switch (voicePart) {
      case "soprano_1": return "Soprano 1";
      case "soprano_2": return "Soprano 2";
      case "alto_1": return "Alto 1";
      case "alto_2": return "Alto 2";
      case "tenor": return "Tenor";
      case "bass": return "Bass";
      default: return voicePart;
    }
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
    formatVoicePart
  };
}
