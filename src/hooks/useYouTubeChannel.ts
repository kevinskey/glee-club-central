
import { useState, useEffect } from 'react';
import { YouTubeVideo } from '@/types/youtube';
import { useYouTubeData } from './useYouTubeData';
import { toast } from 'sonner';

interface UseYouTubeChannelProps {
  channelId?: string;
  maxResults?: number;
}

export const useYouTubeChannel = ({ 
  channelId = 'UCk1x0JI7pM6YaBbtP1pKgJw', // Default Spelman College Glee Club channel
  maxResults = 3 
}: UseYouTubeChannelProps = {}) => {
  const { videos, loading, error, useMockData } = useYouTubeData();
  const [channelVideos, setChannelVideos] = useState<YouTubeVideo[]>([]);
  
  useEffect(() => {
    if (videos && videos.length > 0) {
      try {
        // Filter videos by channel if needed, then limit by maxResults
        const filtered = videos
          .filter(video => !channelId || video.channelTitle.toLowerCase().includes('spelman'))
          .slice(0, maxResults);
          
        setChannelVideos(filtered);
      } catch (err) {
        console.error("Error filtering channel videos:", err);
        // Only show toast in non-development environments
        if (import.meta.env.MODE !== 'development') {
          toast.error("Failed to filter channel videos");
        }
      }
    } else if (!loading && videos.length === 0) {
      // When there are no videos, ensure we return an empty array
      setChannelVideos([]);
    }
  }, [videos, channelId, maxResults, loading]);
  
  return {
    videos: channelVideos,
    loading,
    error,
    useMockData
  };
};
