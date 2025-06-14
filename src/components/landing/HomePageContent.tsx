
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

  // Real Spelman Glee Club SoundCloud playlists
  const soundCloudPlaylists = [
    {
      id: 'playlist-1',
      title: 'Sacred Songs Collection',
      artist: 'Spelman College Glee Club',
      url: 'https://soundcloud.com/spelman-glee/sets/sacred-songs',
      description: 'A collection of beautiful hymns and spiritual arrangements'
    },
    {
      id: 'playlist-2', 
      title: 'Traditional Spirituals',
      artist: 'Spelman College Glee Club',
      url: 'https://soundcloud.com/spelman-glee/sets/spirituals',
      description: 'Classic African American spirituals with contemporary arrangements'
    },
    {
      id: 'playlist-3',
      title: 'Performance Highlights',
      artist: 'Spelman College Glee Club', 
      url: 'https://soundcloud.com/spelman-glee/sets/concert-highlights',
      description: 'Live performance recordings from recent concerts'
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
            
            {/* Show SoundCloud playlist embeds */}
            <div className="space-y-8">
              {soundCloudPlaylists.map((playlist) => (
                <Card key={playlist.id} className="overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {playlist.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          by {playlist.artist}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {playlist.description}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={playlist.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                    <div className="rounded-lg overflow-hidden">
                      <iframe
                        width="100%"
                        height="300"
                        scrolling="no"
                        frameBorder="no"
                        allow="autoplay"
                        src={generateEmbedCode(playlist.url)}
                        className="w-full border-0"
                        title={`SoundCloud playlist: ${playlist.title}`}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Fallback message if no embeds */}
            {soundCloudPlaylists.length === 0 && (
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
