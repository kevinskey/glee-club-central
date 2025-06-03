
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SlideTemplate, SlideDesign } from '@/types/slideDesign';
import { toast } from 'sonner';

export function useSlideDesigns() {
  const [templates, setTemplates] = useState<SlideTemplate[]>([]);
  const [designs, setDesigns] = useState<SlideDesign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('slide_templates')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching slide templates:', error);
      toast.error('Failed to load slide templates');
    }
  };

  const fetchDesigns = async () => {
    try {
      const { data, error } = await supabase
        .from('slide_designs')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      setDesigns(data || []);
    } catch (error) {
      console.error('Error fetching slide designs:', error);
      toast.error('Failed to load slide designs');
    }
  };

  const createDesign = async (designData: Partial<SlideDesign>) => {
    try {
      const { data, error } = await supabase
        .from('slide_designs')
        .insert(designData)
        .select()
        .single();

      if (error) throw error;
      toast.success('Slide design created successfully');
      await fetchDesigns();
      return data;
    } catch (error) {
      console.error('Error creating slide design:', error);
      toast.error('Failed to create slide design');
      throw error;
    }
  };

  const updateDesign = async (id: string, updates: Partial<SlideDesign>) => {
    try {
      const { error } = await supabase
        .from('slide_designs')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      toast.success('Slide design updated successfully');
      await fetchDesigns();
    } catch (error) {
      console.error('Error updating slide design:', error);
      toast.error('Failed to update slide design');
      throw error;
    }
  };

  const deleteDesign = async (id: string) => {
    try {
      const { error } = await supabase
        .from('slide_designs')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
      toast.success('Slide design deleted successfully');
      await fetchDesigns();
    } catch (error) {
      console.error('Error deleting slide design:', error);
      toast.error('Failed to delete slide design');
      throw error;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchTemplates(), fetchDesigns()]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  return {
    templates,
    designs,
    isLoading,
    fetchTemplates,
    fetchDesigns,
    createDesign,
    updateDesign,
    deleteDesign
  };
}
