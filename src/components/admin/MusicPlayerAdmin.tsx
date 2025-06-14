
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music, Calendar, Settings, BarChart3, Cloud } from 'lucide-react';
import { ScheduledPlaylistManager } from '@/components/admin/ScheduledPlaylistManager';
import { SoundCloudPlaylistManager } from '@/components/admin/SoundCloudPlaylistManager';

export function MusicPlayerAdmin() {
  return (
    <div className="space-y-6">
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
          <Card>
            <CardHeader>
              <CardTitle>Local Playlist Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Local playlist management features will be available here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Player Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Music player configuration settings will be available here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Music Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Music listening analytics and statistics will be available here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
