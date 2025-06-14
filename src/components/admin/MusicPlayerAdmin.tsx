
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music, Settings, BarChart3, RefreshCw } from 'lucide-react';
import { SoundCloudPlaylistManager } from './SoundCloudPlaylistManager';
import { SoundCloudPlayerSettings } from './soundcloud/SoundCloudPlayerSettings';

export function MusicPlayerAdmin() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">SoundCloud Music Administration</h1>
          <p className="text-muted-foreground">Manage SoundCloud playlists and streaming content</p>
        </div>
        <Button className="gap-2" asChild>
          <a href="https://soundcloud.com/doctorkj" target="_blank" rel="noopener noreferrer">
            <Music className="w-4 h-4" />
            Visit SoundCloud
          </a>
        </Button>
      </div>

      <Tabs defaultValue="soundcloud" className="space-y-6">
        <TabsList>
          <TabsTrigger value="soundcloud">SoundCloud Management</TabsTrigger>
          <TabsTrigger value="settings">Player Settings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="soundcloud" className="space-y-4">
          <SoundCloudPlaylistManager />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <SoundCloudPlayerSettings />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                SoundCloud Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-semibold mb-2">Analytics Coming Soon</h3>
                <p className="mb-4">View detailed analytics for SoundCloud plays, user engagement, and listening patterns</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
