
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

  // Get user details with memoized callback
  const getUserDetails = useCallback(async (userId: string) => {
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
  }, []);

  // Load users on mount only once
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    selectedUser,
    setSelectedUser,
    isLoading,
    error,
    fetchUsers,
    getUserDetails
  };
}
