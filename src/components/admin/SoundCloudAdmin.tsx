import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Music, 
  Upload, 
  Play, 
  Pause, 
  Trash2, 
  Edit,
  Eye,
  Plus,
  Download,
  BarChart3,
  ExternalLink
} from 'lucide-react';
import { SoundCloudUrlImport } from './SoundCloudUrlImport';

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
  const [tracks, setTracks] = useState<Track[]>([
    {
      id: '1',
      title: 'Ave Maria - Soprano Solo',
      artist: 'Spelman Glee Club',
      duration: 240,
      audioUrl: '/audio/ave-maria.mp3',
      coverArt: '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
      likes: 156,
      plays: 2340,
      genre: 'Classical',
      uploadDate: '2024-01-15',
      description: 'A beautiful rendition of Ave Maria performed by our soprano section.',
      isPublic: true
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
      genre: 'Spiritual',
      uploadDate: '2024-01-10',
      description: 'Our signature arrangement of Amazing Grace.',
      isPublic: true
    }
  ]);

  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalStats = () => {
    const totalTracks = tracks.length;
    const totalPlays = tracks.reduce((sum, track) => sum + track.plays, 0);
    const totalLikes = tracks.reduce((sum, track) => sum + track.likes, 0);
    const publicTracks = tracks.filter(track => track.isPublic).length;
    
    return { totalTracks, totalPlays, totalLikes, publicTracks };
  };

  const stats = getTotalStats();

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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Music className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.totalTracks}</p>
                <p className="text-sm text-muted-foreground">Total Tracks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Play className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.totalPlays.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Plays</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{stats.totalLikes.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Likes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Eye className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{stats.publicTracks}</p>
                <p className="text-sm text-muted-foreground">Public Tracks</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tracks" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tracks">Track Management</TabsTrigger>
          <TabsTrigger value="import">Import from URL</TabsTrigger>
          <TabsTrigger value="upload">Upload New</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="tracks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Track Library</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tracks.map((track) => (
                  <div
                    key={track.id}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="w-16 h-16 rounded overflow-hidden bg-gradient-to-br from-orange-400 to-red-500">
                      <img 
                        src={track.coverArt} 
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold">{track.title}</h3>
                      <p className="text-sm text-muted-foreground">{track.artist}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <Badge variant="outline">{track.genre}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {track.plays.toLocaleString()} plays
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDuration(track.duration)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={track.isPublic ? "default" : "secondary"}>
                        {track.isPublic ? "Public" : "Private"}
                      </Badge>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleVisibility(track.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedTrack(track);
                          setIsEditing(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTrack(track.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
          <SoundCloudUrlImport />
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload New Track</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Track Title</label>
                  <Input placeholder="Enter track title" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Artist</label>
                  <Input placeholder="Enter artist name" defaultValue="Spelman Glee Club" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Genre</label>
                  <Input placeholder="Enter genre" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration</label>
                  <Input placeholder="e.g., 3:45" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea placeholder="Enter track description" rows={3} />
              </div>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop your audio file here, or click to browse
                  </p>
                  <Button variant="outline">
                    Choose Audio File
                  </Button>
                </div>
                
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload cover art (optional)
                  </p>
                  <Button variant="outline">
                    Choose Image
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline">Save as Draft</Button>
                <Button>Upload & Publish</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audio Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Analytics Coming Soon</h3>
                <p className="text-muted-foreground">
                  Detailed analytics for track performance, user engagement, and listening patterns.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
