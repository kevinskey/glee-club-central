
import React, { useState, useEffect } from "react";
import { EnhancedEventsSection } from "./sections/EnhancedEventsSection";
import { StoreSection } from "./sections/StoreSection";
import { YouTubeVideoSection } from "./sections/YouTubeVideoSection";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ExternalLink, Music, ChevronLeft, ChevronRight, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

interface SoundCloudTrack {
  id: string;
  title: string;
  duration: string;
  plays: number;
  likes: number;
  permalink_url: string;
}

interface SoundCloudPlaylistData {
  id: string;
  name: string;
  tracks: SoundCloudTrack[];
  track_count: number;
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
  
  const [soundCloudEmbeds, setSoundCloudEmbeds] = useState<any[]>([]);
  const [soundCloudPlaylists, setSoundCloudPlaylists] = useState<Record<string, SoundCloudPlaylistData>>({});
  const [isLoadingEmbeds, setIsLoadingEmbeds] = useState(true);
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false);

  useEffect(() => {
    loadSoundCloudEmbeds();
  }, []);

  useEffect(() => {
    if (soundCloudEmbeds.length > 0) {
      loadSoundCloudPlaylists();
    }
  }, [soundCloudEmbeds]);

  const loadSoundCloudEmbeds = async () => {
    try {
      const { data, error } = await supabase
        .from('soundcloud_embeds')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setSoundCloudEmbeds(data || []);
    } catch (error) {
      console.error('Error loading SoundCloud embeds:', error);
      setSoundCloudEmbeds([]);
    } finally {
      setIsLoadingEmbeds(false);
    }
  };

  const loadSoundCloudPlaylists = async () => {
    setIsLoadingPlaylists(true);
    try {
      console.log('Fetching SoundCloud playlist data...');
      
      const response = await fetch(`https://dzzptovqfqausipsgabw.supabase.co/functions/v1/soundcloud-api`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6enB0b3ZxZnFhdXNpcHNnYWJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0MDM1MjksImV4cCI6MjA2MTk3OTUyOX0.7jSsV-y-32C7f23rw6smPPzuQs6HsQeKpySP4ae_C5s'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('SoundCloud API response:', data);
        
        if (data.playlists && Array.isArray(data.playlists)) {
          const playlistsMap: Record<string, SoundCloudPlaylistData> = {};
          
          // Map SoundCloud playlists to our embeds by URL matching
          data.playlists.forEach((playlist: any) => {
            const matchingEmbed = soundCloudEmbeds.find(embed => 
              embed.url.includes(playlist.permalink_url) || 
              embed.title.toLowerCase().includes(playlist.name.toLowerCase())
            );
            
            if (matchingEmbed) {
              playlistsMap[matchingEmbed.id] = {
                id: playlist.id,
                name: playlist.name,
                tracks: playlist.tracks || [],
                track_count: playlist.track_count || 0
              };
            }
          });
          
          // If we have individual tracks, create a playlist for the first embed
          if (data.tracks && Array.isArray(data.tracks) && data.tracks.length > 0 && soundCloudEmbeds.length > 0) {
            const firstEmbed = soundCloudEmbeds[0];
            if (!playlistsMap[firstEmbed.id]) {
              playlistsMap[firstEmbed.id] = {
                id: 'tracks-collection',
                name: 'Latest Tracks',
                tracks: data.tracks.map((track: any) => ({
                  id: track.id,
                  title: track.title,
                  duration: formatDuration(track.duration),
                  plays: track.plays || 0,
                  likes: track.likes || 0,
                  permalink_url: track.permalink_url || ''
                })),
                track_count: data.tracks.length
              };
            }
          }
          
          setSoundCloudPlaylists(playlistsMap);
        }
      } else {
        console.error('SoundCloud API request failed:', response.status);
      }
    } catch (error) {
      console.error('Error loading SoundCloud playlists:', error);
    } finally {
      setIsLoadingPlaylists(false);
    }
  };

  const formatDuration = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const generateEmbedCode = (url: string) => {
    const embedParams = new URLSearchParams({
      url: url,
      color: '#ff5500',
      auto_play: 'false',
      hide_related: 'true',
      show_comments: 'false',
      show_user: 'false',
      show_reposts: 'false',
      show_teaser: 'false',
      visual: 'false',
      show_artwork: 'false',
      buying: 'false',
      sharing: 'false',
      download: 'false'
    });

    return `https://w.soundcloud.com/player/?${embedParams.toString()}`;
  };

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
          <div className="mt-16 max-w-7xl mx-auto bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-light text-white mb-4 tracking-tight">
                Listen to the Glee
              </h3>
              <p className="text-lg text-blue-100 max-w-2xl mx-auto font-light">
                Experience our music collection
              </p>
            </div>
            
            {/* Show SoundCloud embeds from admin configuration */}
            {isLoadingEmbeds ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-blue-100 text-sm">Loading music...</p>
              </div>
            ) : soundCloudEmbeds.length > 0 ? (
              <div className="space-y-8">
                {/* Swipeable Carousel for Embeds */}
                <Carousel className="w-full max-w-6xl mx-auto" opts={{ dragFree: true, align: "center" }}>
                  <CarouselContent>
                    {soundCloudEmbeds.map((embed, index) => {
                      const currentPlaylist = soundCloudPlaylists[embed.id];
                      return (
                        <CarouselItem key={embed.id}>
                          <Card className="overflow-hidden bg-white/10 backdrop-blur-sm border-white/20">
                            <div className="p-6">
                              {/* Header with playlist image and info */}
                              <div className="flex items-start gap-6 mb-6">
                                {/* Playlist Image */}
                                <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32">
                                  <img
                                    src={`https://picsum.photos/200/200?random=${index}`}
                                    alt={embed.title}
                                    className="w-full h-full object-cover rounded-lg shadow-sm"
                                    onError={(e) => {
                                      e.currentTarget.src = `https://via.placeholder.com/200x200/f3f4f6/9ca3af?text=${encodeURIComponent(embed.title.slice(0, 2))}`;
                                    }}
                                  />
                                </div>
                                
                                {/* Playlist Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-2">
                                    <div>
                                      <h4 className="text-lg font-semibold text-white truncate">
                                        {embed.title}
                                      </h4>
                                      <p className="text-sm text-blue-100">
                                        by {embed.artist}
                                      </p>
                                      <p className="text-xs text-blue-200 mt-1">
                                        {embed.description}
                                      </p>
                                      {currentPlaylist && (
                                        <p className="text-xs text-blue-200 mt-1">
                                          {currentPlaylist.track_count} tracks
                                        </p>
                                      )}
                                    </div>
                                    
                                    <Button variant="outline" size="sm" asChild className="border-white/30 text-white hover:bg-white/20">
                                      <a href={embed.url} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="w-4 h-4" />
                                      </a>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              
                              {/* SoundCloud Player */}
                              <div className="rounded-lg overflow-hidden mb-6">
                                <iframe
                                  width="100%"
                                  height="166"
                                  scrolling="no"
                                  frameBorder="no"
                                  allow="autoplay"
                                  src={generateEmbedCode(embed.url)}
                                  className="w-full border-0"
                                  title={`SoundCloud: ${embed.title}`}
                                />
                              </div>

                              {/* Real Playlist Tracks */}
                              <div className="border-t border-white/20 pt-6">
                                {isLoadingPlaylists ? (
                                  <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-2"></div>
                                    <p className="text-sm text-blue-100">Loading playlist tracks...</p>
                                  </div>
                                ) : currentPlaylist && currentPlaylist.tracks.length > 0 ? (
                                  <>
                                    <h5 className="text-md font-medium text-white mb-4">
                                      {currentPlaylist.name} ({currentPlaylist.track_count} tracks)
                                    </h5>
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                      {currentPlaylist.tracks.map((track, trackIndex) => (
                                        <div 
                                          key={track.id}
                                          className="flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                                        >
                                          <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <span className="text-sm text-blue-200 w-6">
                                              {trackIndex + 1}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                              <p className="text-sm font-medium text-white truncate">
                                                {track.title}
                                              </p>
                                              <p className="text-xs text-blue-200">
                                                {track.plays.toLocaleString()} plays • {track.likes.toLocaleString()} likes
                                              </p>
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <span className="text-xs text-blue-200">
                                              {track.duration}
                                            </span>
                                            {track.permalink_url && (
                                              <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/20">
                                                <a href={track.permalink_url} target="_blank" rel="noopener noreferrer">
                                                  <ExternalLink className="w-3 h-3" />
                                                </a>
                                              </Button>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </>
                                ) : (
                                  <div className="text-center py-8">
                                    <Music className="w-8 h-8 text-blue-200 mx-auto mb-2" />
                                    <p className="text-sm text-blue-100">
                                      No playlist tracks available for this embed.
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Card>
                        </CarouselItem>
                      );
                    })}
                  </CarouselContent>
                  {/* Hide arrows on mobile, show on desktop */}
                  <CarouselPrevious className="hidden md:flex left-2 border-white/30 text-white hover:bg-white/20" />
                  <CarouselNext className="hidden md:flex right-2 border-white/30 text-white hover:bg-white/20" />
                </Carousel>

                {/* Mobile swipe instruction */}
                <div className="block md:hidden text-center">
                  <p className="text-xs text-blue-200">
                    Swipe left or right to browse music
                  </p>
                </div>

                {/* Playlist Navigation Dots */}
                {soundCloudEmbeds.length > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    {soundCloudEmbeds.map((_, index) => (
                      <div
                        key={index}
                        className="w-3 h-3 rounded-full bg-white/30"
                        aria-label={`Playlist ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 bg-white/10 backdrop-blur-sm rounded-lg">
                <Music className="w-12 h-12 text-blue-200 mx-auto mb-4" />
                <p className="text-blue-100 text-sm">
                  No music embeds configured yet.
                </p>
                <p className="text-blue-200 text-xs mt-2">
                  Admins can add SoundCloud embeds through the admin panel.
                </p>
              </div>
            )}
          </div>

          {/* YouTube Video Section */}
          <div className="mt-16 max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white mb-4 tracking-tight">
                Watch the Glee
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
                Performance videos and behind-the-scenes content
              </p>
            </div>
            
            <YouTubeVideoSection />
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
