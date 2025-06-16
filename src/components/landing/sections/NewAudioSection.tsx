
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaPlayer } from "@/components/audio/MediaPlayer";
import { PlaylistPlayer } from "@/components/audio/PlaylistPlayer";
import { MediaSelector } from "@/components/audio/MediaSelector";
import { 
  Music, 
  List,
  Settings
} from "lucide-react";

interface SelectedTrack {
  id: string;
  title: string;
  artist?: string;
  audioUrl: string;
  albumArt?: string;
}

interface Playlist {
  id: string;
  name: string;
  description?: string;
  albumArt?: string;
  tracks: SelectedTrack[];
}

export function NewAudioSection() {
  const [currentTrack, setCurrentTrack] = useState<SelectedTrack | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [activeTab, setActiveTab] = useState<'player' | 'selector'>('selector');

  const handleTrackSelect = (track: SelectedTrack) => {
    setCurrentTrack(track);
    setCurrentPlaylist(null);
    setActiveTab('player');
  };

  const handlePlaylistCreate = (tracks: SelectedTrack[], name: string, albumArt?: string) => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      albumArt: albumArt || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop`,
      tracks
    };
    
    setPlaylists([...playlists, newPlaylist]);
    setCurrentPlaylist(newPlaylist);
    setCurrentTrack(null);
    setActiveTab('player');
  };

  const handlePlaylistSelect = (playlist: Playlist) => {
    setCurrentPlaylist(playlist);
    setCurrentTrack(null);
    setActiveTab('player');
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Listen to the Sound of GleeWorld
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience our recordings from the media library
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'player' | 'selector')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="player" className="flex items-center gap-2">
                <Music className="h-4 w-4" />
                Player
              </TabsTrigger>
              <TabsTrigger value="selector" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Select Music
              </TabsTrigger>
            </TabsList>

            <TabsContent value="player" className="mt-6">
              {currentPlaylist ? (
                <PlaylistPlayer playlist={currentPlaylist} />
              ) : currentTrack ? (
                <MediaPlayer track={currentTrack} />
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Music className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Audio Selected</h3>
                    <p className="text-muted-foreground mb-4">
                      Choose a track or create a playlist to start listening
                    </p>
                    <Button onClick={() => setActiveTab('selector')}>
                      Select Music
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Saved Playlists */}
              {playlists.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <List className="h-5 w-5" />
                    Your Playlists
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {playlists.map((playlist) => (
                      <Card 
                        key={playlist.id} 
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handlePlaylistSelect(playlist)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600">
                              <img 
                                src={playlist.albumArt} 
                                alt={playlist.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-base">{playlist.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {playlist.tracks.length} track{playlist.tracks.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="selector" className="mt-6">
              <MediaSelector 
                onTrackSelect={handleTrackSelect}
                onPlaylistCreate={handlePlaylistCreate}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
