
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music, Settings, BarChart3, ExternalLink, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
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
      console.log('Testing SoundCloud API connection...');
      
      const { data, error } = await supabase.functions.invoke('soundcloud-api');
      
      if (error) {
        console.error('API test error:', error);
        throw error;
      }
      
      console.log('API test response:', data);
      
      if (data?.status === 'error') {
        if (data.errorType === 'api_auth_required') {
          toast.error('SoundCloud OAuth authentication required. Please use the OAuth Connect tab to authenticate.');
        } else {
          toast.error(`API test failed: ${data.message}`);
        }
      } else if (data?.status === 'success') {
        toast.success(`SoundCloud API working! Found ${data.tracks?.length || 0} tracks, ${data.playlists?.length || 0} playlists`);
      } else {
        toast.info('API connection test completed');
      }
    } catch (error) {
      console.error('Failed to test API connection:', error);
      toast.error('Failed to test SoundCloud API connection. OAuth authentication required.');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">SoundCloud Music Administration</h1>
          <p className="text-muted-foreground">Connect and manage your SoundCloud content</p>
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
            <p className="font-medium">🙁 SoundCloud Authentication Required</p>
            <p>SoundCloud no longer supports basic Client ID authentication. You'll need to use OAuth to connect your account.</p>
            <p className="text-sm">Click on the <strong>"OAuth Connect"</strong> tab below to authenticate with your SoundCloud account.</p>
          </div>
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="oauth" className="space-y-6">
        <TabsList>
          <TabsTrigger value="oauth" className="gap-2">
            <CheckCircle className="w-4 h-4" />
            OAuth Connect
          </TabsTrigger>
          <TabsTrigger value="status">Connection Status</TabsTrigger>
          <TabsTrigger value="playlist-manager">Track Manager</TabsTrigger>
          <TabsTrigger value="settings">Player Settings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="oauth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="w-5 h-5 text-orange-500" />
                Connect Your SoundCloud Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-4 space-y-2">
                <p>This will connect your SoundCloud account and allow you to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Access your tracks and playlists</li>
                  <li>Display real SoundCloud data</li>
                  <li>Manage your music content</li>
                  <li>Embed SoundCloud players</li>
                </ul>
              </div>
              <SoundCloudOAuth />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SoundCloud API Connection Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p><strong>Current Mode:</strong> OAuth Authentication Required</p>
                  <p><strong>Profile:</strong> https://soundcloud.com/doctorkj</p>
                  <p><strong>Integration Type:</strong> OAuth 2.0 (Client ID method deprecated)</p>
                  <p><strong>Status:</strong> ⚠️ Authentication needed</p>
                </div>
                
                <Alert className="border-red-200 bg-red-50 dark:bg-red-950/30">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800 dark:text-red-200">
                    <p className="font-medium">🙁 Client ID Authentication Deprecated</p>
                    <p className="text-sm mt-1">
                      SoundCloud requires OAuth authentication for API access. The basic Client ID method no longer works.
                      Please use the OAuth Connect tab to authenticate.
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
