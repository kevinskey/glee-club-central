
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
  const { videos, loading, error } = useYouTubeData();
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
        toast.error("Failed to filter channel videos");
      }
    }
  }, [videos, channelId, maxResults]);
  
  return {
    videos: channelVideos,
    loading,
    error,
  };
};
