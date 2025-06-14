
import React from "react";
import { EnhancedEventsSection } from "./sections/EnhancedEventsSection";
import { StoreSection } from "./sections/StoreSection";
import { SoundCloudPlayer } from "@/components/audio/SoundCloudPlayer";
import { useSoundCloudPlayer } from "@/hooks/useSoundCloudPlayer";

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
  
  const { activePlaylist, isLoading, error } = useSoundCloudPlayer();
  
  return (
    <main className="w-full">
      {/* Events Section */}
      <section className="w-full py-4 md:py-6 lg:py-8">
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
          
          {/* SoundCloud Music Player */}
          <div className="mt-12 max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-light text-gray-900 dark:text-white mb-4 tracking-tight">
                Listen to the Glee
              </h3>
              <p className="text-base text-gray-600 dark:text-gray-400 max-w-xl mx-auto font-light">
                Experience our music directly from SoundCloud
              </p>
            </div>
            
            {error && (
              <div className="text-center py-8 bg-red-50 dark:bg-red-900/20 rounded-lg mb-8">
                <p className="text-red-600 dark:text-red-400 text-sm">
                  Unable to load SoundCloud content: {error}
                </p>
              </div>
            )}
            
            {isLoading && (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">Loading SoundCloud playlists...</p>
              </div>
            )}
            
            {!isLoading && !error && activePlaylist && (
              <SoundCloudPlayer 
                tracks={activePlaylist.tracks}
                currentTrackIndex={0}
                onTrackChange={() => {}}
              />
            )}
            
            {!isLoading && !error && !activePlaylist && (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  No SoundCloud playlists available at the moment.
                </p>
              </div>
            )}
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
