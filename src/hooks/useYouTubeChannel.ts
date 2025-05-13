
import { useState, useEffect } from 'react';
import { YouTubeVideo } from '@/types/youtube';
import { useYouTubeData } from './useYouTubeData';

interface UseYouTubeChannelProps {
  channelId?: string;
  maxResults?: number;
}

export const useYouTubeChannel = ({ 
  channelId = 'UCk1x0JI7pM6YaBbtP1pKgJw', // Default Spelman College Glee Club channel
  maxResults = 3 
}: UseYouTubeChannelProps = {}) => {
  // Currently using mock data from useYouTubeData
  // In a production app, this would call a real YouTube API
  const { videos, loading, error } = useYouTubeData();
  const [channelVideos, setChannelVideos] = useState<YouTubeVideo[]>([]);
  
  useEffect(() => {
    // For now, we're just filtering the mock data to simulate getting videos from a specific channel
    // In production, you would make an API call to YouTube Data API with the channelId
    if (videos && videos.length > 0) {
      const filtered = videos
        .filter(video => video.channelTitle.includes('Spelman'))
        .slice(0, maxResults);
      setChannelVideos(filtered);
    }
  }, [videos, channelId, maxResults]);
  
  return {
    videos: channelVideos,
    loading,
    error,
  };
};
