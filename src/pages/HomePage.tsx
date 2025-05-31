
import React from "react";
import { HeaderNav } from "@/components/landing/HeaderNav";
import { HeroBanner } from "@/components/landing/HeroBanner";
import { EventScroller } from "@/components/landing/EventScroller";
import { AudioPlayerSection } from "@/components/landing/AudioPlayerSection";
import { StorePreview } from "@/components/landing/StorePreview";
import { FooterLinks } from "@/components/landing/FooterLinks";

const HomePage = () => {
  // Hero images placeholder data
  const heroImages = [
    {
      id: "hero-1",
      url: "https://images.unsplash.com/photo-1493836434471-b9d2aa522a8e?w=1200&h=600&fit=crop",
      title: "Spelman College Glee Club",
      alt: "Glee Club Performance"
    },
    {
      id: "hero-2", 
      url: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1200&h=600&fit=crop",
      title: "Excellence in Harmony",
      alt: "Concert Performance"
    },
    {
      id: "hero-3",
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop", 
      title: "Tradition and Innovation",
      alt: "Choir Rehearsal"
    }
  ];

  // Upcoming events placeholder data
  const upcomingEvents = [
    {
      id: "event-1",
      title: "Spring Concert",
      date: "2024-04-15",
      location: "Sisters Chapel",
      imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop"
    },
    {
      id: "event-2", 
      title: "Alumni Reunion Performance",
      date: "2024-05-20",
      location: "Spelman Campus",
      imageUrl: "https://images.unsplash.com/photo-1501612780327-45045538702b?w=400&h=300&fit=crop"
    },
    {
      id: "event-3",
      title: "Community Outreach Concert",
      date: "2024-06-10", 
      location: "Atlanta Community Center",
      imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop"
    }
  ];

  // Audio tracks placeholder data
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

  // Store products placeholder data
  const storeProducts = [
    {
      id: "product-1",
      name: "Glee Club T-Shirt",
      price: 25.00,
      imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
      isNew: true
    },
    {
      id: "product-2",
      name: "Concert Program Collection",
      price: 15.00,
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop"
    },
    {
      id: "product-3",
      name: "Glee Club Hoodie",
      price: 45.00,
      imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=300&fit=crop",
      isSale: true,
      originalPrice: 55.00
    },
    {
      id: "product-4",
      name: "Alumni Pin Set",
      price: 12.00,
      imageUrl: "https://images.unsplash.com/photo-1517770613040-6e1c00e46612?w=300&h=300&fit=crop"
    }
  ];

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
