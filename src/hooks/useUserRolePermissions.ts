
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RolePermission {
  id: string;
  role: string;
  permission_key: string;
  enabled: boolean;
  updated_at: string;
  updated_by: string | null;
}

export const useUserRolePermissions = () => {
  const [permissions, setPermissions] = useState<RolePermission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from('user_role_permissions')
        .select('*')
        .order('role', { ascending: true })
        .order('permission_key', { ascending: true });

      if (error) throw error;
      setPermissions(data || []);
    } catch (error) {
      console.error('Error fetching role permissions:', error);
      toast.error('Failed to load role permissions');
    } finally {
      setLoading(false);
    }
  };

  const updatePermission = async (id: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('user_role_permissions')
        .update({ enabled })
        .eq('id', id);

      if (error) throw error;

      setPermissions(prev => 
        prev.map(perm => 
          perm.id === id ? { ...perm, enabled } : perm
        )
      );

      toast.success('Permission updated successfully');
    } catch (error) {
      console.error('Error updating permission:', error);
      toast.error('Failed to update permission');
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  return {
    permissions,
    loading,
    updatePermission,
    refetch: fetchPermissions
  };
};
