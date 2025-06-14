
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WaveSurferPlayer } from '@/components/audio/WaveSurferPlayer';
import { useAudioFiles } from '@/hooks/useAudioFiles';
import { AudioFile } from '@/types/audio';
import { Search, Filter, Music } from 'lucide-react';

export const RecordingArchive: React.FC = () => {
  const { audioFiles, loading, error, refetch } = useAudioFiles();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [filteredFiles, setFilteredFiles] = useState<typeof audioFiles>([]);

  useEffect(() => {
    let filtered = audioFiles;

    if (searchTerm) {
      filtered = filtered.filter(file => 
        file.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (file.description && file.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(file => file.category === categoryFilter);
    }

    setFilteredFiles(filtered);
  }, [audioFiles, searchTerm, categoryFilter]);

  const categories = Array.from(new Set(audioFiles.map(file => file.category)));

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading recordings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Error loading recordings</p>
          <Button onClick={refetch} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search recordings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredFiles.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              {searchTerm || categoryFilter !== 'all' 
                ? 'No recordings match your search criteria' 
                : 'No recordings available'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredFiles.map((file) => {
            // Convert AudioFileData to AudioFile for WaveSurferPlayer
            const audioFile: AudioFile = {
              id: file.id,
              title: file.title,
              description: file.description || '',
              file_url: file.file_url,
              file_path: file.file_path || '',
              category: file.category,
              is_backing_track: file.is_backing_track || false,
              uploaded_by: file.uploaded_by || '',
              created_at: file.created_at,
            };

            return (
              <Card key={file.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{file.title}</CardTitle>
                      {file.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {file.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">
                        {file.category}
                      </Badge>
                      {file.is_backing_track && (
                        <Badge variant="outline">
                          Backing Track
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <WaveSurferPlayer audio={audioFile} />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
