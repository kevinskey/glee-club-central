
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface MediaFileLight {
  id: string;
  title: string;
  file_type: string;
  size?: number;
  created_at: string;
  file_url?: string;
}

interface UseInfiniteMediaLibraryProps {
  searchQuery: string;
  mediaType: string;
  pageSize?: number;
}

export function useInfiniteMediaLibrary({
  searchQuery,
  mediaType,
  pageSize = 20
}: UseInfiniteMediaLibraryProps) {
  const [mediaFiles, setMediaFiles] = useState<MediaFileLight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const buildQuery = useCallback(() => {
    let query = supabase
      .from('media_library')
      .select('id, title, file_type, size, created_at')
      .order('created_at', { ascending: false });

    if (searchQuery) {
      query = query.ilike('title', `%${searchQuery}%`);
    }

    if (mediaType !== 'all') {
      if (mediaType === 'image') {
        query = query.like('file_type', 'image/%');
      } else if (mediaType === 'video') {
        query = query.like('file_type', 'video/%');
      } else if (mediaType === 'audio') {
        query = query.like('file_type', 'audio/%');
      } else if (mediaType === 'pdf') {
        query = query.like('file_type', '%pdf%');
      }
    }

    return query;
  }, [searchQuery, mediaType]);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setCurrentPage(0);

      const query = buildQuery().range(0, pageSize - 1);
      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      const files = (data || []).map(file => ({
        ...file,
        size: file.size || 0,
      }));

      setMediaFiles(files);
      setHasMore(files.length === pageSize);
    } catch (err) {
      console.error('Error fetching media files:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch media files');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    try {
      setIsLoadingMore(true);
      const nextPage = currentPage + 1;
      const startRange = nextPage * pageSize;
      const endRange = startRange + pageSize - 1;

      const query = buildQuery().range(startRange, endRange);
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
      setHasMore(newFiles.length === pageSize);
    } catch (err) {
      console.error('Error loading more media files:', err);
      toast.error('Failed to load more files');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const refetch = () => {
    fetchInitialData();
  };

  // Reset and refetch when search or filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchInitialData();
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery, mediaType]);

  return {
    mediaFiles,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    refetch,
  };
}
