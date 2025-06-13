
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SlideTemplate, TemplateData, TextArea } from '@/types/slideDesign';
import { Plus, Save, Eye, Trash2, Grid } from 'lucide-react';
import { toast } from 'sonner';

interface SlideTemplateCreatorProps {
  onSave: (template: Partial<SlideTemplate>) => void;
  onPreview: (template: Partial<SlideTemplate>) => void;
}

export function SlideTemplateCreator({ onSave, onPreview }: SlideTemplateCreatorProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [layoutType, setLayoutType] = useState<'full' | 'half_horizontal' | 'half_vertical' | 'quarter'>('full');
  const [textAreas, setTextAreas] = useState<TextArea[]>([
    {
      id: 'title',
      type: 'heading',
      defaultText: 'Main Title',
      position: { x: 50, y: 30 },
      style: {
        fontSize: '2.5rem',
        color: '#FFFFFF',
        fontWeight: 'bold',
        textAlign: 'center',
        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
      }
    },
    {
      id: 'subtitle',
      type: 'paragraph',
      defaultText: 'Subtitle text',
      position: { x: 50, y: 60 },
      style: {
        fontSize: '1.5rem',
        color: '#FFFFFF',
        textAlign: 'center',
        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
      }
    }
  ]);

  const addTextArea = () => {
    const newArea: TextArea = {
      id: `area-${Date.now()}`,
      type: 'paragraph',
      defaultText: 'New text area',
      position: { x: 50, y: 50 },
      style: {
        fontSize: '1rem',
        color: '#FFFFFF',
        textAlign: 'center'
      }
    };
    setTextAreas(prev => [...prev, newArea]);
  };

  const updateTextArea = (id: string, updates: Partial<TextArea>) => {
    setTextAreas(prev => prev.map(area => 
      area.id === id ? { ...area, ...updates } : area
    ));
  };

  const removeTextArea = (id: string) => {
    setTextAreas(prev => prev.filter(area => area.id !== id));
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Please enter a template name');
      return;
    }

    const template: Partial<SlideTemplate> = {
      name,
      description,
      layout_type: layoutType,
      template_data: {
        textAreas,
        backgroundZones: [{
          id: 'main_bg',
          type: 'background',
          position: { x: 0, y: 0, width: 100, height: 100 },
          allowMedia: true,
          allowColor: true
        }]
      },
      designable_areas: textAreas.map(area => ({
        id: area.id,
        x: area.position.x,
        y: area.position.y,
        width: 30,
        height: 10,
        constraints: {}
      })),
      default_styles: {
        backgroundColor: '#4A90E2',
        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
      },
      is_active: true
    };

    onSave(template);
  };

  const handlePreview = () => {
    const template: Partial<SlideTemplate> = {
      name,
      description,
      layout_type: layoutType,
      template_data: {
        textAreas,
        backgroundZones: []
      },
      designable_areas: [],
      default_styles: {},
      is_active: true
    };

    onPreview(template);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid className="h-5 w-5" />
            Create Template
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter template name"
              />
            </div>
            <div>
              <Label htmlFor="layout-type">Layout Type</Label>
              <Select value={layoutType} onValueChange={(value: any) => setLayoutType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Screen</SelectItem>
                  <SelectItem value="half_horizontal">Half Horizontal</SelectItem>
                  <SelectItem value="half_vertical">Half Vertical</SelectItem>
                  <SelectItem value="quarter">Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="template-description">Description</Label>
            <Textarea
              id="template-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this template"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Text Areas</CardTitle>
            <Button onClick={addTextArea} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Text Area
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {textAreas.map((area, index) => (
              <div key={area.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Text Area {index + 1}</h4>
                  <Button
                    onClick={() => removeTextArea(area.id)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Type</Label>
                    <Select
                      value={area.type}
                      onValueChange={(value: any) => updateTextArea(area.id, { type: value })}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="heading">Heading</SelectItem>
                        <SelectItem value="paragraph">Paragraph</SelectItem>
                        <SelectItem value="caption">Caption</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Default Text</Label>
                    <Input
                      value={area.defaultText}
                      onChange={(e) => updateTextArea(area.id, { defaultText: e.target.value })}
                      className="h-8"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>X Position (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={area.position.x}
                      onChange={(e) => updateTextArea(area.id, { 
                        position: { ...area.position, x: Number(e.target.value) }
                      })}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label>Y Position (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={area.position.y}
                      onChange={(e) => updateTextArea(area.id, { 
                        position: { ...area.position, y: Number(e.target.value) }
                      })}
                      className="h-8"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>Font Size</Label>
                    <Input
                      value={area.style.fontSize}
                      onChange={(e) => updateTextArea(area.id, { 
                        style: { ...area.style, fontSize: e.target.value }
                      })}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label>Color</Label>
                    <Input
                      type="color"
                      value={area.style.color}
                      onChange={(e) => updateTextArea(area.id, { 
                        style: { ...area.style, color: e.target.value }
                      })}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label>Alignment</Label>
                    <Select
                      value={area.style.textAlign || 'center'}
                      onValueChange={(value: any) => updateTextArea(area.id, { 
                        style: { ...area.style, textAlign: value }
                      })}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button onClick={handlePreview} variant="outline">
          <Eye className="h-4 w-4 mr-1" />
          Preview
        </Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-1" />
          Save Template
        </Button>
      </div>
    </div>
  );
}
