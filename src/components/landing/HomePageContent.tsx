
import React from "react";
import { EnhancedEventsSection } from "./sections/EnhancedEventsSection";
import { StoreSection } from "./sections/StoreSection";
import { EnhancedCustomAudioPlayer } from "@/components/audio/EnhancedCustomAudioPlayer";

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
  console.log('🎭 HomePageContent: Rendering with events:', upcomingEvents);
  
  return (
    <main className="w-full">
      {/* Events Section with Integrated Music Player - Moved closer to hero */}
      <section className="w-full py-8 md:py-8 lg:py-10">
        <div className="w-full px-4 md:px-6 lg:px-8">
          {/* Debug info - remove in production */}
          {upcomingEvents.length === 0 && (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg mb-12">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                No upcoming events found. Check back soon for new performances!
              </p>
            </div>
          )}
          
          <EnhancedEventsSection events={upcomingEvents} />
          
          {/* Enhanced Music Player - Backend Controlled */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-light text-gray-900 dark:text-white mb-4 tracking-tight">
                Listen to Our Music
              </h3>
              <p className="text-base text-gray-600 dark:text-gray-400 max-w-xl mx-auto font-light">
                Experience our curated playlist, managed in real-time
              </p>
            </div>
            <EnhancedCustomAudioPlayer className="shadow-lg" />
          </div>
        </div>
      </section>
      
      {/* Store Section */}
      <section className="w-full py-16 md:py-20 lg:py-24 bg-gray-50/30 dark:bg-gray-900/10">
        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="text-center mb-16 md:mb-20 lg:mb-24">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 dark:text-white mb-8 md:mb-10 tracking-tight">
              Glee Store
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
              Show your support with official Spelman Glee Club merchandise
            </p>
          </div>
          <StoreSection products={storeProducts} />
        </div>
      </section>
    </main>
  );
}
