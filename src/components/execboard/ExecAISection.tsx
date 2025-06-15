
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Brain, Send, Sparkles, FileText, DollarSign, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface AIPrompt {
  id: string;
  title: string;
  prompt: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
}

const predefinedPrompts: AIPrompt[] = [
  {
    id: '1',
    title: 'Summarize Meeting Notes',
    prompt: 'Please summarize the following meeting notes into key points and action items:',
    category: 'meetings',
    icon: FileText
  },
  {
    id: '2',
    title: 'Generate Tour Packing List',
    prompt: 'Create a comprehensive packing list for a Glee Club tour including uniforms, music supplies, and personal items:',
    category: 'travel',
    icon: Users
  },
  {
    id: '3',
    title: 'Draft Reimbursement Email',
    prompt: 'Help me write a professional email to the treasurer requesting reimbursement for:',
    category: 'finance',
    icon: DollarSign
  },
  {
    id: '4',
    title: 'Event Planning Checklist',
    prompt: 'Create a detailed checklist for planning a Glee Club performance event including timeline, logistics, and responsibilities:',
    category: 'events',
    icon: Users
  },
  {
    id: '5',
    title: 'Weekly Newsletter Draft',
    prompt: 'Help me write a weekly newsletter for Glee Club members including upcoming events and announcements:',
    category: 'communications',
    icon: FileText
  },
  {
    id: '6',
    title: 'Social Media Caption',
    prompt: 'Generate an engaging social media caption for this Glee Club post:',
    category: 'social',
    icon: Sparkles
  }
];

export function ExecAISection() {
  const { profile } = useAuth();
  const [userPrompt, setUserPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePromptSelect = (prompt: AIPrompt) => {
    setUserPrompt(prompt.prompt + '\n\n[Add your specific details here]');
  };

  const handleSubmit = async () => {
    if (!userPrompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    try {
      // For demo purposes, we'll simulate an AI response
      // In production, this would call your actual AI service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setResponse(`AI Response for Executive Board Member (${profile?.exec_board_role}):\n\nThis is a simulated AI response to your prompt. In a real implementation, this would connect to OpenAI or another AI service to provide intelligent assistance with your Glee Club executive tasks.\n\nYour prompt was: "${userPrompt}"\n\nTo implement this feature, you would:\n1. Add OpenAI API integration\n2. Create role-specific prompts\n3. Add conversation history\n4. Include Glee Club context in prompts`);
      
      toast.success('AI response generated');
    } catch (error) {
      console.error('Error generating AI response:', error);
      toast.error('Failed to generate AI response');
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      meetings: 'bg-blue-100 text-blue-800',
      travel: 'bg-green-100 text-green-800',
      finance: 'bg-yellow-100 text-yellow-800',
      events: 'bg-purple-100 text-purple-800',
      communications: 'bg-pink-100 text-pink-800',
      social: 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Assistant
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Get AI-powered help with your executive board tasks
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Predefined Prompts */}
        <div>
          <h4 className="text-sm font-medium mb-3">Quick Actions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {predefinedPrompts.map((prompt) => {
              const IconComponent = prompt.icon;
              return (
                <Button
                  key={prompt.id}
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-start gap-2"
                  onClick={() => handlePromptSelect(prompt)}
                >
                  <div className="flex items-center gap-2 w-full">
                    <IconComponent className="h-4 w-4" />
                    <span className="text-sm font-medium">{prompt.title}</span>
                  </div>
                  <Badge className={getCategoryColor(prompt.category)}>
                    {prompt.category}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Custom Prompt Input */}
        <div>
          <h4 className="text-sm font-medium mb-3">Custom Prompt</h4>
          <div className="space-y-3">
            <Textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Ask the AI anything about managing your executive board responsibilities..."
              rows={4}
            />
            <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Ask AI
                </>
              )}
            </Button>
          </div>
        </div>

        {/* AI Response */}
        {response && (
          <div>
            <h4 className="text-sm font-medium mb-3">AI Response</h4>
            <div className="p-4 bg-muted rounded-lg">
              <pre className="whitespace-pre-wrap text-sm">{response}</pre>
            </div>
          </div>
        )}

        {/* Role-specific Tips */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Tips for {profile?.exec_board_role}
          </h4>
          <p className="text-sm text-muted-foreground">
            {profile?.exec_board_role === 'President' && 
              'Try asking the AI to help draft board meeting agendas, summarize decisions, or create member communication templates.'}
            {profile?.exec_board_role === 'Secretary' && 
              'Use the AI to format meeting minutes, create attendance summaries, or draft newsletter content.'}
            {profile?.exec_board_role === 'Treasurer' && 
              'Ask for help with budget analysis, reimbursement email templates, or financial reporting summaries.'}
            {profile?.exec_board_role === 'Historian' && 
              'Get assistance with event documentation, photo organization strategies, or archive descriptions.'}
            {profile?.exec_board_role === 'Social Media Chair' && 
              'Generate engaging captions, content calendars, or promotional post ideas for performances.'}
            {!['President', 'Secretary', 'Treasurer', 'Historian', 'Social Media Chair'].includes(profile?.exec_board_role || '') &&
              'Use the AI to help with any executive board tasks, from planning to communication to organization.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
