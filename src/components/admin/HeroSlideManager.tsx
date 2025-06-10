
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Plus, Edit, Eye, Trash2, Save, X, Image as ImageIcon, Video, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface HeroSlide {
  id: string;
  title: string;
  description: string;
  button_text?: string;
  button_link?: string;
  text_position: 'top' | 'center' | 'bottom';
  text_alignment: 'left' | 'center' | 'right';
  visible: boolean;
  slide_order: number;
  media_id?: string;
  media_type: 'image' | 'video';
}

interface NewSlideForm {
  title: string;
  description: string;
  button_text: string;
  button_link: string;
  text_position: 'top' | 'center' | 'bottom';
  text_alignment: 'left' | 'center' | 'right';
  media_id: string;
  youtube_url: string;
  visible: boolean;
}

export function HeroSlideManager() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [previewSlide, setPreviewSlide] = useState<HeroSlide | null>(null);
  
  const { filteredMediaFiles, fetchAllMedia } = useMediaLibrary();
  
  const [newSlide, setNewSlide] = useState<NewSlideForm>({
    title: '',
    description: '',
    button_text: '',
    button_link: '',
    text_position: 'center',
    text_alignment: 'center',
    media_id: '',
    youtube_url: '',
    visible: true
  });

  const [editData, setEditData] = useState<NewSlideForm>({
    title: '',
    description: '',
    button_text: '',
    button_link: '',
    text_position: 'center',
    text_alignment: 'center',
    media_id: '',
    youtube_url: '',
    visible: true
  });

  useEffect(() => {
    fetchSlides();
    fetchAllMedia();
  }, []);

  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('slide_order');

      if (error) throw error;
      setSlides(data || []);
    } catch (error) {
      console.error('Error fetching hero slides:', error);
      toast.error('Failed to load hero slides');
    } finally {
      setIsLoading(false);
    }
  };

  const convertYouTubeToEmbed = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&loop=1&playlist=${match[1]}&controls=0&showinfo=0&rel=0&modestbranding=1` : url;
  };

  const createSlide = async () => {
    if (!newSlide.title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      let mediaId = newSlide.media_id;
      let mediaType: 'image' | 'video' = 'image';

      // Handle YouTube URL
      if (newSlide.youtube_url.trim()) {
        mediaId = convertYouTubeToEmbed(newSlide.youtube_url.trim());
        mediaType = 'video';
      } else if (newSlide.media_id) {
        const media = filteredMediaFiles.find(m => m.id === newSlide.media_id);
        mediaType = media?.file_type?.startsWith('video/') ? 'video' : 'image';
      }

      const { error } = await supabase
        .from('hero_slides')
        .insert({
          title: newSlide.title.trim(),
          description: newSlide.description.trim() || '',
          button_text: newSlide.button_text.trim() || null,
          button_link: newSlide.button_link.trim() || null,
          text_position: newSlide.text_position,
          text_alignment: newSlide.text_alignment,
          visible: newSlide.visible,
          slide_order: slides.length,
          media_id: mediaId || null,
          media_type: mediaType
        });

      if (error) throw error;

      toast.success('Hero slide created successfully');
      setShowCreateDialog(false);
      setNewSlide({
        title: '',
        description: '',
        button_text: '',
        button_link: '',
        text_position: 'center',
        text_alignment: 'center',
        media_id: '',
        youtube_url: '',
        visible: true
      });
      fetchSlides();
    } catch (error) {
      console.error('Error creating hero slide:', error);
      toast.error('Failed to create hero slide');
    }
  };

  const updateSlide = async (slideId: string) => {
    try {
      let mediaId = editData.media_id;
      let mediaType: 'image' | 'video' = 'image';

      if (editData.youtube_url.trim()) {
        mediaId = convertYouTubeToEmbed(editData.youtube_url.trim());
        mediaType = 'video';
      } else if (editData.media_id) {
        const media = filteredMediaFiles.find(m => m.id === editData.media_id);
        mediaType = media?.file_type?.startsWith('video/') ? 'video' : 'image';
      }

      const { error } = await supabase
        .from('hero_slides')
        .update({
          title: editData.title.trim(),
          description: editData.description.trim() || '',
          button_text: editData.button_text.trim() || null,
          button_link: editData.button_link.trim() || null,
          text_position: editData.text_position,
          text_alignment: editData.text_alignment,
          visible: editData.visible,
          media_id: mediaId || null,
          media_type: mediaType,
          updated_at: new Date().toISOString()
        })
        .eq('id', slideId);

      if (error) throw error;

      toast.success('Hero slide updated successfully');
      setEditingSlide(null);
      fetchSlides();
    } catch (error) {
      console.error('Error updating hero slide:', error);
      toast.error('Failed to update hero slide');
    }
  };

  const deleteSlide = async (slideId: string) => {
    try {
      const { error } = await supabase
        .from('hero_slides')
        .delete()
        .eq('id', slideId);

      if (error) throw error;

      toast.success('Hero slide deleted successfully');
      fetchSlides();
    } catch (error) {
      console.error('Error deleting hero slide:', error);
      toast.error('Failed to delete hero slide');
    }
  };

  const toggleVisibility = async (slideId: string, visible: boolean) => {
    try {
      const { error } = await supabase
        .from('hero_slides')
        .update({ visible, updated_at: new Date().toISOString() })
        .eq('id', slideId);

      if (error) throw error;
      
      toast.success(`Slide ${visible ? 'shown' : 'hidden'} successfully`);
      fetchSlides();
    } catch (error) {
      console.error('Error toggling slide visibility:', error);
      toast.error('Failed to update slide visibility');
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(slides);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update slide_order for all slides
    const updates = items.map((slide, index) => ({
      id: slide.id,
      slide_order: index
    }));

    try {
      for (const update of updates) {
        await supabase
          .from('hero_slides')
          .update({ slide_order: update.slide_order })
          .eq('id', update.id);
      }
      
      setSlides(items);
      toast.success('Slide order updated successfully');
    } catch (error) {
      console.error('Error updating slide order:', error);
      toast.error('Failed to update slide order');
      fetchSlides(); // Revert on error
    }
  };

  const handleEditSlide = (slide: HeroSlide) => {
    const media = filteredMediaFiles.find(m => m.id === slide.media_id);
    const isYouTubeEmbed = slide.media_id?.includes('youtube.com/embed/');
    
    setEditData({
      title: slide.title,
      description: slide.description || '',
      button_text: slide.button_text || '',
      button_link: slide.button_link || '',
      text_position: slide.text_position,
      text_alignment: slide.text_alignment,
      media_id: isYouTubeEmbed ? '' : (slide.media_id || ''),
      youtube_url: isYouTubeEmbed ? slide.media_id || '' : '',
      visible: slide.visible
    });
    setEditingSlide(slide.id);
  };

  const renderSlidePreview = (slide: HeroSlide) => {
    const media = filteredMediaFiles.find(m => m.id === slide.media_id);
    const isYouTubeEmbed = slide.media_id?.includes('youtube.com/embed/');

    return (
      <div className="w-48 flex-shrink-0">
        <AspectRatio ratio={16/9}>
          {isYouTubeEmbed ? (
            <iframe
              src={slide.media_id}
              className="w-full h-full object-cover rounded"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : media ? (
            media.file_type?.startsWith('video/') ? (
              <video
                src={media.file_url}
                className="object-cover w-full h-full rounded"
                muted
              />
            ) : (
              <img
                src={media.file_url}
                alt={media.title}
                className="object-cover w-full h-full rounded"
              />
            )
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center rounded">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </AspectRatio>
      </div>
    );
  };

  const mediaLibrary = filteredMediaFiles.filter(file => 
    file.file_type?.startsWith('image/') || file.file_type?.startsWith('video/')
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading hero slides...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Hero Slide Manager</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage the hero slides displayed on your homepage
              </p>
            </div>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Slide
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {slides.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No hero slides yet</h3>
              <p className="text-sm max-w-md mx-auto mb-4">
                Create your first hero slide to showcase content on your homepage
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Slide
              </Button>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="slides">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                    {slides.map((slide, index) => (
                      <Draggable key={slide.id} draggableId={slide.id} index={index}>
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`transition-all duration-200 ${snapshot.isDragging ? 'shadow-lg rotate-2' : 'hover:shadow-md'}`}
                          >
                            <div className="flex">
                              {renderSlidePreview(slide)}
                              
                              <div className="flex-1 p-6">
                                {editingSlide === slide.id ? (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label>Title</Label>
                                        <Input
                                          value={editData.title}
                                          onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                                          placeholder="Slide title"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Visibility</Label>
                                        <div className="flex items-center space-x-2">
                                          <Switch
                                            checked={editData.visible}
                                            onCheckedChange={(checked) => setEditData(prev => ({ ...prev, visible: checked }))}
                                          />
                                          <span className="text-sm">{editData.visible ? 'Visible' : 'Hidden'}</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <Label>Description</Label>
                                      <Textarea
                                        value={editData.description}
                                        onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Slide description"
                                        rows={2}
                                      />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label>Button Text</Label>
                                        <Input
                                          value={editData.button_text}
                                          onChange={(e) => setEditData(prev => ({ ...prev, button_text: e.target.value }))}
                                          placeholder="Optional button text"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Button Link</Label>
                                        <Input
                                          value={editData.button_link}
                                          onChange={(e) => setEditData(prev => ({ ...prev, button_link: e.target.value }))}
                                          placeholder="/events or https://example.com"
                                        />
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label>Text Position</Label>
                                        <Select value={editData.text_position} onValueChange={(value: any) => setEditData(prev => ({ ...prev, text_position: value }))}>
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
                                      <div className="space-y-2">
                                        <Label>Text Alignment</Label>
                                        <Select value={editData.text_alignment} onValueChange={(value: any) => setEditData(prev => ({ ...prev, text_alignment: value }))}>
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
                                    </div>

                                    <div className="flex gap-2 pt-4">
                                      <Button onClick={() => updateSlide(slide.id)}>
                                        <Save className="h-4 w-4 mr-1" />
                                        Save Changes
                                      </Button>
                                      <Button variant="outline" onClick={() => setEditingSlide(null)}>
                                        <X className="h-4 w-4 mr-1" />
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-4">
                                    <div className="flex items-start justify-between">
                                      <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-2">
                                          <div {...provided.dragHandleProps} className="cursor-grab hover:bg-muted p-1 rounded">
                                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                                          </div>
                                          <h3 className="text-lg font-semibold">{slide.title}</h3>
                                          <Badge variant={slide.visible ? "default" : "secondary"}>
                                            {slide.visible ? 'Visible' : 'Hidden'}
                                          </Badge>
                                          <Badge variant="outline">
                                            Order: {slide.slide_order + 1}
                                          </Badge>
                                        </div>
                                        {slide.description && (
                                          <p className="text-muted-foreground">{slide.description}</p>
                                        )}
                                        {slide.button_text && (
                                          <div className="text-sm">
                                            <span className="font-medium">Button:</span> {slide.button_text}
                                            {slide.button_link && (
                                              <span className="text-muted-foreground ml-2">→ {slide.button_link}</span>
                                            )}
                                          </div>
                                        )}
                                        <div className="text-sm text-muted-foreground">
                                          Position: {slide.text_position} • Alignment: {slide.text_alignment}
                                        </div>
                                      </div>
                                      
                                      <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => setPreviewSlide(slide)}>
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                        <Switch
                                          checked={slide.visible}
                                          onCheckedChange={(checked) => toggleVisibility(slide.id, checked)}
                                        />
                                        <Button variant="outline" size="sm" onClick={() => handleEditSlide(slide)}>
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="sm">
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent>
                                            <AlertDialogHeader>
                                              <AlertDialogTitle>Delete Hero Slide</AlertDialogTitle>
                                              <AlertDialogDescription>
                                                Are you sure you want to delete "{slide.title}"? This action cannot be undone.
                                              </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                                              <AlertDialogAction 
                                                onClick={() => deleteSlide(slide.id)}
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                              >
                                                Delete Slide
                                              </AlertDialogAction>
                                            </AlertDialogFooter>
                                          </AlertDialogContent>
                                        </AlertDialog>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </CardContent>
      </Card>

      {/* Create Slide Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Hero Slide</DialogTitle>
            <DialogDescription>
              Add a new slide to your homepage hero section
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={newSlide.title}
                  onChange={(e) => setNewSlide(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Slide title"
                />
              </div>
              <div className="space-y-2">
                <Label>Visibility</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={newSlide.visible}
                    onCheckedChange={(checked) => setNewSlide(prev => ({ ...prev, visible: checked }))}
                  />
                  <span className="text-sm">{newSlide.visible ? 'Visible' : 'Hidden'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={newSlide.description}
                onChange={(e) => setNewSlide(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Slide description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>YouTube Video URL</Label>
              <Input
                value={newSlide.youtube_url}
                onChange={(e) => setNewSlide(prev => ({ ...prev, youtube_url: e.target.value, media_id: e.target.value ? '' : prev.media_id }))}
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <p className="text-xs text-muted-foreground">
                Paste a YouTube URL to use as background video. This will override media library selection.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Button Text</Label>
                <Input
                  value={newSlide.button_text}
                  onChange={(e) => setNewSlide(prev => ({ ...prev, button_text: e.target.value }))}
                  placeholder="Optional button text"
                />
              </div>
              <div className="space-y-2">
                <Label>Button Link</Label>
                <Input
                  value={newSlide.button_link}
                  onChange={(e) => setNewSlide(prev => ({ ...prev, button_link: e.target.value }))}
                  placeholder="/events or https://example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Text Position</Label>
                <Select value={newSlide.text_position} onValueChange={(value: any) => setNewSlide(prev => ({ ...prev, text_position: value }))}>
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
              <div className="space-y-2">
                <Label>Text Alignment</Label>
                <Select value={newSlide.text_alignment} onValueChange={(value: any) => setNewSlide(prev => ({ ...prev, text_alignment: value }))}>
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
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={createSlide} disabled={!newSlide.title.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Create Slide
              </Button>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      {previewSlide && (
        <Dialog open={!!previewSlide} onOpenChange={() => setPreviewSlide(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Preview: {previewSlide.title}</DialogTitle>
            </DialogHeader>
            <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
              {previewSlide.media_id?.includes('youtube.com/embed/') ? (
                <iframe
                  src={previewSlide.media_id}
                  className="w-full h-full object-cover"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : (
                (() => {
                  const media = filteredMediaFiles.find(m => m.id === previewSlide.media_id);
                  return media ? (
                    media.file_type?.startsWith('video/') ? (
                      <video
                        src={media.file_url}
                        className="w-full h-full object-cover"
                        controls
                      />
                    ) : (
                      <img
                        src={media.file_url}
                        alt={previewSlide.title}
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <ImageIcon className="h-16 w-16 text-muted-foreground" />
                    </div>
                  );
                })()
              )}
              <div className="absolute inset-0 bg-black/50"></div>
              <div className={`absolute inset-0 flex items-${previewSlide.text_position === 'top' ? 'start' : previewSlide.text_position === 'bottom' ? 'end' : 'center'} justify-${previewSlide.text_alignment} p-8`}>
                <div className={`text-white max-w-2xl text-${previewSlide.text_alignment}`}>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{previewSlide.title}</h1>
                  {previewSlide.description && (
                    <p className="text-lg md:text-xl mb-6 opacity-90">{previewSlide.description}</p>
                  )}
                  {previewSlide.button_text && (
                    <Button size="lg" className="bg-primary hover:bg-primary/90">
                      {previewSlide.button_text}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
