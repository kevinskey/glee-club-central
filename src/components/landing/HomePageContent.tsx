
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
      {/* Apple-style section spacing with even more generous white space */}
      <div className="space-y-40 md:space-y-52 lg:space-y-64">
        {/* Events Section */}
        <section className="w-full py-20 md:py-28 lg:py-32">
          <div className="container mx-auto px-8 md:px-12 lg:px-16">
            <div className="text-center mb-20 md:mb-28 lg:mb-32">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-gray-900 dark:text-white mb-8 tracking-tight leading-none">
                Upcoming Events
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
                Experience the extraordinary performances of the Spelman College Glee Club
              </p>
            </div>
            <EnhancedEventsSection events={upcomingEvents} />
          </div>
        </section>
        
        {/* Store Section */}
        <section className="w-full py-20 md:py-28 lg:py-32 bg-gray-50/50 dark:bg-gray-900/20">
          <div className="container mx-auto px-8 md:px-12 lg:px-16">
            <div className="text-center mb-20 md:mb-28 lg:mb-32">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-gray-900 dark:text-white mb-8 tracking-tight leading-none">
                Glee Store
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
                Show your support with official Spelman Glee Club merchandise
              </p>
            </div>
            <StoreSection products={storeProducts} />
          </div>
        </section>
        
        {/* Audio Section */}
        <section className="w-full py-20 md:py-28 lg:py-32">
          <div className="container mx-auto px-8 md:px-12 lg:px-16">
            <div className="text-center mb-20 md:mb-28 lg:mb-32">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-gray-900 dark:text-white mb-8 tracking-tight leading-none">
                Our Music
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
                Listen to our beautiful harmonies and vocal arrangements
              </p>
            </div>
            <AudioSection tracks={audioTracks} />
          </div>
        </section>
      </div>
    </main>
  );
}
