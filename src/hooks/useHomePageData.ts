
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";

// Type definitions for reusability
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
  const [storeProducts, setStoreProducts] = useState<Product[]>([]);
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
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
      imageUrl: event.feature_image_url || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
      isPublic: event.is_public
    }));

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
      setStoreProducts([{
        id: "product-fallback-1",
        name: "Glee Club T-Shirt",
        price: 25.00,
        imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop"
      }]);
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
        albumArt: "/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png",
        artist: "Spelman Glee Club",
        duration: "3:45"
      })) || [];

      // Add fallback tracks if no data from database
      if (formattedTracks.length === 0) {
        const fallbackTracks: AudioTrack[] = [
          {
            id: "track-1",
            title: "Ave Maria - Soprano Solo",
            audioUrl: "/placeholder.mp3",
            albumArt: "/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png",
            artist: "Spelman Glee Club",
            duration: "4:20"
          },
          {
            id: "track-2",
            title: "Amazing Grace - Full Choir",
            audioUrl: "/placeholder.mp3",
            albumArt: "/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png",
            artist: "Spelman Glee Club",
            duration: "3:15"
          },
          {
            id: "track-3",
            title: "Lift Every Voice - HBCU Tribute",
            audioUrl: "/placeholder.mp3",
            albumArt: "/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png",
            artist: "Spelman Glee Club",
            duration: "5:00"
          }
        ];
        setAudioTracks(fallbackTracks);
      } else {
        setAudioTracks(formattedTracks);
      }
    } catch (error) {
      console.error('Error fetching audio tracks:', error);
      // Fallback to placeholder
      setAudioTracks([{
        id: "track-1",
        title: "Lift Every Voice",
        audioUrl: "/placeholder.mp3",
        albumArt: "/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png",
        artist: "Spelman Glee Club",
        duration: "3:45"
      }]);
    }
  };

  // Load all data on component mount - only once
  useEffect(() => {
    if (hasLoadedOnce) return;
    
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchStoreProducts(),
          fetchAudioTracks()
        ]);
      } catch (error) {
        console.error('Error loading homepage data:', error);
      } finally {
        setIsLoading(false);
        setHasLoadedOnce(true);
      }
    };

    loadData();
  }, [hasLoadedOnce]);

  return {
    heroImages: [], // No longer used - hero handled by UniversalHero
    upcomingEvents,
    storeProducts,
    audioTracks,
    isLoading
  };
};
