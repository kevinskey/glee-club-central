
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Music, Calendar, Settings, BarChart3, Cloud, Plus, Upload, Volume2, Shuffle } from 'lucide-react';
import { ScheduledPlaylistManager } from '@/components/admin/ScheduledPlaylistManager';
import { SoundCloudPlaylistManager } from '@/components/admin/SoundCloudPlaylistManager';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useMusicPlayer } from '@/hooks/useMusicPlayer';

export function MusicPlayerAdmin() {
  const { activePlaylist, playerSettings, isLoading } = useMusicPlayer();
  const [stats, setStats] = useState({
    totalTracks: 0,
    soundcloudPlaylists: 0,
    scheduledPlaylists: 0,
    totalPlays: 0
  });
  const [playlists, setPlaylists] = useState([]);
  const [analytics, setAnalytics] = useState({
    mostPlayedTracks: [],
    avgListenTime: 0,
    completionRate: 0,
    skipRate: 0
  });

  const [playerSettingsState, setPlayerSettingsState] = useState({
    autoplay: false,
    shuffle: false,
    volume: 70,
    crossfade: true,
    showWaveform: true
  });

  useEffect(() => {
    loadStats();
    loadPlaylists();
    loadAnalytics();
    
    // Update local settings state from hook
    if (playerSettings) {
      setPlayerSettingsState({
        autoplay: playerSettings.autoplay,
        shuffle: playerSettings.shuffle_mode,
        volume: Math.round(playerSettings.default_volume * 100),
        crossfade: true, // Not in current settings, keeping default
        showWaveform: playerSettings.show_visualizer
      });
    }
  }, [playerSettings]);

  const loadStats = async () => {
    try {
      // Get total tracks from audio_files and media_library
      const [audioFilesResult, mediaLibraryResult, playlistsResult, analyticsResult] = await Promise.all([
        supabase.from('audio_files').select('id', { count: 'exact' }),
        supabase.from('media_library').select('id', { count: 'exact' }).or('file_type.like.audio/*,file_type.eq.audio/mpeg,file_type.eq.audio/mp3'),
        supabase.from('playlists').select('id', { count: 'exact' }),
        supabase.from('music_analytics').select('id', { count: 'exact' })
      ]);

      const totalTracks = (audioFilesResult.count || 0) + (mediaLibraryResult.count || 0);
      
      setStats({
        totalTracks,
        soundcloudPlaylists: playlistsResult.count || 0,
        scheduledPlaylists: 0, // This would need a scheduled_playlists count
        totalPlays: analyticsResult.count || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadPlaylists = async () => {
    try {
      const { data, error } = await supabase
        .from('playlists')
        .select(`
          *,
          playlist_tracks (
            id,
            audio_file_id,
            audio_files (
              title,
              description
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlaylists(data || []);
    } catch (error) {
      console.error('Error loading playlists:', error);
    }
  };

  const loadAnalytics = async () => {
    try {
      // Get most played tracks
      const { data: mostPlayed, error: mostPlayedError } = await supabase
        .from('music_analytics')
        .select(`
          audio_file_id,
          audio_files (
            title,
            description
          )
        `)
        .eq('event_type', 'play')
        .limit(4);

      if (mostPlayedError) throw mostPlayedError;

      // Process most played tracks
      const trackCounts = {};
      mostPlayed?.forEach(item => {
        if (item.audio_file_id) {
          trackCounts[item.audio_file_id] = (trackCounts[item.audio_file_id] || 0) + 1;
        }
      });

      const mostPlayedTracks = Object.entries(trackCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 4)
        .map(([audioFileId, plays]) => {
          const track = mostPlayed?.find(item => item.audio_file_id === audioFileId);
          return {
            title: track?.audio_files?.title || 'Unknown Track',
            plays: plays
          };
        });

      // Get analytics metrics
      const { data: analytics, error: analyticsError } = await supabase
        .from('music_analytics')
        .select('listen_duration, event_type');

      if (analyticsError) throw analyticsError;

      let totalListenTime = 0;
      let playEvents = 0;
      let completeEvents = 0;
      let skipEvents = 0;

      analytics?.forEach(event => {
        if (event.event_type === 'play') {
          playEvents++;
          totalListenTime += event.listen_duration || 0;
        } else if (event.event_type === 'complete') {
          completeEvents++;
        } else if (event.event_type === 'skip') {
          skipEvents++;
        }
      });

      const avgListenTime = playEvents > 0 ? Math.round(totalListenTime / playEvents) : 0;
      const completionRate = playEvents > 0 ? Math.round((completeEvents / playEvents) * 100) : 0;
      const skipRate = playEvents > 0 ? Math.round((skipEvents / playEvents) * 100) : 0;

      setAnalytics({
        mostPlayedTracks,
        avgListenTime,
        completionRate,
        skipRate
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const handleSettingChange = async (key: string, value: boolean | number) => {
    setPlayerSettingsState(prev => ({
      ...prev,
      [key]: value
    }));

    try {
      // Update setting in database
      let settingKey = key;
      let settingValue = value;

      // Map local keys to database keys
      if (key === 'shuffle') {
        settingKey = 'shuffle_mode';
      } else if (key === 'volume') {
        settingKey = 'default_volume';
        settingValue = (value as number) / 100; // Convert percentage to decimal
      } else if (key === 'showWaveform') {
        settingKey = 'show_visualizer';
      }

      const { error } = await supabase
        .from('music_player_settings')
        .upsert({
          setting_key: settingKey,
          setting_value: JSON.stringify(settingValue)
        }, {
          onConflict: 'setting_key'
        });

      if (error) throw error;
      
      toast.success(`${key} setting updated`);
    } catch (error) {
      console.error('Error updating setting:', error);
      toast.error('Failed to update setting');
    }
  };

  const createPlaylist = async () => {
    try {
      const { error } = await supabase
        .from('playlists')
        .insert({
          name: 'New Playlist',
          description: 'A new custom playlist',
          is_active: false
        });

      if (error) throw error;
      
      toast.success('Playlist created successfully');
      loadPlaylists();
    } catch (error) {
      console.error('Error creating playlist:', error);
      toast.error('Failed to create playlist');
    }
  };

  const togglePlaylistStatus = async (playlistId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('playlists')
        .update({ is_active: !currentStatus })
        .eq('id', playlistId);

      if (error) throw error;
      
      toast.success(`Playlist ${!currentStatus ? 'activated' : 'deactivated'}`);
      loadPlaylists();
    } catch (error) {
      console.error('Error updating playlist:', error);
      toast.error('Failed to update playlist');
    }
  };

  if (isLoading) {
    return <div>Loading music admin tools...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Music className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.totalTracks}</p>
                <p className="text-sm text-muted-foreground">Total Tracks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Cloud className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{stats.soundcloudPlaylists}</p>
                <p className="text-sm text-muted-foreground">SoundCloud Playlists</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.scheduledPlaylists}</p>
                <p className="text-sm text-muted-foreground">Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{stats.totalPlays}</p>
                <p className="text-sm text-muted-foreground">Total Plays</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="soundcloud" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="soundcloud" className="flex items-center gap-2">
            <Cloud className="h-4 w-4" />
            SoundCloud
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Scheduled
          </TabsTrigger>
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
        </TabsList>

        <TabsContent value="soundcloud" className="space-y-6">
          <SoundCloudPlaylistManager />
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <ScheduledPlaylistManager />
        </TabsContent>

        <TabsContent value="playlists" className="space-y-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Local Playlist Management</h3>
                <p className="text-sm text-muted-foreground">Create and manage custom playlists</p>
              </div>
              <Button onClick={createPlaylist}>
                <Plus className="w-4 h-4 mr-2" />
                Create Playlist
              </Button>
            </div>

            <div className="grid gap-4">
              {playlists.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No playlists found. Create your first playlist!</p>
                  </CardContent>
                </Card>
              ) : (
                playlists.map((playlist: any) => (
                  <Card key={playlist.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{playlist.name}</span>
                        <Switch 
                          checked={playlist.is_active}
                          onCheckedChange={() => togglePlaylistStatus(playlist.id, playlist.is_active)}
                        />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {playlist.description || 'No description available'}
                      </p>
                      <div className="flex items-center gap-2">
                        <Music className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{playlist.playlist_tracks?.length || 0} tracks</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Player Settings</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Configure the music player behavior across the site
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoplay">Autoplay</Label>
                    <p className="text-sm text-muted-foreground">Automatically start playing when page loads</p>
                  </div>
                  <Switch
                    id="autoplay"
                    checked={playerSettingsState.autoplay}
                    onCheckedChange={(checked) => handleSettingChange('autoplay', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="shuffle">Shuffle Mode</Label>
                    <p className="text-sm text-muted-foreground">Randomize track order</p>
                  </div>
                  <Switch
                    id="shuffle"
                    checked={playerSettingsState.shuffle}
                    onCheckedChange={(checked) => handleSettingChange('shuffle', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="crossfade">Crossfade</Label>
                    <p className="text-sm text-muted-foreground">Smooth transitions between tracks</p>
                  </div>
                  <Switch
                    id="crossfade"
                    checked={playerSettingsState.crossfade}
                    onCheckedChange={(checked) => handleSettingChange('crossfade', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="waveform">Show Waveform</Label>
                    <p className="text-sm text-muted-foreground">Display audio waveforms in player</p>
                  </div>
                  <Switch
                    id="waveform"
                    checked={playerSettingsState.showWaveform}
                    onCheckedChange={(checked) => handleSettingChange('showWaveform', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="volume">Default Volume</Label>
                  <div className="flex items-center gap-4">
                    <Volume2 className="w-4 h-4" />
                    <Input
                      id="volume"
                      type="range"
                      min="0"
                      max="100"
                      value={playerSettingsState.volume}
                      onChange={(e) => handleSettingChange('volume', parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm w-12">{playerSettingsState.volume}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Audio Upload Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-process uploads</Label>
                    <p className="text-sm text-muted-foreground">Automatically normalize and compress audio files</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Generate waveforms</Label>
                    <p className="text-sm text-muted-foreground">Create visual waveforms for uploaded tracks</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Music Analytics Dashboard</CardTitle>
              <p className="text-sm text-muted-foreground">
                Track listening patterns and engagement metrics
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Most Played Tracks</h4>
                  <div className="space-y-2">
                    {analytics.mostPlayedTracks.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        No playback data available yet
                      </div>
                    ) : (
                      analytics.mostPlayedTracks.map((track, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                          <span className="text-sm">{track.title}</span>
                          <span className="text-sm font-medium">{track.plays} plays</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Engagement Metrics</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Average Listen Time</span>
                        <span>{Math.floor(analytics.avgListenTime / 60)}:{(analytics.avgListenTime % 60).toString().padStart(2, '0')}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(analytics.avgListenTime / 300 * 100, 100)}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Completion Rate</span>
                        <span>{analytics.completionRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${analytics.completionRate}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Skip Rate</span>
                        <span>{analytics.skipRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: `${analytics.skipRate}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
