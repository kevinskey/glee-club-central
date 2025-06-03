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
import { Edit, Eye, Trash2, Save, X, Image as ImageIcon, Video } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';

interface HeroSlide {
  id: string;
  media_id?: string;
  media_type: 'image' | 'video';
  title: string;
  description: string;
  button_text?: string;
  button_link?: string;
  text_position: 'top' | 'center' | 'bottom';
  text_alignment: 'left' | 'center' | 'right';
  visible: boolean;
  slide_order: number;
}

interface HeroSlideEditorProps {
  slide: HeroSlide;
  onUpdate: () => void;
  onDelete: (id: string) => void;
}

export function HeroSlideEditor({ slide, onUpdate, onDelete }: HeroSlideEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectMediaOpen, setSelectMediaOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  
  const { filteredMediaFiles, fetchAllMedia } = useMediaLibrary();
  
  const [editData, setEditData] = useState({
    media_id: slide.media_id || '',
    media_type: slide.media_type,
    title: slide.title,
    description: slide.description,
    button_text: slide.button_text || '',
    button_link: slide.button_link || '',
    text_position: slide.text_position,
    text_alignment: slide.text_alignment,
    visible: slide.visible,
    youtube_url: ''
  });

  useEffect(() => {
    fetchAllMedia();
    if (slide.media_id) {
      loadSelectedMedia();
    }
  }, [slide.media_id]);

  const convertYouTubeToEmbed = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&loop=1&playlist=${match[1]}&controls=0&showinfo=0&rel=0&modestbranding=1` : url;
  };

  const loadSelectedMedia = async () => {
    if (!slide.media_id) return;
    
    const media = filteredMediaFiles.find(m => m.id === slide.media_id);
    if (media) {
      setSelectedMedia(media);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let updateData = { ...editData };
      
      // If YouTube URL is provided, use it as media_id and set type to video
      if (editData.youtube_url.trim()) {
        updateData.media_id = convertYouTubeToEmbed(editData.youtube_url.trim());
        updateData.media_type = 'video';
      }

      const { error } = await supabase
        .from('hero_slides')
        .update({
          media_id: updateData.media_id || null,
          media_type: updateData.media_type,
          title: updateData.title.trim() || '',
          description: updateData.description.trim() || '',
          button_text: updateData.button_text.trim() || null,
          button_link: updateData.button_link.trim() || null,
          text_position: updateData.text_position,
          text_alignment: updateData.text_alignment,
          visible: updateData.visible,
          updated_at: new Date().toISOString()
        })
        .eq('id', slide.id);

      if (error) throw error;

      toast.success('Hero slide updated successfully');
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating hero slide:', error);
      toast.error('Failed to update hero slide');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      media_id: slide.media_id || '',
      media_type: slide.media_type,
      title: slide.title,
      description: slide.description,
      button_text: slide.button_text || '',
      button_link: slide.button_link || '',
      text_position: slide.text_position,
      text_alignment: slide.text_alignment,
      visible: slide.visible,
      youtube_url: ''
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('hero_slides')
        .delete()
        .eq('id', slide.id);

      if (error) throw error;

      toast.success('Hero slide deleted successfully');
      onDelete(slide.id);
    } catch (error) {
      console.error('Error deleting hero slide:', error);
      toast.error('Failed to delete hero slide');
    }
    setDeleteDialogOpen(false);
  };

  const handleSelectMedia = (media: any) => {
    setEditData(prev => ({
      ...prev,
      media_id: media.id,
      media_type: media.file_type.startsWith('video/') ? 'video' : 'image',
      youtube_url: '' // Clear YouTube URL when selecting from media library
    }));
    setSelectedMedia(media);
    setSelectMediaOpen(false);
  };

  const handleYouTubeUrlChange = (url: string) => {
    setEditData(prev => ({
      ...prev,
      youtube_url: url,
      media_id: url.trim() ? '' : prev.media_id // Clear media_id when YouTube URL is entered
    }));
    
    // Clear selected media when YouTube URL is entered
    if (url.trim()) {
      setSelectedMedia(null);
    }
  };

  const isYouTubeEmbed = (url: string) => {
    return url?.includes('youtube.com/embed/');
  };

  const mediaLibrary = filteredMediaFiles.filter(file => 
    file.file_type?.startsWith('image/') || file.file_type?.startsWith('video/')
  );

  const currentMedia = selectedMedia || filteredMediaFiles.find(m => m.id === slide.media_id);

  const handleAISuggestion = (field: 'title' | 'description' | 'buttonText', value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Card className="group overflow-hidden transition-all duration-200 hover:shadow-md">
        <div className="flex">
          {/* Media Preview */}
          <div className="w-48 flex-shrink-0">
            <AspectRatio ratio={16/9}>
              {editData.youtube_url.trim() ? (
                <iframe
                  src={convertYouTubeToEmbed(editData.youtube_url)}
                  className="w-full h-full object-cover"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : slide.media_id && isYouTubeEmbed(slide.media_id) ? (
                <iframe
                  src={slide.media_id}
                  className="w-full h-full object-cover"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : currentMedia ? (
                currentMedia.file_type?.startsWith('video/') ? (
                  <video
                    src={currentMedia.file_url}
                    className="object-cover w-full h-full"
                    muted
                  />
                ) : (
                  <img
                    src={currentMedia.file_url}
                    alt={currentMedia.title}
                    className="object-cover w-full h-full"
                  />
                )
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </AspectRatio>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            {!isEditing ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">
                        {slide.title || 'Untitled Slide'}
                      </h3>
                      <Badge variant={slide.visible ? "default" : "secondary"}>
                        {slide.visible ? 'Visible' : 'Hidden'}
                      </Badge>
                      {slide.media_id && (
                        <Badge variant="outline">
                          {slide.media_type === 'video' ? <Video className="w-3 h-3 mr-1" /> : <ImageIcon className="w-3 h-3 mr-1" />}
                          {isYouTubeEmbed(slide.media_id) ? 'YouTube' : slide.media_type}
                        </Badge>
                      )}
                      {!slide.title && !slide.description && !slide.button_text && slide.button_link && (
                        <Badge variant="outline">
                          Clickable Image
                        </Badge>
                      )}
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
                    {!slide.button_text && slide.button_link && (
                      <div className="text-sm">
                        <span className="font-medium">Clickable Link:</span>
                        <span className="text-muted-foreground ml-2">→ {slide.button_link}</span>
                      </div>
                    )}
                    <div className="text-sm text-muted-foreground">
                      Position: {slide.text_position} • Alignment: {slide.text_alignment}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setPreviewOpen(true)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => setDeleteDialogOpen(true)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title (Optional)</Label>
                    <Input
                      id="title"
                      value={editData.title}
                      onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Leave empty for image-only slide"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Media</Label>
                    <Button
                      variant="outline"
                      onClick={() => setSelectMediaOpen(true)}
                      className="w-full justify-start"
                    >
                      {currentMedia && !editData.youtube_url.trim() ? currentMedia.title : 'Select Media'}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={editData.description}
                    onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Leave empty for image-only slide"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="youtube-url">YouTube Video URL</Label>
                  <Input
                    id="youtube-url"
                    value={editData.youtube_url}
                    onChange={(e) => handleYouTubeUrlChange(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Paste a YouTube URL to use as background video. This will override media library selection.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="button_text">Button Text (Optional)</Label>
                    <Input
                      id="button_text"
                      value={editData.button_text}
                      onChange={(e) => setEditData(prev => ({ ...prev, button_text: e.target.value }))}
                      placeholder="Leave empty to make entire slide clickable"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="button_link">Link URL</Label>
                    <Input
                      id="button_link"
                      value={editData.button_link}
                      onChange={(e) => setEditData(prev => ({ ...prev, button_link: e.target.value }))}
                      placeholder="/events or https://example.com"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> For image-only slides, leave title and description empty. 
                    Add a link URL without button text to make the entire slide clickable.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Text Position</Label>
                    <Select value={editData.text_position} onValueChange={(value) => setEditData(prev => ({ ...prev, text_position: value as any }))}>
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
                    <Select value={editData.text_alignment} onValueChange={(value) => setEditData(prev => ({ ...prev, text_alignment: value as any }))}>
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

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-1" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Media Selection Dialog */}
      <Dialog open={selectMediaOpen} onOpenChange={setSelectMediaOpen}>
        <DialogContent className="max-w-6xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Select Media for Hero Slide</DialogTitle>
            <DialogDescription>
              Choose an image or video from your media library.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            {mediaLibrary.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {mediaLibrary.map((mediaFile) => (
                  <div
                    key={mediaFile.id}
                    className="relative cursor-pointer border rounded-lg overflow-hidden hover:border-primary hover:shadow-md transition-all duration-200"
                    onClick={() => handleSelectMedia(mediaFile)}
                  >
                    <AspectRatio ratio={16/9}>
                      {mediaFile.file_type?.startsWith('video/') ? (
                        <video
                          src={mediaFile.file_url}
                          className="w-full h-full object-cover"
                          muted
                        />
                      ) : (
                        <img
                          src={mediaFile.file_url}
                          alt={mediaFile.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        />
                      )}
                    </AspectRatio>
                    <div className="p-2 bg-background/95 backdrop-blur">
                      <p className="text-sm font-medium truncate">{mediaFile.title}</p>
                      <Badge variant="outline" className="text-xs">
                        {mediaFile.file_type?.startsWith('video/') ? 'Video' : 'Image'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No media found in library</p>
                <p className="text-sm">Upload some images or videos to the media library first</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Preview: {slide.title}</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
            {slide.media_id && isYouTubeEmbed(slide.media_id) ? (
              <iframe
                src={slide.media_id}
                className="w-full h-full object-cover"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : currentMedia && (
              currentMedia.file_type?.startsWith('video/') ? (
                <video
                  src={currentMedia.file_url}
                  className="w-full h-full object-cover"
                  controls
                />
              ) : (
                <img
                  src={currentMedia.file_url}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              )
            )}
            <div className="absolute inset-0 bg-black/50"></div>
            <div className={`absolute inset-0 flex items-${slide.text_position === 'top' ? 'start' : slide.text_position === 'bottom' ? 'end' : 'center'} justify-${slide.text_alignment} p-8`}>
              <div className={`text-white max-w-2xl text-${slide.text_alignment}`}>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{slide.title}</h1>
                <p className="text-lg md:text-xl mb-6 opacity-90">{slide.description}</p>
                {slide.button_text && (
                  <Button size="lg" className="bg-indigo-500 hover:bg-indigo-600">
                    {slide.button_text}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
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
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Slide
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
