
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ExternalLink, Play, Video, List } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface YouTubeVideo {
  id: string;
  title: string;
  description?: string;
  youtube_url: string;
  thumbnail_url?: string;
  is_active: boolean;
  display_order: number;
  content_type?: 'video' | 'playlist';
  created_at: string;
}

export function YouTubeVideoSection() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadYouTubeVideos();
  }, []);

  const loadYouTubeVideos = async () => {
    try {
      console.log('🎬 Loading YouTube videos...');
      const { data, error } = await supabase
        .from('youtube_videos')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error loading YouTube content:', error);
        throw error;
      }
      
      console.log('🎬 YouTube videos loaded:', data?.length || 0);
      setVideos(data || []);
    } catch (error) {
      console.error('Error loading YouTube content:', error);
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const extractVideoId = (url: string): string | null => {
    // Enhanced YouTube URL parsing to handle more formats
    const patterns = [
      // Standard watch URLs
      /(?:youtube\.com\/watch\?v=)([^"&?\/\s]{11})/,
      // Short URLs
      /(?:youtu\.be\/)([^"&?\/\s]{11})/,
      // Embed URLs
      /(?:youtube\.com\/embed\/)([^"&?\/\s]{11})/,
      // Live URLs
      /(?:youtube\.com\/live\/)([^"&?\/\s]{11})/,
      // Watch URLs with additional parameters
      /(?:youtube\.com\/watch\?.*v=)([^"&?\/\s]{11})/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        console.log('🎬 Extracted video ID:', match[1], 'from URL:', url);
        return match[1];
      }
    }
    
    console.warn('🎬 Could not extract video ID from URL:', url);
    return null;
  };

  const extractPlaylistId = (url: string): string | null => {
    const patterns = [
      /[?&]list=([^"&?\/\s]+)/,
      /youtube\.com\/playlist\?list=([^"&?\/\s]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        console.log('🎬 Extracted playlist ID:', match[1], 'from URL:', url);
        return match[1];
      }
    }
    return null;
  };

  const getEmbedUrl = (url: string, contentType: 'video' | 'playlist' = 'video'): string => {
    console.log('🎬 Creating embed URL for:', url, 'type:', contentType);
    
    if (contentType === 'playlist') {
      const playlistId = extractPlaylistId(url);
      if (playlistId) {
        const embedUrl = `https://www.youtube.com/embed/videoseries?list=${playlistId}&autoplay=0&rel=0&modestbranding=1`;
        console.log('🎬 Playlist embed URL created:', embedUrl);
        return embedUrl;
      }
    }
    
    // For both 'video' content type and fallback for playlists without list parameter
    const videoId = extractVideoId(url);
    if (videoId) {
      const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`;
      console.log('🎬 Video embed URL created:', embedUrl);
      return embedUrl;
    }
    
    console.error('🎬 Could not create embed URL for:', url);
    return '';
  };

  const getThumbnailUrl = (url: string, contentType: 'video' | 'playlist' = 'video'): string => {
    const videoId = extractVideoId(url);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    return '';
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">Loading content...</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          No video content available yet.
        </p>
        <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
          Check back soon for performance videos and playlists.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Carousel className="w-full max-w-6xl mx-auto">
        <CarouselContent>
          {videos.map((video) => {
            const embedUrl = getEmbedUrl(video.youtube_url, video.content_type);
            
            return (
              <CarouselItem key={video.id}>
                <Card className="overflow-hidden">
                  <div className="p-6">
                    {/* Content Header */}
                    <div className="flex items-start gap-6 mb-6">
                      {/* Content Thumbnail */}
                      <div className="flex-shrink-0 w-32 h-24 md:w-40 md:h-30 relative">
                        <img
                          src={video.thumbnail_url || getThumbnailUrl(video.youtube_url, video.content_type)}
                          alt={video.title}
                          className="w-full h-full object-cover rounded-lg shadow-sm"
                          onError={(e) => {
                            e.currentTarget.src = `https://via.placeholder.com/320x240/f3f4f6/9ca3af?text=${video.content_type === 'playlist' ? 'Playlist' : 'Video'}`;
                          }}
                        />
                        <div className="absolute top-1 left-1">
                          <Badge variant={video.content_type === 'playlist' ? 'default' : 'secondary'} className="text-xs">
                            {video.content_type === 'playlist' ? (
                              <>
                                <List className="h-3 w-3 mr-1" />
                                Playlist
                              </>
                            ) : (
                              <>
                                <Video className="h-3 w-3 mr-1" />
                                Video
                              </>
                            )}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Content Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                              {video.title}
                            </h4>
                            {video.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                {video.description}
                              </p>
                            )}
                          </div>
                          
                          <Button variant="outline" size="sm" asChild>
                            <a href={video.youtube_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* YouTube Player/Playlist */}
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                      {embedUrl ? (
                        <iframe
                          width="100%"
                          height="100%"
                          src={embedUrl}
                          title={video.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="w-full h-full"
                          onLoad={() => console.log('🎬 Video iframe loaded successfully for:', video.title)}
                          onError={() => console.error('🎬 Video iframe failed to load for:', video.title)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                          <div className="text-center">
                            <Video className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm mb-2">Unable to load video</p>
                            <p className="text-gray-400 text-xs mb-3">
                              URL format not recognized: {video.youtube_url}
                            </p>
                            <Button variant="outline" size="sm" asChild>
                              <a href={video.youtube_url} target="_blank" rel="noopener noreferrer">
                                Watch on YouTube
                              </a>
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>

      {/* Content Navigation Dots */}
      {videos.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {videos.map((_, index) => (
            <div
              key={index}
              className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"
              aria-label={`Content ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
