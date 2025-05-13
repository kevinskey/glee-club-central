
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Title {
  id: string;
  name: string;
  description?: string;
}

export function useTitlesManagement() {
  const [titles, setTitles] = useState<Title[]>([]);
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

  const updateUserTitle = async (userId: string, title: string): Promise<boolean> => {
    try {
      // We'll use the utility function from permissions.ts
      const { updateUserTitle: updateTitle } = await import('@/utils/supabase/permissions');
      return await updateTitle(userId, title);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update user title');
      return false;
    }
  };

  useEffect(() => {
    loadTitles();
  }, []);

  return {
    titles,
    isLoading,
    error,
    loadTitles,
    addTitle,
    updateTitle,
    deleteTitle,
    updateUserTitle
  };
}
