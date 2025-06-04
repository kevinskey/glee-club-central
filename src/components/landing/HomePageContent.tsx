
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
      {/* Apple-style section spacing with generous white space */}
      <div className="space-y-32 md:space-y-40 lg:space-y-48">
        {/* Events Section */}
        <section className="w-full py-16 md:py-24">
          <div className="container mx-auto px-6 md:px-8">
            <div className="text-center mb-16 md:mb-24">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-gray-900 dark:text-white mb-6 tracking-tight">
                Upcoming Events
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
                Experience the extraordinary performances of the Spelman College Glee Club
              </p>
            </div>
            <EnhancedEventsSection events={upcomingEvents} />
          </div>
        </section>
        
        {/* Store Section */}
        <section className="w-full py-16 md:py-24 bg-gray-50 dark:bg-gray-900/30">
          <div className="container mx-auto px-6 md:px-8">
            <div className="text-center mb-16 md:mb-24">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-gray-900 dark:text-white mb-6 tracking-tight">
                Glee Store
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
                Show your support with official Spelman Glee Club merchandise
              </p>
            </div>
            <StoreSection products={storeProducts} />
          </div>
        </section>
        
        {/* Audio Section */}
        <section className="w-full py-16 md:py-24">
          <div className="container mx-auto px-6 md:px-8">
            <div className="text-center mb-16 md:mb-24">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-gray-900 dark:text-white mb-6 tracking-tight">
                Our Music
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
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
