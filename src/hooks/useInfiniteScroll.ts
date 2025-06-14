
import { useEffect, useCallback } from 'react';

interface UseInfiniteScrollProps {
  hasMore: boolean;
  isLoading: boolean;
  loadMore: () => void;
  threshold?: number;
}

export function useInfiniteScroll({
  hasMore,
  isLoading,
  loadMore,
  threshold = 200
}: UseInfiniteScrollProps) {
  const handleScroll = useCallback(() => {
    if (isLoading || !hasMore) return;

    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    const clientHeight = document.documentElement.clientHeight || window.innerHeight;
    
    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      loadMore();
    }
  }, [hasMore, isLoading, loadMore, threshold]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
}
