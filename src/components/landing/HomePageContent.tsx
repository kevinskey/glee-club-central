
import React from "react";
import { EnhancedEventsSection } from "./sections/EnhancedEventsSection";
import { StoreSection } from "./sections/StoreSection";
import { SoundCloudPlayer } from "@/components/audio/SoundCloudPlayer";
import { useSoundCloudPlayer } from "@/hooks/useSoundCloudPlayer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Music, Clock } from "lucide-react";

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
  
  const { playlists, activePlaylist, isLoading, error, setActivePlaylist } = useSoundCloudPlayer();
  
  const formatDuration = (milliseconds: number) => {
    const totalMinutes = Math.floor(milliseconds / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };
  
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
          
          {/* SoundCloud Music Section */}
          <div className="mt-16 max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white mb-4 tracking-tight">
                Listen to the Glee
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
                Experience our music collection from SoundCloud
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
                <div className="inline-flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading playlists...</p>
                </div>
              </div>
            )}
            
            {!isLoading && !error && playlists.length > 0 && (
              <div className="space-y-8">
                {/* Playlist Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {playlists.filter(playlist => playlist.is_public && playlist.tracks.length > 0).map((playlist) => (
                    <Card key={playlist.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="relative">
                        {playlist.artwork_url ? (
                          <img 
                            src={playlist.artwork_url} 
                            alt={playlist.name}
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 flex items-center justify-center">
                            <Music className="w-16 h-16 text-white/80" />
                          </div>
                        )}
                        
                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Button
                            onClick={() => setActivePlaylist(playlist)}
                            size="lg"
                            className="bg-white/90 hover:bg-white text-black rounded-full w-16 h-16 shadow-lg"
                          >
                            <Play className="w-6 h-6 ml-1" />
                          </Button>
                        </div>

                        {/* Track Count Badge */}
                        <div className="absolute top-3 right-3">
                          <Badge variant="default" className="bg-black/50 text-white">
                            {playlist.track_count} tracks
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {playlist.name}
                        </h4>
                        {playlist.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            {playlist.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Music className="w-3 h-3" />
                              <span>{playlist.track_count} tracks</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{formatDuration(playlist.duration)}</span>
                            </div>
                          </div>
                          <Button
                            onClick={() => setActivePlaylist(playlist)}
                            size="sm"
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Play
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Active Player */}
                {activePlaylist && (
                  <div className="mt-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
                    <h4 className="text-xl font-medium text-gray-900 dark:text-white mb-6">
                      Now Playing: {activePlaylist.name}
                    </h4>
                    <SoundCloudPlayer 
                      tracks={activePlaylist.tracks}
                      currentTrackIndex={0}
                      onTrackChange={() => {}}
                    />
                  </div>
                )}
              </div>
            )}
            
            {!isLoading && !error && playlists.length === 0 && (
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
