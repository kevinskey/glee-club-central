
import React from "react";
import { HeroBannerSection } from "@/components/landing/sections/HeroBannerSection";
import { EventsSection } from "@/components/landing/sections/EventsSection";
import { AudioSection } from "@/components/landing/sections/AudioSection";
import { StoreSection } from "@/components/landing/sections/StoreSection";
import { FanSignupForm } from "@/components/landing/FanSignupForm";
import { Footer } from "@/components/landing/Footer";
import { MobileOptimizedContainer } from "@/components/mobile/MobileOptimizedContainer";

interface HomePageContentProps {
  heroImages: Array<{
    id: string;
    url: string;
    title?: string;
    alt?: string;
  }>;
  upcomingEvents: Array<{
    id: string;
    title: string;
    date: string;
    location?: string;
    imageUrl?: string;
    isPublic?: boolean;
  }>;
  storeProducts: Array<{
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
    isNew?: boolean;
    isSale?: boolean;
    originalPrice?: number;
  }>;
  audioTracks: Array<{
    id: string;
    title: string;
    audioUrl: string;
    albumArt: string;
    artist: string;
    duration: string;
  }>;
}

export const HomePageContent = ({
  heroImages,
  upcomingEvents,
  storeProducts,
  audioTracks
}: HomePageContentProps) => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden w-full">
      {/* Hero Section - Full width but contained */}
      <div className="w-full overflow-x-hidden">
        <HeroBannerSection images={heroImages} />
      </div>
      
      {/* Main Content Sections - Mobile optimized with consistent padding */}
      <div className="w-full overflow-x-hidden">
        <MobileOptimizedContainer padding="md" maxWidth="full" className="space-y-8 sm:space-y-12">
          <EventsSection events={upcomingEvents} />
          <AudioSection tracks={audioTracks} />
          <StoreSection products={storeProducts} />
          <FanSignupForm />
        </MobileOptimizedContainer>
      </div>
      
      <Footer />
    </div>
  );
};
