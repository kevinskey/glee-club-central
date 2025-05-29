
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { useAIDescriptions } from '@/hooks/useAIDescriptions';

interface AIDescriptionButtonsProps {
  title: string;
  eventTypes: string[];
  location: string;
  startTime: string;
  callTime: string;
  onDescriptionGenerated: (description: string, type: 'short' | 'full') => void;
  disabled?: boolean;
}

export const AIDescriptionButtons: React.FC<AIDescriptionButtonsProps> = ({
  title,
  eventTypes,
  location,
  startTime,
  callTime,
  onDescriptionGenerated,
  disabled = false
}) => {
  const { generateDescription, isGenerating } = useAIDescriptions();

  const handleGenerateDescription = async (type: 'short' | 'full') => {
    const description = await generateDescription({
      title,
      eventTypes,
      location,
      startTime,
      callTime,
      type
    });

    if (description) {
      onDescriptionGenerated(description, type);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => handleGenerateDescription('short')}
        disabled={disabled || isGenerating || !title.trim()}
        className="text-xs"
      >
        {isGenerating ? (
          <Loader2 className="h-3 w-3 animate-spin mr-1" />
        ) : (
          <Sparkles className="h-3 w-3 mr-1" />
        )}
        AI Short
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => handleGenerateDescription('full')}
        disabled={disabled || isGenerating || !title.trim()}
        className="text-xs"
      >
        {isGenerating ? (
          <Loader2 className="h-3 w-3 animate-spin mr-1" />
        ) : (
          <Sparkles className="h-3 w-3 mr-1" />
        )}
        AI Full
      </Button>
    </div>
  );
};
