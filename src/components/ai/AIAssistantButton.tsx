
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, RefreshCw, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

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
      // Simulate AI generation with contextual suggestions
      const contextualSuggestions = await mockAIGeneration(currentValue, context, type);
      setSuggestions(contextualSuggestions);
    } catch (error) {
      toast.error('Failed to generate suggestions');
    } finally {
      setIsGenerating(false);
    }
  };

  const mockAIGeneration = async (text: string, context: string, type: string): Promise<string[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const suggestions: Record<string, string[]> = {
      generate: [
        "Fall Concert: Voices of Hope and Harmony",
        "Spring Showcase: A Musical Journey Through Time",
        "Holiday Concert: Songs of Joy and Celebration"
      ],
      rephrase: [
        text ? `${text} - Enhanced Version` : "Improved version of your text",
        text ? `${text} - Professional Tone` : "Professional version of your text",
        text ? `${text} - Engaging Style` : "Engaging version of your text"
      ],
      summarize: [
        text ? `Summary: ${text.slice(0, 50)}...` : "Concise summary will appear here",
        text ? `Key Points: ${text.slice(0, 40)}...` : "Main points summary",
        text ? `Brief: ${text.slice(0, 45)}...` : "Brief overview"
      ],
      format: [
        text ? text.toUpperCase() : "FORMATTED VERSION",
        text ? text.toLowerCase() : "formatted version",
        text ? text.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : "Title Case Version"
      ]
    };

    return suggestions[type] || suggestions.generate;
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
    toast.success('Copied to clipboard');
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
