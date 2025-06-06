import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { SlideTemplate, SlideDesign, TextElement } from '@/types/slideDesign';
import { 
  Type, 
  Palette, 
  Image, 
  Save, 
  Eye, 
  Plus, 
  Bold, 
  Italic, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Trash2,
  Upload,
  Play,
  Clock,
  Settings
} from 'lucide-react';
import { MediaLibrarySelector } from './MediaLibrarySelector';
import { EnhancedAIAssistant } from './EnhancedAIAssistant';
import { DraggableElement } from './DraggableElement';
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
  
  // Animation Controls
  const [animationDuration, setAnimationDuration] = useState(design?.animation_settings?.duration || 5000);
  const [animationTransition, setAnimationTransition] = useState<'fade' | 'slide' | 'zoom' | 'none'>(
    design?.animation_settings?.transition || 'fade'
  );
  const [autoPlay, setAutoPlay] = useState(design?.animation_settings?.autoPlay !== false);
  
  const [layoutType, setLayoutType] = useState<'full' | 'half_horizontal' | 'half_vertical' | 'quarter'>(
    design?.layout_type || template?.layout_type || 'full'
  );
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  
  // Memoized text elements for performance
  const [textElements, setTextElements] = useState<TextElement[]>(() => 
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
        text: 'Click to edit title',
        position: { x: 50, y: 30 },
        style: { fontSize: '2.5rem', color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' as const }
      },
      {
        id: 'subtitle',
        type: 'paragraph' as const,
        text: 'Click to edit subtitle',
        position: { x: 50, y: 60 },
        style: { fontSize: '1.5rem', color: '#FFFFFF', textAlign: 'center' as const }
      }
    ]
  );

  const canvasRef = useRef<HTMLDivElement>(null);
  const selectedElement = useMemo(() => 
    textElements.find(el => el.id === selectedElementId), 
    [textElements, selectedElementId]
  );

  // Optimized update function
  const updateTextElement = useCallback((id: string, updates: Partial<TextElement>) => {
    setTextElements(prev => 
      prev.map(el => el.id === id ? { ...el, ...updates } : el)
    );
  }, []);

  const addTextElement = useCallback(() => {
    const newElement: TextElement = {
      id: `text-${Date.now()}`,
      type: 'paragraph',
      text: 'New Text',
      position: { x: 50, y: 50 },
      style: { fontSize: '1.5rem', color: '#FFFFFF', textAlign: 'center' as const }
    };
    setTextElements(prev => [...prev, newElement]);
    setSelectedElementId(newElement.id);
  }, []);

  const deleteTextElement = useCallback((id: string) => {
    setTextElements(prev => prev.filter(el => el.id !== id));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  }, [selectedElementId]);

  const handleElementClick = useCallback((elementId: string) => {
    setSelectedElementId(elementId);
  }, []);

  const handleMediaSelect = useCallback((mediaUrl: string, mediaId: string) => {
    setBackgroundImage(mediaUrl);
    setBackgroundMediaId(mediaId);
    toast.success('Background updated');
  }, []);

  const handleImageUpload = useCallback((imageUrl: string) => {
    setBackgroundImage(imageUrl);
    setBackgroundMediaId('');
  }, []);

  const handleVideoUpload = useCallback((videoUrl: string) => {
    setBackgroundImage(videoUrl);
    setBackgroundMediaId('');
  }, []);

  const handleAIMediaGenerate = useCallback(async (type: 'image' | 'video', prompt: string) => {
    toast.info(`Generating AI ${type}...`);
    await new Promise(resolve => setTimeout(resolve, 3000));
    const mockUrl = '/lovable-uploads/ef084f8d-fe71-4e34-8587-9ac0ff3ddebf.png';
    if (type === 'image') {
      handleImageUpload(mockUrl);
    } else {
      handleVideoUpload(mockUrl);
    }
  }, [handleImageUpload, handleVideoUpload]);

  const handleRemoveImage = useCallback(() => {
    setBackgroundImage('');
    setBackgroundMediaId('');
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedElementId(null);
    }
  }, []);

  const handleSave = useCallback(() => {
    if (!title.trim()) {
      toast.error('Please enter a title');
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
        transition: animationTransition,
        autoPlay: autoPlay
      },
      link_url: linkUrl,
      is_active: true,
      display_order: design?.display_order || 0
    };

    onSave(designData);
  }, [title, description, layoutType, textElements, backgroundColor, backgroundImage, backgroundMediaId, animationDuration, animationTransition, autoPlay, linkUrl, template, design, onSave]);

  const handleStyleUpdate = useCallback((property: string, value: any) => {
    if (!selectedElement) return;
    
    updateTextElement(selectedElement.id, {
      style: {
        ...selectedElement.style,
        [property]: value
      }
    });
  }, [selectedElement, updateTextElement]);

  const setAlignment = useCallback((alignment: 'left' | 'center' | 'right') => {
    handleStyleUpdate('textAlign', alignment);
  }, [handleStyleUpdate]);

  const toggleBold = useCallback(() => {
    const currentWeight = selectedElement?.style.fontWeight || 'normal';
    const newWeight = currentWeight === 'bold' ? 'normal' : 'bold';
    handleStyleUpdate('fontWeight', newWeight);
  }, [selectedElement, handleStyleUpdate]);

  // Fixed handler for animation transition
  const handleAnimationTransitionChange = useCallback((value: string) => {
    setAnimationTransition(value as 'fade' | 'slide' | 'zoom' | 'none');
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Toolbar */}
      <div className="bg-white border-b px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">Slide Designer</h1>
          <div className="flex items-center gap-2">
            <Button onClick={addTextElement} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Text
            </Button>
            <Button size="sm" variant="outline">
              <Image className="h-4 w-4 mr-1" />
              Image
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={onPreview} variant="outline" size="sm">
            <Play className="h-4 w-4 mr-1" />
            Preview
          </Button>
          <Button onClick={handleSave} size="sm">
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>

      {/* Formatting Toolbar */}
      {selectedElement && (
        <div className="bg-white border-b px-4 py-2 flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Select 
              value={selectedElement.style.fontSize} 
              onValueChange={(value) => handleStyleUpdate('fontSize', value)}
            >
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1rem">Small</SelectItem>
                <SelectItem value="1.5rem">Medium</SelectItem>
                <SelectItem value="2rem">Large</SelectItem>
                <SelectItem value="2.5rem">X-Large</SelectItem>
                <SelectItem value="3rem">XX-Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant={selectedElement.style.fontWeight === 'bold' ? 'default' : 'outline'}
              onClick={toggleBold}
              className="h-8 w-8 p-0"
            >
              <Bold className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant={selectedElement.style.textAlign === 'left' ? 'default' : 'outline'}
              onClick={() => setAlignment('left')}
              className="h-8 w-8 p-0"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={selectedElement.style.textAlign === 'center' ? 'default' : 'outline'}
              onClick={() => setAlignment('center')}
              className="h-8 w-8 p-0"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={selectedElement.style.textAlign === 'right' ? 'default' : 'outline'}
              onClick={() => setAlignment('right')}
              className="h-8 w-8 p-0"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex items-center gap-2">
            <Label className="text-sm">Color:</Label>
            <Input
              type="color"
              value={selectedElement.style.color}
              onChange={(e) => handleStyleUpdate('color', e.target.value)}
              className="w-12 h-8 p-1"
            />
          </div>

          <Button
            onClick={() => deleteTextElement(selectedElement.id)}
            size="sm"
            variant="destructive"
            className="ml-auto h-8"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Slide Thumbnails */}
        <div className="w-64 bg-white border-r flex flex-col">
          <div className="p-3 border-b">
            <h3 className="font-medium text-sm">Slides</h3>
          </div>
          <div className="p-3">
            <div className="border-2 border-blue-500 rounded-lg p-2 bg-blue-50">
              <div className="aspect-video bg-gradient-to-br from-blue-400 to-blue-600 rounded text-white text-xs flex items-center justify-center">
                Slide 1
              </div>
              <p className="text-xs mt-1 truncate">{title}</p>
            </div>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-8 flex items-center justify-center">
            <div
              ref={canvasRef}
              className="relative bg-white shadow-2xl rounded-lg overflow-hidden"
              style={{
                width: '800px',
                height: '450px',
                backgroundColor,
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              onClick={handleCanvasClick}
            >
              {/* Text Elements */}
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
                    showBorders={true}
                    borderStyle={{
                      width: 2,
                      color: selectedElementId === element.id ? '#3b82f6' : 'transparent',
                      style: 'solid'
                    }}
                  />
                </TouchGestureHandler>
              ))}
              
              {/* Click hint */}
              {textElements.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white/80 text-center">
                    <Plus className="h-12 w-12 mx-auto mb-2" />
                    <p>Click "Text" to add content</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Properties Panel */}
        <div className="w-80 bg-white border-l flex flex-col overflow-y-auto">
          <div className="p-4 border-b">
            <h3 className="font-medium">Properties</h3>
          </div>
          
          <div className="p-4 space-y-4">
            {/* Slide Properties */}
            <div>
              <Label className="text-sm font-medium">Slide Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter slide title"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                rows={3}
                className="mt-1"
              />
            </div>

            <Separator />

            {/* Animation Controls */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <Label className="text-sm font-medium">Animation Settings</Label>
              </div>
              
              <div>
                <Label className="text-sm">Display Duration: {animationDuration / 1000}s</Label>
                <Slider
                  value={[animationDuration]}
                  onValueChange={([value]) => setAnimationDuration(value)}
                  min={1000}
                  max={30000}
                  step={500}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm">Transition Effect</Label>
                <Select value={animationTransition} onValueChange={handleAnimationTransitionChange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fade">Fade</SelectItem>
                    <SelectItem value="slide">Slide</SelectItem>
                    <SelectItem value="zoom">Zoom</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autoplay"
                  checked={autoPlay}
                  onChange={(e) => setAutoPlay(e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="autoplay" className="text-sm">Auto-play in slideshow</Label>
              </div>
            </div>

            <Separator />

            {/* Background */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Background</Label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-16 h-9 p-1"
                  />
                  <Input
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    placeholder="#4A90E2"
                    className="flex-1"
                  />
                </div>
                
                <EnhancedMediaDropZone
                  onImageUpload={handleImageUpload}
                  onVideoUpload={handleVideoUpload}
                  onAIGenerate={handleAIMediaGenerate}
                  currentMedia={backgroundImage}
                  mediaType={backgroundImage?.includes('video') ? 'video' : 'image'}
                  onRemoveMedia={handleRemoveImage}
                />
                
                <MediaLibrarySelector onSelectMedia={handleMediaSelect} />
              </div>
            </div>

            <Separator />

            <div>
              <Label className="text-sm font-medium">Link URL</Label>
              <Input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="mt-1"
              />
            </div>

            {/* AI Assistant */}
            <Separator />
            <EnhancedAIAssistant 
              onSlideGenerated={(slideData) => {
                // Handle generated slide data
                if (slideData.textElements) {
                  setTextElements(slideData.textElements);
                }
                if (slideData.backgroundColor) {
                  setBackgroundColor(slideData.backgroundColor);
                }
                if (slideData.backgroundImage) {
                  setBackgroundImage(slideData.backgroundImage);
                }
                toast.success('AI suggestions applied');
              }}
              currentSlideData={{
                title,
                description,
                textElements,
                backgroundColor,
                backgroundImage
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
