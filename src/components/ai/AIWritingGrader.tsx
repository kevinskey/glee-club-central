import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RotateCcw, Sparkles } from 'lucide-react';
import { useAIWritingGrader } from '@/hooks/useAIWritingGrader';

export function AIWritingGrader() {
  const [essay, setEssay] = useState('');
  const [criteria, setCriteria] = useState('');
  const { gradeEssay, isGrading, lastResult } = useAIWritingGrader();

  const handleGrade = async () => {
    if (!essay.trim()) return;
    await gradeEssay(essay, criteria);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Writing Grader</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Essay Text</Label>
          <Textarea
            rows={6}
            value={essay}
            onChange={(e) => setEssay(e.target.value)}
            placeholder="Paste student essay here..."
          />
        </div>
        <div className="space-y-2">
          <Label>Optional Criteria</Label>
          <Input
            value={criteria}
            onChange={(e) => setCriteria(e.target.value)}
            placeholder="e.g. Focus, Organization, Grammar..."
          />
        </div>
        <Button
          onClick={handleGrade}
          disabled={isGrading || !essay.trim()}
          className="w-full"
        >
          {isGrading ? (
            <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          Grade with AI
        </Button>
        {lastResult && (
          <div className="space-y-2 border rounded-md p-4">
            <div>
              <Label className="text-sm">Grade</Label>
              <p className="text-lg font-bold">{lastResult.grade}</p>
            </div>
            <div>
              <Label className="text-sm">Feedback</Label>
              <p className="text-sm">{lastResult.feedback}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AIWritingGrader;
