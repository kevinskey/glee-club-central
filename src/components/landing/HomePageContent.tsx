
import React from "react";
import { EnhancedEventsSection } from "./sections/EnhancedEventsSection";
import { StoreSection } from "./sections/StoreSection";
import { AudioSection } from "./sections/AudioSection";

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

interface HomePageContentProps {
  heroImages: any[]; // Kept for compatibility but unused
  upcomingEvents: Event[];
  storeProducts: Product[];
  audioTracks: AudioTrack[];
}

export function HomePageContent({
  upcomingEvents,
  storeProducts,
  audioTracks
}: HomePageContentProps) {
  return (
    <main className="w-full space-y-12 md:space-y-16 lg:space-y-20">
      {/* Events Section */}
      <section className="w-full">
        <EnhancedEventsSection events={upcomingEvents} />
      </section>
      
      {/* Store Section */}
      <section className="w-full">
        <StoreSection products={storeProducts} />
      </section>
      
      {/* Audio Section */}
      <section className="w-full">
        <AudioSection tracks={audioTracks} />
      </section>
    </main>
  );
}
