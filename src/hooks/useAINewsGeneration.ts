
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AINewsContent {
  headline: string;
  content: string;
}

export interface AINewsGenerationOptions {
  newsType?: 'hbcu' | 'spelman' | 'music' | 'scholarship' | 'general';
  customPrompt?: string;
}

export const useAINewsGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<AINewsContent | null>(null);

  const generateNewsContent = async (options: AINewsGenerationOptions = {}): Promise<AINewsContent | null> => {
    setIsGenerating(true);
    
    try {
      console.log('🤖 Generating AI news content with options:', options);
      
      const { data, error } = await supabase.functions.invoke('generate-news-content', {
        body: {
          newsType: options.newsType || 'general',
          customPrompt: options.customPrompt
        }
      });

      if (error) {
        console.error('❌ Error calling AI function:', error);
        throw new Error(error.message || 'Failed to generate content');
      }

      if (!data.success) {
        console.error('❌ AI function returned error:', data.error);
        throw new Error(data.error || 'Failed to generate content');
      }

      console.log('✅ AI content generated successfully:', data.data);
      
      const generatedContent: AINewsContent = {
        headline: data.data.headline,
        content: data.data.content
      };

      setLastGenerated(generatedContent);
      toast.success('News content generated successfully!');
      
      return generatedContent;

    } catch (error) {
      console.error('💥 Error generating AI news content:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to generate content: ${errorMessage}`);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const saveGeneratedNews = async (
    content: AINewsContent, 
    options: {
      priority?: number;
      startDate?: string;
      endDate?: string;
      active?: boolean;
      aiPrompt?: string;
    } = {}
  ): Promise<boolean> => {
    try {
      console.log('💾 Saving generated news to database:', content);

      // Get current user session with better error handling
      console.log('🔍 Getting user session...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('❌ Session error:', sessionError);
        throw new Error(`Authentication error: ${sessionError.message}`);
      }

      if (!session?.user) {
        console.error('❌ No authenticated user found');
        throw new Error('User not authenticated. Please log in and try again.');
      }

      console.log('✅ User authenticated:', session.user.id);

      const newsItem = {
        headline: content.headline,
        content: content.content,
        generated_by_ai: true,
        ai_prompt: options.aiPrompt || 'AI Generated',
        priority: options.priority || 1,
        start_date: options.startDate || new Date().toISOString().split('T')[0],
        end_date: options.endDate || null,
        active: options.active !== false,
        created_by: session.user.id
      };

      console.log('📝 Attempting to insert news item:', newsItem);

      const { data: insertedNews, error } = await supabase
        .from('news_items')
        .insert(newsItem)
        .select()
        .single();

      if (error) {
        console.error('❌ Insert error:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw new Error(`Database error: ${error.message}`);
      }

      console.log('✅ News item saved successfully:', insertedNews);
      toast.success('News item saved to ticker!');
      return true;

    } catch (error) {
      console.error('💥 Error saving news item:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to save news: ${errorMessage}`);
      return false;
    }
  };

  return {
    generateNewsContent,
    saveGeneratedNews,
    isGenerating,
    lastGenerated
  };
};
