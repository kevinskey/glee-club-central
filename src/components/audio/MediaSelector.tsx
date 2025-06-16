
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';
import { 
  Search, 
  Plus, 
  Music, 
  Image as ImageIcon,
  List,
  X
} from 'lucide-react';

interface SelectedTrack {
  id: string;
  title: string;
  artist?: string;
  audioUrl: string;
  albumArt?: string;
}

interface MediaSelectorProps {
  onTrackSelect: (track: SelectedTrack) => void;
  onPlaylistCreate: (tracks: SelectedTrack[], name: string, albumArt?: string) => void;
}

export function MediaSelector({ onTrackSelect, onPlaylistCreate }: MediaSelectorProps) {
  const { isLoading, searchQuery, setSearchQuery, filteredMediaFiles } = useMediaLibrary();
  const [selectedTracks, setSelectedTracks] = useState<SelectedTrack[]>([]);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistAlbumArt, setPlaylistAlbumArt] = useState('');

  const audioFiles = filteredMediaFiles.filter(file => 
    file.file_type === 'audio' && 
    (file.file_path?.endsWith('.mp3') || file.file_path?.endsWith('.wav'))
  );

  const imageFiles = filteredMediaFiles.filter(file => 
    file.file_type === 'image'
  );

  const handleTrackToggle = (file: any, isSelected: boolean) => {
    const track: SelectedTrack = {
      id: file.id,
      title: file.title,
      artist: file.description || 'Spelman College Glee Club',
      audioUrl: file.file_url,
      albumArt: playlistAlbumArt || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop`
    };

    if (isSelected) {
      setSelectedTracks(prev => [...prev, track]);
    } else {
      setSelectedTracks(prev => prev.filter(t => t.id !== file.id));
    }
  };

  const handleSingleTrackSelect = (file: any) => {
    const track: SelectedTrack = {
      id: file.id,
      title: file.title,
      artist: file.description || 'Spelman College Glee Club',
      audioUrl: file.file_url,
      albumArt: `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop`
    };
    onTrackSelect(track);
  };

  const handleCreatePlaylist = () => {
    if (selectedTracks.length > 0 && playlistName.trim()) {
      onPlaylistCreate(selectedTracks, playlistName, playlistAlbumArt);
      setSelectedTracks([]);
      setPlaylistName('');
      setPlaylistAlbumArt('');
    }
  };

  const handleImageSelect = (imageFile: any) => {
    setPlaylistAlbumArt(imageFile.file_url);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Loading media files...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search audio files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Playlist Creation */}
      {selectedTracks.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <List className="h-5 w-5" />
              Create Playlist ({selectedTracks.length} tracks)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Playlist name..."
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
            />
            
            {/* Album Art Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Playlist Cover Image</label>
              <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                {imageFiles.slice(0, 8).map((image) => (
                  <div
                    key={image.id}
                    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 ${
                      playlistAlbumArt === image.file_url 
                        ? 'border-orange-500' 
                        : 'border-transparent hover:border-gray-300'
                    }`}
                    onClick={() => handleImageSelect(image)}
                  >
                    <img
                      src={image.file_url}
                      alt={image.title}
                      className="w-full h-16 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleCreatePlaylist}
                disabled={!playlistName.trim()}
                className="flex-1"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Playlist
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedTracks([]);
                  setPlaylistName('');
                  setPlaylistAlbumArt('');
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audio Files Grid */}
      <div className="grid gap-4">
        {audioFiles.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No audio files found</p>
            </CardContent>
          </Card>
        ) : (
          audioFiles.map((file) => {
            const isSelected = selectedTracks.some(t => t.id === file.id);
            
            return (
              <Card 
                key={file.id} 
                className={`transition-all duration-200 ${
                  isSelected ? 'ring-2 ring-orange-500 bg-orange-50' : 'hover:shadow-md'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => handleTrackToggle(file, checked as boolean)}
                        />
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                          <Music className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{file.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {file.description || 'Spelman College Glee Club'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {file.file_path?.split('.').pop()?.toUpperCase()}
                          </Badge>
                          {file.tags?.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => handleSingleTrackSelect(file)}
                      size="sm"
                      className="ml-4"
                    >
                      Play Single
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
