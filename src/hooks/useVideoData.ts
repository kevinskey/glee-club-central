
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
        // For now, we'll use sample data with actual Spelman Glee Club YouTube videos
        const sampleVideos: Video[] = [
          {
            id: "Uc66XN8VYO4",
            title: "The Spelman College Glee Club & Jazz Ensemble",
            description: "The Spelman College Glee Club & Jazz Ensemble - 2019 Christmas Concert.",
            thumbnail: "https://img.youtube.com/vi/Uc66XN8VYO4/mqdefault.jpg",
            publishedAt: "2019-12-08T00:00:00Z",
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
            id: "yE2H_rIvVLg",
            title: "Christmas with the Spelman College Glee Club",
            description: "The Christmas Carol Concert 2021 featuring the Spelman College Glee Club.",
            thumbnail: "https://img.youtube.com/vi/yE2H_rIvVLg/mqdefault.jpg",
            publishedAt: "2021-12-25T00:00:00Z",
            category: "Seasonal"
          },
          {
            id: "J62sAkfdgHM",
            title: "Ain't That Good News - Spelman College Glee Club",
            description: "Spelman College Glee Club performs 'Ain't That Good News'.",
            thumbnail: "https://img.youtube.com/vi/J62sAkfdgHM/mqdefault.jpg",
            publishedAt: "2018-04-30T00:00:00Z",
            category: "Spirituals"
          },
          {
            id: "TXm_N9cAcdw",
            title: "I've Been Buked - Spelman College Glee Club",
            description: "Spelman College Glee Club performs 'I've Been Buked' at Sisters Chapel.",
            thumbnail: "https://img.youtube.com/vi/TXm_N9cAcdw/mqdefault.jpg",
            publishedAt: "2019-03-15T00:00:00Z",
            category: "Spirituals"
          },
          {
            id: "fq2kTW-eRag",
            title: "Spelman College Glee Club - Behind the Scenes",
            description: "Go behind the scenes with the Spelman College Glee Club during rehearsal.",
            thumbnail: "https://img.youtube.com/vi/fq2kTW-eRag/mqdefault.jpg",
            publishedAt: "2022-01-20T00:00:00Z",
            category: "Behind the Scenes"
          },
          {
            id: "lGw3VU9yE-U",
            title: "Spelman College Glee Club Tour 2019",
            description: "The Spelman College Glee Club travels for their annual tour.",
            thumbnail: "https://img.youtube.com/vi/lGw3VU9yE-U/mqdefault.jpg",
            publishedAt: "2019-05-10T00:00:00Z",
            category: "Behind the Scenes"
          },
          {
            id: "mJHUw6YjEro",
            title: "Spelman College Glee Club - Sisters Chapel Concert",
            description: "Full concert of the Spelman College Glee Club at Sisters Chapel.",
            thumbnail: "https://img.youtube.com/vi/mJHUw6YjEro/mqdefault.jpg",
            publishedAt: "2023-02-28T00:00:00Z",
            category: "Performances"
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
