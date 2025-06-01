
import React from "react";
import { HeroBannerSection } from "@/components/landing/sections/HeroBannerSection";
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
