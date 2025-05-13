
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchUserPermissions, updateUserTitle } from '@/utils/supabase/permissions';
import { PermissionName, UserTitle } from '@/types/permissions';

// Define explicit return type to avoid deep instantiation
interface UsePermissionsReturn {
  permissions: string[];
  userTitle: UserTitle | null;
  hasPermission: (permission: PermissionName) => boolean;
  isLoading: boolean;
  error: Error | null;
  updateTitle: (userId: string, title: UserTitle) => Promise<void>;
}

export function usePermissions(): UsePermissionsReturn {
  const { session, profile } = useAuth();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [userTitle, setUserTitle] = useState<UserTitle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Reset state when session changes
    setPermissions([]);
    setUserTitle(null);
    setIsLoading(true);
    setError(null);

    async function fetchPermissions() {
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const userId = session.user.id;
        const { permissions: userPermissions, title } = await fetchUserPermissions(userId);
        
        setPermissions(userPermissions || []);
        setUserTitle(title as UserTitle);
      } catch (err) {
        console.error("Error fetching permissions:", err);
        setError(err instanceof Error ? err : new Error("Failed to fetch permissions"));
      } finally {
        setIsLoading(false);
      }
    }

    fetchPermissions();
  }, [session]);

  const hasPermission = (permission: PermissionName): boolean => {
    // Admin bypass - always has permissions
    if (permissions.includes('admin')) {
      return true;
    }
    
    // Regular permission check
    return permissions.includes(permission);
  };
  
  const updateTitle = async (userId: string, title: UserTitle): Promise<void> => {
    try {
      await updateUserTitle(userId, title);
      if (userId === session?.user?.id) {
        setUserTitle(title);
      }
    } catch (err) {
      console.error("Error updating user title:", err);
      throw err;
    }
  };

  return { 
    permissions, 
    userTitle, 
    hasPermission, 
    isLoading, 
    error, 
    updateTitle 
  };
}
