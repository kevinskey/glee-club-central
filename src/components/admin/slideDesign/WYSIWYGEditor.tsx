
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { SlideTemplate, SlideDesign, TextElement, BackgroundElement } from '@/types/slideDesign';
import { Type, Palette, Image, Link, Save, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface WYSIWYGEditorProps {
  template: SlideTemplate;
  design?: SlideDesign;
  onSave: (designData: Partial<SlideDesign>) => void;
  onPreview: () => void;
}

export function WYSIWYGEditor({ template, design, onSave, onPreview }: WYSIWYGEditorProps) {
  const [title, setTitle] = useState(design?.title || '');
  const [description, setDescription] = useState(design?.description || '');
  const [backgroundColor, setBackgroundColor] = useState(design?.background_color || '#4A90E2');
  const [backgroundImage, setBackgroundImage] = useState(design?.background_image_url || '');
  const [linkUrl, setLinkUrl] = useState(design?.link_url || '');
  const [animationDuration, setAnimationDuration] = useState(design?.animation_settings.duration || 5000);
  const [textElements, setTextElements] = useState<TextElement[]>(
    design?.design_data.textElements || 
    template.template_data.textAreas.map(area => ({
      id: area.id,
      type: area.type,
      text: area.defaultText,
      position: area.position,
      style: area.style
    }))
  );

  const canvasRef = useRef<HTMLDivElement>(null);

  const updateTextElement = (id: string, updates: Partial<TextElement>) => {
    setTextElements(prev => 
      prev.map(el => el.id === id ? { ...el, ...updates } : el)
    );
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast.error('Please enter a title for your slide');
      return;
    }

    const designData: Partial<SlideDesign> = {
      template_id: template.id,
      title,
      description,
      layout_type: template.layout_type,
      design_data: {
        textElements,
        backgroundElements: [{
          id: 'main_bg',
          type: backgroundImage ? 'image' : 'color',
          value: backgroundImage || backgroundColor,
          position: { x: 0, y: 0, width: 100, height: 100 }
        }]
      },
      background_color: backgroundColor,
      background_image_url: backgroundImage,
      animation_settings: {
        duration: animationDuration,
        transition: 'fade'
      },
      link_url: linkUrl,
      is_active: true,
      display_order: design?.display_order || 0
    };

    onSave(designData);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Canvas Area */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Design Canvas</span>
              <div className="flex gap-2">
                <Button onClick={onPreview} variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button onClick={handleSave} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save Design
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              ref={canvasRef}
              className="relative w-full aspect-video bg-gradient-to-br rounded-lg overflow-hidden shadow-lg border"
              style={{
                backgroundColor,
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {textElements.map((element) => (
                <div
                  key={element.id}
                  className="absolute cursor-move select-none"
                  style={{
                    left: `${element.position.x}%`,
                    top: `${element.position.y}%`,
                    transform: 'translate(-50%, -50%)',
                    ...element.style
                  }}
                >
                  {element.text}
                </div>
              ))}
              
              {/* Layout grid overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {template.layout_type === 'half_horizontal' && (
                  <div className="w-full h-full border-r border-white/30" style={{ width: '50%' }} />
                )}
                {template.layout_type === 'half_vertical' && (
                  <div className="w-full border-b border-white/30" style={{ height: '50%' }} />
                )}
                {template.layout_type === 'quarter' && (
                  <>
                    <div className="w-full border-b border-white/30" style={{ height: '50%' }} />
                    <div className="absolute top-0 h-full border-r border-white/30" style={{ width: '50%' }} />
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Properties Panel */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Slide Properties
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter slide title"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter slide description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="linkUrl">Link URL (optional)</Label>
              <Input
                id="linkUrl"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>

            <div>
              <Label htmlFor="duration">Display Duration (ms)</Label>
              <Input
                id="duration"
                type="number"
                value={animationDuration}
                onChange={(e) => setAnimationDuration(Number(e.target.value))}
                min={1000}
                max={30000}
                step={500}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Background
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="backgroundColor">Background Color</Label>
              <div className="flex gap-2">
                <Input
                  id="backgroundColor"
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  placeholder="#4A90E2"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="backgroundImage">Background Image URL</Label>
              <Input
                id="backgroundImage"
                value={backgroundImage}
                onChange={(e) => setBackgroundImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Text Elements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {textElements.map((element, index) => (
              <div key={element.id} className="space-y-2 p-3 border rounded">
                <Label className="text-sm font-medium">{element.id}</Label>
                <Input
                  value={element.text}
                  onChange={(e) => updateTextElement(element.id, { text: e.target.value })}
                  placeholder="Enter text"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="color"
                    value={element.style.color}
                    onChange={(e) => updateTextElement(element.id, { 
                      style: { ...element.style, color: e.target.value }
                    })}
                    className="h-8"
                  />
                  <Input
                    value={element.style.fontSize}
                    onChange={(e) => updateTextElement(element.id, { 
                      style: { ...element.style, fontSize: e.target.value }
                    })}
                    placeholder="24px"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
