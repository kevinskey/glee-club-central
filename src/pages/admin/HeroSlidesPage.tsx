
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Trash2, Plus, Edit, Eye, EyeOff, X, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { HeroSlideMediaPicker } from '@/components/admin/HeroSlideMediaPicker';
import { AdminTopNavigation } from '@/components/admin/AdminTopNavigation';

interface HeroSlide {
  id: string;
  title: string;
  description?: string;
  button_text?: string;
  button_link?: string;
  media_id?: string;
  youtube_url?: string;
  media_type?: string;
  visible: boolean;
  show_title?: boolean;
  slide_order: number;
  section_id: string;
}

interface MediaFile {
  id: string;
  title: string;
  file_url: string;
}

export default function HeroSlidesPage() {
  const { user } = useAuth();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedMediaUrl, setSelectedMediaUrl] = useState<string>('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    button_text: '',
    button_link: '',
    media_id: '',
    youtube_url: '',
    media_type: 'image',
    visible: true,
    show_title: true,
    slide_order: 0,
    section_id: 'homepage-main'
  });

  useEffect(() => {
    fetchSlides();
    fetchMediaFiles();
  }, []);

  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('slide_order', { ascending: true });

      if (error) throw error;
      setSlides(data || []);
    } catch (error) {
      console.error('Error fetching slides:', error);
      toast.error('Failed to load slides');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMediaFiles = async () => {
    try {
      console.log('Fetching media files for thumbnails...');
      const { data, error } = await supabase
        .from('media_library')
        .select('id, title, file_url, file_type')
        .in('file_type', ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'])
        .order('title');

      if (error) throw error;
      console.log('Media files fetched:', data);
      setMediaFiles(data || []);
    } catch (error) {
      console.error('Error fetching media files:', error);
    }
  };

  const handleMediaSelect = async (mediaData: { id: string; file_type: string; file_url: string }) => {
    console.log('HeroSlidesPage: Media selected:', mediaData);
    
    if (!mediaData.id || !mediaData.file_url) {
      console.error('HeroSlidesPage: Invalid media data received:', mediaData);
      toast.error('Invalid media selection');
      return;
    }
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      media_id: mediaData.id,
      media_type: mediaData.file_type.startsWith('video/') ? 'video' : 'image'
    }));
    
    // Set the selected media URL for immediate display
    setSelectedMediaUrl(mediaData.file_url);
    
    console.log('HeroSlidesPage: Form updated with media_id:', mediaData.id);
    console.log('HeroSlidesPage: Selected media URL set to:', mediaData.file_url);
    
    toast.success('Image selected successfully!');
    
    // Refresh media files to ensure we have the latest data
    await fetchMediaFiles();
  };

  const getCurrentImageUrl = () => {
    if (formData.media_id) {
      // First check if we have it in selectedMediaUrl
      if (selectedMediaUrl) {
        return selectedMediaUrl;
      }
      
      // Then check in mediaFiles
      const existingFile = mediaFiles.find(f => f.id === formData.media_id);
      if (existingFile) {
        return existingFile.file_url;
      }
    }
    return undefined;
  };

  const getSlideImageUrl = (slide: HeroSlide) => {
    if (slide.media_id) {
      console.log(`Looking for media_id: ${slide.media_id} in:`, mediaFiles.map(f => ({ id: f.id, title: f.title })));
      const mediaFile = mediaFiles.find(f => f.id === slide.media_id);
      console.log(`Found media file:`, mediaFile);
      return mediaFile?.file_url;
    }
    return undefined;
  };

  const handleSave = async () => {
    try {
      console.log('Saving slide with data:', formData);
      
      if (editingSlide) {
        const { error } = await supabase
          .from('hero_slides')
          .update(formData)
          .eq('id', editingSlide.id);

        if (error) throw error;
        toast.success('Slide updated successfully');
      } else {
        const { error } = await supabase
          .from('hero_slides')
          .insert(formData);

        if (error) throw error;
        toast.success('Slide created successfully');
      }

      resetForm();
      fetchSlides();
    } catch (error) {
      console.error('Error saving slide:', error);
      toast.error('Failed to save slide');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('hero_slides')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Slide deleted successfully');
      fetchSlides();
    } catch (error) {
      console.error('Error deleting slide:', error);
      toast.error('Failed to delete slide');
    }
  };

  const handleEdit = (slide: HeroSlide) => {
    console.log('HeroSlidesPage: Editing slide:', slide);
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      description: slide.description || '',
      button_text: slide.button_text || '',
      button_link: slide.button_link || '',
      media_id: slide.media_id || '',
      youtube_url: slide.youtube_url || '',
      media_type: slide.media_type || 'image',
      visible: slide.visible,
      show_title: slide.show_title !== false,
      slide_order: slide.slide_order,
      section_id: slide.section_id
    });
    
    // Set the selected media URL if editing
    if (slide.media_id) {
      const mediaFile = mediaFiles.find(f => f.id === slide.media_id);
      if (mediaFile) {
        setSelectedMediaUrl(mediaFile.file_url);
        console.log('HeroSlidesPage: Set selected media URL for editing:', mediaFile.file_url);
      }
    } else {
      setSelectedMediaUrl('');
    }
    
    // Ensure the form is visible
    setIsCreating(true);
    
    // Scroll to form
    setTimeout(() => {
      const formElement = document.getElementById('hero-slide-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const toggleVisibility = async (slide: HeroSlide) => {
    try {
      const { error } = await supabase
        .from('hero_slides')
        .update({ visible: !slide.visible })
        .eq('id', slide.id);

      if (error) throw error;
      fetchSlides();
      toast.success(`Slide ${!slide.visible ? 'shown' : 'hidden'}`);
    } catch (error) {
      console.error('Error updating visibility:', error);
      toast.error('Failed to update visibility');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      button_text: '',
      button_link: '',
      media_id: '',
      youtube_url: '',
      media_type: 'image',
      visible: true,
      show_title: true,
      slide_order: slides.length,
      section_id: 'homepage-main'
    });
    setSelectedMediaUrl('');
    setEditingSlide(null);
    setIsCreating(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <AdminTopNavigation />
        <div className="p-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminTopNavigation />
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Hero Slides Management</h1>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Slide
          </Button>
        </div>

        {/* Debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">
            <p><strong>Debug:</strong> Found {mediaFiles.length} media files</p>
            <p>Slides with media_id: {slides.filter(s => s.media_id).length}</p>
          </div>
        )}

        {/* Slides List */}
        <div className="grid gap-4">
          {slides.map((slide) => {
            const imageUrl = getSlideImageUrl(slide);
            return (
              <Card key={slide.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-4">
                    {/* Image Thumbnail */}
                    <div className="w-16 h-16 rounded border overflow-hidden bg-gray-100 flex-shrink-0">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={slide.title}
                          className="w-full h-full object-cover"
                          onLoad={() => console.log(`Thumbnail loaded for slide: ${slide.title}`)}
                          onError={() => console.error(`Failed to load thumbnail for slide: ${slide.title}, URL: ${imageUrl}`)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ImageIcon className="h-6 w-6" />
                          {process.env.NODE_ENV === 'development' && (
                            <span className="sr-only">No image (media_id: {slide.media_id || 'none'})</span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <CardTitle className="text-lg flex items-center gap-2">
                      {slide.visible ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      )}
                      {slide.title || 'Untitled Slide'}
                    </CardTitle>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleVisibility(slide)}
                    >
                      {slide.visible ? 'Hide' : 'Show'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(slide)}
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Slide</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{slide.title || 'this slide'}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(slide.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Order: {slide.slide_order} | Type: {slide.media_type}
                    {slide.media_id && ' | Has Image'}
                    {process.env.NODE_ENV === 'development' && slide.media_id && (
                      <span> | Media ID: {slide.media_id}</span>
                    )}
                  </p>
                  {slide.description && (
                    <p className="text-sm mt-2">{slide.description}</p>
                  )}
                  {slide.button_text && (
                    <p className="text-sm mt-1">Button: {slide.button_text}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Create/Edit Form */}
        {isCreating && (
          <Card id="hero-slide-form">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                {editingSlide ? 'Edit Slide' : 'Create New Slide'}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetForm}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter slide title"
                />
              </div>

              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter slide description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="button_text">Button Text (optional)</Label>
                  <Input
                    id="button_text"
                    value={formData.button_text}
                    onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                    placeholder="Learn More"
                  />
                </div>
                <div>
                  <Label htmlFor="button_link">Button Link (optional)</Label>
                  <Input
                    id="button_link"
                    value={formData.button_link}
                    onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                    placeholder="/about"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="media_type">Media Type</Label>
                <Select
                  value={formData.media_type}
                  onValueChange={(value) => setFormData({ ...formData, media_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">YouTube Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.media_type === 'image' && (
                <div>
                  <Label>Background Image</Label>
                  <div className="mt-2 space-y-3">
                    <HeroSlideMediaPicker
                      currentImageUrl={getCurrentImageUrl()}
                      onImageSelect={handleMediaSelect}
                    />
                    {formData.media_id && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800 font-medium">
                          ✓ Image selected (ID: {formData.media_id})
                        </p>
                        {getCurrentImageUrl() && (
                          <div className="mt-2">
                            <img
                              src={getCurrentImageUrl()}
                              alt="Selected slide image"
                              className="w-full max-w-xs h-32 object-cover rounded border"
                              onLoad={() => console.log('Image loaded successfully')}
                              onError={(e) => console.error('Image failed to load:', e)}
                            />
                            <p className="text-xs text-green-600 mt-1">Preview of selected image</p>
                          </div>
                        )}
                      </div>
                    )}
                    {!formData.media_id && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          ⚠️ No image selected. Click "Select Image" to choose a background image.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {formData.media_type === 'video' && (
                <div>
                  <Label htmlFor="youtube_url">YouTube URL</Label>
                  <Input
                    id="youtube_url"
                    value={formData.youtube_url}
                    onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                    placeholder="https://www.youtube.com/embed/VIDEO_ID"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="slide_order">Display Order</Label>
                  <Input
                    id="slide_order"
                    type="number"
                    value={formData.slide_order}
                    onChange={(e) => setFormData({ ...formData, slide_order: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="visible"
                      checked={formData.visible}
                      onCheckedChange={(checked) => setFormData({ ...formData, visible: checked })}
                    />
                    <Label htmlFor="visible">Visible</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show_title"
                      checked={formData.show_title}
                      onCheckedChange={(checked) => setFormData({ ...formData, show_title: checked })}
                    />
                    <Label htmlFor="show_title">Show title on slide</Label>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave}>
                  {editingSlide ? 'Update Slide' : 'Create Slide'}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
