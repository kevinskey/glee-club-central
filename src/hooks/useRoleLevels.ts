
import { useAuth } from "@/contexts/AuthContext";
import { UserLevel } from "@/types/permissions";

export function useRoleLevels() {
  const { profile, isAdmin } = useAuth();
  
  const getUserLevel = (): UserLevel => {
    // Check for admin users first
    if (isAdmin()) {
      return 'admin';
    }
    
    // Check if profile has guest role
    if (profile?.role === 'guest') {
      return 'guest';
    }
    
    // Default to member for all other authenticated users
    return 'member';
  };
  
  const isGuestUser = (): boolean => {
    return getUserLevel() === 'guest';
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
