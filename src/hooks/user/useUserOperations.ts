
import { useState } from "react";
import { toast } from "sonner";
import { updateUserRole, updateUserStatus } from "@/utils/supabaseQueries";
import { User } from "./useUserData";

export function useUserOperations(
  users: User[], 
  setUsers: React.Dispatch<React.SetStateAction<User[]>>,
  selectedUser: User | null,
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>
) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          user.id === userId ? { 
            ...user, 
            role,
            // Update the role_display_name based on the new role value
            role_display_name: formatRoleDisplayName(role)
          } : user
        ));
        
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser({ 
            ...selectedUser, 
            role,
            role_display_name: formatRoleDisplayName(role) 
          });
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

  // Helper function to format role display names
  const formatRoleDisplayName = (role: string): string => {
    switch (role) {
      case 'administrator': return 'Administrator';
      case 'section_leader': return 'Section Leader';
      case 'singer': return 'Singer';
      case 'student_conductor': return 'Student Conductor';
      case 'accompanist': return 'Accompanist';
      case 'non_singer': return 'Non-Singer';
      case 'admin': return 'Administrator';
      case 'member': return 'Member';
      case 'Director': return 'Director';
      case 'Accompanist': return 'Accompanist';
      default: return role;
    }
  };

  // Activate a pending user
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
