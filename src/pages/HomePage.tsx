import React, { useState, useEffect } from "react";
import { Footer } from "@/components/landing/Footer";
import { HeroBannerSection } from "@/components/landing/sections/HeroBannerSection";
import { EventsSection } from "@/components/landing/sections/EventsSection";
import { AudioSection } from "@/components/landing/sections/AudioSection";
import { StoreSection } from "@/components/landing/sections/StoreSection";
import { FanSignupForm } from "@/components/landing/FanSignupForm";
import { supabase } from "@/integrations/supabase/client";

// Type definitions moved to separate interface file for reusability
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

const HomePage = () => {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [storeProducts, setStoreProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Audio tracks placeholder data (not connected to DB yet)
  const audioTracks = [
    {
      id: "track-1",
      title: "Lift Every Voice",
      audioUrl: "/placeholder.mp3",
      albumArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop",
      artist: "Spelman Glee Club",
      duration: "3:45"
    }
  ];

  // Data fetching functions consolidated
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

  const fetchUpcomingEvents = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('events')
        .select('id, title, start_time, location_name, image_url')
        .eq('is_public', true)
        .gte('start_time', today)
        .order('start_time', { ascending: true })
        .limit(6);

      if (error) throw error;

      const formattedEvents: Event[] = data?.map(event => ({
        id: event.id,
        title: event.title,
        date: event.start_time.split('T')[0],
        location: event.location_name,
        imageUrl: event.image_url || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop"
      })) || [];

      setUpcomingEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      // Fallback to placeholder events
      setUpcomingEvents([
        {
          id: "event-fallback-1",
          title: "Spring Concert",
          date: "2024-04-15",
          location: "Sisters Chapel",
          imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop"
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

  // Load all data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchHeroImages(),
        fetchUpcomingEvents(),
        fetchStoreProducts()
      ]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-glee-spelman mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading GleeWorld...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content - Now using extracted section components */}
      <main className="w-full">
        <HeroBannerSection images={heroImages} />
        <EventsSection events={upcomingEvents} />
        <AudioSection tracks={audioTracks} />
        <StoreSection products={storeProducts} />
        <FanSignupForm />
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;
