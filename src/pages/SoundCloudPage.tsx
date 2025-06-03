
import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { SoundCloudPlayer } from '@/components/audio/SoundCloudPlayer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Music, 
  Search, 
  TrendingUp, 
  Clock, 
  Users,
  Heart,
  Play,
  Upload
} from 'lucide-react';

// Mock data for demonstration
const mockTracks = [
  {
    id: '1',
    title: 'Ave Maria - Soprano Solo',
    artist: 'Spelman Glee Club',
    duration: 240,
    audioUrl: '/audio/ave-maria.mp3',
    coverArt: '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
    likes: 156,
    plays: 2340,
    isLiked: false,
    genre: 'Classical',
    uploadDate: '2024-01-15',
    description: 'A beautiful rendition of Ave Maria performed by our soprano section during the Winter Concert 2024.',
    waveformData: Array.from({ length: 200 }, () => Math.random() * 0.8 + 0.1)
  },
  {
    id: '2',
    title: 'Amazing Grace - Full Choir',
    artist: 'Spelman Glee Club',
    duration: 180,
    audioUrl: '/audio/amazing-grace.mp3',
    coverArt: '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
    likes: 203,
    plays: 3120,
    isLiked: true,
    genre: 'Spiritual',
    uploadDate: '2024-01-10',
    description: 'Our signature arrangement of Amazing Grace, featuring rich harmonies and powerful vocals.',
    waveformData: Array.from({ length: 200 }, () => Math.random() * 0.8 + 0.1)
  },
  {
    id: '3',
    title: 'Lift Every Voice - HBCU Tribute',
    artist: 'Spelman Glee Club',
    duration: 300,
    audioUrl: '/audio/lift-every-voice.mp3',
    coverArt: '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
    likes: 89,
    plays: 1890,
    isLiked: false,
    genre: 'Tribute',
    uploadDate: '2024-01-05',
    description: 'A special tribute performance celebrating HBCU heritage and the power of unity.',
    waveformData: Array.from({ length: 200 }, () => Math.random() * 0.8 + 0.1)
  }
];

export default function SoundCloudPage() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');

  const genres = ['all', 'Classical', 'Spiritual', 'Tribute', 'Contemporary'];
  
  const filteredTracks = mockTracks.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         track.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || track.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const getTotalStats = () => {
    const totalPlays = mockTracks.reduce((sum, track) => sum + track.plays, 0);
    const totalLikes = mockTracks.reduce((sum, track) => sum + track.likes, 0);
    return { totalPlays, totalLikes };
  };

  const { totalPlays, totalLikes } = getTotalStats();

  return (
    <div className="container py-6 space-y-8">
      <PageHeader
        title="GleeWorld Audio"
        description="Stream and discover the beautiful voices of Spelman College Glee Club"
        icon={<Music className="h-6 w-6" />}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Music className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{mockTracks.length}</p>
                <p className="text-sm text-muted-foreground">Total Tracks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Play className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{totalPlays.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Plays</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{totalLikes.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Likes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">45</p>
                <p className="text-sm text-muted-foreground">Active Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="player" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="player">Now Playing</TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
        </TabsList>

        <TabsContent value="player" className="space-y-6">
          <SoundCloudPlayer 
            tracks={mockTracks}
            currentTrackIndex={currentTrackIndex}
            onTrackChange={setCurrentTrackIndex}
          />
        </TabsContent>

        <TabsContent value="discover" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Discover Music</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tracks, artists..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex gap-2 overflow-x-auto">
                  {genres.map((genre) => (
                    <Button
                      key={genre}
                      variant={selectedGenre === genre ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedGenre(genre)}
                      className="whitespace-nowrap"
                    >
                      {genre === 'all' ? 'All Genres' : genre}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filtered Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTracks.map((track, index) => (
              <Card key={track.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-orange-400 to-red-500">
                      <img 
                        src={track.coverArt} 
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div>
                      <h3 className="font-semibold truncate">{track.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="secondary">{track.genre}</Badge>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Play className="w-3 h-3" />
                          {track.plays.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full"
                      onClick={() => {
                        const originalIndex = mockTracks.findIndex(t => t.id === track.id);
                        setCurrentTrackIndex(originalIndex);
                      }}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Play Track
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Trending This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTracks
                  .sort((a, b) => b.plays - a.plays)
                  .map((track, index) => (
                    <div key={track.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                      <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      
                      <div className="w-12 h-12 rounded overflow-hidden">
                        <img 
                          src={track.coverArt} 
                          alt={track.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium">{track.title}</h4>
                        <p className="text-sm text-muted-foreground">{track.artist}</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm font-medium">{track.plays.toLocaleString()} plays</p>
                        <p className="text-xs text-muted-foreground">
                          {track.likes.toLocaleString()} likes
                        </p>
                      </div>
                      
                      <Button
                        size="sm"
                        onClick={() => {
                          setCurrentTrackIndex(index);
                        }}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
