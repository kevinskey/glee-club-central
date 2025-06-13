
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Music, Settings, BarChart3, Calendar, Plus, Trash2, Edit, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

  // Load data
  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load playlists
      const { data: playlistData } = await supabase
        .from('playlists')
        .select('*')
        .order('display_order', { ascending: true });

      // Load audio files
      const { data: audioData } = await supabase
        .from('audio_files')
        .select('*')
        .order('title');

      // Load player settings
      const { data: settingsData } = await supabase
        .from('music_player_settings')
        .select('*');

      setPlaylists(playlistData || []);
      setAudioFiles(audioData || []);
      
      const settings = settingsData?.reduce((acc, setting) => {
        acc[setting.setting_key] = setting.setting_value;
        return acc;
      }, {} as PlayerSettings);
      setPlayerSettings(settings || {});
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load music data');
    } finally {
      setIsLoading(false);
    }
  };

  // Create playlist
  const createPlaylist = async (name: string, description: string) => {
    try {
      const { error } = await supabase
        .from('playlists')
        .insert({
          name,
          description,
          display_order: playlists.length
        });

      if (error) throw error;
      toast.success('Playlist created successfully');
      loadData();
    } catch (error) {
      console.error('Error creating playlist:', error);
      toast.error('Failed to create playlist');
    }
  };

  // Update playlist status
  const updatePlaylistStatus = async (playlistId: string, updates: Partial<Playlist>) => {
    try {
      const { error } = await supabase
        .from('playlists')
        .update(updates)
        .eq('id', playlistId);

      if (error) throw error;
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

      if (error) throw error;
      toast.success('Setting updated successfully');
      loadData();
    } catch (error) {
      console.error('Error updating setting:', error);
      toast.error('Failed to update setting');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
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
                <Button onClick={() => {
                  const name = prompt('Playlist name:');
                  const description = prompt('Description (optional):');
                  if (name) createPlaylist(name, description || '');
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Playlist
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {playlists.map((playlist) => (
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
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
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
    </div>
  );
}
