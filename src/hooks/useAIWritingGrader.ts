import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AIGradingResult {
  grade: number;
  feedback: string;
}

export const useAIWritingGrader = () => {
  const [isGrading, setIsGrading] = useState(false);
  const [lastResult, setLastResult] = useState<AIGradingResult | null>(null);

  const gradeEssay = async (essay: string, criteria?: string): Promise<AIGradingResult | null> => {
    setIsGrading(true);
    try {
      const { data, error } = await supabase.functions.invoke('grade-writing-assignment', {
        body: { essay, criteria }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to grade essay');
      }

      const result: AIGradingResult = {
        grade: data.data.grade,
        feedback: data.data.feedback
      };

      setLastResult(result);
      toast.success('Essay graded successfully!');
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(`Failed to grade essay: ${message}`);
      return null;
    } finally {
      setIsGrading(false);
    }
  };

  return { gradeEssay, isGrading, lastResult };
};
