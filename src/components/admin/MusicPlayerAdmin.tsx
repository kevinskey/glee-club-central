
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music, Settings, BarChart3, ExternalLink, RefreshCw } from 'lucide-react';
import { SoundCloudOAuth } from './soundcloud/SoundCloudOAuth';
import { SoundCloudPlayerSettings } from './soundcloud/SoundCloudPlayerSettings';
import { SoundCloudAnalytics } from './soundcloud/SoundCloudAnalytics';
import { SoundCloudPlaylistManager } from './SoundCloudPlaylistManager';

export function MusicPlayerAdmin() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">SoundCloud Music Administration</h1>
          <p className="text-muted-foreground">Manage your SoundCloud content and API integration</p>
        </div>
        <Button className="gap-2" asChild>
          <a href="https://soundcloud.com/spelman-glee" target="_blank" rel="noopener noreferrer">
            <Music className="w-4 h-4" />
            Visit SoundCloud
          </a>
        </Button>
      </div>

      <Tabs defaultValue="api-integration" className="space-y-6">
        <TabsList>
          <TabsTrigger value="api-integration">API Integration</TabsTrigger>
          <TabsTrigger value="playlist-manager">Track Manager</TabsTrigger>
          <TabsTrigger value="oauth">OAuth Connect</TabsTrigger>
          <TabsTrigger value="settings">Player Settings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="api-integration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SoundCloud API Integration Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p><strong>Current Mode:</strong> SoundCloud API Feed</p>
                  <p><strong>Profile:</strong> https://soundcloud.com/spelman-glee</p>
                  <p><strong>Integration Type:</strong> Client ID Authentication</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-green-800 dark:text-green-200 text-sm">
                    ✅ SoundCloud API integration is active. Tracks are now loaded directly from your SoundCloud profile instead of embeds.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Refresh API Data
                  </Button>
                  <Button variant="outline" asChild className="gap-2">
                    <a href="https://developers.soundcloud.com/" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                      SoundCloud Developers
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="playlist-manager" className="space-y-4">
          <SoundCloudPlaylistManager />
        </TabsContent>

        <TabsContent value="oauth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>OAuth Authentication (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-4">
                OAuth connection allows you to access private tracks and manage your SoundCloud account directly. 
                The current API integration works with public content using Client ID authentication.
              </div>
              <SoundCloudOAuth />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <SoundCloudPlayerSettings />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <SoundCloudAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
