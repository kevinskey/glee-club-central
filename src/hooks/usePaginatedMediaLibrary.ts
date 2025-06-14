
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface MediaFileLight {
  id: string;
  title: string;
  file_type: string;
  size?: number;
  created_at: string;
  file_url?: string; // Only loaded when needed
}

export interface MediaFileDetailed extends MediaFileLight {
  description?: string;
  file_url: string;
  file_path: string;
  uploaded_by: string;
  folder?: string;
  tags?: string[];
  is_public: boolean;
}

const ITEMS_PER_PAGE = 20;

export function usePaginatedMediaLibrary() {
  const [mediaFiles, setMediaFiles] = useState<MediaFileLight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMediaType, setSelectedMediaType] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);

  const buildQuery = useCallback(() => {
    let query = supabase
      .from('media_library')
      .select('id, title, file_type, size, created_at')
      .order('created_at', { ascending: false });

    if (searchQuery) {
      query = query.ilike('title', `%${searchQuery}%`);
    }

    if (selectedMediaType !== 'all') {
      if (selectedMediaType === 'image') {
        query = query.like('file_type', 'image/%');
      } else if (selectedMediaType === 'video') {
        query = query.like('file_type', 'video/%');
      } else if (selectedMediaType === 'audio') {
        query = query.like('file_type', 'audio/%');
      } else if (selectedMediaType === 'pdf') {
        query = query.like('file_type', '%pdf%');
      }
    }

    return query;
  }, [searchQuery, selectedMediaType]);

  const fetchInitialMedia = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setCurrentPage(0);

      const query = buildQuery()
        .range(0, ITEMS_PER_PAGE - 1);

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      const files = (data || []).map(file => ({
        ...file,
        size: file.size || 0,
      }));

      setMediaFiles(files);
      setHasMore(files.length === ITEMS_PER_PAGE);
      
    } catch (err) {
      console.error('Error fetching media files:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch media files');
      toast.error('Failed to load media files');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreMedia = async () => {
    if (isLoadingMore || !hasMore) return;

    try {
      setIsLoadingMore(true);
      const nextPage = currentPage + 1;
      const startRange = nextPage * ITEMS_PER_PAGE;
      const endRange = startRange + ITEMS_PER_PAGE - 1;

      const query = buildQuery()
        .range(startRange, endRange);

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      const newFiles = (data || []).map(file => ({
        ...file,
        size: file.size || 0,
      }));

      if (newFiles.length === 0) {
        setHasMore(false);
        return;
      }

      setMediaFiles(prev => [...prev, ...newFiles]);
      setCurrentPage(nextPage);
      setHasMore(newFiles.length === ITEMS_PER_PAGE);

    } catch (err) {
      console.error('Error loading more media files:', err);
      toast.error('Failed to load more files');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const getFileDetails = async (fileId: string): Promise<MediaFileDetailed | null> => {
    try {
      const { data, error } = await supabase
        .from('media_library')
        .select('*')
        .eq('id', fileId)
        .single();

      if (error) throw error;

      // Ensure file URLs are properly formatted
      let fileUrl = data.file_url;
      if (!fileUrl.startsWith('http') && data.file_path) {
        fileUrl = `https://dzzptovqfqausipsgabw.supabase.co/storage/v1/object/public/media-library/${data.file_path}`;
      }

      return {
        ...data,
        file_url: fileUrl,
        description: data.description || '',
        file_path: data.file_path || '',
        size: data.size || 0,
        folder: data.folder || 'general',
        tags: data.tags || []
      };
    } catch (err) {
      console.error('Error fetching file details:', err);
      return null;
    }
  };

  const deleteMediaItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('media_library')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMediaFiles(prev => prev.filter(file => file.id !== id));
      toast.success('File deleted successfully');
    } catch (err) {
      console.error('Error deleting media file:', err);
      toast.error('Failed to delete file');
      throw err;
    }
  };

  // Reset and refetch when search or filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchInitialMedia();
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedMediaType]);

  return {
    mediaFiles,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    searchQuery,
    setSearchQuery,
    selectedMediaType,
    setSelectedMediaType,
    loadMoreMedia,
    getFileDetails,
    deleteMediaItem,
    refetch: fetchInitialMedia,
  };
}
