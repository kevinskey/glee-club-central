
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SlideTemplate } from '@/types/slideDesign';
import { Layout, Columns, Rows, Grid } from 'lucide-react';

interface TemplateSelectorProps {
  templates: SlideTemplate[];
  selectedTemplate?: SlideTemplate;
  onSelectTemplate: (template: SlideTemplate) => void;
  onCreateNew: () => void;
}

const getLayoutIcon = (layoutType: string) => {
  switch (layoutType) {
    case 'full':
      return <Layout className="h-4 w-4" />;
    case 'half_horizontal':
      return <Columns className="h-4 w-4" />;
    case 'half_vertical':
      return <Rows className="h-4 w-4" />;
    case 'quarter':
      return <Grid className="h-4 w-4" />;
    default:
      return <Layout className="h-4 w-4" />;
  }
};

const getLayoutLabel = (layoutType: string) => {
  switch (layoutType) {
    case 'full':
      return 'Full Page';
    case 'half_horizontal':
      return 'Split Horizontal';
    case 'half_vertical':
      return 'Split Vertical';
    case 'quarter':
      return 'Quarter Layout';
    default:
      return layoutType;
  }
};

export function TemplateSelector({ 
  templates, 
  selectedTemplate, 
  onSelectTemplate,
  onCreateNew 
}: TemplateSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Choose a Template</h3>
          <p className="text-sm text-muted-foreground">
            Select a layout template to start designing your slide
          </p>
        </div>
        <Button onClick={onCreateNew} variant="outline">
          Create Blank Slide
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedTemplate?.id === template.id 
                ? 'ring-2 ring-primary shadow-md' 
                : ''
            }`}
            onClick={() => onSelectTemplate(template)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  {getLayoutIcon(template.layout_type)}
                  {template.name}
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {getLayoutLabel(template.layout_type)}
                </Badge>
              </div>
              {template.description && (
                <CardDescription className="text-sm">
                  {template.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="w-full h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded border-2 border-dashed border-blue-300 flex items-center justify-center">
                <span className="text-xs text-blue-600 font-medium">Template Preview</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
