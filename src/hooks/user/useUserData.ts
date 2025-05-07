
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { fetchAllUsers, fetchUserById } from '@/utils/supabase/users';

export type User = {
  id: string;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  role: string;
  role_display_name?: string | null;
  voice_part?: string | null;
  voice_part_display?: string | null;
  avatar_url?: string | null;
  status: string;
  join_date?: string | null;
  created_at?: string;
  last_sign_in_at?: string | null;
  class_year?: string | null;
  dues_paid?: boolean | null;
  notes?: string | null;
  special_roles?: string | null;
};

export function useUserData() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use memoized fetchUsers to prevent unnecessary re-renders
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAllUsers();
      console.log("Fetched users data:", data); // Debug log
      
      // Ensure role_display_name is populated if missing
      const processedData = data.map((user: User) => {
        if (!user.role_display_name) {
          user.role_display_name = formatRoleDisplayName(user.role);
        }
        return user;
      });
      
      setUsers(processedData as User[]);
    } catch (err: any) {
      setError(err.message || "Failed to load users");
      toast.error("Failed to load users");
      // Still set users to empty array on error to prevent UI from being stuck
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Format role display name if not provided by the database
  const formatRoleDisplayName = (role: string): string => {
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

  // Get user details with memoized callback
  const getUserDetails = useCallback(async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await fetchUserById(userId);
      
      // Ensure role_display_name is populated if missing
      if (user && !user.role_display_name) {
        user.role_display_name = formatRoleDisplayName(user.role);
      }
      
      setSelectedUser(user as User);
      return user;
    } catch (err: any) {
      setError(err.message || "Failed to load user details");
      toast.error("Failed to load user details");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load users on mount only once
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    setUsers,
    selectedUser,
    setSelectedUser,
    isLoading,
    error,
    fetchUsers,
    getUserDetails
  };
}
