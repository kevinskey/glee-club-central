
import React, { useState, useCallback } from 'react';
import { AdminV2Layout } from '@/layouts/AdminV2Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { WaveSurferPlayer } from '@/components/audio/WaveSurferPlayer';
import { InlineMediaTitleEdit } from '@/components/media/InlineMediaTitleEdit';
import { useAudioFiles } from '@/hooks/useAudioFiles';
import { AudioFile, AudioFileData } from '@/types/audio';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Upload, 
  Music, 
  Mic, 
  Search, 
  Filter, 
  Edit,
  Trash2,
  Plus
} from 'lucide-react';

export default function AudioManagementPage() {
  const { audioFiles, loading, error, refetch } = useAudioFiles();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [editingFile, setEditingFile] = useState<AudioFileData | null>(null);
  
  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: 'recordings',
    is_backing_track: false
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: 'recordings',
    is_backing_track: false
  });

  const categories = ['recordings', 'backing_tracks', 'practice', 'performance'];

  const filteredFiles = audioFiles.filter(file => {
    const matchesSearch = file.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (file.description && file.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || file.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const recordings = filteredFiles.filter(file => !file.is_backing_track);
  const backingTracks = filteredFiles.filter(file => file.is_backing_track);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      toast.error('Please select a valid audio file');
      return;
    }

    setUploading(true);
    try {
      // Upload file to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `audio/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media_library')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media_library')
        .getPublicUrl(filePath);

      // Save to database
      const { error: dbError } = await supabase
        .from('audio_files')
        .insert({
          title: uploadForm.title || file.name.replace(/\.[^/.]+$/, ''),
          description: uploadForm.description,
          file_path: filePath,
          file_url: publicUrl,
          category: uploadForm.category,
          is_backing_track: uploadForm.is_backing_track,
          uploaded_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (dbError) throw dbError;

      toast.success('Audio file uploaded successfully');
      setUploadForm({
        title: '',
        description: '',
        category: 'recordings',
        is_backing_track: false
      });
      refetch();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error('Failed to upload audio file');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (file: AudioFileData) => {
    setEditingFile(file);
    setEditForm({
      title: file.title,
      description: file.description || '',
      category: file.category,
      is_backing_track: file.is_backing_track || false
    });
  };

  const handleUpdate = async () => {
    if (!editingFile) return;

    try {
      const { error } = await supabase
        .from('audio_files')
        .update({
          title: editForm.title,
          description: editForm.description,
          category: editForm.category,
          is_backing_track: editForm.is_backing_track
        })
        .eq('id', editingFile.id);

      if (error) throw error;

      toast.success('Audio file updated successfully');
      setEditingFile(null);
      refetch();
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error('Failed to update audio file');
    }
  };

  const handleTitleUpdate = async (id: string, newTitle: string) => {
    try {
      const { error } = await supabase
        .from('audio_files')
        .update({ title: newTitle })
        .eq('id', id);

      if (error) throw error;

      toast.success('Title updated successfully');
      refetch();
    } catch (error: any) {
      console.error('Title update error:', error);
      toast.error('Failed to update title');
      throw error;
    }
  };

  const handleDelete = async (file: AudioFileData) => {
    if (!confirm('Are you sure you want to delete this audio file?')) return;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('media_library')
        .remove([file.file_path || '']);

      if (storageError) console.error('Storage deletion error:', storageError);

      // Delete from database
      const { error: dbError } = await supabase
        .from('audio_files')
        .delete()
        .eq('id', file.id);

      if (dbError) throw dbError;

      toast.success('Audio file deleted successfully');
      refetch();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error('Failed to delete audio file');
    }
  };

  const renderFileCard = (file: AudioFileData) => {
    // Convert to AudioFile format for WaveSurferPlayer
    const audioFile: AudioFile = {
      id: file.id,
      title: file.title,
      description: file.description || '',
      file_url: file.file_url,
      file_path: file.file_path || '',
      category: file.category,
      is_backing_track: file.is_backing_track || false,
      uploaded_by: file.uploaded_by || '',
      created_at: file.created_at,
    };

    return (
      <Card key={file.id}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <InlineMediaTitleEdit
                title={file.title}
                onSave={(newTitle) => handleTitleUpdate(file.id, newTitle)}
                className="mb-2"
              />
              {file.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {file.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Badge variant="secondary">
                {file.category}
              </Badge>
              {file.is_backing_track && (
                <Badge variant="outline">
                  Backing Track
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(file)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(file)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <WaveSurferPlayer audio={audioFile} />
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <AdminV2Layout>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading audio files...</p>
        </div>
      </AdminV2Layout>
    );
  }

  if (error) {
    return (
      <AdminV2Layout>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Error loading audio files</p>
          <Button onClick={refetch} variant="outline">
            Try Again
          </Button>
        </div>
      </AdminV2Layout>
    );
  }

  return (
    <AdminV2Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Audio Management</h1>
            <p className="text-muted-foreground">
              Manage recordings, backing tracks, and audio files
            </p>
          </div>
        </div>

        <Tabs defaultValue="library" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="library">Audio Library</TabsTrigger>
            <TabsTrigger value="upload">Upload New</TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search audio files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.replace('_', ' ').charAt(0).toUpperCase() + category.replace('_', ' ').slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Audio Files */}
            <Tabs defaultValue="recordings" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="recordings" className="flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  Recordings ({recordings.length})
                </TabsTrigger>
                <TabsTrigger value="backing" className="flex items-center gap-2">
                  <Music className="h-4 w-4" />
                  Backing Tracks ({backingTracks.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="recordings" className="space-y-4 mt-6">
                {recordings.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Mic className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No recordings found</p>
                    </CardContent>
                  </Card>
                ) : (
                  recordings.map(renderFileCard)
                )}
              </TabsContent>

              <TabsContent value="backing" className="space-y-4 mt-6">
                {backingTracks.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No backing tracks found</p>
                    </CardContent>
                  </Card>
                ) : (
                  backingTracks.map(renderFileCard)
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Audio File
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="audio-file">Audio File</Label>
                  <Input
                    id="audio-file"
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter title (optional - will use filename if empty)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter description (optional)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={uploadForm.category} 
                    onValueChange={(value) => setUploadForm(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category.replace('_', ' ').charAt(0).toUpperCase() + category.replace('_', ' ').slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="backing-track"
                    checked={uploadForm.is_backing_track}
                    onCheckedChange={(checked) => setUploadForm(prev => ({ ...prev, is_backing_track: checked }))}
                  />
                  <Label htmlFor="backing-track">This is a backing track</Label>
                </div>

                {uploading && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Uploading...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        {editingFile && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Edit Audio File</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={editForm.title}
                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select 
                    value={editForm.category} 
                    onValueChange={(value) => setEditForm(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category.replace('_', ' ').charAt(0).toUpperCase() + category.replace('_', ' ').slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-backing-track"
                    checked={editForm.is_backing_track}
                    onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, is_backing_track: checked }))}
                  />
                  <Label htmlFor="edit-backing-track">This is a backing track</Label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleUpdate} className="flex-1">
                    Update
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingFile(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminV2Layout>
  );
}
