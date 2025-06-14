
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music, Settings, BarChart3, Upload, Play } from 'lucide-react';
import { SoundCloudPlaylistManager } from './SoundCloudPlaylistManager';

export function MusicPlayerAdmin() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Music Player Administration</h1>
          <p className="text-muted-foreground">Manage music settings, playlists, and audio content</p>
        </div>
        <Button className="gap-2">
          <Upload className="w-4 h-4" />
          Upload Audio
        </Button>
      </div>

      <Tabs defaultValue="playlists" className="space-y-6">
        <TabsList>
          <TabsTrigger value="playlists">Playlist Management</TabsTrigger>
          <TabsTrigger value="settings">Player Settings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="soundcloud">SoundCloud</TabsTrigger>
        </TabsList>

        <TabsContent value="playlists" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Active Playlists
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Music className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-semibold mb-2">No active playlists</h3>
                <p className="mb-4">Create your first playlist to get started with music management</p>
                <Button className="gap-2">
                  <Upload className="w-4 h-4" />
                  Create Playlist
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Music Player Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Settings className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-semibold mb-2">Player Configuration</h3>
                <p className="mb-4">Configure music player settings and preferences</p>
                <Button variant="outline">
                  Configure Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Music Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-semibold mb-2">Analytics Coming Soon</h3>
                <p className="mb-4">View detailed analytics for music plays, user engagement, and listening patterns</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="soundcloud" className="space-y-4">
          <SoundCloudPlaylistManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
