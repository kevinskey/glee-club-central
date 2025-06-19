
import React, { useState } from 'react';
import { AdminV2Layout } from '@/layouts/AdminV2Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SoundCloudAuth } from '@/components/soundcloud/SoundCloudAuth';
import { SoundCloudLibrary } from '@/components/soundcloud/SoundCloudLibrary';
import { SoundCloudUrlImport } from '@/components/admin/SoundCloudUrlImport';
import { SoundCloudSetup } from '@/components/admin/SoundCloudSetup';
import { Music, ExternalLink, Settings, Upload, AlertTriangle } from 'lucide-react';
import { SoundCloudEmbedManager } from '@/components/admin/soundcloud/SoundCloudEmbedManager';
import { SoundCloudPlayerSettings } from '@/components/admin/soundcloud/SoundCloudPlayerSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SoundCloudAdminPage() {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  return (
    <AdminV2Layout>
      <div className="glee-container glee-section">
        <div className="glee-spacing-md">
          {/* Header */}
          <div className="glee-border-bottom pb-6">
            <h1 className="glee-text-display flex items-center gap-3">
              <Music className="h-8 w-8 text-orange-500" />
              SoundCloud Integration
            </h1>
            <p className="glee-text-body mt-2">
              Manage SoundCloud authentication, imports, and embeds for the website
            </p>
          </div>

          {/* Tabs for different sections */}
          <Tabs defaultValue="auth" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="auth" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Auth
              </TabsTrigger>
              <TabsTrigger value="setup" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Setup
              </TabsTrigger>
              <TabsTrigger value="import" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Import
              </TabsTrigger>
              <TabsTrigger value="embeds" className="flex items-center gap-2">
                <Music className="h-4 w-4" />
                Embeds
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Player
              </TabsTrigger>
            </TabsList>

            {/* Authentication Tab */}
            <TabsContent value="auth" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5" />
                    SoundCloud Authentication
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {accessToken ? (
                    <SoundCloudLibrary accessToken={accessToken} />
                  ) : (
                    <SoundCloudAuth onAuthSuccess={(token) => setAccessToken(token)} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Setup Tab */}
            <TabsContent value="setup" className="space-y-6">
              <SoundCloudSetup />
            </TabsContent>

            {/* Import Tab */}
            <TabsContent value="import" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Import from SoundCloud URL
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SoundCloudUrlImport />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Embeds Tab */}
            <TabsContent value="embeds" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Music className="h-5 w-5" />
                    Homepage Embeds
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SoundCloudEmbedManager />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Player Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Player Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SoundCloudPlayerSettings />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminV2Layout>
  );
}
