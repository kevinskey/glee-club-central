
import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { SlideTemplate, SlideDesign, TextElement } from '@/types/slideDesign';
import { 
  Type, 
  Palette, 
  Image as ImageIcon, 
  Save, 
  Eye, 
  Plus, 
  Bold, 
  Italic, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Trash2,
  Play,
  Clock,
  Settings,
  Layers,
  Grid,
  ZoomIn,
  ZoomOut,
  Undo,
  Redo,
  Copy,
  Download,
  Upload
} from 'lucide-react';
import { MediaLibrarySelector } from './MediaLibrarySelector';
import { EnhancedAIAssistant } from './EnhancedAIAssistant';
import { DraggableElement } from './DraggableElement';
import { TouchGestureHandler } from './TouchGestureHandler';
import { EnhancedMediaDropZone } from './EnhancedMediaDropZone';
import { TextToolbar } from './TextToolbar';
import { toast } from 'sonner';

interface EnhancedWYSIWYGEditorProps {
  template?: SlideTemplate;
  design?: SlideDesign;
  onSave: (designData: Partial<SlideDesign>) => void;
  onPreview: () => void;
}

export function EnhancedWYSIWYGEditor({ template, design, onSave, onPreview }: EnhancedWYSIWYGEditorProps) {
  // Core state
  const [title, setTitle] = useState(design?.title || 'New Slide');
  const [description, setDescription] = useState(design?.description || '');
  const [backgroundColor, setBackgroundColor] = useState(design?.background_color || '#4A90E2');
  const [backgroundImage, setBackgroundImage] = useState(design?.background_image_url || '');
  const [backgroundMediaId, setBackgroundMediaId] = useState(design?.background_media_id || '');
  const [linkUrl, setLinkUrl] = useState(design?.link_url || '');
  
  // Enhanced editor state
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [selectedTool, setSelectedTool] = useState<'select' | 'text' | 'image'>('select');
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
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
  
  // Text elements with enhanced functionality
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
        style: { fontSize: '2.5rem', color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' as const, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }
      },
      {
        id: 'subtitle',
        type: 'paragraph' as const,
        text: 'Click to edit subtitle',
        position: { x: 50, y: 60 },
        style: { fontSize: '1.5rem', color: '#FFFFFF', textAlign: 'center' as const, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }
      }
    ]
  );

  const canvasRef = useRef<HTMLDivElement>(null);
  const selectedElement = useMemo(() => 
    textElements.find(el => el.id === selectedElementId), 
    [textElements, selectedElementId]
  );

  // Enhanced update function with history
  const updateTextElement = useCallback((id: string, updates: Partial<TextElement>) => {
    setTextElements(prev => {
      const newElements = prev.map(el => el.id === id ? { ...el, ...updates } : el);
      // Add to history
      setHistory(hist => [...hist.slice(0, historyIndex + 1), { textElements: prev }]);
      setHistoryIndex(idx => idx + 1);
      return newElements;
    });
  }, [historyIndex]);

  const addTextElement = useCallback(() => {
    const newElement: TextElement = {
      id: `text-${Date.now()}`,
      type: 'paragraph',
      text: 'New Text Element',
      position: { x: 50, y: 50 },
      style: { 
        fontSize: '1.5rem', 
        color: '#FFFFFF', 
        textAlign: 'center' as const,
        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
      }
    };
    setTextElements(prev => {
      const newElements = [...prev, newElement];
      setHistory(hist => [...hist.slice(0, historyIndex + 1), { textElements: prev }]);
      setHistoryIndex(idx => idx + 1);
      return newElements;
    });
    setSelectedElementId(newElement.id);
    toast.success('Text element added');
  }, [historyIndex]);

  const deleteTextElement = useCallback((id: string) => {
    setTextElements(prev => {
      const newElements = prev.filter(el => el.id !== id);
      setHistory(hist => [...hist.slice(0, historyIndex + 1), { textElements: prev }]);
      setHistoryIndex(idx => idx + 1);
      return newElements;
    });
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
    toast.success('Text element deleted');
  }, [selectedElementId, historyIndex]);

  const duplicateElement = useCallback((id: string) => {
    const element = textElements.find(el => el.id === id);
    if (element) {
      const newElement: TextElement = {
        ...element,
        id: `text-${Date.now()}`,
        position: { x: element.position.x + 5, y: element.position.y + 5 }
      };
      setTextElements(prev => [...prev, newElement]);
      setSelectedElementId(newElement.id);
      toast.success('Element duplicated');
    }
  }, [textElements]);

  // Undo/Redo functionality
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setTextElements(prevState.textElements);
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setTextElements(nextState.textElements);
      setHistoryIndex(historyIndex + 1);
    }
  }, [history, historyIndex]);

  const handleElementClick = useCallback((elementId: string) => {
    setSelectedElementId(elementId);
    setSelectedTool('select');
  }, []);

  const handleMediaSelect = useCallback((mediaUrl: string, mediaId: string) => {
    setBackgroundImage(mediaUrl);
    setBackgroundMediaId(mediaId);
    toast.success('Background updated');
  }, []);

  const handleImageUpload = useCallback((imageUrl: string) => {
    setBackgroundImage(imageUrl);
    setBackgroundMediaId('');
    toast.success('Background image uploaded');
  }, []);

  const handleVideoUpload = useCallback((videoUrl: string) => {
    setBackgroundImage(videoUrl);
    setBackgroundMediaId('');
    toast.success('Background video uploaded');
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
    toast.success('Background removed');
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget && selectedTool === 'text') {
      // Add text element at click position
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        const newElement: TextElement = {
          id: `text-${Date.now()}`,
          type: 'paragraph',
          text: 'New Text',
          position: { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) },
          style: { 
            fontSize: '1.5rem', 
            color: '#FFFFFF', 
            textAlign: 'center' as const,
            textShadow: '0 1px 2px rgba(0,0,0,0.5)'
          }
        };
        
        setTextElements(prev => [...prev, newElement]);
        setSelectedElementId(newElement.id);
        setSelectedTool('select');
      }
    } else if (e.target === e.currentTarget) {
      setSelectedElementId(null);
    }
  }, [selectedTool]);

  const exportDesign = useCallback(() => {
    const designData = {
      title,
      description,
      textElements,
      backgroundColor,
      backgroundImage,
      animationSettings: {
        duration: animationDuration,
        transition: animationTransition,
        autoPlay
      }
    };
    
    const dataStr = JSON.stringify(designData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${title.replace(/\s+/g, '_').toLowerCase()}_design.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Design exported successfully');
  }, [title, description, textElements, backgroundColor, backgroundImage, animationDuration, animationTransition, autoPlay]);

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

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Enhanced Top Toolbar */}
      <div className="bg-white border-b px-4 py-2 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-gray-900">Advanced Slide Designer</h1>
          
          {/* Tool Selector */}
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button 
              size="sm" 
              variant={selectedTool === 'select' ? 'default' : 'ghost'}
              onClick={() => setSelectedTool('select')}
              className="h-8 w-8 p-0"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant={selectedTool === 'text' ? 'default' : 'ghost'}
              onClick={() => setSelectedTool('text')}
              className="h-8 w-8 p-0"
            >
              <Type className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant={selectedTool === 'image' ? 'default' : 'ghost'}
              onClick={() => setSelectedTool('image')}
              className="h-8 w-8 p-0"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <Button onClick={addTextElement} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Text
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button 
              onClick={undo} 
              size="sm" 
              variant="outline"
              disabled={historyIndex <= 0}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button 
              onClick={redo} 
              size="sm" 
              variant="outline"
              disabled={historyIndex >= history.length - 1}
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm">
            <Button
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0"
            >
              <ZoomOut className="h-3 w-3" />
            </Button>
            <span className="text-xs font-medium min-w-[45px] text-center">{zoom}%</span>
            <Button
              onClick={() => setZoom(Math.min(200, zoom + 10))}
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0"
            >
              <ZoomIn className="h-3 w-3" />
            </Button>
          </div>
          
          <Separator orientation="vertical" className="h-6" />
          
          <Button onClick={exportDesign} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
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

      {/* Text Formatting Toolbar */}
      {selectedElement && (
        <div className="bg-white border-b px-4 py-2 flex items-center gap-4 shadow-sm">
          <div className="flex items-center gap-1">
            <Select 
              value={selectedElement.style.fontSize} 
              onValueChange={(value) => handleStyleUpdate('fontSize', value)}
            >
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.875rem">14px</SelectItem>
                <SelectItem value="1rem">16px</SelectItem>
                <SelectItem value="1.125rem">18px</SelectItem>
                <SelectItem value="1.25rem">20px</SelectItem>
                <SelectItem value="1.5rem">24px</SelectItem>
                <SelectItem value="2rem">32px</SelectItem>
                <SelectItem value="2.5rem">40px</SelectItem>
                <SelectItem value="3rem">48px</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant={selectedElement.style.fontWeight === 'bold' ? 'default' : 'outline'}
              onClick={() => handleStyleUpdate('fontWeight', selectedElement.style.fontWeight === 'bold' ? 'normal' : 'bold')}
              className="h-8 w-8 p-0"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={selectedElement.style.fontStyle === 'italic' ? 'default' : 'outline'}
              onClick={() => handleStyleUpdate('fontStyle', selectedElement.style.fontStyle === 'italic' ? 'normal' : 'italic')}
              className="h-8 w-8 p-0"
            >
              <Italic className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant={selectedElement.style.textAlign === 'left' ? 'default' : 'outline'}
              onClick={() => handleStyleUpdate('textAlign', 'left')}
              className="h-8 w-8 p-0"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={selectedElement.style.textAlign === 'center' ? 'default' : 'outline'}
              onClick={() => handleStyleUpdate('textAlign', 'center')}
              className="h-8 w-8 p-0"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={selectedElement.style.textAlign === 'right' ? 'default' : 'outline'}
              onClick={() => handleStyleUpdate('textAlign', 'right')}
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

          <div className="flex items-center gap-2 ml-auto">
            <Button
              onClick={() => duplicateElement(selectedElement.id)}
              size="sm"
              variant="outline"
              className="h-8"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => deleteTextElement(selectedElement.id)}
              size="sm"
              variant="destructive"
              className="h-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Layer Management */}
        <div className="w-64 bg-white border-r flex flex-col">
          <div className="p-3 border-b">
            <h3 className="font-medium text-sm flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Layers
            </h3>
          </div>
          <div className="flex-1 overflow-auto p-3 space-y-2">
            {textElements.map((element, index) => (
              <div
                key={element.id}
                className={`p-2 rounded border cursor-pointer transition-colors ${
                  selectedElementId === element.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleElementClick(element.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Type className="h-3 w-3 text-gray-500" />
                    <span className="text-xs font-medium truncate">
                      {element.text.substring(0, 15)}...
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {element.type}
                  </div>
                </div>
              </div>
            ))}
            {textElements.length === 0 && (
              <div className="text-center text-gray-500 text-sm py-8">
                No elements yet
              </div>
            )}
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-8 flex items-center justify-center overflow-auto">
            <div
              ref={canvasRef}
              className="relative bg-white shadow-2xl rounded-lg overflow-hidden border-2 border-gray-200"
              style={{
                width: `${800 * (zoom / 100)}px`,
                height: `${450 * (zoom / 100)}px`,
                backgroundColor,
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
              onClick={handleCanvasClick}
            >
              {/* Grid Overlay */}
              {showGrid && (
                <div 
                  className="absolute inset-0 pointer-events-none opacity-30"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}
                />
              )}

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
              
              {/* Tool Helper */}
              {selectedTool === 'text' && (
                <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Click to add text
                </div>
              )}
            </div>
          </div>
          
          {/* Canvas Controls */}
          <div className="bg-white border-t px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="show-grid"
                  checked={showGrid}
                  onCheckedChange={setShowGrid}
                />
                <Label htmlFor="show-grid" className="text-sm">Grid</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="snap-to-grid"
                  checked={snapToGrid}
                  onCheckedChange={setSnapToGrid}
                />
                <Label htmlFor="snap-to-grid" className="text-sm">Snap</Label>
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              Canvas: 800 × 450px
            </div>
          </div>
        </div>

        {/* Enhanced Right Properties Panel */}
        <div className="w-80 bg-white border-l flex flex-col overflow-y-auto">
          <div className="p-4 border-b">
            <h3 className="font-medium">Properties</h3>
          </div>
          
          <div className="p-4 space-y-6">
            {/* Slide Properties */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900">Slide Settings</h4>
              <div>
                <Label className="text-sm font-medium">Title</Label>
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
            </div>

            <Separator />

            {/* Text Element Properties */}
            {selectedElement && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-900">Text Properties</h4>
                <TextToolbar
                  selectedElement={selectedElement}
                  onUpdateElement={updateTextElement}
                  onAddElement={addTextElement}
                  onDeleteElement={deleteTextElement}
                />
              </div>
            )}

            <Separator />

            {/* Background Settings */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900">Background</h4>
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

            <Separator />

            {/* Animation Controls */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <h4 className="text-sm font-medium text-gray-900">Animation</h4>
              </div>
              
              <div>
                <Label className="text-sm">Duration: {animationDuration / 1000}s</Label>
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
                <Label className="text-sm">Transition</Label>
                <Select value={animationTransition} onValueChange={(value: any) => setAnimationTransition(value)}>
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
                <Switch
                  id="autoplay"
                  checked={autoPlay}
                  onCheckedChange={setAutoPlay}
                />
                <Label htmlFor="autoplay" className="text-sm">Auto-play</Label>
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
              onApplySuggestion={(suggestion) => {
                if (suggestion.type === 'text' && selectedElementId) {
                  updateTextElement(selectedElementId, {
                    text: suggestion.content,
                    style: { ...selectedElement?.style, ...suggestion.data }
                  });
                }
              }}
              onGenerateGraphics={() => {}}
              onGenerateVideo={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
