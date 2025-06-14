
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AudioFileData {
  id: string;
  title: string;
  file_url: string;
  description?: string;
  category: string;
  created_at: string;
}

export const useAudioFiles = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFileData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAudioFiles = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch from audio_files table
      const { data: audioFilesData, error: audioError } = await supabase
        .from('audio_files')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch audio files from media_library
      const { data: mediaLibraryData, error: mediaError } = await supabase
        .from('media_library')
        .select('*')
        .or('file_type.like.audio/*,file_type.eq.audio/mpeg,file_type.eq.audio/mp3,file_type.eq.audio/x-m4a')
        .order('created_at', { ascending: false });

      if (audioError && mediaError) {
        throw new Error('Failed to fetch audio files');
      }

      const combinedFiles: AudioFileData[] = [];

      // Add audio_files entries
      if (audioFilesData) {
        combinedFiles.push(...audioFilesData.map(file => ({
          id: file.id,
          title: file.title,
          file_url: file.file_url,
          description: file.description,
          category: file.category,
          created_at: file.created_at
        })));
      }

      // Add media_library audio entries
      if (mediaLibraryData) {
        combinedFiles.push(...mediaLibraryData.map(file => ({
          id: file.id,
          title: file.title,
          file_url: file.file_url,
          description: file.description,
          category: file.folder || 'general',
          created_at: file.created_at
        })));
      }

      setAudioFiles(combinedFiles);
    } catch (err) {
      console.error('Error fetching audio files:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch audio files');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAudioFiles();
  }, []);

  return {
    audioFiles,
    isLoading,
    error,
    refetch: fetchAudioFiles
  };
};
