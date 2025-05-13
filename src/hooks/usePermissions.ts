
import { useAuth } from '@/contexts/AuthContext';
import { useRolePermissions } from '@/contexts/RolePermissionContext';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PermissionName } from '@/types/permissions';

// Define explicit interface for the hook's return value
interface UsePermissionsReturn {
  hasPermission: (permissionName: string) => boolean;
  isSuperAdmin: boolean;
  isAdminRole: boolean;
  promoteToSuperAdmin: () => Promise<boolean>;
  setKevinJohnsonAsSuperAdmin: (email: string) => Promise<boolean>;
  isUpdating: boolean;
}

export function usePermissions(): UsePermissionsReturn {
  const { profile, isAdmin } = useAuth();
  const { permissions, hasPermission: contextHasPermission, refreshPermissions } = useRolePermissions();
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Get permission by name, using the context's hasPermission function
  const hasPermission = (permissionName: string): boolean => {
    // If user has no permissions loaded or if permissions is null, deny access
    if (!permissions) return false;
    
    // If user is a super admin, grant all permissions
    if (profile?.is_super_admin) return true;
    
    // If user has an admin-like role, grant all permissions
    if (profile?.role === 'admin' || 
        profile?.role === 'administrator' || 
        profile?.role === 'director') {
      return true;
    }
    
    // Otherwise, check if the specific permission is granted
    return contextHasPermission(permissionName);
  };
  
  // Check if the user is a super admin
  const isSuperAdmin = Boolean(profile?.is_super_admin);
  
  // Check if the user has an admin-like role
  const isAdminRole = Boolean(
    profile?.role === 'admin' || 
    profile?.role === 'administrator' ||
    profile?.role === 'director'
  );
  
  // Development function to promote current user to super admin
  const promoteToSuperAdmin = async (): Promise<boolean> => {
    if (!profile?.id) {
      toast.error("You must be logged in to use this function");
      return false;
    }
    
    setIsUpdating(true);
    try {
      // Update the profile to make user a super admin
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_super_admin: true,
          title: 'Super Admin',
          role: 'admin'
        })
        .eq('id', profile.id);
      
      if (error) {
        console.error("Failed to set super admin status:", error);
        toast.error("Failed to update admin permissions");
        return false;
      }
      
      // Use refreshPermissions from the context directly
      if (refreshPermissions) {
        await refreshPermissions();
      }
      
      toast.success("You are now a Super Admin");
      return true;
    } catch (err) {
      console.error("Error updating admin status:", err);
      toast.error("Failed to update admin status");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Set Dr. Kevin Johnson as Super Admin
  const setKevinJohnsonAsSuperAdmin = async (email: string): Promise<boolean> => {
    setIsUpdating(true);
    try {
      // First find the user by email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();
      
      if (userError || !userData) {
        console.error("Failed to find user by email:", userError);
        toast.error("Failed to find user by email");
        return false;
      }
      
      // Update the profile to make user a super admin
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_super_admin: true,
          title: 'Super Admin',
          role: 'admin'
        })
        .eq('id', userData.id);
      
      if (error) {
        console.error("Failed to set super admin status:", error);
        toast.error("Failed to update admin permissions");
        return false;
      }
      
      toast.success("Dr. Kevin Johnson is now set as Super Admin");
      return true;
    } catch (err) {
      console.error("Error updating admin status:", err);
      toast.error("Failed to update admin status");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };
  
  return {
    hasPermission,
    isSuperAdmin,
    isAdminRole,
    promoteToSuperAdmin,
    setKevinJohnsonAsSuperAdmin,
    isUpdating
  };
}
