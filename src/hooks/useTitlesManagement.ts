
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserTitleData {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface PermissionData {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface TitlePermissionData {
  id: string;
  title_id: string;
  permission_id: string;
  granted: boolean;
  created_at: string;
}

export function useTitlesManagement() {
  const [titles, setTitles] = useState<UserTitleData[]>([]);
  const [permissions, setPermissions] = useState<PermissionData[]>([]);
  const [titlePermissions, setTitlePermissions] = useState<Record<string, TitlePermissionData[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTitles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('user_titles')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setTitles(data || []);
      return data;
    } catch (err: any) {
      console.error('Error fetching titles:', err);
      setError('Failed to load user titles');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPermissions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setPermissions(data || []);
      return data;
    } catch (err: any) {
      console.error('Error fetching permissions:', err);
      return [];
    }
  }, []);

  const fetchTitlePermissions = useCallback(async (titleId: string) => {
    try {
      const { data, error } = await supabase
        .from('title_permissions')
        .select('*, permissions(name)')
        .eq('title_id', titleId);
      
      if (error) throw error;
      setTitlePermissions(prev => ({
        ...prev,
        [titleId]: data || []
      }));
      return data;
    } catch (err: any) {
      console.error(`Error fetching permissions for title ${titleId}:`, err);
      return [];
    }
  }, []);

  const updateUserTitle = useCallback(async (userId: string, titleName: string): Promise<boolean> => {
    try {
      // Use the database function to ensure the title exists
      const { data, error } = await supabase
        .rpc('update_user_title_dynamic', { 
          p_user_id: userId, 
          p_title: titleName 
        });
      
      if (error) throw error;
      
      // Check if update was successful
      if (data === false) {
        toast.error(`Title "${titleName}" doesn't exist`);
        return false;
      }
      
      toast.success(`User title updated to ${titleName}`);
      return true;
    } catch (err: any) {
      console.error('Error updating user title:', err);
      toast.error(`Failed to update title: ${err.message || 'Unknown error'}`);
      return false;
    }
  }, []);

  const addNewTitle = useCallback(async (name: string, description?: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('user_titles')
        .insert([{ name, description }])
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success(`Added new title: ${name}`);
      fetchTitles(); // Refresh titles list
      return true;
    } catch (err: any) {
      console.error('Error adding new title:', err);
      toast.error(`Failed to add title: ${err.message || 'Unknown error'}`);
      return false;
    }
  }, [fetchTitles]);

  const updateTitlePermissions = useCallback(async (
    titleId: string,
    permissionUpdates: { permissionId: string, granted: boolean }[]
  ): Promise<boolean> => {
    try {
      // Process updates in sequence
      for (const { permissionId, granted } of permissionUpdates) {
        // Check if the permission mapping already exists
        const { data: existingMapping, error: checkError } = await supabase
          .from('title_permissions')
          .select('id')
          .eq('title_id', titleId)
          .eq('permission_id', permissionId)
          .maybeSingle();
        
        if (checkError) throw checkError;
        
        if (existingMapping) {
          // Update existing mapping
          const { error: updateError } = await supabase
            .from('title_permissions')
            .update({ granted })
            .eq('id', existingMapping.id);
          
          if (updateError) throw updateError;
        } else {
          // Insert new mapping
          const { error: insertError } = await supabase
            .from('title_permissions')
            .insert({ title_id: titleId, permission_id: permissionId, granted });
          
          if (insertError) throw insertError;
        }
      }
      
      toast.success(`Permissions updated`);
      return true;
    } catch (err: any) {
      console.error('Error updating title permissions:', err);
      toast.error(`Failed to update permissions: ${err.message || 'Unknown error'}`);
      return false;
    }
  }, []);

  useEffect(() => {
    fetchTitles();
    fetchPermissions();
  }, [fetchTitles, fetchPermissions]);

  return {
    titles,
    permissions,
    titlePermissions,
    isLoading,
    error,
    fetchTitles,
    fetchPermissions,
    fetchTitlePermissions,
    updateUserTitle,
    addNewTitle,
    updateTitlePermissions
  };
}
