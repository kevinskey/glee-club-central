import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { SlideTemplate, SlideDesign, TextElement } from '@/types/slideDesign';
import { Type, Palette, Image, Link, Save, Eye, Plus } from 'lucide-react';
import { MediaLibrarySelector } from './MediaLibrarySelector';
import { TextToolbar } from './TextToolbar';
import { EnhancedAIAssistant } from './EnhancedAIAssistant';
import { DraggableElement } from './DraggableElement';
import { BorderSettings } from './BorderSettings';
import { SectionValidator } from './SectionValidator';
import { TouchGestureHandler } from './TouchGestureHandler';
import { EnhancedMediaDropZone } from './EnhancedMediaDropZone';
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
  
  const [showBorders, setShowBorders] = useState(false);
  const [borderStyle, setBorderStyle] = useState<{
    width: number;
    color: string;
    style: 'solid' | 'dashed' | 'dotted';
  }>({
    width: 2,
    color: '#3b82f6',
    style: 'solid'
  });
  
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

  // Section validation state
  const [sections] = useState([
    { id: 'title', name: 'Title & Description', required: true, completed: !!title, description: 'Main slide information' },
    { id: 'background', name: 'Background', required: true, completed: !!(backgroundColor || backgroundImage), description: 'Color or image background' },
    { id: 'text', name: 'Text Elements', required: true, completed: textElements.length > 0, description: 'At least one text element' },
    { id: 'layout', name: 'Layout', required: false, completed: !!layoutType, description: 'Slide layout configuration' },
    { id: 'animation', name: 'Animation', required: false, completed: animationDuration > 0, description: 'Animation and timing settings' }
  ]);

  const canSave = sections.filter(s => s.required).every(s => s.completed);

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

  const handleImageUpload = (imageUrl: string) => {
    setBackgroundImage(imageUrl);
    setBackgroundMediaId('');
  };

  const handleVideoUpload = (videoUrl: string) => {
    setBackgroundImage(videoUrl);
    setBackgroundMediaId('');
    toast.success('Background video uploaded');
  };

  const handleAIMediaGenerate = async (type: 'image' | 'video', prompt: string) => {
    toast.info(`Generating AI ${type}...`);
    // In real implementation, this would call an AI service
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock response
    const mockUrl = '/lovable-uploads/ef084f8d-fe71-4e34-8587-9ac0ff3ddebf.png';
    if (type === 'image') {
      handleImageUpload(mockUrl);
    } else {
      handleVideoUpload(mockUrl);
    }
  };

  const handleRemoveImage = () => {
    setBackgroundImage('');
    setBackgroundMediaId('');
    toast.success('Background media removed');
  };

  const handleAISuggestion = (suggestion: any) => {
    if (suggestion.type === 'text' && suggestion.data) {
      if (selectedElementId) {
        updateTextElement(selectedElementId, {
          text: suggestion.content,
          style: { ...textElements.find(el => el.id === selectedElementId)?.style, ...suggestion.data }
        });
      } else {
        const newElement: TextElement = {
          id: `ai-text-${Date.now()}`,
          type: 'paragraph',
          text: suggestion.content,
          position: { x: 50, y: 30 },
          style: { fontSize: '1rem', color: '#FFFFFF', textAlign: 'center' as const, ...suggestion.data }
        };
        setTextElements(prev => [...prev, newElement]);
        setSelectedElementId(newElement.id);
      }
    } else if (suggestion.type === 'color' && suggestion.data) {
      setBackgroundColor(suggestion.data.background);
    }
  };

  const handleAIGraphics = (prompt: string) => {
    toast.info('Generating AI graphics...');
    // Implementation for AI graphics generation
  };

  const handleAIVideo = (prompt: string) => {
    toast.info('Generating AI video...');
    // Implementation for AI video generation
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedElementId(null);
    }
  };

  const handleSectionClick = (sectionId: string) => {
    toast.info(`Focus on ${sectionId} section`);
    // Could scroll to or highlight the relevant section
  };

  const handleSave = () => {
    if (!canSave) {
      toast.error('Please complete all required sections before saving');
      return;
    }

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

  const renderNonDesignableAreas = () => {
    const areas = [];
    
    if (layoutType === 'half_horizontal') {
      areas.push(
        <div
          key="non-designable-bottom"
          className="absolute bottom-0 left-0 w-full h-1/2 bg-gray-400/30 border-2 border-dashed border-gray-500/50 flex items-center justify-center pointer-events-none"
        >
          <div className="text-center text-gray-600 text-sm font-medium">
            <div className="mb-1">Non-Designable Area</div>
            <div className="text-xs opacity-75">Reserved for other content</div>
          </div>
        </div>
      );
    } else if (layoutType === 'half_vertical') {
      areas.push(
        <div
          key="non-designable-right"
          className="absolute right-0 top-0 w-1/2 h-full bg-gray-400/30 border-2 border-dashed border-gray-500/50 flex items-center justify-center pointer-events-none"
        >
          <div className="text-center text-gray-600 text-sm font-medium">
            <div className="mb-1">Non-Designable Area</div>
            <div className="text-xs opacity-75">Reserved for other content</div>
          </div>
        </div>
      );
    } else if (layoutType === 'quarter') {
      areas.push(
        <div
          key="non-designable-top-right"
          className="absolute top-0 right-0 w-1/2 h-1/2 bg-gray-400/30 border-2 border-dashed border-gray-500/50 flex items-center justify-center pointer-events-none"
        >
          <div className="text-center text-gray-600 text-sm font-medium">
            <div className="mb-1">Non-Designable</div>
            <div className="text-xs opacity-75">Reserved</div>
          </div>
        </div>,
        <div
          key="non-designable-bottom-left"
          className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gray-400/30 border-2 border-dashed border-gray-500/50 flex items-center justify-center pointer-events-none"
        >
          <div className="text-center text-gray-600 text-sm font-medium">
            <div className="mb-1">Non-Designable</div>
            <div className="text-xs opacity-75">Reserved</div>
          </div>
        </div>,
        <div
          key="non-designable-bottom-right"
          className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gray-400/30 border-2 border-dashed border-gray-500/50 flex items-center justify-center pointer-events-none"
        >
          <div className="text-center text-gray-600 text-sm font-medium">
            <div className="mb-1">Non-Designable</div>
            <div className="text-xs opacity-75">Reserved</div>
          </div>
        </div>
      );
    }
    
    return areas;
  };

  return (
    <div className="flex flex-col space-y-4 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-4">
      {/* Canvas Area - Full width on mobile, spans 6 columns on desktop */}
      <div className="lg:col-span-6 order-1">
        <Card className="h-full">
          <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
            <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm sm:text-base">
              <span>Design Canvas (8.5" × 11")</span>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button onClick={onPreview} variant="outline" size="sm" className="h-8 flex-1 sm:flex-none">
                  <Eye className="h-3 w-3 mr-1" />
                  <span className="hidden xs:inline">Preview</span>
                </Button>
                <Button 
                  onClick={handleSave} 
                  size="sm" 
                  className="h-8 flex-1 sm:flex-none"
                  disabled={!canSave}
                >
                  <Save className="h-3 w-3 mr-1" />
                  <span className="hidden xs:inline">Save </span>Design
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div
              ref={canvasRef}
              className="relative w-full bg-gradient-to-br rounded-lg overflow-hidden shadow-lg border cursor-crosshair mx-auto"
              style={{
                aspectRatio: '8.5 / 11',
                maxWidth: '100%',
                backgroundColor,
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              onClick={handleCanvasClick}
            >
              {/* Text Elements with Enhanced Touch & Drag */}
              {textElements.map((element) => (
                <TouchGestureHandler
                  key={element.id}
                  element={element}
                  onUpdate={(updates) => updateTextElement(element.id, updates)}
                  onSelect={() => handleElementClick(element.id)}
                  containerRef={canvasRef}
                >
                  <DraggableElement
                    element={element}
                    isSelected={selectedElementId === element.id}
                    onSelect={() => handleElementClick(element.id)}
                    onUpdate={(updates) => updateTextElement(element.id, updates)}
                    containerRef={canvasRef}
                    showBorders={showBorders}
                    borderStyle={borderStyle}
                  />
                </TouchGestureHandler>
              ))}
              
              {/* Layout grid overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {layoutType === 'half_horizontal' && (
                  <div className="w-full border-b border-white/30" style={{ height: '50%' }} />
                )}
                {layoutType === 'half_vertical' && (
                  <div className="h-full border-r border-white/30" style={{ width: '50%' }} />
                )}
                {layoutType === 'quarter' && (
                  <>
                    <div className="w-full border-b border-white/30" style={{ height: '50%' }} />
                    <div className="absolute top-0 h-full border-r border-white/30" style={{ width: '50%' }} />
                  </>
                )}
              </div>

              {/* Non-designable areas */}
              {renderNonDesignableAreas()}
              
              {/* Add Text Button */}
              <Button
                onClick={addTextElement}
                size="sm"
                className="absolute top-2 right-2 h-8 opacity-70 hover:opacity-100"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Text
              </Button>
            </div>
            
            <div className="mt-2 text-xs text-muted-foreground space-y-1">
              <p>💡 Touch/click elements to select, double-tap to edit, drag to move, pinch to scale</p>
              <p>📄 Canvas represents standard US Letter size (8.5" × 11")</p>
              {layoutType !== 'full' && (
                <p>🚫 Grayed areas are reserved for other content and cannot be designed</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Properties Panel - spans 3 columns */}
      <div className="lg:col-span-3 order-2 space-y-3">
        <SectionValidator
          sections={sections}
          onSectionClick={handleSectionClick}
          canSave={canSave}
        />

        <Card>
          <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <Type className="h-4 w-4" />
              Slide Properties
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0 space-y-3">
            <div className="space-y-1">
              <Label htmlFor="title" className="text-sm">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter slide title"
                className="h-8"
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="description" className="text-sm">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter slide description"
                rows={2}
                className="text-sm resize-none"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="layout" className="text-sm">Layout Type</Label>
              <Select value={layoutType} onValueChange={(value) => setLayoutType(value as any)}>
                <SelectTrigger className="h-8">
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

            <div className="space-y-1">
              <Label htmlFor="linkUrl" className="text-sm">Link URL (optional)</Label>
              <Input
                id="linkUrl"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="h-8"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="duration" className="text-sm">Display Duration (ms)</Label>
              <Input
                id="duration"
                type="number"
                value={animationDuration}
                onChange={(e) => setAnimationDuration(Number(e.target.value))}
                min={1000}
                max={30000}
                step={500}
                className="h-8"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <Palette className="h-4 w-4" />
              Background
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0 space-y-3">
            <div className="space-y-1">
              <Label htmlFor="backgroundColor" className="text-sm">Background Color</Label>
              <div className="flex gap-2">
                <Input
                  id="backgroundColor"
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-12 h-8 p-1"
                />
                <Input
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  placeholder="#4A90E2"
                  className="flex-1 h-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Background Media</Label>
              <EnhancedMediaDropZone
                onImageUpload={handleImageUpload}
                onVideoUpload={handleVideoUpload}
                onAIGenerate={handleAIMediaGenerate}
                currentMedia={backgroundImage}
                mediaType={backgroundImage?.includes('video') ? 'video' : 'image'}
                onRemoveMedia={handleRemoveImage}
              />
              <MediaLibrarySelector onSelectMedia={handleMediaSelect} />
              <Input
                value={backgroundImage}
                onChange={(e) => setBackgroundImage(e.target.value)}
                placeholder="Or enter image/video URL directly"
                className="h-8 text-sm"
              />
            </div>
          </CardContent>
        </Card>

        <BorderSettings
          showBorders={showBorders}
          onShowBordersChange={setShowBorders}
          borderStyle={borderStyle}
          onBorderStyleChange={setBorderStyle}
        />
      </div>

      {/* Enhanced AI Assistant & Text Tools Panel - spans 3 columns */}
      <div className="lg:col-span-3 order-3 space-y-3">
        <EnhancedAIAssistant 
          onApplySuggestion={handleAISuggestion}
          onGenerateGraphics={handleAIGraphics}
          onGenerateVideo={handleAIVideo}
        />
        
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
