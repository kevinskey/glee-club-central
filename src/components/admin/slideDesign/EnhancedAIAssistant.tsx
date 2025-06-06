
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Mic, MicOff, Wand2, Sparkles, MessageSquare, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface EnhancedAIAssistantProps {
  onSlideGenerated: (slideData: any) => void;
  currentSlideData?: any;
}

// Simplified speech recognition interface
interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      };
    };
  };
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

export function EnhancedAIAssistant({ onSlideGenerated, currentSlideData }: EnhancedAIAssistantProps) {
  const [prompt, setPrompt] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions] = useState([
    'Create a hero slide for upcoming concert',
    'Design an announcement for new merchandise',
    'Make a welcome slide for new members',
    'Create a fundraising campaign slide'
  ]);

  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    // Initialize speech recognition if available
    if (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      
      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setPrompt(prev => prev + ' ' + transcript);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event);
        setIsListening(false);
        toast.error('Speech recognition failed');
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    } else {
      toast.error('Speech recognition not supported in this browser');
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate AI generation for demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockSlideData = {
        id: Date.now().toString(),
        title: 'AI Generated Slide',
        content: prompt,
        background: '#1a365d',
        textColor: '#ffffff',
        elements: [
          {
            type: 'text',
            content: 'Generated from: ' + prompt,
            style: { fontSize: '24px', textAlign: 'center' }
          }
        ]
      };
      
      onSlideGenerated(mockSlideData);
      toast.success('Slide generated successfully!');
      setPrompt('');
      
    } catch (error) {
      console.error('Generation failed:', error);
      toast.error('Failed to generate slide');
    } finally {
      setIsGenerating(false);
    }
  };

  const applySuggestion = (suggestion: string) => {
    setPrompt(suggestion);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          AI Design Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Voice Input */}
        <div className="flex items-center gap-2">
          <Button
            variant={isListening ? "destructive" : "outline"}
            size="sm"
            onClick={isListening ? stopListening : startListening}
            disabled={!recognition}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {isListening ? 'Stop' : 'Voice Input'}
          </Button>
          {isListening && (
            <Badge variant="destructive" className="animate-pulse">
              Listening...
            </Badge>
          )}
        </div>

        {/* Text Input */}
        <Textarea
          placeholder="Describe the slide you want to create..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
        />

        {/* Quick Suggestions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Quick Suggestions:</h4>
          <div className="grid grid-cols-1 gap-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="justify-start text-left h-auto p-2"
                onClick={() => applySuggestion(suggestion)}
              >
                <MessageSquare className="h-3 w-3 mr-2 flex-shrink-0" />
                <span className="text-xs">{suggestion}</span>
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Generate Button */}
        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating || !prompt.trim()}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4 mr-2" />
              Generate Slide
            </>
          )}
        </Button>

        {/* Current Context */}
        {currentSlideData && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <h4 className="text-sm font-medium mb-2">Current Slide Context:</h4>
            <p className="text-xs text-muted-foreground">
              {currentSlideData.title || 'Untitled Slide'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
