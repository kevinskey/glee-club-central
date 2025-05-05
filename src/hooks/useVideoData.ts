
import { useState, useEffect } from "react";
import { Video } from "@/types/video";

export function useVideoData() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [featuredVideo, setFeaturedVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // In a real app, this would be an API call to the YouTube API or your backend
        // For now, we'll use sample data
        const sampleVideos: Video[] = [
          {
            id: "E4vtbJ79_7Y",
            title: "Spelman Glee Club - Glory Hallelujah",
            description: "Spelman College Glee Club performs Glory Hallelujah.",
            thumbnail: "https://img.youtube.com/vi/E4vtbJ79_7Y/mqdefault.jpg",
            publishedAt: "2022-12-15T00:00:00Z",
            category: "Performances"
          },
          {
            id: "s6tV0omDDpA",
            title: "Spelman College Glee Club | 'Plenty Good Room'",
            description: "Spelman College Glee Club performs 'Plenty Good Room'.",
            thumbnail: "https://img.youtube.com/vi/s6tV0omDDpA/mqdefault.jpg",
            publishedAt: "2019-05-19T00:00:00Z",
            category: "Performances"
          },
          {
            id: "3LXiP5Ns5m4",
            title: "Spelman College Glee Club - Pilgrim's Hymn",
            description: "Spelman College Glee Club performs Pilgrim's Hymn by Stephen Paulus.",
            thumbnail: "https://img.youtube.com/vi/3LXiP5Ns5m4/mqdefault.jpg",
            publishedAt: "2023-01-10T00:00:00Z",
            category: "Performances"
          },
          {
            id: "A8QZipk08rY",
            title: "Spelman College Glee Club - Stay in the Field",
            description: "The Spelman College Glee Club singing 'Stay in the Field'.",
            thumbnail: "https://img.youtube.com/vi/A8QZipk08rY/mqdefault.jpg",
            publishedAt: "2020-06-20T00:00:00Z",
            category: "Spirituals"
          },
          {
            id: "xAXvMRwFopQ",
            title: "Spelman College Glee Club - I'll Stand",
            description: "Spelman College Glee Club performs 'I'll Stand' at a special event.",
            thumbnail: "https://img.youtube.com/vi/xAXvMRwFopQ/mqdefault.jpg",
            publishedAt: "2021-11-05T00:00:00Z",
            category: "Spirituals"
          },
          {
            id: "lRXU1W4Uqg0",
            title: "Spelman College Glee Club Tour",
            description: "Follow the Spelman College Glee Club on their latest tour.",
            thumbnail: "https://img.youtube.com/vi/lRXU1W4Uqg0/mqdefault.jpg",
            publishedAt: "2022-07-15T00:00:00Z",
            category: "Behind the Scenes"
          },
          {
            id: "LGwlR7A_8Xo",
            title: "Spelman College Glee Club - Christmas Special",
            description: "Enjoy the Spelman College Glee Club Christmas performance.",
            thumbnail: "https://img.youtube.com/vi/LGwlR7A_8Xo/mqdefault.jpg",
            publishedAt: "2022-12-25T00:00:00Z",
            category: "Seasonal"
          },
          {
            id: "PeInWqUfZwM",
            title: "Spelman College Glee Club - Interviews",
            description: "Meet the members of the Spelman College Glee Club.",
            thumbnail: "https://img.youtube.com/vi/PeInWqUfZwM/mqdefault.jpg",
            publishedAt: "2023-02-28T00:00:00Z",
            category: "Behind the Scenes"
          }
        ];

        // Sort videos by publish date (newest first)
        const sortedVideos = [...sampleVideos].sort((a, b) => 
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );

        setVideos(sortedVideos);
        
        // Set the first video as featured
        setFeaturedVideo(sortedVideos[0]);
        
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch videos'));
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return { videos, featuredVideo, isLoading, error };
}
