
import React, { useState } from 'react';
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

export function MusicPlayerAdmin() {
  const [playerSettings, setPlayerSettings] = useState({
    autoplay: false,
    shuffle: false,
    volume: 70,
    crossfade: true,
    showWaveform: true
  });

  const handleSettingChange = (key: string, value: boolean | number) => {
    setPlayerSettings(prev => ({
      ...prev,
      [key]: value
    }));
    toast.success(`${key} setting updated`);
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Music className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">24</p>
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
                <p className="text-2xl font-bold">3</p>
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
                <p className="text-2xl font-bold">2</p>
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
                <p className="text-2xl font-bold">1.2K</p>
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
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Playlist
              </Button>
            </div>

            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Homepage Featured</span>
                    <Switch defaultChecked />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Main playlist displayed on the homepage
                  </p>
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">5 tracks</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Rehearsal Practice</span>
                    <Switch />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Practice tracks for current repertoire
                  </p>
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">8 tracks</span>
                  </div>
                </CardContent>
              </Card>
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
                    checked={playerSettings.autoplay}
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
                    checked={playerSettings.shuffle}
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
                    checked={playerSettings.crossfade}
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
                    checked={playerSettings.showWaveform}
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
                      value={playerSettings.volume}
                      onChange={(e) => handleSettingChange('volume', parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm w-12">{playerSettings.volume}%</span>
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
                    {[
                      { title: "Ave Maria", plays: 234 },
                      { title: "Amazing Grace", plays: 189 },
                      { title: "Wade in the Water", plays: 156 },
                      { title: "Lift Every Voice", plays: 143 },
                    ].map((track, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="text-sm">{track.title}</span>
                        <span className="text-sm font-medium">{track.plays} plays</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Engagement Metrics</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Average Listen Time</span>
                        <span>2:34</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Completion Rate</span>
                        <span>78%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Skip Rate</span>
                        <span>22%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '22%' }}></div>
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
