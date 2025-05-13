
import { useState, useEffect } from 'react';
import { YouTubeVideo } from '@/types/youtube';

export const useYouTubeData = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([
    {
      id: 'video1',
      title: 'Spelman College Glee Club - Amazing Grace',
      description: 'Spelman College Glee Club performs Amazing Grace at the 2023 Spring Concert.',
      url: 'https://www.youtube.com/watch?v=example1',
      thumbnailUrl: '/lovable-uploads/8aa13e63-fb9a-4c52-95cf-86b458c58f1c.png',
      publishedAt: '2023-04-15T12:00:00Z',
      channelTitle: 'Spelman College',
      viewCount: 12500,
      likeCount: 750,
      commentCount: 86,
      duration: 'PT3M45S'
    },
    {
      id: 'video2',
      title: 'Lift Every Voice and Sing - Spelman Glee Club',
      description: 'Spelman College Glee Club performs the Black National Anthem at Founders Day.',
      url: 'https://www.youtube.com/watch?v=example2',
      thumbnailUrl: '/lovable-uploads/9a044e72-80dc-40a6-b716-2d5c2d35b878.png',
      publishedAt: '2023-02-10T15:30:00Z',
      channelTitle: 'Spelman College',
      viewCount: 9800,
      likeCount: 620,
      commentCount: 45,
      duration: 'PT4M20S'
    },
    {
      id: 'video3',
      title: 'Behind the Scenes with the Spelman Glee Club',
      description: 'A behind the scenes look at the rehearsal process of the Spelman College Glee Club.',
      url: 'https://www.youtube.com/watch?v=example3',
      thumbnailUrl: '/lovable-uploads/a2e734d0-cb83-4b32-be93-9f3f0da03fc4.png',
      publishedAt: '2023-03-05T09:15:00Z',
      channelTitle: 'Spelman College',
      viewCount: 7560,
      likeCount: 380,
      commentCount: 32,
      duration: 'PT8M12S'
    },
    {
      id: 'video4',
      title: 'Interview: Spelman Glee Club Director',
      description: 'An exclusive interview with the director of the Spelman College Glee Club.',
      url: 'https://www.youtube.com/watch?v=example4',
      thumbnailUrl: '/lovable-uploads/10bab1e7-0f4e-402f-ab65-feb4710b5eaf.png',
      publishedAt: '2023-01-20T14:45:00Z',
      channelTitle: 'Spelman College',
      viewCount: 8200,
      likeCount: 410,
      commentCount: 28,
      duration: 'PT12M35S'
    },
    {
      id: 'video5',
      title: 'Spelman Glee Club European Tour Highlights',
      description: 'Highlights from the Spelman College Glee Club European summer tour.',
      url: 'https://www.youtube.com/watch?v=example5',
      thumbnailUrl: '/lovable-uploads/312fd1a4-7f46-4000-8711-320383aa565a.png',
      publishedAt: '2022-08-30T18:20:00Z',
      channelTitle: 'Spelman College',
      viewCount: 15300,
      likeCount: 870,
      commentCount: 93,
      duration: 'PT15M20S'
    },
    {
      id: 'video6',
      title: 'Spelman and Morehouse College Glee Clubs Joint Concert',
      description: 'Annual joint concert featuring the Spelman and Morehouse College Glee Clubs.',
      url: 'https://www.youtube.com/watch?v=example6',
      thumbnailUrl: '/lovable-uploads/642b93d7-fc15-4c2c-a7df-fe81aadb2f3b.png',
      publishedAt: '2022-11-15T19:00:00Z',
      channelTitle: 'Spelman College',
      viewCount: 18700,
      likeCount: 1200,
      commentCount: 145,
      duration: 'PT1H25M'
    },
    {
      id: 'video7',
      title: 'Spelman Glee Club Christmas Concert',
      description: 'The annual Christmas Concert featuring the Spelman College Glee Club.',
      url: 'https://www.youtube.com/watch?v=example7',
      thumbnailUrl: '/lovable-uploads/8fa96710-a03a-4033-9ee0-032306d74daa.png',
      publishedAt: '2022-12-10T20:30:00Z',
      channelTitle: 'Spelman College',
      viewCount: 22400,
      likeCount: 1500,
      commentCount: 210,
      duration: 'PT1H10M'
    },
    {
      id: 'video8',
      title: 'Spelman Glee Club - Alumnae Concert',
      description: 'Special performance featuring current members and alumnae of the Spelman College Glee Club.',
      url: 'https://www.youtube.com/watch?v=example8',
      thumbnailUrl: '/lovable-uploads/cb5429e5-ef5e-4b87-8109-1e1216828e19.png',
      publishedAt: '2022-10-05T16:45:00Z',
      channelTitle: 'Spelman College',
      viewCount: 16800,
      likeCount: 920,
      commentCount: 105,
      duration: 'PT1H30M'
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

// Remove default export to fix the named export issue
