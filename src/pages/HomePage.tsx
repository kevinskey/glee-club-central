
import React, { useState, useEffect } from "react";
import { HeaderNav } from "@/components/landing/HeaderNav";
import { HeroBanner } from "@/components/landing/HeroBanner";
import { EventScroller } from "@/components/landing/EventScroller";
import { AudioPlayerSection } from "@/components/landing/AudioPlayerSection";
import { StorePreview } from "@/components/landing/StorePreview";
import { FanSignupForm } from "@/components/landing/FanSignupForm";
import { FooterLinks } from "@/components/landing/FooterLinks";
import { supabase } from "@/integrations/supabase/client";

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

  // Fetch hero images from media_library
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

  // Fetch upcoming events
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

  // Fetch featured products
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <HeaderNav 
          logoText="GleeWorld"
          navigationLinks={[
            { label: "About", href: "/about" },
            { label: "Events", href: "/events" },
            { label: "Store", href: "/store" },
            { label: "Press Kit", href: "/press-kit" }
          ]}
          showLoginButton={true}
        />
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
      {/* Header Navigation */}
      <HeaderNav 
        logoText="GleeWorld"
        navigationLinks={[
          { label: "About", href: "/about" },
          { label: "Events", href: "/events" },
          { label: "Store", href: "/store" },
          { label: "Press Kit", href: "/press-kit" }
        ]}
        showLoginButton={true}
      />

      {/* Main Content */}
      <main className="w-full">
        {/* Hero Banner Section */}
        <section className="w-full">
          <HeroBanner 
            images={heroImages}
            autoPlayInterval={5000}
            showOverlayText={true}
          />
        </section>

        {/* Events Section */}
        <section className="py-12 md:py-16">
          <EventScroller 
            events={upcomingEvents}
            title="Upcoming Events"
            showViewAllButton={true}
            onViewAll={() => window.location.href = "/events"}
          />
        </section>

        {/* Audio Player Section */}
        <section className="py-12 md:py-16">
          <AudioPlayerSection 
            tracks={audioTracks}
            title="Listen to the Sound of GleeWorld"
            subtitle="Experience our latest recordings"
          />
        </section>

        {/* Store Preview Section */}
        <section className="py-12 md:py-16">
          <StorePreview 
            products={storeProducts}
            title="Glee Club Store"
            subtitle="Show your Spelman Glee Club pride"
            showShopAllButton={true}
            onShopAll={() => window.location.href = "/store"}
          />
        </section>

        {/* Fan Signup Section */}
        <FanSignupForm />
      </main>

      {/* Footer */}
      <FooterLinks 
        logoText="GleeWorld"
        tagline="Spelman College Glee Club Official Site"
        email="gleeworld@spelman.edu"
        socialLinks={[
          { platform: 'instagram', url: 'https://instagram.com/spelmanglee', label: 'Instagram' },
          { platform: 'youtube', url: 'https://youtube.com/@SpelmanCollegeGleeClub', label: 'YouTube' },
          { platform: 'facebook', url: 'https://facebook.com/SpelmanGlee', label: 'Facebook' },
          { platform: 'tiktok', url: 'https://tiktok.com/@spelmanglee', label: 'TikTok' }
        ]}
        siteLinks={[
          { label: 'About', href: '/about' },
          { label: 'Events', href: '/events' },
          { label: 'Contact', href: '/contact' },
          { label: 'Press Kit', href: '/press-kit' },
          { label: 'Fan Login', href: '/login' }
        ]}
        developerCredit="Built with ♪ for the Spelman Glee Club"
      />
    </div>
  );
};

export default HomePage;
