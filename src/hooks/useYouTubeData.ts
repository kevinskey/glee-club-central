
import { useState, useEffect } from 'react';
import { YouTubeVideo } from '@/types/youtube';

// Enhanced sample YouTube data - in a real implementation, this would fetch from YouTube API
const sampleYouTubeVideos: YouTubeVideo[] = [
  {
    id: "hYbHCl8gW-U",
    title: "Spelman College Glee Club - Deep River",
    description: "Spelman College Glee Club performing Deep River at the Sisters Chapel.",
    thumbnailUrl: "https://i3.ytimg.com/vi/hYbHCl8gW-U/maxresdefault.jpg",
    publishedAt: "2024-02-15",
    videoUrl: "https://www.youtube.com/watch?v=hYbHCl8gW-U"
  },
  {
    id: "EI-IGy8BFZ0",
    title: "Spelman College Glee Club - Fix Me Jesus",
    description: "Spelman College Glee Club performs Fix Me Jesus at the annual Christmas Carol Concert.",
    thumbnailUrl: "https://i3.ytimg.com/vi/EI-IGy8BFZ0/maxresdefault.jpg",
    publishedAt: "2023-12-10",
    videoUrl: "https://www.youtube.com/watch?v=EI-IGy8BFZ0"
  },
  {
    id: "c4Z8E4WMat4",
    title: "Spelman College Glee Club - Wade in the Water",
    description: "Spelman College Glee Club performing Wade in the Water during the spring concert tour.",
    thumbnailUrl: "https://i3.ytimg.com/vi/c4Z8E4WMat4/maxresdefault.jpg",
    publishedAt: "2023-10-05",
    videoUrl: "https://www.youtube.com/watch?v=c4Z8E4WMat4"
  },
  {
    id: "wQFVgRBDykY",
    title: "Spelman College Glee Club - Lift Every Voice and Sing",
    description: "Spelman College Glee Club performing Lift Every Voice and Sing at the annual Founders Day celebration.",
    thumbnailUrl: "https://i3.ytimg.com/vi/wQFVgRBDykY/maxresdefault.jpg",
    publishedAt: "2023-08-22",
    videoUrl: "https://www.youtube.com/watch?v=wQFVgRBDykY"
  },
  {
    id: "XmvKMxxWBOw",
    title: "Spelman College Glee Club - Behind the Scenes Rehearsal",
    description: "Go behind the scenes with the Spelman College Glee Club as they prepare for their upcoming tour.",
    thumbnailUrl: "https://i3.ytimg.com/vi/XmvKMxxWBOw/maxresdefault.jpg",
    publishedAt: "2023-07-15",
    videoUrl: "https://www.youtube.com/watch?v=XmvKMxxWBOw"
  },
  {
    id: "KqZG5hHgArQ",
    title: "Spelman College Glee Club - Hallelujah Chorus",
    description: "Performance from the Spring Concert featuring the full ensemble.",
    thumbnailUrl: "https://i3.ytimg.com/vi/KqZG5hHgArQ/maxresdefault.jpg",
    publishedAt: "2023-05-18",
    videoUrl: "https://www.youtube.com/watch?v=KqZG5hHgArQ"
  },
  {
    id: "YM3g8Hz1J4Y",
    title: "Spelman College Glee Club - Tour Vlog: New York City",
    description: "Join us on our East Coast tour as we perform at venues in New York City and connect with alumni.",
    thumbnailUrl: "https://i3.ytimg.com/vi/YM3g8Hz1J4Y/maxresdefault.jpg",
    publishedAt: "2023-04-05",
    videoUrl: "https://www.youtube.com/watch?v=YM3g8Hz1J4Y"
  },
  {
    id: "dRLRQUcoCO4",
    title: "Spelman College Glee Club - Alto Section Warm-up Techniques",
    description: "Our vocal coach demonstrates warm-up techniques specifically for the alto section.",
    thumbnailUrl: "https://i3.ytimg.com/vi/dRLRQUcoCO4/maxresdefault.jpg",
    publishedAt: "2023-03-12",
    videoUrl: "https://www.youtube.com/watch?v=dRLRQUcoCO4"
  }
];

export function useYouTubeData() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // Simulate API call with a timeout
        setTimeout(() => {
          setVideos(sampleYouTubeVideos);
          setIsLoading(false);
        }, 800);
        
        // For a real implementation, you would use the YouTube API here:
        /*
        const apiKey = 'YOUR_YOUTUBE_API_KEY';
        const channelId = 'UCxxxxxxxxxxxxxxxxxxxxxxx'; // Spelman Glee Club YouTube channel ID
        const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=20`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.items) {
          const formattedVideos = data.items
            .filter(item => item.id.kind === 'youtube#video')
            .map(item => ({
              id: item.id.videoId,
              title: item.snippet.title,
              description: item.snippet.description,
              thumbnailUrl: item.snippet.thumbnails.high.url,
              publishedAt: item.snippet.publishedAt,
              videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`
            }));
          setVideos(formattedVideos);
        }
        */
      } catch (err) {
        console.error('Error fetching YouTube videos:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch YouTube videos'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return { videos, isLoading, error };
}
