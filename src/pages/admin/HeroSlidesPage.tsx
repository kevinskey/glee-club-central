
import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useHeroSlides } from '@/hooks/useHeroSlides';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Eye, EyeOff, Edit, Plus, ArrowUp, ArrowDown, Image, Video } from 'lucide-react';

export default function HeroSlidesPage() {
  const { slides, loading, fetchHeroSlides, updateSlideVisibility, updateSlideOrder } = useHeroSlides('homepage-main');
  const { files: mediaFiles, loading: mediaLoading } = useMediaLibrary();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    media_id: '',
    button_text: '',
    button_link: '',
    text_position: 'center',
    text_alignment: 'center',
    show_title: true,
    media_type: 'image',
    youtube_url: ''
  });

  const handleCreateSlide = async () => {
    try {
      const slideOrder = slides.length;
      
      const { error } = await supabase
        .from('hero_slides')
        .insert({
          ...formData,
          section_id: 'homepage-main',
          slide_order: slideOrder,
          visible: false
        });

      if (error) throw error;

      toast.success('Hero slide created successfully');
      setIsCreateDialogOpen(false);
      setFormData({
        title: '',
        description: '',
        media_id: '',
        button_text: '',
        button_link: '',
        text_position: 'center',
        text_alignment: 'center',
        show_title: true,
        media_type: 'image',
        youtube_url: ''
      });
      fetchHeroSlides();
    } catch (error) {
      console.error('Error creating slide:', error);
      toast.error('Failed to create slide');
    }
  };

  const handleUpdateSlide = async () => {
    if (!editingSlide) return;

    try {
      const { error } = await supabase
        .from('hero_slides')
        .update(formData)
        .eq('id', editingSlide.id);

      if (error) throw error;

      toast.success('Hero slide updated successfully');
      setEditingSlide(null);
      fetchHeroSlides();
    } catch (error) {
      console.error('Error updating slide:', error);
      toast.error('Failed to update slide');
    }
  };

  const handleDeleteSlide = async (slideId) => {
    try {
      const { error } = await supabase
        .from('hero_slides')
        .delete()
        .eq('id', slideId);

      if (error) throw error;

      toast.success('Hero slide deleted successfully');
      fetchHeroSlides();
    } catch (error) {
      console.error('Error deleting slide:', error);
      toast.error('Failed to delete slide');
    }
  };

  const moveSlide = async (slideId, direction) => {
    const currentIndex = slides.findIndex(s => s.id === slideId);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= slides.length) return;

    await updateSlideOrder(slideId, newIndex);
  };

  const openEditDialog = (slide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title || '',
      description: slide.description || '',
      media_id: slide.media_id || '',
      button_text: slide.button_text || '',
      button_link: slide.button_link || '',
      text_position: slide.text_position || 'center',
      text_alignment: slide.text_alignment || 'center',
      show_title: slide.show_title !== false,
      media_type: slide.media_type || 'image',
      youtube_url: slide.youtube_url || ''
    });
  };

  const availableMedia = mediaFiles.filter(file => 
    file.file_type?.startsWith('image/') || file.file_type?.startsWith('video/')
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Hero Slides"
          description="Manage the landing page slider content"
        />
        <div className="mt-8 text-center">Loading slides...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Hero Slides"
        description="Manage the landing page slider content"
        action={
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Slide
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Hero Slide</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter slide title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter slide description"
                  />
                </div>

                <div>
                  <Label htmlFor="media_type">Media Type</Label>
                  <Select
                    value={formData.media_type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, media_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select media type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">YouTube Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.media_type === 'image' ? (
                  <div>
                    <Label htmlFor="media_id">Background Image</Label>
                    <Select
                      value={formData.media_id}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, media_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select background image" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableMedia.map((file) => (
                          <SelectItem key={file.id} value={file.id}>
                            {file.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="youtube_url">YouTube Embed URL</Label>
                    <Input
                      id="youtube_url"
                      value={formData.youtube_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, youtube_url: e.target.value }))}
                      placeholder="https://www.youtube.com/embed/VIDEO_ID"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="button_text">Button Text</Label>
                    <Input
                      id="button_text"
                      value={formData.button_text}
                      onChange={(e) => setFormData(prev => ({ ...prev, button_text: e.target.value }))}
                      placeholder="Learn More"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="button_link">Button Link</Label>
                    <Input
                      id="button_link"
                      value={formData.button_link}
                      onChange={(e) => setFormData(prev => ({ ...prev, button_link: e.target.value }))}
                      placeholder="/about"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="text_position">Text Position</Label>
                    <Select
                      value={formData.text_position}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, text_position: value }))}
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
                    <Label htmlFor="text_alignment">Text Alignment</Label>
                    <Select
                      value={formData.text_alignment}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, text_alignment: value }))}
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
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="show_title"
                    checked={formData.show_title}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, show_title: checked }))}
                  />
                  <Label htmlFor="show_title">Show Title</Label>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateSlide}>
                    Create Slide
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="mt-8 space-y-4">
        {slides.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No hero slides created yet. Add your first slide to get started.</p>
            </CardContent>
          </Card>
        ) : (
          slides.map((slide, index) => (
            <Card key={slide.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <CardTitle className="flex items-center space-x-2">
                      {slide.media_type === 'video' ? (
                        <Video className="h-5 w-5" />
                      ) : (
                        <Image className="h-5 w-5" />
                      )}
                      <span>{slide.title}</span>
                    </CardTitle>
                    <Badge variant={slide.visible ? "default" : "secondary"}>
                      {slide.visible ? "Visible" : "Hidden"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveSlide(slide.id, 'up')}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveSlide(slide.id, 'down')}
                      disabled={index === slides.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateSlideVisibility(slide.id, !slide.visible)}
                    >
                      {slide.visible ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(slide)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSlide(slide.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    {slide.media?.file_url ? (
                      <img
                        src={slide.media.file_url}
                        alt={slide.title}
                        className="w-full h-32 object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-500">No image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground mb-2">{slide.description}</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <Badge variant="outline">Order: {slide.slide_order}</Badge>
                      <Badge variant="outline">Position: {slide.text_position}</Badge>
                      <Badge variant="outline">Alignment: {slide.text_alignment}</Badge>
                      {slide.button_text && (
                        <Badge variant="outline">Button: {slide.button_text}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingSlide} onOpenChange={() => setEditingSlide(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Hero Slide</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Same form fields as create dialog */}
            <div>
              <Label htmlFor="edit_title">Title</Label>
              <Input
                id="edit_title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter slide title"
              />
            </div>
            
            <div>
              <Label htmlFor="edit_description">Description</Label>
              <Textarea
                id="edit_description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter slide description"
              />
            </div>

            <div>
              <Label htmlFor="edit_media_type">Media Type</Label>
              <Select
                value={formData.media_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, media_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select media type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">YouTube Video</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.media_type === 'image' ? (
              <div>
                <Label htmlFor="edit_media_id">Background Image</Label>
                <Select
                  value={formData.media_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, media_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select background image" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMedia.map((file) => (
                      <SelectItem key={file.id} value={file.id}>
                        {file.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div>
                <Label htmlFor="edit_youtube_url">YouTube Embed URL</Label>
                <Input
                  id="edit_youtube_url"
                  value={formData.youtube_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, youtube_url: e.target.value }))}
                  placeholder="https://www.youtube.com/embed/VIDEO_ID"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_button_text">Button Text</Label>
                <Input
                  id="edit_button_text"
                  value={formData.button_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, button_text: e.target.value }))}
                  placeholder="Learn More"
                />
              </div>
              
              <div>
                <Label htmlFor="edit_button_link">Button Link</Label>
                <Input
                  id="edit_button_link"
                  value={formData.button_link}
                  onChange={(e) => setFormData(prev => ({ ...prev, button_link: e.target.value }))}
                  placeholder="/about"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_text_position">Text Position</Label>
                <Select
                  value={formData.text_position}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, text_position: value }))}
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
                <Label htmlFor="edit_text_alignment">Text Alignment</Label>
                <Select
                  value={formData.text_alignment}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, text_alignment: value }))}
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
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="edit_show_title"
                checked={formData.show_title}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, show_title: checked }))}
              />
              <Label htmlFor="edit_show_title">Show Title</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingSlide(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateSlide}>
                Update Slide
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
