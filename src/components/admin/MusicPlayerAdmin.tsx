
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music, Settings, BarChart3, ExternalLink, RefreshCw, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SoundCloudOAuth } from './soundcloud/SoundCloudOAuth';
import { SoundCloudPlayerSettings } from './soundcloud/SoundCloudPlayerSettings';
import { SoundCloudAnalytics } from './soundcloud/SoundCloudAnalytics';
import { SoundCloudPlaylistManager } from './SoundCloudPlaylistManager';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function MusicPlayerAdmin() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshApiData = async () => {
    setIsRefreshing(true);
    try {
      console.log('Refreshing SoundCloud API data...');
      
      const { data, error } = await supabase.functions.invoke('soundcloud-api');
      
      if (error) {
        console.error('API refresh error:', error);
        throw error;
      }
      
      console.log('API refresh response:', data);
      
      if (data?.status === 'success') {
        toast.success(`Successfully refreshed SoundCloud data: ${data.tracks?.length || 0} tracks, ${data.playlists?.length || 0} playlists`);
      } else if (data?.status === 'error') {
        toast.error(`API refresh failed: ${data.message}`);
      } else {
        toast.success('API data refresh completed');
      }
    } catch (error) {
      console.error('Failed to refresh API data:', error);
      toast.error('Failed to refresh SoundCloud data. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">SoundCloud Music Administration</h1>
          <p className="text-muted-foreground">Manage your SoundCloud content and API integration</p>
        </div>
        <Button className="gap-2" asChild>
          <a href="https://soundcloud.com/doctorkj" target="_blank" rel="noopener noreferrer">
            <Music className="w-4 h-4" />
            Visit SoundCloud
          </a>
        </Button>
      </div>

      <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/30">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800 dark:text-orange-200">
          <div className="space-y-2">
            <p className="font-medium">SoundCloud API Authentication Required</p>
            <p>SoundCloud now requires OAuth authentication for API access. The basic Client ID method is no longer supported.</p>
            <p>Please use the "OAuth Connect" tab below to authenticate with your SoundCloud account for full API access.</p>
          </div>
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="oauth" className="space-y-6">
        <TabsList>
          <TabsTrigger value="oauth">OAuth Connect</TabsTrigger>
          <TabsTrigger value="api-integration">API Integration</TabsTrigger>
          <TabsTrigger value="playlist-manager">Track Manager</TabsTrigger>
          <TabsTrigger value="settings">Player Settings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="oauth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SoundCloud OAuth Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-4">
                Connect your SoundCloud account to access your tracks, playlists, and manage your music content.
                This is now required due to SoundCloud's updated API authentication requirements.
              </div>
              <SoundCloudOAuth />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api-integration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SoundCloud API Integration Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p><strong>Current Mode:</strong> OAuth Authentication Required</p>
                  <p><strong>Profile:</strong> https://soundcloud.com/doctorkj</p>
                  <p><strong>Integration Type:</strong> OAuth 2.0 (Client ID method deprecated)</p>
                </div>
                <Alert className="border-red-200 bg-red-50 dark:bg-red-950/30">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800 dark:text-red-200">
                    <p className="font-medium">⚠️ Client ID Authentication No Longer Supported</p>
                    <p className="text-sm mt-1">
                      SoundCloud has deprecated basic Client ID authentication. You must use OAuth to access the API.
                      Please switch to the "OAuth Connect" tab to authenticate properly.
                    </p>
                  </AlertDescription>
                </Alert>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    onClick={handleRefreshApiData}
                    disabled={isRefreshing}
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    {isRefreshing ? 'Testing API...' : 'Test API Connection'}
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
