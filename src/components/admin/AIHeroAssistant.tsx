
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Copy, Check } from 'lucide-react';
import { useAIHeroAssistance } from '@/hooks/useAIHeroAssistance';
import { toast } from 'sonner';

interface AIHeroAssistantProps {
  context: {
    mediaType?: 'image' | 'video';
    mediaTitle?: string;
    sectionName?: string;
    currentTitle?: string;
    currentDescription?: string;
  };
  onApplySuggestion: (field: 'title' | 'description' | 'buttonText', value: string) => void;
}

export function AIHeroAssistant({ context, onApplySuggestion }: AIHeroAssistantProps) {
  const { generateSuggestions, isGenerating } = useAIHeroAssistance();
  const [suggestions, setSuggestions] = useState<{
    title?: string;
    description?: string;
    buttonText?: string;
  } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleGenerateSuggestions = async () => {
    const result = await generateSuggestions(context);
    if (result) {
      setSuggestions(result);
    }
  };

  const handleApplySuggestion = (field: 'title' | 'description' | 'buttonText', value: string) => {
    onApplySuggestion(field, value);
    toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} applied successfully`);
  };

  const handleCopySuggestion = async (field: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
      toast.success('Copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const SuggestionRow = ({ 
    label, 
    field, 
    value 
  }: { 
    label: string; 
    field: 'title' | 'description' | 'buttonText'; 
    value: string; 
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-xs">
          {label}
        </Badge>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleCopySuggestion(field, value)}
            className="h-6 px-2"
          >
            {copiedField === field ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
          <Button
            size="sm"
            onClick={() => handleApplySuggestion(field, value)}
            className="h-6 px-2 text-xs"
          >
            Apply
          </Button>
        </div>
      </div>
      <p className="text-sm bg-muted p-2 rounded border">{value}</p>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          AI Content Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Generate compelling hero content suggestions using AI.
        </div>
        
        <Button 
          onClick={handleGenerateSuggestions}
          disabled={isGenerating}
          className="w-full"
          variant="outline"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {isGenerating ? 'Generating Suggestions...' : 'Generate AI Suggestions'}
        </Button>

        {suggestions && (
          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-medium text-sm">AI Suggestions</h4>
            
            {suggestions.title && (
              <SuggestionRow 
                label="Title" 
                field="title" 
                value={suggestions.title} 
              />
            )}
            
            {suggestions.description && (
              <SuggestionRow 
                label="Description" 
                field="description" 
                value={suggestions.description} 
              />
            )}
            
            {suggestions.buttonText && (
              <SuggestionRow 
                label="Button Text" 
                field="buttonText" 
                value={suggestions.buttonText} 
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
