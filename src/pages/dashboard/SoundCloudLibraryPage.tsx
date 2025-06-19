import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Music } from 'lucide-react';
import { SoundCloudAuth } from '@/components/soundcloud/SoundCloudAuth';
import { SoundCloudLibrary } from '@/components/soundcloud/SoundCloudLibrary';

const SoundCloudLibraryPage = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="SoundCloud Library"
        description="Browse your SoundCloud playlists and tracks"
        icon={<Music className="h-6 w-6" />}
      />

      {accessToken ? (
        <SoundCloudLibrary accessToken={accessToken} />
      ) : (
        <SoundCloudAuth
          onAuthSuccess={(token, u) => {
            setAccessToken(token);
            setUser(u);
          }}
        />
      )}
    </div>
  );
};

export default SoundCloudLibraryPage;
