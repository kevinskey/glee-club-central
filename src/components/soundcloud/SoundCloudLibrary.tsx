
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Music, 
  Play, 
  Pause, 
  Heart, 
  Search,
  Shuffle,
  MoreHorizontal,
  ListMusic,
  Clock,
  User
} from 'lucide-react';
import { SoundCloudPlayer } from '@/components/audio/SoundCloudPlayer';

interface SoundCloudTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  audioUrl: string;
  waveformData: number[];
  coverArt: string;
  likes: number;
  plays: number;
  isLiked: boolean;
  genre: string;
  uploadDate: string;
  description: string;
}

interface SoundCloudPlaylist {
  id: string;
  title: string;
  description: string;
  trackCount: number;
  duration: number;
  coverArt: string;
  isPublic: boolean;
  createdAt: string;
  tracks: SoundCloudTrack[];
}

interface SoundCloudLibraryProps {
  accessToken: string;
}

export function SoundCloudLibrary({ accessToken }: SoundCloudLibraryProps) {
  const [playlists, setPlaylists] = useState<SoundCloudPlaylist[]>([]);
  const [tracks, setTracks] = useState<SoundCloudTrack[]>([]);
  const [likedTracks, setLikedTracks] = useState<SoundCloudTrack[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState<SoundCloudPlaylist | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSoundCloudData();
  }, [accessToken]);

  const fetchSoundCloudData = async () => {
    setIsLoading(true);
    
    // Simulate fetching data from SoundCloud API
    setTimeout(() => {
      const mockTracks: SoundCloudTrack[] = [
        {
          id: 'sc1',
          title: 'My Latest Track',
          artist: 'You',
          duration: 210,
          audioUrl: '/placeholder-audio.mp3',
          waveformData: Array.from({ length: 200 }, () => Math.random() * 0.8 + 0.1),
          coverArt: '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
          likes: 45,
          plays: 1200,
          isLiked: true,
          genre: 'Electronic',
          uploadDate: '2024-01-20',
          description: 'My latest creation uploaded to SoundCloud'
        },
        {
          id: 'sc2',
          title: 'Acoustic Session',
          artist: 'You',
          duration: 185,
          audioUrl: '/placeholder-audio.mp3',
          waveformData: Array.from({ length: 200 }, () => Math.random() * 0.8 + 0.1),
          coverArt: '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
          likes: 32,
          plays: 850,
          isLiked: false,
          genre: 'Acoustic',
          uploadDate: '2024-01-15',
          description: 'Intimate acoustic performance'
        }
      ];

      const mockLikedTracks: SoundCloudTrack[] = [
        {
          id: 'liked1',
          title: 'Favorite Song',
          artist: 'Artist Name',
          duration: 195,
          audioUrl: '/placeholder-audio.mp3',
          waveformData: Array.from({ length: 200 }, () => Math.random() * 0.8 + 0.1),
          coverArt: '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
          likes: 1500,
          plays: 25000,
          isLiked: true,
          genre: 'Pop',
          uploadDate: '2024-01-10',
          description: 'One of my favorite tracks'
        }
      ];

      const mockPlaylists: SoundCloudPlaylist[] = [
        {
          id: 'pl1',
          title: 'My Favorites',
          description: 'Collection of my favorite tracks',
          trackCount: 15,
          duration: 3600,
          coverArt: '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
          isPublic: true,
          createdAt: '2024-01-01',
          tracks: [...mockTracks, ...mockLikedTracks]
        },
        {
          id: 'pl2',
          title: 'Work in Progress',
          description: 'Tracks I\'m currently working on',
          trackCount: 8,
          duration: 1800,
          coverArt: '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
          isPublic: false,
          createdAt: '2024-01-18',
          tracks: mockTracks
        }
      ];

      setTracks(mockTracks);
      setLikedTracks(mockLikedTracks);
      setPlaylists(mockPlaylists);
      setIsLoading(false);
    }, 1500);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalDuration = (tracks: SoundCloudTrack[]) => {
    const total = tracks.reduce((sum, track) => sum + track.duration, 0);
    const hours = Math.floor(total / 3600);
    const mins = Math.floor((total % 3600) / 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const filteredTracks = tracks.filter(track =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPlaylists = playlists.filter(playlist =>
    playlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    playlist.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Music className="w-12 h-12 mx-auto mb-4 animate-pulse text-muted-foreground" />
            <p className="text-muted-foreground">Loading your SoundCloud library...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (selectedPlaylist) {
    return (
      <div className="space-y-6 overflow-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ListMusic className="w-5 h-5" />
                  {selectedPlaylist.title}
                </CardTitle>
                <p className="text-muted-foreground">{selectedPlaylist.description}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>{selectedPlaylist.trackCount} tracks</span>
                  <span>{getTotalDuration(selectedPlaylist.tracks)}</span>
                  <Badge variant={selectedPlaylist.isPublic ? "default" : "secondary"}>
                    {selectedPlaylist.isPublic ? "Public" : "Private"}
                  </Badge>
                </div>
              </div>
              <Button variant="outline" onClick={() => setSelectedPlaylist(null)}>
                Back to Library
              </Button>
            </div>
          </CardHeader>
        </Card>

        <div className="overflow-auto max-h-[calc(100vh-200px)]">
          <SoundCloudPlayer 
            tracks={selectedPlaylist.tracks}
            currentTrackIndex={currentTrackIndex}
            onTrackChange={setCurrentTrackIndex}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-auto max-h-screen">
      <Card>
        <CardHeader>
          <CardTitle>Your SoundCloud Library</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search your music..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
      </Card>

      <div className="overflow-auto flex-1">
        <Tabs defaultValue="playlists" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="playlists">Playlists</TabsTrigger>
            <TabsTrigger value="tracks">Your Tracks</TabsTrigger>
            <TabsTrigger value="likes">Liked Tracks</TabsTrigger>
          </TabsList>

          <TabsContent value="playlists" className="space-y-4 overflow-auto max-h-[600px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlaylists.map((playlist) => (
                <Card 
                  key={playlist.id} 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setSelectedPlaylist(playlist)}
                >
                  <CardContent className="p-4">
                    <div className="aspect-square bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg mb-3 overflow-hidden">
                      <img 
                        src={playlist.coverArt} 
                        alt={playlist.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold truncate">{playlist.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">{playlist.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {playlist.trackCount} tracks
                      </span>
                      <Badge variant={playlist.isPublic ? "default" : "secondary"} className="text-xs">
                        {playlist.isPublic ? "Public" : "Private"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tracks" className="space-y-4 overflow-auto max-h-[600px]">
            <SoundCloudPlayer 
              tracks={filteredTracks}
              currentTrackIndex={currentTrackIndex}
              onTrackChange={setCurrentTrackIndex}
            />
          </TabsContent>

          <TabsContent value="likes" className="space-y-4 overflow-auto max-h-[600px]">
            <SoundCloudPlayer 
              tracks={likedTracks}
              currentTrackIndex={0}
              onTrackChange={() => {}}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
