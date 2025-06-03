
import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Music } from 'lucide-react';
import { SoundCloudAuth } from '@/components/soundcloud/SoundCloudAuth';
import { SoundCloudLibrary } from '@/components/soundcloud/SoundCloudLibrary';

interface SoundCloudUser {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  followers_count: number;
  followings_count: number;
  track_count: number;
  playlist_count: number;
}

export default function SoundCloudPage() {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem('soundcloud_access_token')
  );
  const [connectedUser, setConnectedUser] = useState<SoundCloudUser | null>(null);

  const handleAuthSuccess = (token: string, user: SoundCloudUser) => {
    setAccessToken(token);
    setConnectedUser(user);
  };

  return (
    <div className="container py-6 space-y-8">
      <PageHeader
        title="SoundCloud Integration"
        description="Connect your SoundCloud account to access your playlists and tracks"
        icon={<Music className="h-6 w-6" />}
      />

      {!accessToken ? (
        <SoundCloudAuth onAuthSuccess={handleAuthSuccess} />
      ) : (
        <SoundCloudLibrary accessToken={accessToken} />
      )}
    </div>
  );
}
