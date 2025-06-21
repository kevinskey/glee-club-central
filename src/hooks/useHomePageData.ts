
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";

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
  const [isLoading, setIsLoading] = useState(false); // Changed from true to false
  const { events, loading: eventsLoading } = useCalendarEvents();
  const { activePlaylist, isLoading: musicLoading } = useMusicPlayer();

  console.log('🏠 useHomePageData: Raw events from calendar:', events);
  console.log('🏠 useHomePageData: Events loading state:', eventsLoading);

  // Transform calendar events for homepage use
  const upcomingEvents: Event[] = events
    .filter(event => {
      const isPublic = event.is_public;
      const isFuture = new Date(event.start_time) > new Date();
      console.log(`🔍 Event ${event.title}: isPublic=${isPublic}, isFuture=${isFuture}`);
      return isPublic && isFuture;
    })
    .slice(0, 6)
    .map(event => ({
      id: event.id,
      title: event.title,
      date: event.start_time.split('T')[0],
      location: event.location_name,
      imageUrl: event.feature_image_url || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
      isPublic: event.is_public
    }));

  console.log('🎯 useHomePageData: Filtered upcoming events:', upcomingEvents);

  // Use playlist tracks from the music player hook
  const audioTracks: AudioTrack[] = activePlaylist?.tracks?.map(track => ({
    id: track.id,
    title: track.title,
    audioUrl: track.audioUrl,
    albumArt: track.albumArt,
    artist: track.artist,
    duration: track.duration
  })) || [];

  const fetchStoreProducts = async () => {
    try {
      setIsLoading(true);
      
      if (!supabase) {
        console.warn('useHomePageData: Supabase not configured, using fallback products');
        setStoreProducts([{
          id: "product-fallback-1",
          name: "Glee Club T-Shirt",
          price: 25.00,
          imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop"
        }]);
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, image_url')
        .eq('is_active', true)
        .eq('featured', true)
        .limit(4);

      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }

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
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchStoreProducts();
  }, []); // Removed hasLoadedOnce dependency

  // Overall loading state - now only shows loading during actual data fetches
  const overallLoading = isLoading;

  return {
    upcomingEvents,
    storeProducts,
    audioTracks,
    isLoading: overallLoading
  };
};
