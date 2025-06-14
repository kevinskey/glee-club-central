
import React from "react";
import { EnhancedEventsSection } from "./sections/EnhancedEventsSection";
import { StoreSection } from "./sections/StoreSection";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Music } from "lucide-react";

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
  
  const generateEmbedCode = (url: string) => {
    const embedParams = new URLSearchParams({
      url: url,
      color: '#ff5500',
      auto_play: 'false',
      hide_related: 'false',
      show_comments: 'true',
      show_user: 'true',
      show_reposts: 'false',
      show_teaser: 'true'
    });

    return `https://w.soundcloud.com/player/?${embedParams.toString()}`;
  };

  // Hardcoded SoundCloud tracks for display
  const soundCloudTracks = [
    {
      id: 'track-1',
      title: 'Amazing Grace',
      artist: 'Spelman College Glee Club',
      url: 'https://soundcloud.com/doctorkj/amazing-grace-spelman',
      description: 'A beautiful rendition of this classic hymn'
    },
    {
      id: 'track-2', 
      title: 'Lift Every Voice and Sing',
      artist: 'Spelman College Glee Club',
      url: 'https://soundcloud.com/doctorkj/lift-every-voice',
      description: 'The Negro National Anthem performed with passion'
    },
    {
      id: 'track-3',
      title: 'Wade in the Water',
      artist: 'Spelman College Glee Club', 
      url: 'https://soundcloud.com/doctorkj/wade-in-the-water',
      description: 'Traditional spiritual arrangement'
    }
  ];
  
  return (
    <main className="w-full">
      {/* Events Section */}
      <section className="w-full pt-[10px] pb-4 md:pb-6 lg:pb-8">
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
          
          {/* SoundCloud Music Section */}
          <div className="mt-16 max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white mb-4 tracking-tight">
                Listen to the Glee
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
                Experience our music collection
              </p>
            </div>
            
            {/* Show SoundCloud embeds */}
            <div className="space-y-8">
              {soundCloudTracks.map((track) => (
                <Card key={track.id} className="overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {track.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          by {track.artist}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {track.description}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={track.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                    <div className="rounded-lg overflow-hidden">
                      <iframe
                        width="100%"
                        height="166"
                        scrolling="no"
                        frameBorder="no"
                        allow="autoplay"
                        src={generateEmbedCode(track.url)}
                        className="w-full"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Fallback message if no embeds */}
            {soundCloudTracks.length === 0 && (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Music className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  No music available at the moment.
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
                  Check back soon for new tracks!
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
