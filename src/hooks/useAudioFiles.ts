
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AudioFileData {
  id: string;
  title: string;
  file_url: string;
  description?: string;
  category: string;
  created_at: string;
  file_path?: string;
  uploaded_by?: string;
  is_backing_track?: boolean;
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
          created_at: file.created_at,
          file_path: file.file_url,
          uploaded_by: file.uploaded_by,
          is_backing_track: file.is_backing_track
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
          created_at: file.created_at,
          file_path: file.file_url,
          uploaded_by: file.uploaded_by
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

  const deleteAudioFile = async (id: string) => {
    try {
      // Try deleting from audio_files first
      const { error: audioError } = await supabase
        .from('audio_files')
        .delete()
        .eq('id', id);

      if (audioError) {
        // If not found in audio_files, try media_library
        const { error: mediaError } = await supabase
          .from('media_library')
          .delete()
          .eq('id', id);

        if (mediaError) {
          throw mediaError;
        }
      }

      // Refresh the list
      await fetchAudioFiles();
    } catch (err) {
      console.error('Error deleting audio file:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchAudioFiles();
  }, []);

  return {
    audioFiles,
    isLoading,
    loading: isLoading, // Legacy compatibility
    error,
    refetch: fetchAudioFiles,
    fetchAudioFiles, // Legacy compatibility
    deleteAudioFile
  };
};
