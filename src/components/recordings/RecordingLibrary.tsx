
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WaveSurferPlayer } from '@/components/audio/WaveSurferPlayer';
import { useAudioFiles } from '@/hooks/useAudioFiles';
import { AudioFile } from '@/types/audio';
import { Search, Music, Mic } from 'lucide-react';

export const RecordingLibrary: React.FC = () => {
  const { audioFiles, loading, error, refetch } = useAudioFiles();
  const [searchTerm, setSearchTerm] = useState('');
  const [recordings, setRecordings] = useState<AudioFile[]>([]);
  const [backingTracks, setBackingTracks] = useState<AudioFile[]>([]);

  useEffect(() => {
    if (audioFiles.length > 0) {
      // Convert AudioFileData to AudioFile format
      const convertedFiles: AudioFile[] = audioFiles.map(file => ({
        id: file.id,
        title: file.title,
        description: file.description || '',
        file_url: file.file_url,
        file_path: file.file_path || '',
        category: file.category,
        is_backing_track: file.is_backing_track || false,
        uploaded_by: file.uploaded_by || '',
        created_at: file.created_at,
      }));

      const recordingFiles = convertedFiles.filter(file => !file.is_backing_track);
      const backingTrackFiles = convertedFiles.filter(file => file.is_backing_track);
      
      setRecordings(recordingFiles);
      setBackingTracks(backingTrackFiles);
    }
  }, [audioFiles]);

  const filterFiles = (files: AudioFile[], term: string) => {
    if (!term) return files;
    return files.filter(file => 
      file.title.toLowerCase().includes(term.toLowerCase()) ||
      file.description.toLowerCase().includes(term.toLowerCase())
    );
  };

  const filteredRecordings = filterFiles(recordings, searchTerm);
  const filteredBackingTracks = filterFiles(backingTracks, searchTerm);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading library...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Error loading library</p>
          <Button onClick={refetch} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const renderFileList = (files: AudioFile[], emptyMessage: string, icon: React.ReactNode) => (
    <>
      {files.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            {icon}
            <p className="text-muted-foreground mt-4">{emptyMessage}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {files.map((file) => (
            <Card key={file.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{file.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {file.description}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {file.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <WaveSurferPlayer audio={file} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search library..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="recordings" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recordings" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            Recordings ({filteredRecordings.length})
          </TabsTrigger>
          <TabsTrigger value="backing" className="flex items-center gap-2">
            <Music className="h-4 w-4" />
            Backing Tracks ({filteredBackingTracks.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="recordings" className="mt-6">
          {renderFileList(
            filteredRecordings,
            searchTerm ? 'No recordings match your search' : 'No recordings available',
            <Mic className="h-12 w-12 mx-auto text-muted-foreground" />
          )}
        </TabsContent>
        
        <TabsContent value="backing" className="mt-6">
          {renderFileList(
            filteredBackingTracks,
            searchTerm ? 'No backing tracks match your search' : 'No backing tracks available',
            <Music className="h-12 w-12 mx-auto text-muted-foreground" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
