
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface FanTag {
  id: string;
  label: string;
  description?: string;
  created_at: string;
  fan_count?: number;
}

export function useFanTags() {
  const [tags, setTags] = useState<FanTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTags = async () => {
    try {
      setIsLoading(true);
      
      // Fetch tags with fan count
      const { data: tagsData, error: tagsError } = await supabase
        .from('fan_tags')
        .select('*')
        .order('label');

      if (tagsError) throw tagsError;

      // Calculate fan count for each tag
      const tagsWithCount = await Promise.all(
        (tagsData || []).map(async (tag) => {
          const { count } = await supabase
            .from('fans')
            .select('*', { count: 'exact', head: true })
            .contains('tags', [tag.label]);
          
          return {
            ...tag,
            fan_count: count || 0
          };
        })
      );

      setTags(tagsWithCount);
    } catch (error) {
      console.error('Error fetching fan tags:', error);
      toast.error('Failed to load fan tags');
    } finally {
      setIsLoading(false);
    }
  };

  const createTag = async (label: string, description?: string) => {
    try {
      const { error } = await supabase
        .from('fan_tags')
        .insert([{ label, description }]);

      if (error) throw error;

      toast.success('Tag created successfully');
      fetchTags();
      return true;
    } catch (error: any) {
      console.error('Error creating tag:', error);
      if (error.code === '23505') {
        toast.error('A tag with this name already exists');
      } else {
        toast.error('Failed to create tag');
      }
      return false;
    }
  };

  const updateTag = async (id: string, label: string, description?: string) => {
    try {
      const { error } = await supabase
        .from('fan_tags')
        .update({ label, description })
        .eq('id', id);

      if (error) throw error;

      toast.success('Tag updated successfully');
      fetchTags();
      return true;
    } catch (error: any) {
      console.error('Error updating tag:', error);
      if (error.code === '23505') {
        toast.error('A tag with this name already exists');
      } else {
        toast.error('Failed to update tag');
      }
      return false;
    }
  };

  const deleteTag = async (id: string, label: string) => {
    try {
      // Remove tag from all fans first
      const { data: fans } = await supabase
        .from('fans')
        .select('id, tags')
        .contains('tags', [label]);

      if (fans && fans.length > 0) {
        const updates = fans.map(fan => ({
          id: fan.id,
          tags: fan.tags.filter((tag: string) => tag !== label)
        }));

        for (const update of updates) {
          await supabase
            .from('fans')
            .update({ tags: update.tags })
            .eq('id', update.id);
        }
      }

      // Delete the tag
      const { error } = await supabase
        .from('fan_tags')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Tag deleted successfully');
      fetchTags();
      return true;
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast.error('Failed to delete tag');
      return false;
    }
  };

  const assignTagsToFans = async (fanIds: string[], tagLabels: string[]) => {
    try {
      for (const fanId of fanIds) {
        const { data: fan } = await supabase
          .from('fans')
          .select('tags')
          .eq('id', fanId)
          .single();

        if (fan) {
          const existingTags = fan.tags || [];
          const newTags = [...new Set([...existingTags, ...tagLabels])];

          await supabase
            .from('fans')
            .update({ tags: newTags })
            .eq('id', fanId);
        }
      }

      toast.success('Tags assigned successfully');
      fetchTags();
      return true;
    } catch (error) {
      console.error('Error assigning tags:', error);
      toast.error('Failed to assign tags');
      return false;
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return {
    tags,
    isLoading,
    refetch: fetchTags,
    createTag,
    updateTag,
    deleteTag,
    assignTagsToFans
  };
}
