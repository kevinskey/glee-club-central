
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

  // Stable reference to prevent infinite re-renders
  const fetchMediaFiles = useCallback(async () => {
    console.log('useMediaLibrary: Starting to fetch media files...');
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('useMediaLibrary: Fetch error:', fetchError);
        throw fetchError;
      }

      console.log('useMediaLibrary: Raw data received:', data?.length || 0, 'files');

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
      
      console.log('useMediaLibrary: Processed files:', files.length);
      setAllMediaFiles(files);
    } catch (err) {
      console.error('useMediaLibrary: Error fetching media files:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch media files');
      toast.error('Failed to load media files');
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array to prevent infinite re-renders

  // Separate function for manual refresh
  const fetchAllMedia = useCallback(() => {
    console.log('useMediaLibrary: Manual refresh triggered');
    fetchMediaFiles();
  }, [fetchMediaFiles]);

  const deleteMediaItem = useCallback(async (id: string) => {
    try {
      console.log('useMediaLibrary: Deleting media item:', id);
      const { error } = await supabase
        .from('media_library')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state immediately for better UX
      setAllMediaFiles(prev => prev.filter(file => file.id !== id));
      toast.success('Media file deleted successfully');
    } catch (err) {
      console.error('useMediaLibrary: Error deleting media file:', err);
      toast.error('Failed to delete media file');
      throw err;
    }
  }, []);

  // Memoized filtered results
  const filteredMediaFiles = useMemo(() => {
    console.log('useMediaLibrary: Filtering media files...');
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

    console.log('useMediaLibrary: Filtered results:', filtered.length);
    return filtered;
  }, [allMediaFiles, searchQuery, selectedMediaType, selectedCategory]);

  // Memoized stats
  const mediaStats = useMemo(() => {
    const stats = {
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
    };
    console.log('useMediaLibrary: Media stats calculated:', stats);
    return stats;
  }, [allMediaFiles]);

  // Memoized categories
  const categories = useMemo(() => {
    const cats = ['all', ...Array.from(new Set(allMediaFiles.map(file => file.category || 'general')))];
    console.log('useMediaLibrary: Categories:', cats);
    return cats;
  }, [allMediaFiles]);

  const mediaTypes: MediaType[] = ['image', 'video', 'pdf', 'audio', 'document'];

  // Fetch data only once on mount
  useEffect(() => {
    console.log('useMediaLibrary: Component mounted, fetching initial data');
    fetchMediaFiles();
  }, []); // Only run once on mount

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
