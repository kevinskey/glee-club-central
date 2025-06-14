
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Music, Settings, BarChart3, Calendar, Plus, Trash2, Edit, Play, ListMusic } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface Playlist {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  is_homepage_default: boolean;
  display_order: number;
  created_at: string;
}

interface AudioFile {
  id: string;
  title: string;
  description: string;
  file_url: string;
  category: string;
  source?: 'audio_files' | 'media_library';
}

interface PlaylistTrack {
  id: string;
  playlist_id: string;
  audio_file_id: string;
  track_order: number;
  is_featured: boolean;
  audio_files: AudioFile;
}

interface PlayerSettings {
  [key: string]: any;
}

export function MusicPlayerAdmin() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [playerSettings, setPlayerSettings] = useState<PlayerSettings>({});
  const [activeTab, setActiveTab] = useState('playlists');
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isTracksDialogOpen, setIsTracksDialogOpen] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [playlistTracks, setPlaylistTracks] = useState<PlaylistTrack[]>([]);
  const [selectedAudioFiles, setSelectedAudioFiles] = useState<string[]>([]);
  const [newPlaylistData, setNewPlaylistData] = useState({
    name: '',
    description: ''
  });
  const [editPlaylistData, setEditPlaylistData] = useState({
    name: '',
    description: ''
  });
  const { user } = useAuth();

  // Load data
  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load playlists
      const { data: playlistData, error: playlistError } = await supabase
        .from('playlists')
        .select('*')
        .order('display_order', { ascending: true });

      if (playlistError) {
        console.error('Error loading playlists:', playlistError);
        toast.error('Failed to load playlists');
      } else {
        setPlaylists(playlistData || []);
      }

      // Load audio files from both tables
      const [audioFilesResult, mediaLibraryResult] = await Promise.all([
        supabase
          .from('audio_files')
          .select('*')
          .order('title'),
        supabase
          .from('media_library')
          .select('*')
          .or('file_type.like.audio/*,file_type.eq.audio/mpeg,file_type.eq.audio/mp3')
          .order('title')
      ]);

      const combinedAudioFiles: AudioFile[] = [];

      // Add audio_files entries
      if (audioFilesResult.data) {
        combinedAudioFiles.push(...audioFilesResult.data.map(file => ({
          id: file.id,
          title: file.title,
          description: file.description || '',
          file_url: file.file_url,
          category: file.category,
          source: 'audio_files' as const
        })));
      }

      // Add media_library audio entries
      if (mediaLibraryResult.data) {
        combinedAudioFiles.push(...mediaLibraryResult.data.map(file => ({
          id: file.id,
          title: file.title,
          description: file.description || '',
          file_url: file.file_url,
          category: file.folder || 'general',
          source: 'media_library' as const
        })));
      }

      console.log('Combined audio files:', combinedAudioFiles);
      setAudioFiles(combinedAudioFiles);

      // Load player settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('music_player_settings')
        .select('*');

      if (settingsError) {
        console.error('Error loading settings:', settingsError);
      } else {
        const settings = settingsData?.reduce((acc, setting) => {
          acc[setting.setting_key] = setting.setting_value;
          return acc;
        }, {} as PlayerSettings);
        setPlayerSettings(settings || {});
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load music data');
    } finally {
      setIsLoading(false);
    }
  };

  // Create playlist
  const createPlaylist = async () => {
    if (!user) {
      toast.error('You must be logged in to create playlists');
      return;
    }

    if (!newPlaylistData.name.trim()) {
      toast.error('Please enter a playlist name');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('playlists')
        .insert({
          name: newPlaylistData.name.trim(),
          description: newPlaylistData.description.trim(),
          display_order: playlists.length,
          created_by: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating playlist:', error);
        toast.error(`Failed to create playlist: ${error.message}`);
        return;
      }

      toast.success('Playlist created successfully');
      setNewPlaylistData({ name: '', description: '' });
      setIsCreateDialogOpen(false);
      loadData();
    } catch (error) {
      console.error('Error creating playlist:', error);
      toast.error('Failed to create playlist');
    }
  };

  // Edit playlist
  const openEditDialog = (playlist: Playlist) => {
    setEditingPlaylist(playlist);
    setEditPlaylistData({
      name: playlist.name,
      description: playlist.description || ''
    });
    setIsEditDialogOpen(true);
  };

  const updatePlaylist = async () => {
    if (!editingPlaylist || !user) {
      toast.error('Unable to update playlist');
      return;
    }

    if (!editPlaylistData.name.trim()) {
      toast.error('Please enter a playlist name');
      return;
    }

    try {
      const { error } = await supabase
        .from('playlists')
        .update({
          name: editPlaylistData.name.trim(),
          description: editPlaylistData.description.trim()
        })
        .eq('id', editingPlaylist.id);

      if (error) {
        console.error('Error updating playlist:', error);
        toast.error(`Failed to update playlist: ${error.message}`);
        return;
      }

      toast.success('Playlist updated successfully');
      setIsEditDialogOpen(false);
      setEditingPlaylist(null);
      setEditPlaylistData({ name: '', description: '' });
      loadData();
    } catch (error) {
      console.error('Error updating playlist:', error);
      toast.error('Failed to update playlist');
    }
  };

  // Update playlist status
  const updatePlaylistStatus = async (playlistId: string, updates: Partial<Playlist>) => {
    try {
      const { error } = await supabase
        .from('playlists')
        .update(updates)
        .eq('id', playlistId);

      if (error) {
        console.error('Error updating playlist:', error);
        toast.error(`Failed to update playlist: ${error.message}`);
        return;
      }

      toast.success('Playlist updated successfully');
      loadData();
    } catch (error) {
      console.error('Error updating playlist:', error);
      toast.error('Failed to update playlist');
    }
  };

  // Update player setting
  const updatePlayerSetting = async (key: string, value: any) => {
    try {
      const { error } = await supabase
        .from('music_player_settings')
        .upsert({
          setting_key: key,
          setting_value: value
        });

      if (error) {
        console.error('Error updating setting:', error);
        toast.error(`Failed to update setting: ${error.message}`);
        return;
      }

      toast.success('Setting updated successfully');
      loadData();
    } catch (error) {
      console.error('Error updating setting:', error);
      toast.error('Failed to update setting');
    }
  };

  // Load playlist tracks
  const loadPlaylistTracks = async (playlistId: string) => {
    try {
      const { data, error } = await supabase
        .from('playlist_tracks')
        .select(`
          *,
          audio_files (
            id,
            title,
            description,
            file_url,
            category
          )
        `)
        .eq('playlist_id', playlistId)
        .order('track_order');

      if (error) {
        console.error('Error loading playlist tracks:', error);
        toast.error('Failed to load playlist tracks');
      } else {
        setPlaylistTracks(data || []);
      }
    } catch (error) {
      console.error('Error loading playlist tracks:', error);
      toast.error('Failed to load playlist tracks');
    }
  };

  // Open tracks management dialog
  const openTracksDialog = async (playlist: Playlist) => {
    setEditingPlaylist(playlist);
    await loadPlaylistTracks(playlist.id);
    
    // Get current track audio file IDs
    const currentTrackIds = playlistTracks.map(track => track.audio_file_id);
    setSelectedAudioFiles(currentTrackIds);
    
    setIsTracksDialogOpen(true);
  };

  // Add tracks to playlist - Updated to handle both audio_files and media_library
  const addTracksToPlaylist = async () => {
    if (!editingPlaylist) return;

    try {
      // Remove existing tracks
      await supabase
        .from('playlist_tracks')
        .delete()
        .eq('playlist_id', editingPlaylist.id);

      // For tracks from media_library, we need to create corresponding audio_files entries first
      const tracksToAdd = [];
      
      for (let index = 0; index < selectedAudioFiles.length; index++) {
        const audioFileId = selectedAudioFiles[index];
        const audioFile = audioFiles.find(f => f.id === audioFileId);
        
        if (!audioFile) continue;

        let finalAudioFileId = audioFileId;

        // If this is from media_library, create an audio_files entry
        if (audioFile.source === 'media_library') {
          const { data: existingAudioFile } = await supabase
            .from('audio_files')
            .select('id')
            .eq('file_url', audioFile.file_url)
            .single();

          if (!existingAudioFile) {
            const { data: newAudioFile, error: audioFileError } = await supabase
              .from('audio_files')
              .insert({
                title: audioFile.title,
                description: audioFile.description,
                file_url: audioFile.file_url,
                file_path: audioFile.file_url.split('/').pop() || 'unknown',
                category: audioFile.category,
                uploaded_by: user?.id || '00000000-0000-0000-0000-000000000000'
              })
              .select('id')
              .single();

            if (audioFileError) {
              console.error('Error creating audio file entry:', audioFileError);
              continue;
            }

            finalAudioFileId = newAudioFile.id;
          } else {
            finalAudioFileId = existingAudioFile.id;
          }
        }

        tracksToAdd.push({
          playlist_id: editingPlaylist.id,
          audio_file_id: finalAudioFileId,
          track_order: index,
          is_featured: false
        });
      }

      if (tracksToAdd.length > 0) {
        const { error } = await supabase
          .from('playlist_tracks')
          .insert(tracksToAdd);

        if (error) {
          console.error('Error adding tracks:', error);
          toast.error(`Failed to add tracks: ${error.message}`);
          return;
        }
      }

      toast.success('Playlist tracks updated successfully');
      setIsTracksDialogOpen(false);
      await loadPlaylistTracks(editingPlaylist.id);
    } catch (error) {
      console.error('Error updating playlist tracks:', error);
      toast.error('Failed to update playlist tracks');
    }
  };

  // Handle audio file selection
  const handleAudioFileToggle = (audioFileId: string) => {
    setSelectedAudioFiles(prev => 
      prev.includes(audioFileId)
        ? prev.filter(id => id !== audioFileId)
        : [...prev, audioFileId]
    );
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Loading music player settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Music Player Administration</h1>
        <p className="text-muted-foreground">
          Manage playlists, player settings, and music analytics
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="playlists" className="flex items-center gap-2">
            <Music className="h-4 w-4" />
            Playlists
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule
          </TabsTrigger>
        </TabsList>

        <TabsContent value="playlists" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Playlist Management
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Playlist
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Playlist</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="playlist-name">Playlist Name</Label>
                        <Input
                          id="playlist-name"
                          value={newPlaylistData.name}
                          onChange={(e) => setNewPlaylistData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter playlist name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="playlist-description">Description (Optional)</Label>
                        <Textarea
                          id="playlist-description"
                          value={newPlaylistData.description}
                          onChange={(e) => setNewPlaylistData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Enter playlist description"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={createPlaylist}>
                          Create Playlist
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {playlists.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No playlists found. Create your first playlist to get started.</p>
                  </div>
                ) : (
                  playlists.map((playlist) => (
                    <div key={playlist.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{playlist.name}</h3>
                          {playlist.is_active && <Badge variant="default">Active</Badge>}
                          {playlist.is_homepage_default && <Badge variant="secondary">Homepage Default</Badge>}
                        </div>
                        {playlist.description && (
                          <p className="text-sm text-muted-foreground">{playlist.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={playlist.is_active}
                          onCheckedChange={(checked) => 
                            updatePlaylistStatus(playlist.id, { is_active: checked })
                          }
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => 
                            updatePlaylistStatus(playlist.id, { is_homepage_default: !playlist.is_homepage_default })
                          }
                        >
                          {playlist.is_homepage_default ? 'Remove Default' : 'Set Default'}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openTracksDialog(playlist)}
                        >
                          <ListMusic className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openEditDialog(playlist)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Player Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="default_volume">Default Volume</Label>
                  <Input
                    id="default_volume"
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={playerSettings.default_volume || 0.7}
                    onChange={(e) => updatePlayerSetting('default_volume', parseFloat(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="repeat_mode">Default Repeat Mode</Label>
                  <Select 
                    value={playerSettings.repeat_mode || 'none'}
                    onValueChange={(value) => updatePlayerSetting('repeat_mode', `"${value}"`)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="track">Repeat Track</SelectItem>
                      <SelectItem value="playlist">Repeat Playlist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="autoplay"
                    checked={playerSettings.autoplay === 'true'}
                    onCheckedChange={(checked) => updatePlayerSetting('autoplay', checked.toString())}
                  />
                  <Label htmlFor="autoplay">Enable Autoplay</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="shuffle_mode"
                    checked={playerSettings.shuffle_mode === 'true'}
                    onCheckedChange={(checked) => updatePlayerSetting('shuffle_mode', checked.toString())}
                  />
                  <Label htmlFor="shuffle_mode">Default Shuffle Mode</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="show_visualizer"
                    checked={playerSettings.show_visualizer !== 'false'}
                    onCheckedChange={(checked) => updatePlayerSetting('show_visualizer', checked.toString())}
                  />
                  <Label htmlFor="show_visualizer">Show Audio Visualizer</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="analytics_enabled"
                    checked={playerSettings.analytics_enabled !== 'false'}
                    onCheckedChange={(checked) => updatePlayerSetting('analytics_enabled', checked.toString())}
                  />
                  <Label htmlFor="analytics_enabled">Enable Analytics</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Music Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                <p>Analytics dashboard coming soon...</p>
                <p className="text-sm mt-2">Track plays, popular songs, and listening patterns</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Playlists</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4" />
                <p>Playlist scheduling coming soon...</p>
                <p className="text-sm mt-2">Automatically switch playlists based on time or events</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Playlist Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Playlist</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-playlist-name">Playlist Name</Label>
              <Input
                id="edit-playlist-name"
                value={editPlaylistData.name}
                onChange={(e) => setEditPlaylistData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter playlist name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-playlist-description">Description (Optional)</Label>
              <Textarea
                id="edit-playlist-description"
                value={editPlaylistData.description}
                onChange={(e) => setEditPlaylistData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter playlist description"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={updatePlaylist}>
                Update Playlist
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manage Tracks Dialog */}
      <Dialog open={isTracksDialogOpen} onOpenChange={setIsTracksDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Playlist Tracks - {editingPlaylist?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select audio files to add to this playlist (includes files from both Audio Files and Media Library):
            </p>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {audioFiles.map((audioFile) => (
                <div key={audioFile.id} className="flex items-center space-x-2 p-2 border rounded">
                  <Checkbox
                    id={`audio-${audioFile.id}`}
                    checked={selectedAudioFiles.includes(audioFile.id)}
                    onCheckedChange={() => handleAudioFileToggle(audioFile.id)}
                  />
                  <label htmlFor={`audio-${audioFile.id}`} className="flex-1 cursor-pointer">
                    <div className="font-medium">{audioFile.title}</div>
                    {audioFile.description && (
                      <div className="text-sm text-muted-foreground">{audioFile.description}</div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="capitalize">{audioFile.category}</span>
                      <Badge variant="outline" className="text-xs">
                        {audioFile.source === 'media_library' ? 'Media Library' : 'Audio Files'}
                      </Badge>
                    </div>
                  </label>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {selectedAudioFiles.length} tracks selected ({audioFiles.length} total available)
              </p>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setIsTracksDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addTracksToPlaylist}>
                  Update Playlist
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
