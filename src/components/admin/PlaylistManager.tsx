
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Music, 
  Play, 
  X,
  Save,
  GripVertical 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAudioFiles, AudioFileData } from '@/hooks/useAudioFiles';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Playlist {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  is_homepage_default: boolean;
  display_order: number;
  created_at: string;
  tracks?: PlaylistTrack[];
}

interface PlaylistTrack {
  id: string;
  audio_file_id: string;
  track_order: number;
  is_featured: boolean;
  audio_file?: AudioFileData;
}

export function PlaylistManager() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddTrackDialog, setShowAddTrackDialog] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Partial<Playlist>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  const { audioFiles } = useAudioFiles();

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      setIsLoading(true);
      const { data: playlistsData, error } = await supabase
        .from('playlists')
        .select(`
          *,
          playlist_tracks (
            id,
            audio_file_id,
            track_order,
            is_featured,
            audio_files (
              id,
              title,
              description,
              file_url
            )
          )
        `)
        .order('display_order');

      if (error) throw error;

      const formattedPlaylists = playlistsData?.map(playlist => ({
        ...playlist,
        tracks: playlist.playlist_tracks?.map((track: any) => ({
          id: track.id,
          audio_file_id: track.audio_file_id,
          track_order: track.track_order,
          is_featured: track.is_featured,
          audio_file: track.audio_files
        })) || []
      })) || [];

      setPlaylists(formattedPlaylists);
    } catch (error) {
      console.error('Error loading playlists:', error);
      toast.error('Failed to load playlists');
    } finally {
      setIsLoading(false);
    }
  };

  const createPlaylist = async () => {
    if (!editingPlaylist.name?.trim()) {
      toast.error('Playlist name is required');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('playlists')
        .insert({
          name: editingPlaylist.name,
          description: editingPlaylist.description || null,
          is_active: editingPlaylist.is_active || false,
          is_homepage_default: editingPlaylist.is_homepage_default || false,
          display_order: playlists.length
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Playlist created successfully');
      setShowCreateDialog(false);
      setEditingPlaylist({});
      loadPlaylists();
    } catch (error) {
      console.error('Error creating playlist:', error);
      toast.error('Failed to create playlist');
    }
  };

  const updatePlaylist = async () => {
    if (!selectedPlaylist || !editingPlaylist.name?.trim()) {
      toast.error('Playlist name is required');
      return;
    }

    try {
      const { error } = await supabase
        .from('playlists')
        .update({
          name: editingPlaylist.name,
          description: editingPlaylist.description || null,
          is_active: editingPlaylist.is_active,
          is_homepage_default: editingPlaylist.is_homepage_default
        })
        .eq('id', selectedPlaylist.id);

      if (error) throw error;

      toast.success('Playlist updated successfully');
      setShowEditDialog(false);
      setEditingPlaylist({});
      loadPlaylists();
    } catch (error) {
      console.error('Error updating playlist:', error);
      toast.error('Failed to update playlist');
    }
  };

  const deletePlaylist = async (playlistId: string) => {
    if (!confirm('Are you sure you want to delete this playlist?')) return;

    try {
      const { error } = await supabase
        .from('playlists')
        .delete()
        .eq('id', playlistId);

      if (error) throw error;

      toast.success('Playlist deleted successfully');
      loadPlaylists();
      if (selectedPlaylist?.id === playlistId) {
        setSelectedPlaylist(null);
      }
    } catch (error) {
      console.error('Error deleting playlist:', error);
      toast.error('Failed to delete playlist');
    }
  };

  const addTrackToPlaylist = async (audioFileId: string) => {
    if (!selectedPlaylist) return;

    try {
      const nextOrder = (selectedPlaylist.tracks?.length || 0);
      
      const { error } = await supabase
        .from('playlist_tracks')
        .insert({
          playlist_id: selectedPlaylist.id,
          audio_file_id: audioFileId,
          track_order: nextOrder,
          is_featured: false
        });

      if (error) throw error;

      toast.success('Track added to playlist');
      setShowAddTrackDialog(false);
      loadPlaylists();
    } catch (error) {
      console.error('Error adding track:', error);
      toast.error('Failed to add track to playlist');
    }
  };

  const removeTrackFromPlaylist = async (trackId: string) => {
    try {
      const { error } = await supabase
        .from('playlist_tracks')
        .delete()
        .eq('id', trackId);

      if (error) throw error;

      toast.success('Track removed from playlist');
      loadPlaylists();
    } catch (error) {
      console.error('Error removing track:', error);
      toast.error('Failed to remove track');
    }
  };

  const toggleTrackFeatured = async (trackId: string, isFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('playlist_tracks')
        .update({ is_featured: isFeatured })
        .eq('id', trackId);

      if (error) throw error;

      toast.success(isFeatured ? 'Track marked as featured' : 'Track unmarked as featured');
      loadPlaylists();
    } catch (error) {
      console.error('Error updating track:', error);
      toast.error('Failed to update track');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading playlists...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Playlists List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Playlists
            </div>
            <Button onClick={() => {
              setEditingPlaylist({});
              setShowCreateDialog(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Create Playlist
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {playlists.length === 0 ? (
            <div className="text-center py-8">
              <Music className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No playlists created yet
              </p>
              <Button onClick={() => {
                setEditingPlaylist({});
                setShowCreateDialog(true);
              }}>
                Create Your First Playlist
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {playlists.map((playlist) => (
                <div key={playlist.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{playlist.name}</h3>
                        {playlist.is_active && (
                          <Badge variant="default">Active</Badge>
                        )}
                        {playlist.is_homepage_default && (
                          <Badge variant="secondary">Homepage Default</Badge>
                        )}
                      </div>
                      {playlist.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {playlist.description}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {playlist.tracks?.length || 0} tracks
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedPlaylist(playlist)}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Manage
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingPlaylist(playlist);
                          setSelectedPlaylist(playlist);
                          setShowEditDialog(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deletePlaylist(playlist.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Playlist Details */}
      {selectedPlaylist && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div>
                Managing: {selectedPlaylist.name}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => setShowAddTrackDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Track
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedPlaylist(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPlaylist.tracks?.length === 0 ? (
              <div className="text-center py-8">
                <Music className="h-8 w-8 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  This playlist is empty
                </p>
                <Button onClick={() => setShowAddTrackDialog(true)}>
                  Add First Track
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedPlaylist.tracks?.map((track, index) => (
                  <div key={track.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium">{track.audio_file?.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {track.audio_file?.description || 'No description'}
                        </p>
                      </div>
                      {track.is_featured && (
                        <Badge variant="outline">Featured</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={track.is_featured}
                        onCheckedChange={(checked) => toggleTrackFeatured(track.id, checked)}
                      />
                      <Label className="text-sm">Featured</Label>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeTrackFromPlaylist(track.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Playlist Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Playlist</DialogTitle>
            <DialogDescription>
              Create a new playlist to organize your audio tracks.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Playlist Name</Label>
              <Input
                id="name"
                value={editingPlaylist.name || ''}
                onChange={(e) => setEditingPlaylist(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter playlist name"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={editingPlaylist.description || ''}
                onChange={(e) => setEditingPlaylist(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description (optional)"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={editingPlaylist.is_active || false}
                onCheckedChange={(checked) => setEditingPlaylist(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_homepage_default"
                checked={editingPlaylist.is_homepage_default || false}
                onCheckedChange={(checked) => setEditingPlaylist(prev => ({ ...prev, is_homepage_default: checked }))}
              />
              <Label htmlFor="is_homepage_default">Homepage Default</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={createPlaylist}>
                <Save className="h-4 w-4 mr-2" />
                Create Playlist
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Playlist Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Playlist</DialogTitle>
            <DialogDescription>
              Update playlist information and settings.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Playlist Name</Label>
              <Input
                id="edit-name"
                value={editingPlaylist.name || ''}
                onChange={(e) => setEditingPlaylist(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter playlist name"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={editingPlaylist.description || ''}
                onChange={(e) => setEditingPlaylist(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description (optional)"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-is_active"
                checked={editingPlaylist.is_active || false}
                onCheckedChange={(checked) => setEditingPlaylist(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="edit-is_active">Active</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-is_homepage_default"
                checked={editingPlaylist.is_homepage_default || false}
                onCheckedChange={(checked) => setEditingPlaylist(prev => ({ ...prev, is_homepage_default: checked }))}
              />
              <Label htmlFor="edit-is_homepage_default">Homepage Default</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={updatePlaylist}>
                <Save className="h-4 w-4 mr-2" />
                Update Playlist
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Track Dialog */}
      <Dialog open={showAddTrackDialog} onOpenChange={setShowAddTrackDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Track to Playlist</DialogTitle>
            <DialogDescription>
              Select an audio file to add to "{selectedPlaylist?.name}".
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {audioFiles.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No audio files available. Upload some audio files first.
              </p>
            ) : (
              audioFiles
                .filter(file => !selectedPlaylist?.tracks?.some(track => track.audio_file_id === file.id))
                .map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">{file.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {file.description || file.category}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addTrackToPlaylist(file.id)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
