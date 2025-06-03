
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, Sparkles, Wand2, Send, Loader2, Mic, MicOff, Image, Video, Palette, Type } from 'lucide-react';
import { toast } from 'sonner';

interface EnhancedAIAssistantProps {
  onApplySuggestion: (suggestion: any) => void;
  onGenerateGraphics: (prompt: string) => void;
  onGenerateVideo: (prompt: string) => void;
}

interface AISuggestion {
  type: 'text' | 'layout' | 'color' | 'image' | 'video' | 'graphics';
  content: string;
  data?: any;
  preview?: string;
}

export function EnhancedAIAssistant({ 
  onApplySuggestion, 
  onGenerateGraphics, 
  onGenerateVideo 
}: EnhancedAIAssistantProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [aiMode, setAiMode] = useState<'design' | 'graphics' | 'video' | 'speech'>('design');

  const aiModes = [
    { value: 'design', label: 'Design Assistant', icon: Palette },
    { value: 'graphics', label: 'AI Graphics', icon: Image },
    { value: 'video', label: 'AI Video', icon: Video },
    { value: 'speech', label: 'Speech-to-Text', icon: Mic }
  ];

  const quickPrompts = {
    design: [
      "Create a professional title and subtitle for a music event",
      "Suggest color scheme for an elegant design",
      "Design layout for a concert announcement",
      "Generate motivational text for a performance poster"
    ],
    graphics: [
      "Generate a background with musical notes",
      "Create an abstract geometric pattern",
      "Design a vintage concert poster style",
      "Generate elegant typography graphics"
    ],
    video: [
      "Create animated text entrance",
      "Generate sliding background elements",
      "Design fade-in/out transitions",
      "Create pulsing rhythm animations"
    ],
    speech: [
      "Click to start voice input",
      "Speak your design requirements",
      "Describe what you want to create",
      "Voice commands for quick edits"
    ]
  };

  const startVoiceInput = async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast.info('Listening... Speak now');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(transcript);
      toast.success('Voice input captured');
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      toast.error('Speech recognition error: ' + event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const generateSuggestions = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt or use voice input');
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate AI response - in real implementation, this would call OpenAI API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockSuggestions: AISuggestion[] = [];
      
      if (aiMode === 'design') {
        mockSuggestions.push(
          {
            type: 'text',
            content: 'Spelman College Glee Club presents an evening of musical excellence',
            data: { fontSize: '2.5rem', color: '#4A90E2', fontWeight: 'bold' }
          },
          {
            type: 'color',
            content: 'Elegant blue and gold color scheme',
            data: { background: '#1e3a8a', accent: '#fbbf24', text: '#ffffff' }
          }
        );
      } else if (aiMode === 'graphics') {
        mockSuggestions.push(
          {
            type: 'graphics',
            content: 'AI-generated musical background',
            data: { type: 'background', style: 'musical_notes' },
            preview: '/lovable-uploads/ef084f8d-fe71-4e34-8587-9ac0ff3ddebf.png'
          }
        );
      } else if (aiMode === 'video') {
        mockSuggestions.push(
          {
            type: 'video',
            content: 'Animated text entrance effect',
            data: { animation: 'slideInLeft', duration: '1s', delay: '0.2s' }
          }
        );
      }

      setSuggestions(mockSuggestions);
      toast.success(`AI ${aiMode} suggestions generated!`);
    } catch (error) {
      toast.error('Failed to generate suggestions');
    } finally {
      setIsGenerating(false);
    }
  };

  const applySuggestion = (suggestion: AISuggestion) => {
    if (suggestion.type === 'graphics') {
      onGenerateGraphics(suggestion.content);
    } else if (suggestion.type === 'video') {
      onGenerateVideo(suggestion.content);
    } else {
      onApplySuggestion(suggestion);
    }
    toast.success(`Applied ${suggestion.type} suggestion`);
  };

  const currentMode = aiModes.find(mode => mode.value === aiMode);
  const CurrentModeIcon = currentMode?.icon || Bot;

  return (
    <Card className="h-full">
      <CardHeader className="p-3 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Bot className="h-4 w-4 text-blue-500" />
          Enhanced AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-3">
        {/* AI Mode Selector */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">AI Mode</label>
          <Select value={aiMode} onValueChange={(value: any) => setAiMode(value)}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {aiModes.map((mode) => (
                <SelectItem key={mode.value} value={mode.value}>
                  <div className="flex items-center gap-2">
                    <mode.icon className="h-3 w-3" />
                    {mode.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Input Area */}
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <CurrentModeIcon className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">
              {currentMode?.label}
            </span>
          </div>
          
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`Describe what you want to ${aiMode === 'design' ? 'design' : aiMode === 'graphics' ? 'generate' : aiMode === 'video' ? 'animate' : 'say'}...`}
            rows={3}
            className="text-sm resize-none"
          />
          
          <div className="flex gap-2">
            <Button 
              onClick={generateSuggestions}
              disabled={isGenerating}
              size="sm"
              className="flex-1 h-8"
            >
              {isGenerating ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <Wand2 className="h-3 w-3 mr-1" />
              )}
              Generate
            </Button>
            
            {aiMode === 'speech' && (
              <Button
                onClick={startVoiceInput}
                disabled={isListening}
                size="sm"
                variant="outline"
                className="h-8"
              >
                {isListening ? (
                  <MicOff className="h-3 w-3" />
                ) : (
                  <Mic className="h-3 w-3" />
                )}
              </Button>
            )}
          </div>
        </div>

        <Separator />

        {/* Quick Prompts */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground">Quick Prompts</h4>
          <div className="flex flex-wrap gap-1">
            {quickPrompts[aiMode]?.map((quickPrompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="h-6 text-xs"
                onClick={() => setPrompt(quickPrompt)}
              >
                {quickPrompt.slice(0, 15)}...
              </Button>
            ))}
          </div>
        </div>

        {/* AI Suggestions */}
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
                    <p className="text-xs text-muted-foreground mb-1">{suggestion.content}</p>
                    {suggestion.preview && (
                      <img 
                        src={suggestion.preview} 
                        alt="Preview" 
                        className="w-full h-16 object-cover rounded"
                      />
                    )}
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
