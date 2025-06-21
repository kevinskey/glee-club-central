
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Download, Music, User, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ArnoldMp3 {
  id: string;
  title: string;
  file_url: string;
  duration?: string;
  description?: string;
  uploaded_at: string;
  file_size?: number;
}

export function ArnoldMp3Manager() {
  const { isAdmin } = useAuth();
  const [mp3Files, setMp3Files] = useState<ArnoldMp3[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isAdmin()) {
      fetchArnoldMp3s();
    }
  }, [isAdmin]);

  const fetchArnoldMp3s = async () => {
    try {
      const { data, error } = await supabase
        .from('audio_files')
        .select('*')
        .ilike('title', '%arnold%')
        .or('description.ilike.%arnold%,category.ilike.%arnold%')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const arnoldMp3s: ArnoldMp3[] = data?.map(file => ({
        id: file.id,
        title: file.title,
        file_url: file.file_url,
        duration: '3:45', // Default duration, could be dynamic
        description: file.description,
        uploaded_at: file.created_at,
        file_size: file.file_size
      })) || [];

      setMp3Files(arnoldMp3s);
    } catch (error) {
      console.error('Error fetching Arnold MP3s:', error);
      toast.error('Failed to load Arnold MP3s');
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (mp3: ArnoldMp3) => {
    if (currentlyPlaying === mp3.id) {
      // Pause current track
      if (audioRef) {
        audioRef.pause();
        setCurrentlyPlaying(null);
      }
      return;
    }

    // Stop current track if playing
    if (audioRef) {
      audioRef.pause();
    }

    // Play new track
    const audio = new Audio(mp3.file_url);
    audio.play();
    setAudioRef(audio);
    setCurrentlyPlaying(mp3.id);

    audio.onended = () => {
      setCurrentlyPlaying(null);
      setAudioRef(null);
    };

    audio.onerror = () => {
      toast.error('Failed to play audio file');
      setCurrentlyPlaying(null);
      setAudioRef(null);
    };
  };

  const handleDownload = async (mp3: ArnoldMp3) => {
    try {
      const response = await fetch(mp3.file_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${mp3.title}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Download started');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!isAdmin()) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Admin Access Required</h3>
          <p className="text-muted-foreground">
            You need admin privileges to access Arnold's MP3 collection.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading Arnold's MP3 collection...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5 text-orange-500" />
            Arnold's MP3 Collection
            <Badge variant="secondary" className="ml-2">
              Admin Access
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Exclusive access to Arnold's audio recordings and music files.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {mp3Files.length} files available
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchArnoldMp3s}
              disabled={loading}
            >
              Refresh Collection
            </Button>
          </div>
        </CardContent>
      </Card>

      {mp3Files.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Arnold MP3s Found</h3>
            <p className="text-muted-foreground">
              No audio files related to Arnold were found in the system.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {mp3Files.map((mp3) => (
            <Card key={mp3.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{mp3.title}</h3>
                    {mp3.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {mp3.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {mp3.duration}
                      </span>
                      <span>Size: {formatFileSize(mp3.file_size)}</span>
                      <span>Added: {formatDate(mp3.uploaded_at)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePlay(mp3)}
                      className="flex items-center gap-2"
                    >
                      {currentlyPlaying === mp3.id ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                      {currentlyPlaying === mp3.id ? 'Pause' : 'Play'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(mp3)}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
