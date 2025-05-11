
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function usePermissions() {
  const { permissions, profile, isAdmin, refreshPermissions } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  // Get permission by name
  const hasPermission = (permissionName: string): boolean => {
    // Super admins and admins have all permissions
    if (profile?.is_super_admin || isAdmin()) return true;
    
    // Otherwise check specific permissions
    if (!permissions) return false;
    return permissions[permissionName] === true;
  };
  
  // Check if the user is a super admin
  const isSuperAdmin = Boolean(profile?.is_super_admin);
  
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
          title: 'Super Admin' 
        })
        .eq('id', profile.id);
      
      if (error) {
        console.error("Failed to set super admin status:", error);
        toast.error("Failed to update admin permissions");
        return false;
      }
      
      // Refresh the permissions to reflect the changes
      if (refreshPermissions) {
        await refreshPermissions();
      }
      
      toast.success("You are now a Super Admin for development");
      return true;
    } catch (err) {
      console.error("Error updating admin status:", err);
      toast.error("Failed to update admin status");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Log permissions for debugging
  console.log('usePermissions hook:', {
    isSuperAdmin,
    isAdmin: isAdmin ? isAdmin() : false,
    profileSuperAdmin: profile?.is_super_admin,
    permissions
  });
  
  return {
    hasPermission,
    isSuperAdmin,
    promoteToSuperAdmin,
    isUpdating
  };
}
