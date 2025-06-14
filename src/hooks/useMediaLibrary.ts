
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MediaType } from '@/utils/mediaUtils';

interface MediaFile {
  id: string;
  title: string;
  description?: string;
  file_url: string;
  file_path: string;
  file_type: string;
  file_size?: number;
  size?: number;
  uploaded_by: string;
  category?: string;
  folder?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  is_public: boolean;
}

export function useMediaLibrary() {
  const [allMediaFiles, setAllMediaFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMediaType, setSelectedMediaType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const fetchMediaFiles = useCallback(async () => {
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

      const files = (data || []).map(file => ({
        ...file,
        description: file.description || '',
        file_path: file.file_path || '',
        size: file.size || file.file_size || 0,
        file_size: file.size || file.file_size || 0,
        category: file.category || file.folder || 'general',
        folder: file.folder || 'general',
        tags: file.tags || []
      }));
      
      setAllMediaFiles(files);
    } catch (err) {
      console.error('Error fetching media files:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch media files');
      toast.error('Failed to load media files');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAllMedia = useCallback(() => {
    fetchMediaFiles();
  }, [fetchMediaFiles]);

  const deleteMediaItem = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('media_library')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state instead of refetching
      setAllMediaFiles(prev => prev.filter(file => file.id !== id));
      toast.success('Media file deleted successfully');
    } catch (err) {
      console.error('Error deleting media file:', err);
      toast.error('Failed to delete media file');
      throw err;
    }
  }, []);

  // Memoized filtered results to prevent unnecessary recalculations
  const filteredMediaFiles = useMemo(() => {
    let filtered = [...allMediaFiles];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(file => 
        file.title.toLowerCase().includes(query) ||
        (file.description && file.description.toLowerCase().includes(query))
      );
    }

    if (selectedMediaType !== 'all') {
      filtered = filtered.filter(file => {
        if (selectedMediaType === 'image') return file.file_type.startsWith('image/');
        if (selectedMediaType === 'video') return file.file_type.startsWith('video/');
        if (selectedMediaType === 'pdf') return file.file_type.includes('pdf');
        if (selectedMediaType === 'audio') return file.file_type.startsWith('audio/');
        if (selectedMediaType === 'document') return file.file_type.includes('pdf') || file.file_type.includes('document');
        return true;
      });
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(file => file.category === selectedCategory);
    }

    return filtered;
  }, [allMediaFiles, searchQuery, selectedMediaType, selectedCategory]);

  // Memoized stats to prevent recalculation
  const mediaStats = useMemo(() => ({
    total: allMediaFiles.length,
    totalFiles: allMediaFiles.length,
    totalSize: allMediaFiles.reduce((acc, file) => acc + (file.size || 0), 0),
    images: allMediaFiles.filter(file => file.file_type.startsWith('image/')).length,
    videos: allMediaFiles.filter(file => file.file_type.startsWith('video/')).length,
    documents: allMediaFiles.filter(file => file.file_type.includes('pdf') || file.file_type.includes('document')).length,
    filesByType: {
      image: allMediaFiles.filter(file => file.file_type.startsWith('image/')).length,
      video: allMediaFiles.filter(file => file.file_type.startsWith('video/')).length,
      pdf: allMediaFiles.filter(file => file.file_type.includes('pdf')).length,
      audio: allMediaFiles.filter(file => file.file_type.startsWith('audio/')).length,
      application: allMediaFiles.filter(file => file.file_type.startsWith('application/') && !file.file_type.includes('pdf')).length,
    }
  }), [allMediaFiles]);

  // Memoized categories and types
  const categories = useMemo(() => 
    ['all', ...Array.from(new Set(allMediaFiles.map(file => file.category || 'general')))],
    [allMediaFiles]
  );

  const mediaTypes: MediaType[] = ['image', 'video', 'pdf', 'audio', 'document'];

  // Only fetch on mount
  useEffect(() => {
    fetchMediaFiles();
  }, [fetchMediaFiles]);

  return {
    mediaFiles: filteredMediaFiles,
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
    mediaTypes,
    categories,
    fetchMediaFiles,
    fetchAllMedia,
    deleteMediaItem,
    useMediaInContext: () => {}, // Placeholder function
  };
}
