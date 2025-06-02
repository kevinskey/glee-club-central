
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAINewsGeneration, AINewsContent } from '@/hooks/useAINewsGeneration';
import { 
  Bot, 
  Sparkles, 
  Save, 
  RotateCcw, 
  GraduationCap, 
  Music, 
  Award,
  Building
} from 'lucide-react';
import { toast } from 'sonner';

interface AINewsGeneratorProps {
  onNewsGenerated?: (content: AINewsContent) => void;
  onNewsSaved?: () => void;
}

export function AINewsGenerator({ onNewsGenerated, onNewsSaved }: AINewsGeneratorProps) {
  const { generateNewsContent, saveGeneratedNews, isGenerating, lastGenerated } = useAINewsGeneration();
  const [customPrompt, setCustomPrompt] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<AINewsContent | null>(null);

  // Predefined news categories with their prompts
  const newsCategories = [
    {
      id: 'hbcu',
      name: 'HBCU News',
      icon: GraduationCap,
      description: 'HBCU achievements and community news',
      color: 'bg-blue-500'
    },
    {
      id: 'spelman',
      name: 'Spelman College',
      icon: Building,
      description: 'Spelman College updates and achievements',
      color: 'bg-purple-500'
    },
    {
      id: 'music',
      name: 'Choral Music',
      icon: Music,
      description: 'Choral music and performance news',
      color: 'bg-green-500'
    },
    {
      id: 'scholarship',
      name: 'Scholarships',
      icon: Award,
      description: 'Scholarship opportunities and funding',
      color: 'bg-yellow-500'
    }
  ];

  const handleCategoryGenerate = async (categoryId: string) => {
    const content = await generateNewsContent({ 
      newsType: categoryId as any 
    });
    
    if (content) {
      setGeneratedContent(content);
      onNewsGenerated?.(content);
    }
  };

  const handleCustomGenerate = async () => {
    if (!customPrompt.trim()) {
      toast.error('Please enter a custom prompt');
      return;
    }

    const content = await generateNewsContent({ 
      customPrompt 
    });
    
    if (content) {
      setGeneratedContent(content);
      onNewsGenerated?.(content);
    }
  };

  const handleSaveNews = async () => {
    if (!generatedContent) {
      toast.error('No content to save');
      return;
    }

    const success = await saveGeneratedNews(generatedContent, {
      aiPrompt: isCustomMode ? customPrompt : 'AI Generated from category'
    });

    if (success) {
      setGeneratedContent(null);
      onNewsSaved?.();
    }
  };

  const handleRegenerate = () => {
    if (isCustomMode) {
      handleCustomGenerate();
    } else {
      // Re-run the last category if available
      handleCategoryGenerate('general');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-500" />
          AI News Generator
          <Badge variant="secondary" className="ml-auto">
            <Sparkles className="h-3 w-3 mr-1" />
            Powered by ChatGPT
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Buttons */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Quick Generate by Category</Label>
          <div className="grid grid-cols-2 gap-3">
            {newsCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-start gap-2"
                  onClick={() => handleCategoryGenerate(category.id)}
                  disabled={isGenerating}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div className={`p-1 rounded ${category.color} text-white`}>
                      <IconComponent className="h-3 w-3" />
                    </div>
                    <span className="font-medium text-sm">{category.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground text-left">
                    {category.description}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Custom Prompt */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Custom Prompt</Label>
          <Textarea
            placeholder="Enter a custom prompt for generating news content..."
            value={customPrompt}
            onChange={(e) => {
              setCustomPrompt(e.target.value);
              setIsCustomMode(true);
            }}
            rows={3}
          />
          <Button
            onClick={handleCustomGenerate}
            disabled={isGenerating || !customPrompt.trim()}
            className="w-full"
            variant="outline"
          >
            {isGenerating ? (
              <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Generate from Custom Prompt
          </Button>
        </div>

        {/* Generated Content Preview */}
        {generatedContent && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Generated Content</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRegenerate}
                  disabled={isGenerating}
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Regenerate
                </Button>
              </div>
              
              <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
                <CardContent className="p-4 space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Headline</Label>
                    <p className="font-medium text-sm mt-1">{generatedContent.headline}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Content</Label>
                    <p className="text-sm mt-1">{generatedContent.content}</p>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveNews}
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save to News Ticker
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setGeneratedContent(null)}
                >
                  Clear
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Status */}
        {isGenerating && (
          <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
            <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
            <span className="text-sm text-muted-foreground">
              Generating content with AI...
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
