
import { useAuth } from "@/contexts/AuthContext";
import { UserLevel } from "@/types/permissions";

export function useRoleLevels() {
  const { profile, isAdmin } = useAuth();
  
  const getUserLevel = (): UserLevel => {
    // Check for admin users first
    if (isAdmin()) {
      return 'admin';
    }
    
    // Default to member for all authenticated users
    return 'member';
  };
  
  const isGuestUser = (): boolean => {
    return false; // No more guest users in the simplified system
  };
  
  const isMemberUser = (): boolean => {
    return getUserLevel() === 'member';
  };
  
  const isAdminUser = (): boolean => {
    return getUserLevel() === 'admin';
  };
  
  return {
    getUserLevel,
    isGuestUser,
    isMemberUser,
    isAdminUser
  };
}
