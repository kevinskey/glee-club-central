
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface GenerateDescriptionParams {
  title: string;
  eventTypes?: string[];
  location?: string;
  startTime?: string;
  callTime?: string;
  type: 'short' | 'full';
}

export const useAIDescriptions = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateDescription = async (params: GenerateDescriptionParams): Promise<string | null> => {
    if (!params.title.trim()) {
      toast.error('Please enter an event title first');
      return null;
    }

    setIsGenerating(true);
    
    try {
      console.log('Calling AI description generation with:', params);
      
      const { data, error } = await supabase.functions.invoke('generate-event-descriptions', {
        body: params
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to generate description');
      }

      if (!data?.description) {
        throw new Error('No description generated');
      }

      toast.success(`${params.type === 'short' ? 'Short' : 'Full'} description generated!`);
      return data.description;
    } catch (error) {
      console.error('Error generating description:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate description';
      toast.error(`AI generation failed: ${errorMessage}`);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateDescription,
    isGenerating
  };
};
