
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
  showText: boolean;
  height: 'small' | 'medium' | 'large' | 'full';
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
    mediaId: '',
    showText: true,
    height: 'large'
  });
  const [editForm, setEditForm] = useState<NewSlideForm>({
    title: '',
    description: '',
    buttonText: '',
    buttonLink: '',
    textPosition: 'center',
    textAlignment: 'center',
    backgroundColor: '#4F46E5',
    backgroundImage: '',
    mediaId: '',
    showText: true,
    height: 'large'
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
    if (editingSlide) {
      setEditForm(prev => ({ ...prev, backgroundImage: imageUrl, mediaId: '' }));
    } else {
      setNewSlide(prev => ({ ...prev, backgroundImage: imageUrl, mediaId: '' }));
    }
    toast.success('Image uploaded successfully');
  };

  const handleMediaSelect = (mediaUrl: string, mediaId: string) => {
    if (editingSlide) {
      setEditForm(prev => ({ ...prev, backgroundImage: mediaUrl, mediaId }));
    } else {
      setNewSlide(prev => ({ ...prev, backgroundImage: mediaUrl, mediaId }));
    }
    toast.success('Media selected successfully');
  };

  const handleRemoveImage = () => {
    if (editingSlide) {
      setEditForm(prev => ({ ...prev, backgroundImage: '', mediaId: '' }));
    } else {
      setNewSlide(prev => ({ ...prev, backgroundImage: '', mediaId: '' }));
    }
    toast.success('Image removed');
  };

  const startEditing = (slide: any) => {
    setEditingSlide(slide.id);
    setEditForm({
      title: slide.title || '',
      description: slide.description || '',
      buttonText: slide.design_data?.buttonText || '',
      buttonLink: slide.link_url || '',
      textPosition: slide.design_data?.textPosition || 'center',
      textAlignment: slide.design_data?.textAlignment || 'center',
      backgroundColor: slide.background_color || '#4F46E5',
      backgroundImage: slide.background_image_url || '',
      mediaId: slide.background_media_id || '',
      showText: slide.design_data?.showText !== false,
      height: slide.design_data?.height || 'large'
    });
  };

  const cancelEditing = () => {
    setEditingSlide(null);
    setEditForm({
      title: '',
      description: '',
      buttonText: '',
      buttonLink: '',
      textPosition: 'center',
      textAlignment: 'center',
      backgroundColor: '#4F46E5',
      backgroundImage: '',
      mediaId: '',
      showText: true,
      height: 'large'
    });
  };

  const updateSlide = async () => {
    if (!editingSlide) {
      toast.error('No slide selected for editing');
      return;
    }

    try {
      const { error } = await supabase
        .from('slide_designs')
        .update({
          title: editForm.title,
          description: editForm.description,
          design_data: {
            textElements: [{
              id: '1',
              type: 'heading',
              text: editForm.title,
              position: { x: 50, y: 50 },
              style: { 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                color: 'white',
                textAlign: editForm.textAlignment
              }
            }],
            backgroundElements: [{
              id: 'bg1',
              type: editForm.backgroundImage ? 'image' : 'color',
              value: editForm.backgroundImage || editForm.backgroundColor,
              position: { x: 0, y: 0, width: 100, height: 100 }
            }],
            buttonText: editForm.buttonText,
            textPosition: editForm.textPosition,
            textAlignment: editForm.textAlignment,
            showText: editForm.showText,
            height: editForm.height
          },
          background_color: editForm.backgroundColor,
          background_image_url: editForm.backgroundImage || null,
          background_media_id: editForm.mediaId || null,
          link_url: editForm.buttonLink || null
        })
        .eq('id', editingSlide);

      if (error) throw error;

      toast.success('Slide updated successfully');
      setEditingSlide(null);
      fetchSlides();
    } catch (error) {
      console.error('Error updating slide:', error);
      toast.error('Failed to update slide');
    }
  };

  const createSlide = async () => {
    if (!newSlide.backgroundImage && !newSlide.backgroundColor) {
      toast.error('Please select an image or background color');
      return;
    }

    try {
      const { error } = await supabase
        .from('slide_designs')
        .insert({
          title: newSlide.title || 'Image Slide',
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
            }],
            buttonText: newSlide.buttonText,
            textPosition: newSlide.textPosition,
            textAlignment: newSlide.textAlignment,
            showText: newSlide.showText,
            height: newSlide.height
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
        mediaId: '',
        showText: true,
        height: 'large'
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      placeholder="Slide title (optional for image-only slides)"
                      value={newSlide.title}
                      onChange={(e) => setNewSlide(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="showText"
                        checked={newSlide.showText}
                        onCheckedChange={(checked) => setNewSlide(prev => ({ ...prev, showText: checked }))}
                      />
                      <Label htmlFor="showText">Show text overlay</Label>
                    </div>
                    <div className="space-y-2">
                      <Label>Hero Height</Label>
                      <Select 
                        value={newSlide.height} 
                        onValueChange={(value: 'small' | 'medium' | 'large' | 'full') => 
                          setNewSlide(prev => ({ ...prev, height: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small (40vh)</SelectItem>
                          <SelectItem value="medium">Medium (60vh)</SelectItem>
                          <SelectItem value="large">Large (80vh)</SelectItem>
                          <SelectItem value="full">Full Screen (100vh)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {newSlide.showText && (
                    <>
                      <Textarea
                        placeholder="Slide description (optional)"
                        value={newSlide.description}
                        onChange={(e) => setNewSlide(prev => ({ ...prev, description: e.target.value }))}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          placeholder="Button text (optional)"
                          value={newSlide.buttonText}
                          onChange={(e) => setNewSlide(prev => ({ ...prev, buttonText: e.target.value }))}
                        />
                        <Input
                          placeholder="Button/Click link (optional)"
                          value={newSlide.buttonLink}
                          onChange={(e) => setNewSlide(prev => ({ ...prev, buttonLink: e.target.value }))}
                        />
                      </div>
                    </>
                  )}

                  {!newSlide.showText && (
                    <Input
                      placeholder="Click link for entire image (optional)"
                      value={newSlide.buttonLink}
                      onChange={(e) => setNewSlide(prev => ({ ...prev, buttonLink: e.target.value }))}
                    />
                  )}

                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={newSlide.backgroundColor}
                      onChange={(e) => setNewSlide(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <span className="text-sm text-muted-foreground">Background color (fallback)</span>
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
                          ✓ Background image selected. {!newSlide.showText ? 'Image-only slide ready!' : 'This will override the background color.'}
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
                        {editingSlide === slide.id ? (
                          /* Edit Form */
                          <div className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-medium">Edit Slide</h4>
                              <div className="flex gap-2">
                                <Button size="sm" onClick={updateSlide}>
                                  <Save className="h-4 w-4 mr-1" />
                                  Save
                                </Button>
                                <Button size="sm" variant="outline" onClick={cancelEditing}>
                                  <X className="h-4 w-4 mr-1" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <Input
                                placeholder="Slide title (optional)"
                                value={editForm.title}
                                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                              />
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="editShowText"
                                  checked={editForm.showText}
                                  onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, showText: checked }))}
                                />
                                <Label htmlFor="editShowText">Show text overlay</Label>
                              </div>
                              <div className="space-y-2">
                                <Label>Hero Height</Label>
                                <Select 
                                  value={editForm.height} 
                                  onValueChange={(value: 'small' | 'medium' | 'large' | 'full') => 
                                    setEditForm(prev => ({ ...prev, height: value }))
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="small">Small (40vh)</SelectItem>
                                    <SelectItem value="medium">Medium (60vh)</SelectItem>
                                    <SelectItem value="large">Large (80vh)</SelectItem>
                                    <SelectItem value="full">Full Screen (100vh)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            {editForm.showText && (
                              <>
                                <Textarea
                                  placeholder="Slide description (optional)"
                                  value={editForm.description}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="flex gap-2">
                                    <Select 
                                      value={editForm.textPosition} 
                                      onValueChange={(value: 'top' | 'center' | 'bottom') => 
                                        setEditForm(prev => ({ ...prev, textPosition: value }))
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
                                      value={editForm.textAlignment} 
                                      onValueChange={(value: 'left' | 'center' | 'right') => 
                                        setEditForm(prev => ({ ...prev, textAlignment: value }))
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

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <Input
                                    placeholder="Button text (optional)"
                                    value={editForm.buttonText}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, buttonText: e.target.value }))}
                                  />
                                  <Input
                                    placeholder="Button/Click link (optional)"
                                    value={editForm.buttonLink}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, buttonLink: e.target.value }))}
                                  />
                                </div>
                              </>
                            )}

                            {!editForm.showText && (
                              <Input
                                placeholder="Click link for entire image (optional)"
                                value={editForm.buttonLink}
                                onChange={(e) => setEditForm(prev => ({ ...prev, buttonLink: e.target.value }))}
                              />
                            )}

                            <div className="flex items-center gap-2">
                              <Input
                                type="color"
                                value={editForm.backgroundColor}
                                onChange={(e) => setEditForm(prev => ({ ...prev, backgroundColor: e.target.value }))}
                                className="w-16 h-10 p-1 border rounded"
                              />
                              <span className="text-sm text-muted-foreground">Background color</span>
                            </div>

                            {/* Edit Image Upload Section */}
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium">Background Image</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-xs text-muted-foreground mb-2 block">Upload Image</label>
                                  <ImageDropZone
                                    onImageUpload={handleImageUpload}
                                    currentImage={editForm.backgroundImage}
                                    onRemoveImage={handleRemoveImage}
                                  />
                                </div>
                                <div>
                                  <label className="text-xs text-muted-foreground mb-2 block">Or Select from Library</label>
                                  <MediaLibrarySelector onSelectMedia={handleMediaSelect} />
                                </div>
                              </div>
                              {editForm.backgroundImage && (
                                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                                  <p className="text-sm text-green-800">
                                    ✓ Background image selected. {!editForm.showText ? 'Image-only slide!' : 'This will override the background color.'}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          /* Display Mode */
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
                                  <h4 className="font-medium">{slide.title || 'Image Slide'}</h4>
                                  {slide.description && (
                                    <p className="text-sm text-muted-foreground">{slide.description}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2 mt-2">
                                <Badge variant="outline">Slide {index + 1}</Badge>
                                {slide.is_active && (
                                  <Badge variant="default">Active</Badge>
                                )}
                                {slide.design_data?.showText === false && (
                                  <Badge variant="secondary">Image Only</Badge>
                                )}
                                {slide.background_image_url && (
                                  <Badge variant="secondary">
                                    <Image className="h-3 w-3 mr-1" />
                                    Image
                                  </Badge>
                                )}
                                <Badge variant="secondary">
                                  Height: {slide.design_data?.height || 'large'}
                                </Badge>
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
                                onClick={() => startEditing(slide)}
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
                        )}
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
