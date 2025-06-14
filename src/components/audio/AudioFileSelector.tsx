
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Music, Search, Loader2 } from 'lucide-react';
import { useAudioFiles, AudioFileData } from '@/hooks/useAudioFiles';
import { WaveSurferPlayer } from './WaveSurferPlayer';

interface AudioFileSelectorProps {
  onSelectFile?: (file: AudioFileData) => void;
  selectedFileId?: string;
  showPlayer?: boolean;
}

export function AudioFileSelector({ 
  onSelectFile, 
  selectedFileId, 
  showPlayer = true 
}: AudioFileSelectorProps) {
  const { audioFiles, isLoading, error } = useAudioFiles();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState<AudioFileData | null>(null);

  const filteredFiles = audioFiles.filter(file =>
    file.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectFile = (file: AudioFileData) => {
    setSelectedFile(file);
    onSelectFile?.(file);
  };

  const currentFile = selectedFile || audioFiles.find(f => f.id === selectedFileId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
            <p className="text-gray-600 dark:text-gray-400">Loading audio files...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center p-8">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Audio File Browser */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Select Audio File
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search audio files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredFiles.length === 0 ? (
            <div className="text-center py-8">
              <Music className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm ? 'No audio files match your search.' : 'No audio files found.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    currentFile?.id === file.id
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => handleSelectFile(file)}
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-sm truncate">{file.title}</h4>
                      {file.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate mt-1">
                          {file.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {file.category}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(file.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {currentFile?.id === file.id && (
                      <div className="ml-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* WaveSurfer Player */}
      {showPlayer && currentFile && (
        <WaveSurferPlayer
          key={currentFile.id}
          audioUrl={currentFile.file_url}
          title={currentFile.title}
          artist={currentFile.description}
          className="sticky bottom-4"
        />
      )}
    </div>
  );
}
