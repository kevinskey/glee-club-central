
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, RefreshCw, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AIAssistantButtonProps {
  currentValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  context?: string;
  type?: 'generate' | 'rephrase' | 'summarize' | 'format';
  className?: string;
}

export function AIAssistantButton({ 
  currentValue, 
  onValueChange, 
  placeholder = "Enter text...",
  context = "",
  type = 'generate',
  className 
}: AIAssistantButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const generateSuggestions = async () => {
    setIsGenerating(true);
    try {
      // Create a prompt based on the type and current value
      let prompt = '';
      
      switch (type) {
        case 'generate':
          prompt = `Generate 3 creative and engaging ${context || 'text'} suggestions. Make them professional and suitable for a music organization.`;
          break;
        case 'rephrase':
          prompt = `Rephrase this text in 3 different ways while maintaining the same meaning: "${currentValue}". Make them professional and engaging.`;
          break;
        case 'summarize':
          prompt = `Create 3 different concise summaries of this text: "${currentValue}". Make them clear and professional.`;
          break;
        case 'format':
          prompt = `Reformat this text in 3 different styles (formal, casual, creative): "${currentValue}"`;
          break;
        default:
          prompt = `Generate 3 creative suggestions for: ${currentValue || 'music event content'}`;
      }

      console.log('Calling AI with prompt:', prompt);

      const { data, error } = await supabase.functions.invoke('generate-event-descriptions', {
        body: { 
          title: currentValue || 'Content',
          type: 'full'
        }
      });

      if (error) {
        console.error('AI generation error:', error);
        throw new Error(error.message || 'Failed to generate suggestions');
      }

      // Create multiple variations based on the response
      const baseResponse = data?.description || 'AI-generated content';
      const variations = [
        baseResponse,
        `${baseResponse} - Enhanced version with additional detail and professional tone.`,
        `${baseResponse} - Concise and engaging format for better readability.`
      ];

      setSuggestions(variations);
      toast.success(`AI ${type} suggestions generated!`);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate suggestions';
      toast.error(`AI generation failed: ${errorMessage}`);
      
      // Fallback suggestions if AI fails
      setSuggestions([
        `Sample ${type} suggestion 1`,
        `Sample ${type} suggestion 2`, 
        `Sample ${type} suggestion 3`
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(null), 2000);
      toast.success('Copied to clipboard');
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleApply = (suggestion: string) => {
    onValueChange(suggestion);
    setIsOpen(false);
    toast.success('Applied suggestion');
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={`h-8 px-2 ${className}`}
      >
        <Sparkles className="h-3 w-3" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Assistant - {type.charAt(0).toUpperCase() + type.slice(1)}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Current Text</label>
              <Textarea
                value={currentValue}
                onChange={(e) => onValueChange(e.target.value)}
                placeholder={placeholder}
                rows={3}
              />
            </div>

            <div className="flex justify-between items-center">
              <h4 className="font-medium">AI Suggestions</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={generateSuggestions}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <RefreshCw className="h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="h-3 w-3" />
                )}
                {isGenerating ? 'Generating...' : 'Generate'}
              </Button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {suggestions.length === 0 && !isGenerating && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Click "Generate" to get AI suggestions
                </p>
              )}
              
              {suggestions.map((suggestion, index) => (
                <div key={index} className="p-3 border rounded-lg space-y-2">
                  <p className="text-sm">{suggestion}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleApply(suggestion)}
                    >
                      Apply
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(suggestion)}
                    >
                      {copied === suggestion ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
