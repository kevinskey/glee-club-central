
import { useState, useEffect } from 'react';
import { Video } from '@/types/video';

const useVideoData = () => {
  const [videos, setVideos] = useState<Video[]>([
    {
      id: '1',
      title: 'Spelman Glee Club - Amazing Grace',
      description: 'Performance at the Annual Spring Concert',
      url: 'https://example.com/video1',
      thumbnailUrl: '/lovable-uploads/8aa13e63-fb9a-4c52-95cf-86b458c58f1c.png',
      publishedAt: '2023-04-15',
      duration: '3:45',
      viewCount: 1200,
      category: 'Performance',
      tags: ['concert', 'spiritual']
    },
    {
      id: '2',
      title: 'Spelman Glee Club - Lift Every Voice and Sing',
      description: 'Performance at the Founders Day Celebration',
      url: 'https://example.com/video2',
      thumbnailUrl: '/lovable-uploads/9a044e72-80dc-40a6-b716-2d5c2d35b878.png',
      publishedAt: '2023-02-10',
      duration: '4:20',
      viewCount: 950,
      category: 'Performance',
      tags: ['concert', 'anthem']
    },
    {
      id: '3',
      title: 'Behind the Scenes - Glee Club Rehearsal',
      description: 'A look at our rehearsal process',
      url: 'https://example.com/video3',
      thumbnailUrl: '/lovable-uploads/a2e734d0-cb83-4b32-be93-9f3f0da03fc4.png',
      publishedAt: '2023-03-05',
      duration: '8:12',
      viewCount: 750,
      category: 'Rehearsal',
      tags: ['behind-the-scenes', 'rehearsal']
    },
    {
      id: '4',
      title: 'Interview with Glee Club Director',
      description: 'Learn about our musical direction and philosophy',
      url: 'https://example.com/video4',
      thumbnailUrl: '/lovable-uploads/10bab1e7-0f4e-402f-ab65-feb4710b5eaf.png',
      publishedAt: '2023-01-20',
      duration: '12:35',
      viewCount: 820,
      category: 'Interview',
      tags: ['interview', 'director']
    },
    {
      id: '5',
      title: 'Spelman Glee Club - European Tour Highlights',
      description: 'Highlights from our summer tour of Europe',
      url: 'https://example.com/video5',
      thumbnailUrl: '/lovable-uploads/312fd1a4-7f46-4000-8711-320383aa565a.png',
      publishedAt: '2022-08-30',
      duration: '15:20',
      viewCount: 1500,
      category: 'Tour',
      tags: ['tour', 'europe', 'travel']
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  return {
    videos,
    loading,
    error
  };
};

export default useVideoData;
