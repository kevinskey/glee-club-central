
import React from "react";
import { EventsSection } from "@/components/landing/sections/EventsSection";
import { AudioSection } from "@/components/landing/sections/AudioSection";
import { StoreSection } from "@/components/landing/sections/StoreSection";
import { FanSignupForm } from "@/components/landing/FanSignupForm";
import { Footer } from "@/components/landing/Footer";

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
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      {/* Main Content Sections */}
      <div className="w-full overflow-x-hidden space-y-3 sm:space-y-4 pt-6">
        <div className="events-section w-full px-4 sm:px-6 lg:px-8">
          <EventsSection events={upcomingEvents} />
        </div>
        <div className="audio-section w-full px-4 sm:px-6 lg:px-8">
          <AudioSection tracks={audioTracks} />
        </div>
        <div className="store-section w-full px-4 sm:px-6 lg:px-8">
          <StoreSection products={storeProducts} />
        </div>
        <div className="signup-section w-full px-4 sm:px-6 lg:px-8">
          <FanSignupForm />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};
