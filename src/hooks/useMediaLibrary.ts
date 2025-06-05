
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MediaFile {
  id: string;
  title: string;
  file_url: string;
  file_type: string;
  file_size: number;
  is_public: boolean;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

export function useMediaLibrary() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [allMediaFiles, setAllMediaFiles] = useState<MediaFile[]>([]);
  const [filteredMediaFiles, setFilteredMediaFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMediaType, setSelectedMediaType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const fetchMediaFiles = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      const files = data || [];
      setMediaFiles(files);
      setAllMediaFiles(files);
      setFilteredMediaFiles(files);
    } catch (err) {
      console.error('Error fetching media files:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch media files');
      toast.error('Failed to load media files');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllMedia = fetchMediaFiles;

  const uploadMediaFile = async (file: File, title?: string, isPublic: boolean = false) => {
    try {
      // Upload file to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `media/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      // Insert media record
      const { data: mediaRecord, error: insertError } = await supabase
        .from('media_library')
        .insert({
          title: title || file.name,
          file_url: publicUrl,
          file_type: file.type,
          file_size: file.size,
          is_public: isPublic,
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Refresh media files list
      await fetchMediaFiles();

      toast.success('Media file uploaded successfully');
      return mediaRecord;
    } catch (err) {
      console.error('Error uploading media file:', err);
      toast.error('Failed to upload media file');
      throw err;
    }
  };

  const deleteMediaFile = async (id: string) => {
    try {
      const { error } = await supabase
        .from('media_library')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      await fetchMediaFiles();
      toast.success('Media file deleted successfully');
    } catch (err) {
      console.error('Error deleting media file:', err);
      toast.error('Failed to delete media file');
      throw err;
    }
  };

  const deleteMediaItem = deleteMediaFile;

  const mediaStats = {
    total: allMediaFiles.length,
    images: allMediaFiles.filter(file => file.file_type.startsWith('image/')).length,
    videos: allMediaFiles.filter(file => file.file_type.startsWith('video/')).length,
    documents: allMediaFiles.filter(file => file.file_type.includes('pdf') || file.file_type.includes('document')).length,
  };

  // Filter media files based on search and filters
  useEffect(() => {
    let filtered = [...allMediaFiles];

    if (searchQuery) {
      filtered = filtered.filter(file => 
        file.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedMediaType !== 'all') {
      filtered = filtered.filter(file => {
        if (selectedMediaType === 'image') return file.file_type.startsWith('image/');
        if (selectedMediaType === 'video') return file.file_type.startsWith('video/');
        if (selectedMediaType === 'document') return file.file_type.includes('pdf') || file.file_type.includes('document');
        return true;
      });
    }

    setFilteredMediaFiles(filtered);
  }, [allMediaFiles, searchQuery, selectedMediaType, selectedCategory, dateFilter]);

  useEffect(() => {
    fetchMediaFiles();
  }, []);

  return {
    mediaFiles,
    allMediaFiles,
    filteredMediaFiles,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    selectedMediaType,
    setSelectedMediaType,
    selectedCategory,
    setSelectedCategory,
    dateFilter,
    setDateFilter,
    mediaStats,
    fetchMediaFiles,
    fetchAllMedia,
    uploadMediaFile,
    deleteMediaFile,
    deleteMediaItem,
  };
}
