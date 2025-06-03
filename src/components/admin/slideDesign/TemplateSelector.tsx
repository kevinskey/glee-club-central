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

const renderLayoutPreview = (layoutType: string) => {
  const baseClasses = "w-full bg-gradient-to-br from-blue-100 to-blue-200 rounded border-2 border-dashed border-blue-300 relative overflow-hidden";
  const paperStyle = { aspectRatio: '8.5 / 11' }; // US Letter paper ratio
  
  if (layoutType === 'full') {
    return (
      <div className={baseClasses} style={paperStyle}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs text-blue-600 font-medium">Full Designable Area</span>
        </div>
      </div>
    );
  }
  
  if (layoutType === 'half_horizontal') {
    return (
      <div className={baseClasses} style={paperStyle}>
        {/* Left half - designable */}
        <div className="absolute left-0 top-0 w-1/2 h-full flex items-center justify-center border-r border-blue-300">
          <span className="text-xs text-blue-600 font-medium text-center">Designable</span>
        </div>
        {/* Right half - non-designable */}
        <div className="absolute right-0 top-0 w-1/2 h-full bg-gray-400/40 border-2 border-dashed border-gray-500/50 flex items-center justify-center">
          <span className="text-xs text-gray-600 font-medium text-center">Reserved</span>
        </div>
      </div>
    );
  }
  
  if (layoutType === 'half_vertical') {
    return (
      <div className={baseClasses} style={paperStyle}>
        {/* Top half - designable */}
        <div className="absolute top-0 left-0 w-full h-1/2 flex items-center justify-center border-b border-blue-300">
          <span className="text-xs text-blue-600 font-medium">Designable</span>
        </div>
        {/* Bottom half - non-designable */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gray-400/40 border-2 border-dashed border-gray-500/50 flex items-center justify-center">
          <span className="text-xs text-gray-600 font-medium">Reserved</span>
        </div>
      </div>
    );
  }
  
  if (layoutType === 'quarter') {
    return (
      <div className={baseClasses} style={paperStyle}>
        {/* Top left quarter - designable */}
        <div className="absolute top-0 left-0 w-1/2 h-1/2 flex items-center justify-center border-r border-b border-blue-300">
          <span className="text-xs text-blue-600 font-medium text-center leading-tight">Design Area</span>
        </div>
        {/* Top right half - non-designable */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gray-400/40 border-2 border-dashed border-gray-500/50 flex items-center justify-center">
          <span className="text-xs text-gray-600 font-medium text-center">Reserved</span>
        </div>
        {/* Bottom left quarter - non-designable */}
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gray-400/40 border-2 border-dashed border-gray-500/50 flex items-center justify-center">
          <span className="text-xs text-gray-600 font-medium text-center">Reserved</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className={baseClasses} style={paperStyle}>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs text-blue-600 font-medium">Template Preview</span>
      </div>
    </div>
  );
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
            Select a layout template to start designing your slide. Gray areas are reserved for other content.
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
              {renderLayoutPreview(template.layout_type)}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
