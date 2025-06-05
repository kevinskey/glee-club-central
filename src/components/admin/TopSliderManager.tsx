import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, MoveUp, MoveDown, Eye, EyeOff, Image, Video, ExternalLink, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MediaPicker } from '@/components/media/MediaPicker';

interface MediaLibraryItem {
  id: string;
  file_url: string;
  title: string;
}

interface TopSliderItem {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  youtube_url?: string;
  media_id?: string;
  link_url?: string;
  background_color?: string;
  text_color?: string;
  visible: boolean;
  display_order: number;
  created_at: string;
}

export function TopSliderManager() {
  const [items, setItems] = useState<TopSliderItem[]>([]);
  const [mediaFiles, setMediaFiles] = useState<{ [key: string]: MediaLibraryItem }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<TopSliderItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [backgroundType, setBackgroundType] = useState<'color' | 'image' | 'media' | 'youtube'>('color');
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    youtube_url: '',
    media_id: '',
    link_url: '',
    background_color: '#4F46E5',
    text_color: '#FFFFFF',
    visible: true
  });

  const fetchItems = async () => {
    try {
      console.log('🔍 TopSliderManager: Fetching slider items...');
      
      // Fetch slides
      const { data: slidesData, error: slidesError } = await supabase
        .from('top_slider_items')
        .select('*')
        .order('display_order', { ascending: true });

      if (slidesError) {
        console.error('❌ TopSliderManager: Slides error:', slidesError);
        throw slidesError;
      }

      console.log('📊 TopSliderManager: Fetched items:', slidesData);
      
      if (!slidesData) {
        setItems([]);
        setIsLoading(false);
        return;
      }

      // Get all unique media IDs
      const mediaIds = slidesData
        .map(slide => slide.media_id)
        .filter(id => id !== null && id !== undefined);

      // Fetch media files if we have media IDs
      let mediaData: MediaLibraryItem[] = [];
      if (mediaIds.length > 0) {
        const { data: fetchedMedia, error: mediaError } = await supabase
          .from('media_library')
          .select('id, file_url, title')
          .in('id', mediaIds);

        if (mediaError) {
          console.error('❌ TopSliderManager: Media error:', mediaError);
        } else {
          mediaData = fetchedMedia || [];
        }
      }

      // Create media lookup map
      const mediaMap: { [key: string]: MediaLibraryItem } = {};
      mediaData.forEach(media => {
        mediaMap[media.id] = media;
      });

      setItems(slidesData);
      setMediaFiles(mediaMap);
    } catch (error) {
      console.error('💥 TopSliderManager: Error fetching top slider items:', error);
      toast.error('Failed to load slider items');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('🚀 TopSliderManager: Component mounted');
    fetchItems();
    
    // Auto-create a sample slide if none exist
    const createSampleSlide = async () => {
      const { data: existingItems } = await supabase
        .from('top_slider_items')
        .select('id')
        .limit(1);
      
      if (!existingItems || existingItems.length === 0) {
        const sampleSlide = {
          title: 'Welcome to Spelman Glee Club',
          description: 'Experience the power of music and sisterhood',
          background_color: '#4F46E5',
          text_color: '#FFFFFF',
          visible: true,
          display_order: 0
        };
        
        try {
          await supabase.from('top_slider_items').insert(sampleSlide);
          console.log('✅ Sample slide created');
          toast.success('Sample slide created');
          fetchItems();
        } catch (error) {
          console.error('❌ Error creating sample slide:', error);
        }
      }
    };
    
    createSampleSlide();
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      youtube_url: '',
      media_id: '',
      link_url: '',
      background_color: '#4F46E5',
      text_color: '#FFFFFF',
      visible: true
    });
    setEditingItem(null);
    setBackgroundType('color');
  };

  const openEditDialog = (item?: TopSliderItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        description: item.description || '',
        image_url: item.image_url || '',
        youtube_url: item.youtube_url || '',
        media_id: item.media_id || '',
        link_url: item.link_url || '',
        background_color: item.background_color || '#4F46E5',
        text_color: item.text_color || '#FFFFFF',
        visible: item.visible
      });
      
      // Determine background type
      if (item.youtube_url) {
        setBackgroundType('youtube');
      } else if (item.media_id) {
        setBackgroundType('media');
      } else if (item.image_url) {
        setBackgroundType('image');
      } else {
        setBackgroundType('color');
      }
    } else {
      resetForm();
    }
    setEditDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      console.log('💾 TopSliderManager: Saving slider item...', { formData, backgroundType });
      
      // Prepare data based on background type
      const dataToSave = {
        title: formData.title,
        description: formData.description,
        link_url: formData.link_url,
        background_color: formData.background_color,
        text_color: formData.text_color,
        visible: formData.visible,
        image_url: backgroundType === 'image' ? formData.image_url : null,
        youtube_url: backgroundType === 'youtube' ? formData.youtube_url : null,
        media_id: backgroundType === 'media' ? formData.media_id : null
      };

      console.log('📋 TopSliderManager: Data to save:', dataToSave);

      if (editingItem) {
        // Update existing item
        const { error } = await supabase
          .from('top_slider_items')
          .update(dataToSave)
          .eq('id', editingItem.id);

        if (error) {
          console.error('❌ TopSliderManager: Update error:', error);
          throw error;
        }
        console.log('✅ TopSliderManager: Item updated successfully');
        toast.success('Slider item updated successfully');
      } else {
        // Create new item
        const maxOrder = Math.max(...items.map(item => item.display_order), -1);
        const newItemData = {
          ...dataToSave,
          display_order: maxOrder + 1
        };
        
        console.log('🆕 TopSliderManager: Creating new item:', newItemData);
        
        const { error } = await supabase
          .from('top_slider_items')
          .insert(newItemData);

        if (error) {
          console.error('❌ TopSliderManager: Insert error:', error);
          throw error;
        }
        console.log('✅ TopSliderManager: Item created successfully');
        toast.success('Slider item created successfully');
      }

      setEditDialogOpen(false);
      resetForm();
      fetchItems();
    } catch (error) {
      console.error('💥 TopSliderManager: Error saving slider item:', error);
      toast.error('Failed to save slider item');
    }
  };

  const handleMediaSelect = (mediaFile: any) => {
    console.log('📁 TopSliderManager: Media selected:', mediaFile);
    setFormData({ ...formData, media_id: mediaFile.id });
    setMediaPickerOpen(false);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      const { error } = await supabase
        .from('top_slider_items')
        .delete()
        .eq('id', itemToDelete);

      if (error) throw error;

      toast.success('Slider item deleted successfully');
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      fetchItems();
    } catch (error) {
      console.error('Error deleting slider item:', error);
      toast.error('Failed to delete slider item');
    }
  };

  const toggleVisibility = async (id: string, visible: boolean) => {
    try {
      const { error } = await supabase
        .from('top_slider_items')
        .update({ visible })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Slider item ${visible ? 'shown' : 'hidden'}`);
      fetchItems();
    } catch (error) {
      console.error('Error updating visibility:', error);
      toast.error('Failed to update visibility');
    }
  };

  const moveItem = async (id: string, direction: 'up' | 'down') => {
    const itemIndex = items.findIndex(item => item.id === id);
    if (
      (direction === 'up' && itemIndex === 0) ||
      (direction === 'down' && itemIndex === items.length - 1)
    ) {
      return;
    }

    const newItems = [...items];
    const targetIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
    
    // Swap display orders
    const currentOrder = newItems[itemIndex].display_order;
    const targetOrder = newItems[targetIndex].display_order;

    try {
      await supabase
        .from('top_slider_items')
        .update({ display_order: targetOrder })
        .eq('id', newItems[itemIndex].id);

      await supabase
        .from('top_slider_items')
        .update({ display_order: currentOrder })
        .eq('id', newItems[targetIndex].id);

      toast.success('Item order updated');
      fetchItems();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  const getItemPreview = (item: TopSliderItem) => {
    let backgroundImage: string | undefined;
    
    if (item.media_id && mediaFiles[item.media_id]) {
      backgroundImage = mediaFiles[item.media_id].file_url;
    } else if (item.image_url) {
      backgroundImage = item.image_url;
    }

    if (item.youtube_url) {
      return (
        <div className="w-16 h-12 rounded flex-shrink-0 bg-red-600 flex items-center justify-center">
          <Video className="h-6 w-6 text-white" />
        </div>
      );
    } else if (backgroundImage) {
      return (
        <div 
          className="w-16 h-12 rounded flex-shrink-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${backgroundImage})`,
          }}
        />
      );
    } else {
      return (
        <div 
          className="w-16 h-12 rounded flex-shrink-0"
          style={{ backgroundColor: item.background_color }}
        />
      );
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Slider Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Top Slider Manager</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage the banner slider that appears at the top of the homepage. Changes are live immediately.
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={fetchItems}
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.open('/', '_blank')}
              size="sm"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Preview Homepage
            </Button>
            <Button onClick={() => openEditDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Slide
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No slider items created yet</p>
            <Button onClick={() => openEditDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Slide
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Live Preview Section */}
            {items.filter(item => item.visible).length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3 text-muted-foreground">LIVE PREVIEW</h4>
                <div className="border rounded-lg overflow-hidden">
                  {(() => {
                    const firstVisibleItem = items.find(item => item.visible);
                    if (!firstVisibleItem) return null;
                    
                    let previewBackgroundImage: string | undefined;
                    if (firstVisibleItem.media_id && mediaFiles[firstVisibleItem.media_id]) {
                      previewBackgroundImage = mediaFiles[firstVisibleItem.media_id].file_url;
                    } else if (firstVisibleItem.image_url) {
                      previewBackgroundImage = firstVisibleItem.image_url;
                    }

                    return (
                      <div 
                        className="h-16 md:h-20 flex items-center justify-center relative bg-cover bg-center"
                        style={{
                          backgroundColor: firstVisibleItem.background_color || '#4F46E5',
                          backgroundImage: previewBackgroundImage ? `url(${previewBackgroundImage})` : undefined
                        }}
                      >
                        {previewBackgroundImage && (
                          <div className="absolute inset-0 bg-black/40" />
                        )}
                        <div className="text-center relative z-10">
                          <h3 
                            className="text-sm md:text-lg font-semibold mb-1"
                            style={{ color: firstVisibleItem.text_color || '#FFFFFF' }}
                          >
                            {firstVisibleItem.title}
                          </h3>
                          {firstVisibleItem.description && (
                            <p 
                              className="text-xs md:text-sm opacity-90"
                              style={{ color: firstVisibleItem.text_color || '#FFFFFF' }}
                            >
                              {firstVisibleItem.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {items.map((item, index) => (
              <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                {getItemPreview(item)}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium truncate">{item.title}</h4>
                    <Badge variant={item.visible ? "default" : "secondary"}>
                      {item.visible ? "Visible" : "Hidden"}
                    </Badge>
                    {item.youtube_url && <Badge variant="outline">YouTube</Badge>}
                    {item.media_id && <Badge variant="outline">Media Library</Badge>}
                    {item.image_url && <Badge variant="outline">Direct URL</Badge>}
                  </div>
                  {item.description && (
                    <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                  )}
                  {item.link_url && (
                    <p className="text-xs text-blue-600 truncate">{item.link_url}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleVisibility(item.id, !item.visible)}
                  >
                    {item.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => moveItem(item.id, 'up')}
                    disabled={index === 0}
                  >
                    <MoveUp className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => moveItem(item.id, 'down')}
                    disabled={index === items.length - 1}
                  >
                    <MoveDown className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setItemToDelete(item.id);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Slider Item' : 'Add Slider Item'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter slide title"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter slide description"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="link_url">Link URL</Label>
              <Input
                id="link_url"
                value={formData.link_url}
                onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                placeholder="https://example.com"
              />
            </div>

            {/* Background Type Selection */}
            <div>
              <Label>Background Type</Label>
              <Tabs value={backgroundType} onValueChange={(value) => setBackgroundType(value as any)}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="color">Color</TabsTrigger>
                  <TabsTrigger value="image">Image URL</TabsTrigger>
                  <TabsTrigger value="media">Media Library</TabsTrigger>
                  <TabsTrigger value="youtube">YouTube</TabsTrigger>
                </TabsList>
                
                <TabsContent value="color" className="mt-4">
                  <div>
                    <Label htmlFor="background_color">Background Color</Label>
                    <Input
                      id="background_color"
                      type="color"
                      value={formData.background_color}
                      onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="image" className="mt-4">
                  <div>
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="media" className="mt-4">
                  <div>
                    <Label>Select from Media Library</Label>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setMediaPickerOpen(true)}
                      className="w-full mt-2"
                    >
                      <Image className="h-4 w-4 mr-2" />
                      {formData.media_id ? 'Change Media' : 'Select Media'}
                    </Button>
                    {formData.media_id && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Media selected: {formData.media_id}
                      </p>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="youtube" className="mt-4">
                  <div>
                    <Label htmlFor="youtube_url">YouTube URL</Label>
                    <Input
                      id="youtube_url"
                      value={formData.youtube_url}
                      onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      The video will auto-play muted as background
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div>
              <Label htmlFor="text_color">Text Color</Label>
              <Input
                id="text_color"
                type="color"
                value={formData.text_color}
                onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="visible"
                checked={formData.visible}
                onCheckedChange={(checked) => setFormData({ ...formData, visible: checked })}
              />
              <Label htmlFor="visible">Visible</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingItem ? 'Update' : 'Create'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Media Picker Dialog */}
      <Dialog open={mediaPickerOpen} onOpenChange={setMediaPickerOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Select Media from Library</DialogTitle>
          </DialogHeader>
          <MediaPicker 
            onSelect={handleMediaSelect}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Slider Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this slider item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
