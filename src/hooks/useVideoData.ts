
import { useState, useEffect } from 'react';
import { Video } from '@/types/video';

// Sample video data to display - replace with actual data fetching from your API/Supabase
const sampleVideos: Video[] = [
  {
    id: '1',
    title: 'Spring Concert Highlights',
    description: 'Highlights from our annual Spring Concert featuring selections from our tour repertoire.',
    thumbnail: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=600&auto=format&fit=crop',
    publishedAt: '2025-04-01',
    category: 'performance'
  },
  {
    id: '2',
    title: 'Alto Sectional Rehearsal',
    description: 'Rehearsal footage from the alto section preparing for the upcoming concert.',
    thumbnail: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=600&auto=format&fit=crop',
    publishedAt: '2025-03-20',
    category: 'rehearsal'
  },
  {
    id: '3',
    title: 'Tour Performance in Chicago',
    description: 'Live recording of our performance at the Chicago Cultural Center during our Midwest tour.',
    thumbnail: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=600&auto=format&fit=crop',
    publishedAt: '2025-02-15',
    category: 'tour'
  },
  {
    id: '4',
    title: 'Holiday Concert',
    description: 'Annual holiday concert featuring seasonal favorites and spirituals.',
    thumbnail: 'https://images.unsplash.com/photo-1522839209177-1d1997b7e5b6?q=80&w=600&auto=format&fit=crop',
    publishedAt: '2024-12-10',
    category: 'performance'
  },
  {
    id: '5',
    title: 'Spelman College Glee Club Promo',
    description: 'Official promotional video for the Spelman College Glee Club featuring interviews and performance clips.',
    thumbnail: 'https://images.unsplash.com/photo-1557682250-4b256635a863?q=80&w=600&auto=format&fit=crop',
    publishedAt: '2024-11-05',
    category: 'events'
  }
];

export function useVideoData() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // Simulate API call with a timeout
        setTimeout(() => {
          setVideos(sampleVideos);
          setIsLoading(false);
        }, 1000);

        // For a real implementation, you would use Supabase here:
        /*
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .order('publishedAt', { ascending: false });

        if (error) throw error;
        setVideos(data);
        */
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch videos'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return { videos, isLoading, error };
}
