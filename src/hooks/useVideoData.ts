
import { useState } from 'react';
import { Video } from '@/types/video';

const useVideoData = () => {
  const [videos] = useState<Video[]>([
    {
      id: "1",
      title: "Spelman College Glee Club - Spring Concert Highlights",
      description: "Watch the highlights from our annual Spring Concert showcase.",
      url: "https://example.com/video1",
      thumbnailUrl: "/lovable-uploads/8aa13e63-fb9a-4c52-95cf-86b458c58f1c.png", 
      publishedAt: "2023-05-15T14:00:00Z",
      duration: "PT15M30S",
      viewCount: 2500,
      category: "Performances",
      tags: ["spring concert", "highlights", "performance"]
    },
    // You can add more mock videos here
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  return {
    videos,
    loading,
    error,
    isLoading: loading // Adding isLoading for consistency
  };
};

export default useVideoData;
export { useVideoData }; // Also export as named export for consistency
