import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserTitle } from '@/types/permissions';
import { updateUserTitle } from '@/utils/supabase/permissions';

interface Title {
  id: string;
  name: string;
  description?: string;
}

interface Permission {
  id: string;
  name: string;
  description?: string;
}

interface TitlePermission {
  title_id: string;
  permission_id: string;
  granted: boolean;
}

export function useTitlesManagement() {
  const [titles, setTitles] = useState<Title[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTitles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('user_titles')
        .select('id, name, description')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      setTitles(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load titles');
      console.error('Error loading titles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from('permissions')
        .select('id, name, description')
        .order('name');
      
      if (error) {
        console.error('Error loading permissions:', error);
        return;
      }
      
      setPermissions(data || []);
    } catch (err) {
      console.error('Error loading permissions:', err);
    }
  };

  const addTitle = async (name: string, description?: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('user_titles')
        .insert([{ name, description }]);
      
      if (error) {
        toast.error(`Failed to add title: ${error.message}`);
        return false;
      }
      
      toast.success(`Title "${name}" added successfully`);
      loadTitles();
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Failed to add title');
      return false;
    }
  };

  // Alias for addTitle to match component expectations
  const addNewTitle = addTitle;

  const updateTitle = async (id: string, name: string, description?: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('user_titles')
        .update({ name, description, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) {
        toast.error(`Failed to update title: ${error.message}`);
        return false;
      }
      
      toast.success(`Title "${name}" updated successfully`);
      loadTitles();
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Failed to update title');
      return false;
    }
  };

  const deleteTitle = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('user_titles')
        .delete()
        .eq('id', id);
      
      if (error) {
        toast.error(`Failed to delete title: ${error.message}`);
        return false;
      }
      
      toast.success('Title deleted successfully');
      loadTitles();
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete title');
      return false;
    }
  };

  const fetchTitlePermissions = async (titleId: string): Promise<TitlePermission[]> => {
    try {
      const { data, error } = await supabase
        .from('title_permissions')
        .select('*')
        .eq('title_id', titleId);
      
      if (error) {
        toast.error(`Failed to fetch title permissions: ${error.message}`);
        return [];
      }
      
      return data || [];
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch title permissions');
      return [];
    }
  };

  const updateTitlePermissions = async (
    titleId: string, 
    permissionUpdates: Array<{ permissionId: string; granted: boolean }>
  ): Promise<boolean> => {
    try {
      // Delete existing permissions for this title
      const { error: deleteError } = await supabase
        .from('title_permissions')
        .delete()
        .eq('title_id', titleId);
      
      if (deleteError) {
        toast.error(`Failed to update permissions: ${deleteError.message}`);
        return false;
      }
      
      // Insert new permissions
      const permissionsToInsert = permissionUpdates.map(update => ({
        title_id: titleId,
        permission_id: update.permissionId,
        granted: update.granted
      }));
      
      const { error: insertError } = await supabase
        .from('title_permissions')
        .insert(permissionsToInsert);
      
      if (insertError) {
        toast.error(`Failed to update permissions: ${insertError.message}`);
        return false;
      }
      
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Failed to update permissions');
      return false;
    }
  };

  const setUserTitle = async (userId: string, title: UserTitle): Promise<boolean> => {
    try {
      await updateUserTitle(userId, title);
      return true;
    } catch (error) {
      console.error("Error setting user title:", error);
      return false;
    }
  };

  useEffect(() => {
    loadTitles();
    loadPermissions();
  }, []);

  return {
    titles,
    permissions,
    isLoading,
    error,
    loadTitles,
    addTitle,
    updateTitle,
    deleteTitle,
    setUserTitle,
    fetchTitlePermissions,
    updateTitlePermissions,
    addNewTitle
  };
}
