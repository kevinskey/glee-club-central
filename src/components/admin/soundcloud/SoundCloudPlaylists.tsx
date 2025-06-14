
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { SoundCloudPlaylist } from './types';

interface SoundCloudPlaylistsProps {
  playlists: SoundCloudPlaylist[];
}

export function SoundCloudPlaylists({ playlists }: SoundCloudPlaylistsProps) {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  if (playlists.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Playlists</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{playlist.name}</h4>
                  {playlist.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {playlist.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Badge variant={playlist.is_public ? "default" : "secondary"}>
                    {playlist.is_public ? "Public" : "Private"}
                  </Badge>
                  <Button variant="outline" size="sm" asChild>
                    <a href={playlist.permalink_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span>{playlist.track_count} tracks</span>
                <span>{formatDuration(Math.floor(playlist.duration / 1000))}</span>
                <span>Created: {new Date(playlist.created_at).toLocaleDateString()}</span>
              </div>
              
              {/* SoundCloud playlist oEmbed widget */}
              <div className="mt-4">
                <iframe
                  width="100%"
                  height="300"
                  scrolling="no"
                  frameBorder="no"
                  allow="autoplay"
                  src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(playlist.permalink_url)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
                ></iframe>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
