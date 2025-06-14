
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle, Music, RefreshCw, Unlink } from 'lucide-react';
import { SoundCloudUser } from './types';

interface SoundCloudUserProfileProps {
  user: SoundCloudUser;
  isLoadingData: boolean;
  onRefresh: () => void;
  onDisconnect: () => void;
}

export function SoundCloudUserProfile({ user, isLoadingData, onRefresh, onDisconnect }: SoundCloudUserProfileProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          Connected to SoundCloud
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user.avatar_url} alt={user.display_name} />
            <AvatarFallback>
              <Music className="w-8 h-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{user.display_name}</h3>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{user.track_count}</div>
            <div className="text-sm text-muted-foreground">Tracks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{user.playlist_count}</div>
            <div className="text-sm text-muted-foreground">Playlists</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{user.followers_count}</div>
            <div className="text-sm text-muted-foreground">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{user.followings_count}</div>
            <div className="text-sm text-muted-foreground">Following</div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={onRefresh} disabled={isLoadingData} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingData ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
          <Button onClick={onDisconnect} variant="outline">
            <Unlink className="w-4 h-4 mr-2" />
            Disconnect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
