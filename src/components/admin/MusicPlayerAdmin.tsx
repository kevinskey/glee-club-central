
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music, Settings, BarChart3 } from 'lucide-react';
import { SoundCloudEmbed } from './soundcloud/SoundCloudEmbed';
import { SoundCloudOAuth } from './soundcloud/SoundCloudOAuth';
import { SoundCloudPlayerSettings } from './soundcloud/SoundCloudPlayerSettings';
import { SoundCloudAnalytics } from './soundcloud/SoundCloudAnalytics';

export function MusicPlayerAdmin() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">SoundCloud Music Administration</h1>
          <p className="text-muted-foreground">Manage your SoundCloud content with embeds and OAuth authentication</p>
        </div>
        <Button className="gap-2" asChild>
          <a href="https://soundcloud.com/doctorkj" target="_blank" rel="noopener noreferrer">
            <Music className="w-4 h-4" />
            Visit SoundCloud
          </a>
        </Button>
      </div>

      <Tabs defaultValue="embed" className="space-y-6">
        <TabsList>
          <TabsTrigger value="embed">SoundCloud Embeds</TabsTrigger>
          <TabsTrigger value="oauth">OAuth Connect</TabsTrigger>
          <TabsTrigger value="settings">Player Settings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="embed" className="space-y-4">
          <SoundCloudEmbed />
        </TabsContent>

        <TabsContent value="oauth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>OAuth Authentication (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-4">
                OAuth connection allows you to access private tracks and manage your SoundCloud account directly. 
                For now, you can use embeds which work with any public SoundCloud content.
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
