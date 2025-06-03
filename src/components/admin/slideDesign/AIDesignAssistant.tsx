
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Bot, Sparkles, Wand2, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AIDesignAssistantProps {
  onApplySuggestion: (suggestion: any) => void;
}

interface AISuggestion {
  type: 'text' | 'layout' | 'color' | 'image';
  content: string;
  data?: any;
}

export function AIDesignAssistant({ onApplySuggestion }: AIDesignAssistantProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);

  const quickPrompts = [
    "Create a professional title and subtitle for a music event",
    "Suggest color scheme for an elegant design",
    "Design layout for a concert announcement",
    "Generate motivational text for a performance poster",
    "Create text for a scholarship announcement"
  ];

  const generateSuggestions = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate AI response - in real implementation, this would call an AI API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockSuggestions: AISuggestion[] = [
        {
          type: 'text',
          content: 'Spelman College Glee Club presents an evening of musical excellence',
          data: { fontSize: '2.5rem', color: '#4A90E2', fontWeight: 'bold' }
        },
        {
          type: 'text',
          content: 'Join us for an unforgettable performance celebrating our musical heritage',
          data: { fontSize: '1.2rem', color: '#666666' }
        },
        {
          type: 'color',
          content: 'Elegant blue and gold color scheme',
          data: { background: '#1e3a8a', accent: '#fbbf24', text: '#ffffff' }
        },
        {
          type: 'layout',
          content: 'Center-aligned layout with hierarchical text',
          data: { textAlign: 'center', layout: 'vertical' }
        }
      ];

      setSuggestions(mockSuggestions);
      toast.success('AI suggestions generated!');
    } catch (error) {
      toast.error('Failed to generate suggestions');
    } finally {
      setIsGenerating(false);
    }
  };

  const applySuggestion = (suggestion: AISuggestion) => {
    onApplySuggestion(suggestion);
    toast.success(`Applied ${suggestion.type} suggestion`);
  };

  return (
    <Card className="h-full">
      <CardHeader className="p-3 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Bot className="h-4 w-4 text-blue-500" />
          AI Design Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-3">
        <div className="space-y-2">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to create or improve..."
            rows={3}
            className="text-sm resize-none"
          />
          <Button 
            onClick={generateSuggestions}
            disabled={isGenerating}
            size="sm"
            className="w-full h-8"
          >
            {isGenerating ? (
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            ) : (
              <Wand2 className="h-3 w-3 mr-1" />
            )}
            Generate Ideas
          </Button>
        </div>

        <Separator />

        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground">Quick Prompts</h4>
          <div className="flex flex-wrap gap-1">
            {quickPrompts.map((quickPrompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="h-6 text-xs"
                onClick={() => setPrompt(quickPrompt)}
              >
                {quickPrompt.slice(0, 20)}...
              </Button>
            ))}
          </div>
        </div>

        {suggestions.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                AI Suggestions
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-2 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => applySuggestion(suggestion)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="secondary" className="text-xs">
                        {suggestion.type}
                      </Badge>
                      <Send className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">{suggestion.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
