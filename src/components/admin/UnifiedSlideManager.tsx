import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Edit, Eye, Trash2, Save, X, Settings, Plus, ChevronLeft, ChevronRight, Play, Pause, SkipBack, SkipForward, RotateCcw, Clock, Zap, Image, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';

interface SlideData {
  id: string;
  title: string;
  description?: string;
  background_image_url?: string;
  background_color?: string;
  link_url?: string;
  design_data?: {
    buttonText?: string;
    textPosition?: 'top' | 'center' | 'bottom';
    textAlignment?: 'left' | 'center' | 'right';
    showText?: boolean;
    height?: 'tiny' | 'small' | 'medium' | 'full' | 'large';
    objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
    objectPosition?: string;
    overlayOpacity?: number;
  };
  display_order: number;
  is_active: boolean;
}

export function UnifiedSlideManager() {
  const { filteredMediaFiles, fetchAllMedia } = useMediaLibrary();
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState<SlideData | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hero controls state
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(5000);
  const [transition, setTransition] = useState('fade');
  const [autoPlay, setAutoPlay] = useState(true);
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);

  useEffect(() => {
    fetchSlides();
    fetchAllMedia();
  }, []);

  // Auto-advance slides with hero controls
  useEffect(() => {
    if (slides.length > 1 && isPlaying && autoPlay) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, speed);
      return () => clearInterval(timer);
    }
  }, [slides.length, isPlaying, autoPlay, speed]);

  const fetchSlides = async () => {
    console.log('🔍 UnifiedSlideManager: Starting to fetch slides...');
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔍 UnifiedSlideManager: Executing database query...');
      const { data, error: dbError } = await supabase
        .from('slide_designs')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      console.log('🔍 UnifiedSlideManager: Database response:', { data, error: dbError });

      if (dbError) {
        console.error('🚨 UnifiedSlideManager: Database error:', dbError);
        setError(`Database error: ${dbError.message}`);
        throw dbError;
      }
      
      console.log('🔍 UnifiedSlideManager: Successfully fetched slides:', data?.length || 0, 'slides');
      setSlides(data || []);
      
      if (!data || data.length === 0) {
        console.log('🔍 UnifiedSlideManager: No slides found in database');
        setError('No active slides found in the database');
      }
    } catch (error) {
      console.error('🚨 UnifiedSlideManager: Error fetching slides:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Failed to load slides: ${errorMessage}`);
      toast.error('Failed to load slides');
      setSlides([]);
    } finally {
      setIsLoading(false);
      console.log('🔍 UnifiedSlideManager: Fetch slides completed');
    }
  };

  // Hero control handlers
  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handlePlayPause = () => setIsPlaying(!isPlaying);
  
  const handleNext = () => {
    if (slides.length > 1) {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }
  };
  
  const handlePrevious = () => {
    if (slides.length > 1) {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };
  
  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };
  
  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
  };
  
  const handleTransitionChange = (newTransition: string) => {
    setTransition(newTransition);
  };
  
  const handleAutoPlayToggle = (enabled: boolean) => {
    setAutoPlay(enabled);
    if (!enabled) {
      setIsPlaying(false);
    }
  };
  
  const handleReset = () => {
    setCurrentSlide(0);
    setIsPlaying(true);
  };

  const handleEditSlide = (slide: SlideData) => {
    setEditingSlide({ ...slide });
    setEditDialogOpen(true);
  };

  const handleSaveSlide = async () => {
    if (!editingSlide) return;

    try {
      const { error } = await supabase
        .from('slide_designs')
        .update({
          title: editingSlide.title,
          description: editingSlide.description,
          background_color: editingSlide.background_color,
          background_image_url: editingSlide.background_image_url,
          link_url: editingSlide.link_url,
          design_data: editingSlide.design_data,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingSlide.id);

      if (error) throw error;

      toast.success('Slide updated successfully');
      setEditDialogOpen(false);
      setEditingSlide(null);
      fetchSlides();
    } catch (error) {
      console.error('Error updating slide:', error);
      toast.error('Failed to update slide');
    }
  };

  const handleDeleteSlide = async (slideId: string) => {
    if (!window.confirm('Are you sure you want to delete this slide?')) return;

    try {
      const { error } = await supabase
        .from('slide_designs')
        .update({ is_active: false })
        .eq('id', slideId);

      if (error) throw error;

      toast.success('Slide deleted successfully');
      fetchSlides();
    } catch (error) {
      console.error('Error deleting slide:', error);
      toast.error('Failed to delete slide');
    }
  };

  const handleImageSelect = (media: any) => {
    if (!editingSlide) return;
    setEditingSlide(prev => prev ? {
      ...prev,
      background_image_url: media.file_url
    } : null);
    toast.success('Background image updated');
  };

  const handleImageUpload = async (file: File) => {
    if (!editingSlide) return;
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `slide-bg-${Date.now()}.${fileExt}`;
      const filePath = `slides/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media-library')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media-library')
        .getPublicUrl(filePath);

      setEditingSlide(prev => prev ? {
        ...prev,
        background_image_url: publicUrl
      } : null);

      toast.success('Image uploaded and set as background');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
  };

  const handleRemoveImage = () => {
    if (!editingSlide) return;
    setEditingSlide(prev => prev ? {
      ...prev,
      background_image_url: ''
    } : null);
    toast.success('Background image removed');
  };

  const getResponsiveHeightClass = (height?: string) => {
    // Remove fixed height constraints to let image determine height
    switch (height) {
      case 'tiny': return 'min-h-[200px] max-h-[300px]';
      case 'small': return 'min-h-[250px] max-h-[400px]';
      case 'medium': return 'min-h-[300px] max-h-[500px]';
      case 'full': return 'min-h-[400px] max-h-screen';
      case 'large':
      default:
        return 'min-h-[320px]'; // Only set minimum, let image determine actual height
    }
  };

  const getTextPositionClass = (position?: string) => {
    switch (position) {
      case 'top': return 'items-start pt-4 md:pt-8';
      case 'bottom': return 'items-end pb-4 md:pb-8';
      default: return 'items-center';
    }
  };

  const getTextAlignmentClass = (alignment?: string) => {
    switch (alignment) {
      case 'left': return 'text-left';
      case 'right': return 'text-right';
      default: return 'text-center';
    }
  };

  const transitionOptions = [
    { value: 'fade', label: 'Fade' },
    { value: 'slide', label: 'Slide' },
    { value: 'zoom', label: 'Zoom' },
    { value: 'none', label: 'None' }
  ];

  if (isLoading) {
    return (
      <div className="w-full p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
        <p className="text-center mt-4 text-muted-foreground">Loading slides...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Error Loading Slides</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 mb-4">{error}</p>
            <div className="space-y-2">
              <Button onClick={fetchSlides} variant="outline">
                Retry Loading Slides
              </Button>
              <Button onClick={() => window.location.href = '/admin/hero-manager'}>
                Create Your First Slide
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentSlideData = slides[currentSlide];

  return (
    <div className="w-full p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Hero Slide Manager</h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {slides.length} slides loaded
          </Badge>
          <Button onClick={fetchSlides} variant="outline" size="sm">
            Refresh
          </Button>
          <Button onClick={() => window.location.href = '/admin/hero-manager'}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Slide
          </Button>
        </div>
      </div>

      {slides.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">No slides found</p>
            <p className="text-sm text-muted-foreground mb-4">
              There are no active slides in the database. Create your first slide to get started.
            </p>
            <Button onClick={() => window.location.href = '/admin/hero-manager'}>
              Create Your First Slide
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Hero Controls Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Slideshow Controls
                <Badge variant="outline" className="ml-auto">
                  {currentSlide + 1} of {slides.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevious}
                  disabled={slides.length <= 1}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePlayPause}
                  disabled={slides.length <= 1}
                  className="h-12 w-12"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                  disabled={slides.length <= 1}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleReset}
                  title="Reset to first slide"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              {/* Slide Progress */}
              {slides.length > 1 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Slide Position</Label>
                  <Slider
                    value={[currentSlide]}
                    onValueChange={([value]) => handleSlideChange(value)}
                    max={slides.length - 1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Slide 1</span>
                    <span>Slide {slides.length}</span>
                  </div>
                </div>
              )}

              {/* AutoPlay Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  <Label htmlFor="autoplay">Auto Play</Label>
                </div>
                <Switch
                  id="autoplay"
                  checked={autoPlay}
                  onCheckedChange={handleAutoPlayToggle}
                />
              </div>

              {/* Speed Control */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <Label className="text-sm font-medium">
                    Speed: {speed / 1000}s per slide
                  </Label>
                </div>
                <Slider
                  value={[speed]}
                  onValueChange={([value]) => handleSpeedChange(value)}
                  min={1000}
                  max={10000}
                  step={500}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Fast (1s)</span>
                  <span>Slow (10s)</span>
                </div>
              </div>

              {/* Advanced Controls Toggle */}
              <Button
                variant="ghost"
                onClick={() => setShowAdvancedControls(!showAdvancedControls)}
                className="w-full flex items-center gap-2"
              >
                <Zap className="h-4 w-4" />
                {showAdvancedControls ? 'Hide' : 'Show'} Advanced Controls
              </Button>

              {/* Advanced Controls */}
              {showAdvancedControls && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Transition Effect</Label>
                    <Select value={transition} onValueChange={handleTransitionChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {transitionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Quick Speed Presets */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Quick Speed Presets</Label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSpeedChange(2000)}
                        className={speed === 2000 ? 'bg-primary text-primary-foreground' : ''}
                      >
                        Fast
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSpeedChange(5000)}
                        className={speed === 5000 ? 'bg-primary text-primary-foreground' : ''}
                      >
                        Normal
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSpeedChange(8000)}
                        className={speed === 8000 ? 'bg-primary text-primary-foreground' : ''}
                      >
                        Slow
                      </Button>
                    </div>
                  </div>

                  {/* Status Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant={isPlaying ? "default" : "secondary"}>
                        {isPlaying ? "Playing" : "Paused"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transition:</span>
                      <span className="capitalize">{transition}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Separator />

          {/* Current Slide Preview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Slide Preview</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {currentSlide + 1} of {slides.length}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={currentSlideData ? () => handleEditSlide(currentSlideData) : undefined}
                    disabled={!currentSlideData}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={currentSlideData ? () => handleDeleteSlide(currentSlideData.id) : undefined}
                    disabled={!currentSlideData}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {currentSlideData && (
                <div 
                  className={`relative w-full ${getResponsiveHeightClass(currentSlideData.design_data?.height)} overflow-hidden rounded-lg transition-opacity duration-500 flex items-center justify-center`}
                  style={{ 
                    transitionDuration: transition === 'fade' ? '500ms' : '300ms' 
                  }}
                >
                  {/* Background */}
                  {currentSlideData.background_image_url ? (
                    <div className="absolute inset-0">
                      <img
                        src={currentSlideData.background_image_url}
                        alt={currentSlideData.title}
                        className="w-full h-full object-contain"
                        style={{ 
                          objectPosition: currentSlideData.design_data?.objectPosition || 'center center',
                          objectFit: 'contain' // Changed to contain to preserve aspect ratio
                        }}
                        onLoad={(e) => {
                          // Let the container adapt to the image's natural aspect ratio
                          const img = e.currentTarget;
                          const container = img.parentElement?.parentElement;
                          if (container && img.naturalWidth && img.naturalHeight) {
                            const aspectRatio = img.naturalWidth / img.naturalHeight;
                            const containerWidth = container.offsetWidth;
                            const naturalHeight = containerWidth / aspectRatio;
                            container.style.height = `${Math.min(naturalHeight, window.innerHeight * 0.8)}px`;
                          }
                        }}
                      />
                      {currentSlideData.design_data?.showText !== false && (
                        <div 
                          className="absolute inset-0 bg-black" 
                          style={{ opacity: (currentSlideData.design_data?.overlayOpacity || 20) / 100 }}
                        />
                      )}
                    </div>
                  ) : (
                    <div 
                      className="absolute inset-0"
                      style={{ backgroundColor: currentSlideData.background_color || '#4F46E5' }}
                    />
                  )}

                  {/* Content */}
                  {currentSlideData.design_data?.showText !== false && (
                    <div className={`relative h-full flex ${getTextPositionClass(currentSlideData.design_data?.textPosition)} justify-center px-4`}>
                      <div className={`max-w-4xl mx-auto text-white ${getTextAlignmentClass(currentSlideData.design_data?.textAlignment)} space-y-2 md:space-y-4`}>
                        {currentSlideData.title && (
                          <h1 className="text-lg md:text-2xl lg:text-4xl font-bold leading-tight drop-shadow-lg">
                            {currentSlideData.title}
                          </h1>
                        )}
                        
                        {currentSlideData.description && (
                          <p className="text-sm md:text-base lg:text-lg opacity-90 leading-relaxed drop-shadow-md">
                            {currentSlideData.description}
                          </p>
                        )}

                        {currentSlideData.design_data?.buttonText && currentSlideData.link_url && (
                          <div className="pt-2">
                            <Button 
                              size="sm"
                              className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
                            >
                              {currentSlideData.design_data.buttonText}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  {slides.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevious}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>

                      {/* Dots indicator */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {slides.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === currentSlide ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Slides List */}
          <Card>
            <CardHeader>
              <CardTitle>All Slides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {slides.map((slide, index) => (
                  <Card 
                    key={slide.id} 
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md",
                      index === currentSlide && "ring-2 ring-primary"
                    )}
                    onClick={() => setCurrentSlide(index)}
                  >
                    <div className="relative h-32 overflow-hidden rounded-t-lg">
                      {slide.background_image_url ? (
                        <img
                          src={slide.background_image_url}
                          alt={slide.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div 
                          className="w-full h-full"
                          style={{ backgroundColor: slide.background_color || '#4F46E5' }}
                        />
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditSlide(slide);
                          }}
                          className="bg-white/90 text-gray-900 hover:bg-white"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSlide(slide.id);
                          }}
                          className="bg-red-500/90 hover:bg-red-500"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium truncate">{slide.title}</h3>
                      {slide.description && (
                        <p className="text-sm text-muted-foreground truncate">{slide.description}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline" className="text-xs">
                          Order: {slide.display_order}
                        </Badge>
                        <Badge variant={slide.is_active ? "default" : "secondary"} className="text-xs">
                          {slide.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Slide Attributes</DialogTitle>
          </DialogHeader>
          
          {editingSlide && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Form Fields */}
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={editingSlide.title}
                      onChange={(e) => setEditingSlide(prev => prev ? { ...prev, title: e.target.value } : null)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editingSlide.description || ''}
                      onChange={(e) => setEditingSlide(prev => prev ? { ...prev, description: e.target.value } : null)}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="link_url">Link URL</Label>
                    <Input
                      id="link_url"
                      value={editingSlide.link_url || ''}
                      onChange={(e) => setEditingSlide(prev => prev ? { ...prev, link_url: e.target.value } : null)}
                      placeholder="https://example.com or /internal-page"
                    />
                  </div>

                  <div>
                    <Label htmlFor="button_text">Button Text</Label>
                    <Input
                      id="button_text"
                      value={editingSlide.design_data?.buttonText || ''}
                      onChange={(e) => setEditingSlide(prev => prev ? { 
                        ...prev, 
                        design_data: { 
                          ...prev.design_data, 
                          buttonText: e.target.value 
                        } 
                      } : null)}
                      placeholder="Learn More"
                    />
                  </div>
                </div>

                {/* Layout Settings */}
                <div className="space-y-4">
                  <h3 className="font-medium">Layout Settings</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Height</Label>
                      <Select
                        value={editingSlide.design_data?.height || 'large'}
                        onValueChange={(value) => setEditingSlide(prev => prev ? { 
                          ...prev, 
                          design_data: { 
                            ...prev.design_data, 
                            height: value as any 
                          } 
                        } : null)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tiny">Tiny</SelectItem>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                          <SelectItem value="full">Full Screen</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Text Position</Label>
                      <Select
                        value={editingSlide.design_data?.textPosition || 'center'}
                        onValueChange={(value) => setEditingSlide(prev => prev ? { 
                          ...prev, 
                          design_data: { 
                            ...prev.design_data, 
                            textPosition: value as any 
                          } 
                        } : null)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top">Top</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="bottom">Bottom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Text Alignment</Label>
                      <Select
                        value={editingSlide.design_data?.textAlignment || 'center'}
                        onValueChange={(value) => setEditingSlide(prev => prev ? { 
                          ...prev, 
                          design_data: { 
                            ...prev.design_data, 
                            textAlignment: value as any 
                          } 
                        } : null)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">Left</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="right">Right</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Image Fit</Label>
                      <Select
                        value={editingSlide.design_data?.objectFit || 'cover'}
                        onValueChange={(value) => setEditingSlide(prev => prev ? { 
                          ...prev, 
                          design_data: { 
                            ...prev.design_data, 
                            objectFit: value as any 
                          } 
                        } : null)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cover">Cover</SelectItem>
                          <SelectItem value="contain">Contain</SelectItem>
                          <SelectItem value="fill">Fill</SelectItem>
                          <SelectItem value="scale-down">Scale Down</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Overlay Opacity: {editingSlide.design_data?.overlayOpacity || 20}%</Label>
                    <Slider
                      value={[editingSlide.design_data?.overlayOpacity || 20]}
                      onValueChange={([value]) => setEditingSlide(prev => prev ? { 
                        ...prev, 
                        design_data: { 
                          ...prev.design_data, 
                          overlayOpacity: value 
                        } 
                      } : null)}
                      max={100}
                      step={5}
                      className="mt-2"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={editingSlide.design_data?.showText !== false}
                      onCheckedChange={(checked) => setEditingSlide(prev => prev ? { 
                        ...prev, 
                        design_data: { 
                          ...prev.design_data, 
                          showText: checked 
                        } 
                      } : null)}
                    />
                    <Label>Show Text Overlay</Label>
                  </div>
                </div>

                {/* Background Settings */}
                <div className="space-y-4">
                  <h3 className="font-medium">Background Settings</h3>
                  
                  <div>
                    <Label htmlFor="bg_color">Background Color (fallback)</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="color"
                        value={editingSlide.background_color || '#4F46E5'}
                        onChange={(e) => setEditingSlide(prev => prev ? { ...prev, background_color: e.target.value } : null)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={editingSlide.background_color || '#4F46E5'}
                        onChange={(e) => setEditingSlide(prev => prev ? { ...prev, background_color: e.target.value } : null)}
                        placeholder="#4F46E5"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <Label>Background Image</Label>
                    <div className="mt-2 space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file);
                        }}
                        className="hidden"
                        id="image-upload"
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('image-upload')?.click()}
                          className="flex-1"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload New Image
                        </Button>
                        {editingSlide.background_image_url && (
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={handleRemoveImage}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Media Library Selection */}
                  <div>
                    <Label>Or Select from Media Library</Label>
                    <div className="mt-2 max-h-40 overflow-y-auto border rounded-lg p-2">
                      <div className="grid grid-cols-3 gap-2">
                        {filteredMediaFiles
                          .filter(file => file.file_type.startsWith('image/'))
                          .slice(0, 12)
                          .map((media) => (
                            <div
                              key={media.id}
                              className="relative aspect-square cursor-pointer hover:opacity-75 transition-opacity"
                              onClick={() => handleImageSelect(media)}
                            >
                              <img
                                src={media.file_url}
                                alt={media.title}
                                className="w-full h-full object-cover rounded"
                              />
                              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors rounded flex items-center justify-center">
                                <Image className="h-6 w-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          ))}
                      </div>
                      {filteredMediaFiles.filter(file => file.file_type.startsWith('image/')).length === 0 && (
                        <p className="text-center text-muted-foreground py-4">No images available in media library</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSaveSlide}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>

              {/* Right Column - Preview */}
              <div className="space-y-4">
                <h3 className="font-medium">Preview</h3>
                <div 
                  className="relative w-full aspect-video overflow-hidden rounded-lg border"
                  style={{ 
                    backgroundColor: editingSlide.background_color || '#4F46E5',
                    backgroundImage: editingSlide.background_image_url ? `url(${editingSlide.background_image_url})` : undefined,
                    backgroundSize: editingSlide.design_data?.objectFit || 'cover',
                    backgroundPosition: editingSlide.design_data?.objectPosition || 'center center',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  {editingSlide.design_data?.showText !== false && (
                    <>
                      {editingSlide.background_image_url && (
                        <div 
                          className="absolute inset-0 bg-black" 
                          style={{ opacity: (editingSlide.design_data?.overlayOpacity || 20) / 100 }}
                        />
                      )}
                      <div className={`relative h-full flex ${getTextPositionClass(editingSlide.design_data?.textPosition)} justify-center px-4`}>
                        <div className={`max-w-lg text-white ${getTextAlignmentClass(editingSlide.design_data?.textAlignment)} space-y-2`}>
                          {editingSlide.title && (
                            <h1 className="text-lg font-bold leading-tight drop-shadow-lg">
                              {editingSlide.title}
                            </h1>
                          )}
                          
                          {editingSlide.description && (
                            <p className="text-sm opacity-90 leading-relaxed drop-shadow-md">
                              {editingSlide.description}
                            </p>
                          )}

                          {editingSlide.design_data?.buttonText && editingSlide.link_url && (
                            <div className="pt-2">
                              <Button 
                                size="sm"
                                className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg pointer-events-none"
                              >
                                {editingSlide.design_data.buttonText}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                  
                  {!editingSlide.background_image_url && (
                    <div className="absolute inset-0 flex items-center justify-center text-white/50">
                      <div className="text-center">
                        <Image className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-sm">No background image</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {editingSlide.background_image_url && (
                  <div className="text-xs text-muted-foreground">
                    <strong>Current image:</strong> {editingSlide.background_image_url.split('/').pop()}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
