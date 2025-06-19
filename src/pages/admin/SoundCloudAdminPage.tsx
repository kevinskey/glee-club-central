import React, { useState } from 'react';
import { AdminV2Layout } from '@/layouts/AdminV2Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SoundCloudAuth } from '@/components/soundcloud/SoundCloudAuth';
import { SoundCloudLibrary } from '@/components/soundcloud/SoundCloudLibrary';
import { SoundCloudUrlImport } from '@/components/admin/SoundCloudUrlImport';
import { Music } from 'lucide-react';

export default function SoundCloudAdminPage() {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  return (
    <AdminV2Layout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" /> SoundCloud Integration
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

        {accessToken && (
          <Card>
            <CardHeader>
              <CardTitle>Import from URL</CardTitle>
            </CardHeader>
            <CardContent>
              <SoundCloudUrlImport />
            </CardContent>
          </Card>
        )}
      </div>
    </AdminV2Layout>
  );
}
