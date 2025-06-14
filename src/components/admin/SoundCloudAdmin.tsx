
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { SoundCloudUrlImport } from './SoundCloudUrlImport';
import { SoundCloudStats } from './soundcloud/SoundCloudStats';
import { TrackList } from './soundcloud/TrackList';
import { UploadTrackForm } from './soundcloud/UploadTrackForm';
import { SoundCloudAnalytics } from './soundcloud/SoundCloudAnalytics';
import { SoundCloudTrack } from './soundcloud/types';

export function SoundCloudAdmin() {
  const [tracks, setTracks] = useState<SoundCloudTrack[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<SoundCloudTrack | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleDeleteTrack = (trackId: string) => {
    setTracks(tracks.filter(track => track.id !== trackId));
  };

  const handleToggleVisibility = (trackId: string) => {
    console.log('Toggle visibility for track:', trackId);
  };

  const handleEditTrack = (track: SoundCloudTrack) => {
    setSelectedTrack(track);
    setIsEditing(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">SoundCloud Admin</h1>
          <p className="text-muted-foreground">Manage audio tracks and streaming content</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Upload Track
        </Button>
      </div>

      <SoundCloudStats tracks={tracks} playlists={[]} />

      <Tabs defaultValue="tracks" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tracks">Track Management</TabsTrigger>
          <TabsTrigger value="import">Import from URL</TabsTrigger>
          <TabsTrigger value="upload">Upload New</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="tracks" className="space-y-4">
          <TrackList
            tracks={tracks}
            onDeleteTrack={handleDeleteTrack}
            onToggleVisibility={handleToggleVisibility}
            onEditTrack={handleEditTrack}
          />
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
          <SoundCloudUrlImport />
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <UploadTrackForm />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <SoundCloudAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
