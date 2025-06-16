
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';
import { 
  Search, 
  Music, 
  Play,
  Plus,
  Image as ImageIcon
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
  className?: string;
}

export function MediaSelector({ onTrackSelect, onPlaylistCreate, className = "" }: MediaSelectorProps) {
  const { mediaFiles, loading } = useMediaLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTracks, setSelectedTracks] = useState<SelectedTrack[]>([]);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistArt, setPlaylistArt] = useState('');

  // Filter for audio files
  const audioFiles = mediaFiles.filter(file => 
    file.file_type?.startsWith('audio/') || 
    file.file_path?.match(/\.(mp3|wav|m4a|aac|ogg)$/i)
  );

  // Filter by search term
  const filteredFiles = audioFiles.filter(file =>
    file.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (file.description && file.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleTrackToggle = (file: any) => {
    const track: SelectedTrack = {
      id: file.id,
      title: file.title,
      artist: file.description || 'Spelman College Glee Club',
      audioUrl: file.file_url,
      albumArt: file.thumbnail_url
    };

    const isSelected = selectedTracks.some(t => t.id === file.id);
    
    if (isSelected) {
      setSelectedTracks(selectedTracks.filter(t => t.id !== file.id));
    } else {
      setSelectedTracks([...selectedTracks, track]);
    }
  };

  const handlePlaySingle = (file: any) => {
    const track: SelectedTrack = {
      id: file.id,
      title: file.title,
      artist: file.description || 'Spelman College Glee Club',
      audioUrl: file.file_url,
      albumArt: file.thumbnail_url
    };
    onTrackSelect(track);
  };

  const handleCreatePlaylist = () => {
    if (selectedTracks.length > 0 && playlistName.trim()) {
      onPlaylistCreate(selectedTracks, playlistName.trim(), playlistArt || undefined);
      setSelectedTracks([]);
      setPlaylistName('');
      setPlaylistArt('');
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading media files...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Select Audio Files
        </CardTitle>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search audio files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Playlist Creation */}
        {selectedTracks.length > 0 && (
          <div className="space-y-3 p-4 border rounded-lg bg-orange-50 dark:bg-orange-950/20">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{selectedTracks.length} tracks selected</Badge>
            </div>
            
            <div className="space-y-2">
              <Input
                placeholder="Playlist name"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
              />
              <Input
                placeholder="Album art URL (optional)"
                value={playlistArt}
                onChange={(e) => setPlaylistArt(e.target.value)}
              />
              <Button 
                onClick={handleCreatePlaylist}
                disabled={!playlistName.trim()}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Playlist
              </Button>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {filteredFiles.length === 0 ? (
          <div className="text-center py-8">
            <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              {searchTerm ? 'No audio files found' : 'No audio files in media library'}
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredFiles.map((file) => {
              const isSelected = selectedTracks.some(t => t.id === file.id);
              
              return (
                <div
                  key={file.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    isSelected 
                      ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Thumbnail */}
                      <div className="w-10 h-10 rounded bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0">
                        {file.thumbnail_url ? (
                          <img 
                            src={file.thumbnail_url} 
                            alt={file.title}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <Music className="h-5 w-5 text-white" />
                        )}
                      </div>
                      
                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.title}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {file.description || 'Audio file'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {file.file_type || 'Audio'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePlaySingle(file)}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleTrackToggle(file)}
                      >
                        {isSelected ? 'Selected' : 'Select'}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
