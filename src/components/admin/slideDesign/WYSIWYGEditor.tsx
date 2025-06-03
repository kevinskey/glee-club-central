import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { SlideTemplate, SlideDesign, TextElement, BackgroundElement } from '@/types/slideDesign';
import { Type, Palette, Image, Link, Save, Eye, MousePointer } from 'lucide-react';
import { MediaLibrarySelector } from './MediaLibrarySelector';
import { TextToolbar } from './TextToolbar';
import { toast } from 'sonner';

interface WYSIWYGEditorProps {
  template?: SlideTemplate;
  design?: SlideDesign;
  onSave: (designData: Partial<SlideDesign>) => void;
  onPreview: () => void;
}

export function WYSIWYGEditor({ template, design, onSave, onPreview }: WYSIWYGEditorProps) {
  const [title, setTitle] = useState(design?.title || 'New Slide');
  const [description, setDescription] = useState(design?.description || '');
  const [backgroundColor, setBackgroundColor] = useState(design?.background_color || '#4A90E2');
  const [backgroundImage, setBackgroundImage] = useState(design?.background_image_url || '');
  const [backgroundMediaId, setBackgroundMediaId] = useState(design?.background_media_id || '');
  const [linkUrl, setLinkUrl] = useState(design?.link_url || '');
  const [animationDuration, setAnimationDuration] = useState(design?.animation_settings?.duration || 5000);
  const [layoutType, setLayoutType] = useState<'full' | 'half_horizontal' | 'half_vertical' | 'quarter'>(
    design?.layout_type || template?.layout_type || 'full'
  );
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  
  const [textElements, setTextElements] = useState<TextElement[]>(
    design?.design_data?.textElements || 
    (template?.template_data?.textAreas || []).map(area => ({
      id: area.id,
      type: area.type,
      text: area.defaultText,
      position: area.position,
      style: area.style
    })) || [
      {
        id: 'main-title',
        type: 'heading' as const,
        text: 'Your Slide Title',
        position: { x: 50, y: 40 },
        style: { fontSize: '2rem', color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' as const }
      },
      {
        id: 'subtitle',
        type: 'paragraph' as const,
        text: 'Your slide description here',
        position: { x: 50, y: 60 },
        style: { fontSize: '1.2rem', color: '#FFFFFF', textAlign: 'center' as const }
      }
    ]
  );

  const canvasRef = useRef<HTMLDivElement>(null);

  const updateTextElement = (id: string, updates: Partial<TextElement>) => {
    setTextElements(prev => 
      prev.map(el => el.id === id ? { ...el, ...updates } : el)
    );
  };

  const addTextElement = () => {
    const newElement: TextElement = {
      id: `text-${Date.now()}`,
      type: 'paragraph',
      text: 'New Text',
      position: { x: 50, y: 50 },
      style: { fontSize: '1rem', color: '#FFFFFF', textAlign: 'center' as const }
    };
    setTextElements(prev => [...prev, newElement]);
    setSelectedElementId(newElement.id);
  };

  const deleteTextElement = (id: string) => {
    setTextElements(prev => prev.filter(el => el.id !== id));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  };

  const handleElementClick = (elementId: string) => {
    setSelectedElementId(elementId);
  };

  const handleMediaSelect = (mediaUrl: string, mediaId: string) => {
    setBackgroundImage(mediaUrl);
    setBackgroundMediaId(mediaId);
    toast.success('Background image updated');
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast.error('Please enter a title for your slide');
      return;
    }

    const designData: Partial<SlideDesign> = {
      template_id: template?.id,
      title,
      description,
      layout_type: layoutType,
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
      background_media_id: backgroundMediaId,
      animation_settings: {
        duration: animationDuration,
        transition: 'fade',
        autoPlay: true
      },
      link_url: linkUrl,
      is_active: true,
      display_order: design?.display_order || 0
    };

    onSave(designData);
  };

  const selectedElement = textElements.find(el => el.id === selectedElementId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
              className="relative w-full aspect-video bg-gradient-to-br rounded-lg overflow-hidden shadow-lg border cursor-crosshair"
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
                  className={`absolute cursor-pointer select-none border-2 transition-all ${
                    selectedElementId === element.id 
                      ? 'border-blue-400 bg-blue-400/20' 
                      : 'border-transparent hover:border-white/50'
                  }`}
                  style={{
                    left: `${element.position.x}%`,
                    top: `${element.position.y}%`,
                    transform: 'translate(-50%, -50%)',
                    ...element.style,
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    padding: '8px',
                    borderRadius: '4px'
                  }}
                  onClick={() => handleElementClick(element.id)}
                >
                  {element.text}
                  {selectedElementId === element.id && (
                    <MousePointer className="absolute -top-2 -right-2 h-4 w-4 text-blue-400" />
                  )}
                </div>
              ))}
              
              {/* Layout grid overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {layoutType === 'half_horizontal' && (
                  <div className="w-full h-full border-r border-white/30" style={{ width: '50%' }} />
                )}
                {layoutType === 'half_vertical' && (
                  <div className="w-full border-b border-white/30" style={{ height: '50%' }} />
                )}
                {layoutType === 'quarter' && (
                  <>
                    <div className="w-full border-b border-white/30" style={{ height: '50%' }} />
                    <div className="absolute top-0 h-full border-r border-white/30" style={{ width: '50%' }} />
                  </>
                )}
              </div>
            </div>
            
            <div className="mt-4 text-sm text-muted-foreground">
              <p>💡 Click on text elements to select and edit them</p>
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
              <Label htmlFor="layout">Layout Type</Label>
              <Select value={layoutType} onValueChange={(value) => setLayoutType(value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Page</SelectItem>
                  <SelectItem value="half_horizontal">Split Horizontal</SelectItem>
                  <SelectItem value="half_vertical">Split Vertical</SelectItem>
                  <SelectItem value="quarter">Quarter Layout</SelectItem>
                </SelectContent>
              </Select>
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
              <Label>Background Image</Label>
              <div className="space-y-2">
                <MediaLibrarySelector onSelectMedia={handleMediaSelect} />
                <Input
                  value={backgroundImage}
                  onChange={(e) => setBackgroundImage(e.target.value)}
                  placeholder="Or enter image URL directly"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Text Tools Panel */}
      <div>
        <TextToolbar
          selectedElement={selectedElement}
          onUpdateElement={updateTextElement}
          onAddElement={addTextElement}
          onDeleteElement={deleteTextElement}
        />
      </div>
    </div>
  );
}
