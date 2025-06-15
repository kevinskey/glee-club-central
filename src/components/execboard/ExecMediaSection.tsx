import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Camera, Plus, Image, Video } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Profile } from '@/types/auth';

interface MediaItem {
  id: string;
  title: string;
  file_url: string;
  file_type: string;
  tags: string[];
  created_at: string;
  uploaded_by: string;
}

export function ExecMediaSection() {
  const { profile } = useAuth() as { profile: Profile | null };
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    tags: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const canUpload = () => {
    return ['President', 'Historian', 'Social Media Chair'].includes(profile?.exec_board_role || '');
  };

  useEffect(() => {
    fetchMediaItems();
  }, []);

  const fetchMediaItems = async () => {
    try {
      const { data, error } = await supabase
        .from('media_library')
        .select(`
          id,
          title,
          file_url,
          file_type,
          tags,
          created_at,
          uploaded_by,
          profiles!inner(first_name, last_name)
        `)
        .eq('is_internal', true)
        .order('created_at', { ascending: false })
        .limit(12);

      if (error) throw error;

      const formattedMedia = (data ?? []).map(item => {
        let uploaded_by = "Unknown";
        if (Array.isArray(item.profiles) && item.profiles[0]) {
          const { first_name, last_name } = item.profiles[0];
          uploaded_by = `${first_name ?? ""} ${last_name ?? ""}`.trim() || "Unknown";
        } else if (item.profiles?.first_name || item.profiles?.last_name) {
          uploaded_by = `${item.profiles.first_name ?? ""} ${item.profiles.last_name ?? ""}`.trim() || "Unknown";
        }
        return {
          id: item.id,
          title: item.title,
          file_url: item.file_url,
          file_type: item.file_type,
          tags: item.tags || [],
          created_at: item.created_at,
          uploaded_by,
        };
      });

      setMediaItems(formattedMedia);
    } catch (error) {
      console.error('Error fetching media:', error);
      toast.error('Failed to load media');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMediaUpload = async () => {
    if (!selectedFile || !formData.title.trim()) {
      toast.error('Please provide a title and select a file');
      return;
    }

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${selectedFile.name}`;
      const filePath = `exec-media/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);

      const { error: dbError } = await supabase
        .from('media_library')
        .insert({
          title: formData.title,
          file_path: filePath,
          file_url: publicUrl,
          file_type: selectedFile.type,
          tags: tags,
          is_internal: true,
          uploaded_by: profile?.id,
          folder: 'exec-board'
        });

      if (dbError) throw dbError;

      toast.success('Media uploaded successfully');
      setUploadDialog(false);
      setFormData({ title: '', tags: '' });
      setSelectedFile(null);
      fetchMediaItems();
    } catch (error) {
      console.error('Error uploading media:', error);
      toast.error('Failed to upload media');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Media Gallery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Media Gallery
        </CardTitle>
        {canUpload() && (
          <Dialog open={uploadDialog} onOpenChange={setUploadDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Upload Media
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Media</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Media title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Tags (comma separated)</label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="rehearsal, performance, social"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">File</label>
                  <Input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    accept="image/*,video/*"
                  />
                </div>
                <Button onClick={handleMediaUpload} className="w-full">
                  <Camera className="h-4 w-4 mr-2" />
                  Upload Media
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {mediaItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No media uploaded yet</p>
            {canUpload() && (
              <p className="text-sm">Click "Upload Media" to add photos and videos</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {mediaItems.map((item) => (
              <div key={item.id} className="group relative aspect-square bg-muted rounded-lg overflow-hidden">
                {item.file_type.startsWith('image/') ? (
                  <img
                    src={item.file_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <Video className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors">
                  <div className="absolute bottom-0 left-0 right-0 p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
