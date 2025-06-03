
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, Circle } from 'lucide-react';

interface Section {
  id: string;
  name: string;
  required: boolean;
  completed: boolean;
  description: string;
}

interface SectionValidatorProps {
  sections: Section[];
  onSectionClick: (sectionId: string) => void;
  canSave: boolean;
}

export function SectionValidator({ sections, onSectionClick, canSave }: SectionValidatorProps) {
  const completedSections = sections.filter(s => s.completed).length;
  const requiredSections = sections.filter(s => s.required);
  const completedRequiredSections = requiredSections.filter(s => s.completed).length;
  const progressPercentage = (completedSections / sections.length) * 100;
  const requiredProgressPercentage = (completedRequiredSections / requiredSections.length) * 100;

  return (
    <Card>
      <CardHeader className="p-3 pb-2">
        <CardTitle className="flex items-center justify-between text-sm">
          <span>Design Sections</span>
          <Badge variant={canSave ? "default" : "secondary"}>
            {completedSections}/{sections.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-3">
        {/* Overall Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Overall Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Required Sections Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Required Sections</span>
            <span>{Math.round(requiredProgressPercentage)}%</span>
          </div>
          <Progress value={requiredProgressPercentage} className="h-2" />
        </div>

        {/* Section List */}
        <div className="space-y-1">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                section.completed 
                  ? 'bg-green-50 hover:bg-green-100 dark:bg-green-950 dark:hover:bg-green-900' 
                  : section.required 
                    ? 'bg-orange-50 hover:bg-orange-100 dark:bg-orange-950 dark:hover:bg-orange-900'
                    : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700'
              }`}
              onClick={() => onSectionClick(section.id)}
            >
              {section.completed ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : section.required ? (
                <AlertCircle className="h-4 w-4 text-orange-600" />
              ) : (
                <Circle className="h-4 w-4 text-gray-400" />
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate">{section.name}</span>
                  {section.required && (
                    <Badge variant="secondary" className="text-xs">Required</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">{section.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Save Status */}
        <div className={`p-2 rounded-md text-center text-xs ${
          canSave 
            ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300' 
            : 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300'
        }`}>
          {canSave 
            ? '✓ Ready to save design' 
            : '⚠ Complete all required sections to save'
          }
        </div>
      </CardContent>
    </Card>
  );
}
