
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
  heroImages: any[];
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
    <main className="w-full">
      {/* Events Section - No top spacing, directly under slider */}
      <section className="w-full">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12 pt-8 md:pt-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 dark:text-white mb-4 md:mb-6 tracking-tight">
              Upcoming Events
            </h2>
          </div>
          <EnhancedEventsSection events={upcomingEvents} />
        </div>
      </section>
      
      {/* Store Section */}
      <section className="w-full py-8 md:py-12 lg:py-16 bg-gray-50/30 dark:bg-gray-900/10">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 dark:text-white mb-4 md:mb-6 tracking-tight">
              Glee Store
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
              Show your support with official Spelman Glee Club merchandise
            </p>
          </div>
          <StoreSection products={storeProducts} />
        </div>
      </section>
      
      {/* Audio Section */}
      <section className="w-full py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 dark:text-white mb-4 md:mb-6 tracking-tight">
              Our Music
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
              Listen to our beautiful harmonies and vocal arrangements
            </p>
          </div>
          <AudioSection tracks={audioTracks} />
        </div>
      </section>
    </main>
  );
}
