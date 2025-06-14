
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { SoundCloudTrack } from './types';

interface SoundCloudTracksProps {
  tracks: SoundCloudTrack[];
}

export function SoundCloudTracks({ tracks }: SoundCloudTracksProps) {
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  if (tracks.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Tracks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tracks.slice(0, 5).map((track) => (
            <div key={track.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{track.title}</h4>
                  <p className="text-sm text-muted-foreground">by {track.artist}</p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    <span>{formatNumber(track.plays)} plays</span>
                    <span>{formatNumber(track.likes)} likes</span>
                    {track.genre && <Badge variant="outline" className="text-xs">{track.genre}</Badge>}
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href={track.permalink_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
              
              {/* SoundCloud oEmbed widget */}
              <div className="mt-4">
                <iframe
                  width="100%"
                  height="166"
                  scrolling="no"
                  frameBorder="no"
                  allow="autoplay"
                  src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(track.permalink_url)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
                ></iframe>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
