
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";

// Type definitions for reusability
interface HeroImage {
  id: string;
  url: string;
  title?: string;
  alt?: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  location?: string;
  imageUrl?: string;
  isPublic?: boolean;
}

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  isNew?: boolean;
  isSale?: boolean;
  originalPrice?: number;
}

interface AudioTrack {
  id: string;
  title: string;
  audioUrl: string;
  albumArt: string;
  artist: string;
  duration: string;
}

export const useHomePageData = () => {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [storeProducts, setStoreProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { events } = useCalendarEvents();

  // Transform calendar events for homepage use
  const upcomingEvents: Event[] = events
    .filter(event => event.is_public && new Date(event.start_time) > new Date())
    .slice(0, 6)
    .map(event => ({
      id: event.id,
      title: event.title,
      date: event.start_time.split('T')[0],
      location: event.location_name,
      imageUrl: event.image_url || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
      isPublic: event.is_public
    }));

  // Audio tracks from database
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([]);

  // Data fetching functions
  const fetchHeroImages = async () => {
    try {
      const { data, error } = await supabase
        .from('media_library')
        .select('id, title, file_url')
        .eq('is_hero', true)
        .eq('hero_tag', 'main-hero')
        .eq('is_public', true)
        .order('display_order', { ascending: true });

      if (error) throw error;

      const formattedImages: HeroImage[] = data?.map(item => ({
        id: item.id,
        url: item.file_url,
        title: item.title,
        alt: item.title
      })) || [];

      setHeroImages(formattedImages);
    } catch (error) {
      console.error('Error fetching hero images:', error);
      // Fallback to placeholder images
      setHeroImages([
        {
          id: "fallback-1",
          url: "https://images.unsplash.com/photo-1493836434471-b9d2aa522a8e?w=1200&h=600&fit=crop",
          title: "Spelman College Glee Club",
          alt: "Glee Club Performance"
        }
      ]);
    }
  };

  const fetchStoreProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, image_url')
        .eq('is_active', true)
        .eq('featured', true)
        .limit(4);

      if (error) throw error;

      const formattedProducts: Product[] = data?.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.image_url || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop"
      })) || [];

      setStoreProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to placeholder products
      setStoreProducts([
        {
          id: "product-fallback-1",
          name: "Glee Club T-Shirt",
          price: 25.00,
          imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop"
        }
      ]);
    }
  };

  const fetchAudioTracks = async () => {
    try {
      const { data, error } = await supabase
        .from('audio_files')
        .select('id, title, file_url, description')
        .eq('category', 'recordings')
        .limit(5);

      if (error) throw error;

      const formattedTracks: AudioTrack[] = data?.map(track => ({
        id: track.id,
        title: track.title,
        audioUrl: track.file_url,
        albumArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop",
        artist: "Spelman Glee Club",
        duration: "3:45" // This would need to be calculated from actual audio files
      })) || [];

      setAudioTracks(formattedTracks);
    } catch (error) {
      console.error('Error fetching audio tracks:', error);
      // Fallback to placeholder
      setAudioTracks([
        {
          id: "track-1",
          title: "Lift Every Voice",
          audioUrl: "/placeholder.mp3",
          albumArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop",
          artist: "Spelman Glee Club",
          duration: "3:45"
        }
      ]);
    }
  };

  // Load all data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchHeroImages(),
        fetchStoreProducts(),
        fetchAudioTracks()
      ]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  return {
    heroImages,
    upcomingEvents,
    storeProducts,
    audioTracks,
    isLoading
  };
};
