
import { useState } from 'react';
import { toast } from 'sonner';

interface AIHeroSuggestions {
  title?: string;
  description?: string;
  buttonText?: string;
}

export function useAIHeroAssistance() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSuggestions = async (context: {
    mediaType?: 'image' | 'video';
    mediaTitle?: string;
    sectionName?: string;
    currentTitle?: string;
    currentDescription?: string;
  }): Promise<AIHeroSuggestions | null> => {
    setIsGenerating(true);
    
    try {
      const prompt = `Generate compelling hero section content for the Spelman College Glee Club website. 
      
Context:
- Section: ${context.sectionName || 'Homepage'}
- Media Type: ${context.mediaType || 'image'}
- Media Title: ${context.mediaTitle || 'Untitled'}
- Current Title: ${context.currentTitle || 'None'}
- Current Description: ${context.currentDescription || 'None'}

Please provide:
1. A compelling, engaging title (max 60 characters)
2. A descriptive subtitle/description (max 150 characters)
3. A call-to-action button text (max 20 characters)

The content should reflect the elegance and musical excellence of the Spelman College Glee Club, be inspiring, and encourage engagement. Focus on themes of musical heritage, sisterhood, excellence, and community.

Return the response in JSON format:
{
  "title": "...",
  "description": "...", 
  "buttonText": "..."
}`;

      const response = await fetch('/api/generate-hero-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI suggestions');
      }

      const data = await response.json();
      
      // Parse the AI response
      let suggestions: AIHeroSuggestions;
      try {
        suggestions = JSON.parse(data.generatedText);
      } catch {
        // Fallback parsing if AI doesn't return valid JSON
        suggestions = {
          title: data.generatedText.match(/title['":\s]*([^,\n]+)/i)?.[1]?.replace(/['"]/g, '') || '',
          description: data.generatedText.match(/description['":\s]*([^,\n]+)/i)?.[1]?.replace(/['"]/g, '') || '',
          buttonText: data.generatedText.match(/buttonText['":\s]*([^,\n}]+)/i)?.[1]?.replace(/['"]/g, '') || ''
        };
      }

      return suggestions;
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      toast.error('Failed to generate AI suggestions. Please try again.');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateSuggestions,
    isGenerating
  };
}
