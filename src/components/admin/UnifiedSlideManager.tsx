
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Save, X, Sliders, Layout, TestTube, Eye, Settings, Upload, Image } from 'lucide-react';
import { TopSliderManager } from './TopSliderManager';
import { SliderTestPreview } from './SliderTestPreview';
import { ImageDropZone } from './slideDesign/ImageDropZone';
import { MediaLibrarySelector } from './slideDesign/MediaLibrarySelector';

interface NewSlideForm {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  textPosition: 'top' | 'center' | 'bottom';
  textAlignment: 'left' | 'center' | 'right';
  backgroundColor: string;
  backgroundImage: string;
  mediaId: string;
}

export function UnifiedSlideManager() {
  const [slides, setSlides] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('hero-slides');
  const [previewMode, setPreviewMode] = useState(false);
  const [newSlide, setNewSlide] = useState<NewSlideForm>({
    title: '',
    description: '',
    buttonText: '',
    buttonLink: '',
    textPosition: 'center',
    textAlignment: 'center',
    backgroundColor: '#4F46E5',
    backgroundImage: '',
    mediaId: ''
  });

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

  const handleImageUpload = (imageUrl: string) => {
    setNewSlide(prev => ({ ...prev, backgroundImage: imageUrl, mediaId: '' }));
    toast.success('Image uploaded successfully');
  };

  const handleMediaSelect = (mediaUrl: string, mediaId: string) => {
    setNewSlide(prev => ({ ...prev, backgroundImage: mediaUrl, mediaId }));
    toast.success('Media selected successfully');
  };

  const handleRemoveImage = () => {
    setNewSlide(prev => ({ ...prev, backgroundImage: '', mediaId: '' }));
    toast.success('Image removed');
  };

  const createSlide = async () => {
    if (!newSlide.title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      const { error } = await supabase
        .from('slide_designs')
        .insert({
          title: newSlide.title,
          description: newSlide.description,
          layout_type: 'full',
          design_data: {
            textElements: [{
              id: '1',
              type: 'heading',
              text: newSlide.title,
              position: { x: 50, y: 50 },
              style: { 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                color: 'white',
                textAlign: newSlide.textAlignment
              }
            }],
            backgroundElements: [{
              id: 'bg1',
              type: newSlide.backgroundImage ? 'image' : 'color',
              value: newSlide.backgroundImage || newSlide.backgroundColor,
              position: { x: 0, y: 0, width: 100, height: 100 }
            }]
          },
          background_color: newSlide.backgroundColor,
          background_image_url: newSlide.backgroundImage || null,
          background_media_id: newSlide.mediaId || null,
          animation_settings: {
            duration: 1000,
            transition: 'fade',
            autoPlay: true
          },
          link_url: newSlide.buttonLink || null,
          is_active: true,
          display_order: slides.length
        });

      if (error) throw error;

      toast.success('Slide created successfully');
      setNewSlide({
        title: '',
        description: '',
        buttonText: '',
        buttonLink: '',
        textPosition: 'center',
        textAlignment: 'center',
        backgroundColor: '#4F46E5',
        backgroundImage: '',
        mediaId: ''
      });
      fetchSlides();
    } catch (error) {
      console.error('Error creating slide:', error);
      toast.error('Failed to create slide');
    }
  };

  const deleteSlide = async (slideId: string) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;

    try {
      const { error } = await supabase
        .from('slide_designs')
        .update({ is_active: false })
        .eq('id', slideId);

      if (error) throw error;

      toast.success('Slide deleted successfully');
      setSlides(prev => prev.filter(slide => slide.id !== slideId));
    } catch (error) {
      console.error('Error deleting slide:', error);
      toast.error('Failed to delete slide');
    }
  };

  if (previewMode) {
    return <SliderTestPreview onExitPreview={() => setPreviewMode(false)} />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="h-5 w-5" />
              Unified Slide Management
              <Badge variant="secondary" className="ml-2">Admin Only</Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center gap-2"
            >
              {previewMode ? <Settings /> : <Eye />}
              {previewMode ? 'Admin Mode' : 'Preview Mode'}
            </Button>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage all slide content from one unified interface - hero slides and top slider banners
          </p>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="hero-slides" className="flex items-center gap-2">
                <Layout className="h-4 w-4" />
                Hero Slides
              </TabsTrigger>
              <TabsTrigger value="top-slider" className="flex items-center gap-2">
                <Sliders className="h-4 w-4" />
                Top Banner
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <TestTube className="h-4 w-4" />
                Preview
              </TabsTrigger>
            </TabsList>

            <Separator className="my-6" />

            <TabsContent value="hero-slides" className="mt-0">
              <div className="space-y-6">
                {/* Create New Slide Form */}
                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-medium">Create New Hero Slide</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Slide title"
                      value={newSlide.title}
                      onChange={(e) => setNewSlide(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <div className="flex gap-2">
                      <Select 
                        value={newSlide.textPosition} 
                        onValueChange={(value: 'top' | 'center' | 'bottom') => 
                          setNewSlide(prev => ({ ...prev, textPosition: value }))
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top">Top</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="bottom">Bottom</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select 
                        value={newSlide.textAlignment} 
                        onValueChange={(value: 'left' | 'center' | 'right') => 
                          setNewSlide(prev => ({ ...prev, textAlignment: value }))
                        }
                      >
                        <SelectTrigger className="w-32">
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

                  <Textarea
                    placeholder="Slide description"
                    value={newSlide.description}
                    onChange={(e) => setNewSlide(prev => ({ ...prev, description: e.target.value }))}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      placeholder="Button text (optional)"
                      value={newSlide.buttonText}
                      onChange={(e) => setNewSlide(prev => ({ ...prev, buttonText: e.target.value }))}
                    />
                    <Input
                      placeholder="Button link (optional)"
                      value={newSlide.buttonLink}
                      onChange={(e) => setNewSlide(prev => ({ ...prev, buttonLink: e.target.value }))}
                    />
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        value={newSlide.backgroundColor}
                        onChange={(e) => setNewSlide(prev => ({ ...prev, backgroundColor: e.target.value }))}
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <span className="text-sm text-muted-foreground">Background</span>
                    </div>
                  </div>

                  {/* Image Upload Section */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Background Image</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-muted-foreground mb-2 block">Upload Image</label>
                        <ImageDropZone
                          onImageUpload={handleImageUpload}
                          currentImage={newSlide.backgroundImage}
                          onRemoveImage={handleRemoveImage}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-2 block">Or Select from Library</label>
                        <MediaLibrarySelector onSelectMedia={handleMediaSelect} />
                      </div>
                    </div>
                    {newSlide.backgroundImage && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-sm text-green-800">
                          ✓ Background image selected. This will override the background color.
                        </p>
                      </div>
                    )}
                  </div>

                  <Button onClick={createSlide} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Hero Slide
                  </Button>
                </div>

                {/* Existing Slides */}
                <div className="space-y-4">
                  <h3 className="font-medium">Current Hero Slides ({slides.length})</h3>
                  {isLoading ? (
                    <div className="text-center text-muted-foreground py-8">
                      Loading slides...
                    </div>
                  ) : slides.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      No hero slides configured. Create your first slide above.
                    </div>
                  ) : (
                    slides.map((slide, index) => (
                      <div key={slide.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {slide.background_image_url && (
                                <img 
                                  src={slide.background_image_url} 
                                  alt="Slide preview"
                                  className="w-16 h-10 object-cover rounded border"
                                />
                              )}
                              <div>
                                <h4 className="font-medium">{slide.title}</h4>
                                <p className="text-sm text-muted-foreground">{slide.description}</p>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline">Slide {index + 1}</Badge>
                              {slide.is_active && (
                                <Badge variant="default">Active</Badge>
                              )}
                              {slide.background_image_url && (
                                <Badge variant="secondary">
                                  <Image className="h-3 w-3 mr-1" />
                                  Image
                                </Badge>
                              )}
                              <Badge 
                                variant="secondary" 
                                style={{ backgroundColor: slide.background_color + '20', color: slide.background_color }}
                              >
                                {slide.background_color}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setEditingSlide(slide.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => deleteSlide(slide.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="top-slider" className="mt-0">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Top Banner Slider</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage the banner slides that appear at the top of your pages.
                  </p>
                </div>
                <TopSliderManager />
              </div>
            </TabsContent>

            <TabsContent value="preview" className="mt-0">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Live Preview</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Preview how your slides appear on the live site.
                  </p>
                </div>
                <SliderTestPreview />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
