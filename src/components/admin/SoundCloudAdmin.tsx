
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { SoundCloudUrlImport } from './SoundCloudUrlImport';
import { SoundCloudStats } from './soundcloud/SoundCloudStats';
import { TrackList } from './soundcloud/TrackList';
import { UploadTrackForm } from './soundcloud/UploadTrackForm';
import { SoundCloudAnalytics } from './soundcloud/SoundCloudAnalytics';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  audioUrl: string;
  coverArt?: string;
  likes: number;
  plays: number;
  genre?: string;
  uploadDate: string;
  description?: string;
  isPublic: boolean;
}

export function SoundCloudAdmin() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleDeleteTrack = (trackId: string) => {
    setTracks(tracks.filter(track => track.id !== trackId));
  };

  const handleToggleVisibility = (trackId: string) => {
    setTracks(tracks.map(track => 
      track.id === trackId 
        ? { ...track, isPublic: !track.isPublic }
        : track
    ));
  };

  const handleEditTrack = (track: Track) => {
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

      <SoundCloudStats tracks={tracks} />

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
