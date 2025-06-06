
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
import { Edit, Eye, Trash2, Save, X, Settings, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState<SlideData | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from('slide_designs')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      setSlides(data || []);
    } catch (error) {
      console.error('Error fetching slides:', error);
      toast.error('Failed to load slides');
    } finally {
      setIsLoading(false);
    }
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

  const getResponsiveHeightClass = (height?: string) => {
    switch (height) {
      case 'tiny': return 'h-[120px] md:h-[180px]';
      case 'small': return 'h-[160px] md:h-[240px]';
      case 'medium': return 'h-[200px] md:h-[320px]';
      case 'full': return 'h-[240px] md:h-screen';
      case 'large':
      default:
        return 'h-[220px] md:h-[400px]';
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

  if (isLoading) {
    return (
      <div className="w-full p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const currentSlideData = slides[currentSlide];

  return (
    <div className="w-full p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Hero Slide Manager</h1>
        <Button onClick={() => window.location.href = '/admin/hero-manager'}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Slide
        </Button>
      </div>

      {slides.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">No slides found</p>
            <Button onClick={() => window.location.href = '/admin/hero-manager'}>
              Create Your First Slide
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
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
                  className={`relative w-full ${getResponsiveHeightClass(currentSlideData.design_data?.height)} overflow-hidden rounded-lg`}
                >
                  {/* Background */}
                  {currentSlideData.background_image_url ? (
                    <div className="absolute inset-0">
                      <img
                        src={currentSlideData.background_image_url}
                        alt={currentSlideData.title}
                        className="w-full h-full"
                        style={{ 
                          objectPosition: currentSlideData.design_data?.objectPosition || 'center center',
                          objectFit: currentSlideData.design_data?.objectFit || 'cover'
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
                    <div className={`relative h-full flex ${getTextPositionClass(currentSlideData.design_data?.textPosition)} justify-center`}>
                      <div className={`max-w-4xl mx-auto text-white ${getTextAlignmentClass(currentSlideData.design_data?.textAlignment)} space-y-2 md:space-y-4 px-4`}>
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
                        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Slide Attributes</DialogTitle>
          </DialogHeader>
          
          {editingSlide && (
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

              {/* Background Color */}
              <div>
                <Label htmlFor="bg_color">Background Color (for slides without images)</Label>
                <Input
                  id="bg_color"
                  type="color"
                  value={editingSlide.background_color || '#4F46E5'}
                  onChange={(e) => setEditingSlide(prev => prev ? { ...prev, background_color: e.target.value } : null)}
                  className="h-12"
                />
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
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
