
import React, { useState } from 'react';
import { AdminV2Layout } from '@/layouts/AdminV2Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SoundCloudAuth } from '@/components/soundcloud/SoundCloudAuth';
import { SoundCloudLibrary } from '@/components/soundcloud/SoundCloudLibrary';
import { SoundCloudUrlImport } from '@/components/admin/SoundCloudUrlImport';
import { Music, ExternalLink, Settings, Upload } from 'lucide-react';
import { SoundCloudEmbedManager } from '@/components/admin/soundcloud/SoundCloudEmbedManager';
import { SoundCloudPlayerSettings } from '@/components/admin/soundcloud/SoundCloudPlayerSettings';

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

          {/* Main Content */}
          <div className="space-y-6">
            {/* Authentication Section */}
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

            {/* URL Import Section */}
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

            {/* Homepage Embeds Section */}
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

            {/* Player Settings Section */}
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
          </div>
        </div>
      </div>
    </AdminV2Layout>
  );
}
