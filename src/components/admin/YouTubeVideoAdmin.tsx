import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, ExternalLink, Video, Save, X, List, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface YouTubeVideo {
  id: string;
  title: string;
  description?: string;
  youtube_url: string;
  thumbnail_url?: string;
  is_active: boolean;
  display_order: number;
  content_type: 'video' | 'playlist';
  created_at: string;
}

export function YouTubeVideoAdmin() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingVideoInfo, setIsLoadingVideoInfo] = useState(false);
  const [editingVideo, setEditingVideo] = useState<YouTubeVideo | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtube_url: '',
    thumbnail_url: '',
    is_active: true,
    display_order: 1,
    content_type: 'video' as 'video' | 'playlist'
  });

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      console.log('🎬 Loading all YouTube videos for admin...');
      const { data, error } = await supabase
        .from('youtube_videos')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error loading videos:', error);
        throw error;
      }
      
      console.log('🎬 Admin videos loaded:', data?.length || 0, data);
      setVideos(data || []);
    } catch (error) {
      console.error('Error loading videos:', error);
      toast.error('Failed to load videos');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch YouTube video information using our Edge Function
  const fetchYouTubeInfo = async (url: string) => {
    setIsLoadingVideoInfo(true);
    try {
      console.log('🎬 Fetching YouTube info from API for:', url);
      
      const { data, error } = await supabase.functions.invoke('youtube-info', {
        body: { url }
      });

      if (error) {
        console.error('YouTube API Error:', error);
        throw new Error(error.message || 'Failed to fetch video information');
      }

      if (data) {
        console.log('🎬 YouTube API response:', data);
        
        // Update form data with fetched information
        setFormData(prev => ({
          ...prev,
          title: data.title || prev.title,
          description: data.description || prev.description,
          thumbnail_url: data.thumbnail_url || prev.thumbnail_url,
          content_type: data.content_type || prev.content_type
        }));

        toast.success(
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Video information loaded from YouTube API!</span>
          </div>
        );
      }
    } catch (error) {
      console.error('Error fetching YouTube info:', error);
      toast.error(`Failed to fetch video information: ${error.message}`);
      
      // Fallback to basic extraction if API fails
      await fetchYouTubeInfoFallback(url);
    } finally {
      setIsLoadingVideoInfo(false);
    }
  };

  // Fallback method using oEmbed (keeping the original logic)
  const fetchYouTubeInfoFallback = async (url: string) => {
    try {
      console.log('🎬 Using fallback oEmbed method');
      const videoId = extractVideoId(url);
      const playlistId = extractPlaylistId(url);
      
      if (!videoId && !playlistId) {
        toast.error('Invalid YouTube URL');
        return;
      }

      let title = '';
      let description = '';
      let thumbnailUrl = '';
      let contentType: 'video' | 'playlist' = 'video';

      if (playlistId) {
        contentType = 'playlist';
        title = 'YouTube Playlist';
        description = 'Imported from YouTube playlist';
        thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
      } else if (videoId) {
        try {
          const oEmbedResponse = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
          if (oEmbedResponse.ok) {
            const oEmbedData = await oEmbedResponse.json();
            title = oEmbedData.title || 'YouTube Video';
            description = `By ${oEmbedData.author_name || 'Unknown Author'}`;
            thumbnailUrl = oEmbedData.thumbnail_url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
          } else {
            throw new Error('oEmbed failed');
          }
        } catch (oEmbedError) {
          console.log('oEmbed failed, using basic fallback');
          title = 'YouTube Video';
          description = 'Imported from YouTube';
          thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }
      }

      setFormData(prev => ({
        ...prev,
        title: title,
        description: description,
        thumbnail_url: thumbnailUrl,
        content_type: contentType
      }));

      toast.success('Basic video information loaded (fallback method)');
    } catch (error) {
      console.error('Fallback method failed:', error);
      toast.error('Failed to fetch video information');
    }
  };

  // Function to extract video ID from YouTube URL
  const extractVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Function to extract playlist ID from YouTube URL
  const extractPlaylistId = (url: string): string | null => {
    const regex = /[?&]list=([^"&?\/\s]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const detectContentType = (url: string): 'video' | 'playlist' => {
    if (url.includes('list=') || url.includes('/playlist?')) {
      return 'playlist';
    }
    return 'video';
  };

  const handleUrlChange = async (url: string) => {
    const contentType = detectContentType(url);
    setFormData({ 
      ...formData, 
      youtube_url: url, 
      content_type: contentType 
    });

    // Auto-fetch video info if URL looks valid
    if (url && (url.includes('youtube.com') || url.includes('youtu.be'))) {
      await fetchYouTubeInfo(url);
    }
  };

  const handleSave = async () => {
    try {
      if (editingVideo) {
        const { error } = await supabase
          .from('youtube_videos')
          .update(formData)
          .eq('id', editingVideo.id);

        if (error) throw error;
        toast.success('Content updated successfully');
      } else {
        const { error } = await supabase
          .from('youtube_videos')
          .insert([formData]);

        if (error) throw error;
        toast.success('Content added successfully');
      }

      resetForm();
      loadVideos();
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      const { error } = await supabase
        .from('youtube_videos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Content deleted successfully');
      loadVideos();
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Failed to delete content');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      youtube_url: '',
      thumbnail_url: '',
      is_active: true,
      display_order: 1,
      content_type: 'video'
    });
    setEditingVideo(null);
    setShowAddForm(false);
  };

  const startEdit = (video: YouTubeVideo) => {
    setFormData({
      title: video.title,
      description: video.description || '',
      youtube_url: video.youtube_url,
      thumbnail_url: video.thumbnail_url || '',
      is_active: video.is_active,
      display_order: video.display_order,
      content_type: video.content_type || 'video'
    });
    setEditingVideo(video);
    setShowAddForm(true);
  };

  const getThumbnailUrl = (url: string, contentType: 'video' | 'playlist'): string => {
    if (contentType === 'playlist') {
      const playlistId = extractPlaylistId(url);
      const videoId = extractVideoId(url);
      return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
    } else {
      const videoId = extractVideoId(url);
      return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">Loading content...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-navy-900">YouTube Content</h2>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Content
        </Button>
      </div>

      <Tabs defaultValue="content" className="space-y-4">
        <TabsList>
          <TabsTrigger value="content">Manage Content</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          {/* Add/Edit Form */}
          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle>{editingVideo ? 'Edit Content' : 'Add New Content'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="youtube_url">YouTube URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="youtube_url"
                      value={formData.youtube_url}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      placeholder="Paste YouTube URL here - info will auto-populate from YouTube API"
                      className="flex-1"
                    />
                    {isLoadingVideoInfo && (
                      <div className="flex items-center px-3">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Paste a YouTube video or playlist URL and detailed information will be automatically fetched from YouTube's API
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Content title (auto-filled from YouTube API)"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="content_type">Content Type</Label>
                    <Select value={formData.content_type} onValueChange={(value: 'video' | 'playlist') => setFormData({ ...formData, content_type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Single Video</SelectItem>
                        <SelectItem value="playlist">Playlist</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">
                      Auto-detected from URL: {formData.content_type === 'playlist' 
                        ? 'This will embed an entire YouTube playlist'
                        : 'This will embed a single YouTube video'
                      }
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Content description (auto-filled from YouTube API)"
                    rows={3}
                  />
                </div>

                {formData.thumbnail_url && (
                  <div className="space-y-2">
                    <Label>Preview Thumbnail</Label>
                    <div className="max-w-sm">
                      <img 
                        src={formData.thumbnail_url} 
                        alt="Video thumbnail"
                        className="w-full rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="display_order">Display Order</Label>
                    <Input
                      id="display_order"
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 1 })}
                      min="1"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={resetForm}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isLoadingVideoInfo}>
                    <Save className="h-4 w-4 mr-2" />
                    {editingVideo ? 'Update' : 'Add'} Content
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Content List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => {
              const thumbnailUrl = video.thumbnail_url || getThumbnailUrl(video.youtube_url, video.content_type || 'video');
              const fallbackUrl = `https://via.placeholder.com/320x180/f3f4f6/9ca3af?text=${video.content_type === 'playlist' ? 'Playlist' : 'Video'}`;
              
              return (
                <Card key={video.id} className="overflow-hidden">
                  <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative">
                    <img
                      src={thumbnailUrl || fallbackUrl}
                      alt={video.title || 'YouTube Content'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log('Thumbnail failed to load, using fallback');
                        e.currentTarget.src = fallbackUrl;
                      }}
                    />
                    <div className="absolute top-2 left-2">
                      <Badge variant={video.content_type === 'playlist' ? 'default' : 'secondary'}>
                        {video.content_type === 'playlist' ? (
                          <>
                            <List className="h-3 w-3 mr-1" />
                            Playlist
                          </>
                        ) : (
                          <>
                            <Video className="h-3 w-3 mr-1" />
                            Video
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-sm line-clamp-2 flex-1 mr-2">
                        {video.title || 'Untitled'}
                      </h3>
                      <Badge variant={video.is_active ? "default" : "secondary"}>
                        {video.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    
                    {video.description && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {video.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Order: {video.display_order}</span>
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(video.youtube_url, '_blank')}
                          title="Open in YouTube"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEdit(video)}
                          title="Edit"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(video.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {videos.length === 0 && (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                No content added yet. Add your first YouTube video or playlist to get started.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Homepage Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-600 dark:text-gray-400">
                This shows how the content will appear on the homepage.
                <br />
                Visit the homepage to see the actual implementation.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
