import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
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
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    loadYouTubeVideos();
  }, []);

  const loadYouTubeVideos = async () => {
    try {
      console.log('🎬 Loading video content...');
      const { data, error } = await supabase
        .from('youtube_videos')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error loading video content:', error);
        throw error;
      }
      
      console.log('🎬 Video content loaded:', data?.length || 0);
      setVideos(data || []);
    } catch (error) {
      console.error('Error loading video content:', error);
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([^"&?\/\s]{11})/,
      /(?:youtu\.be\/)([^"&?\/\s]{11})/,
      /(?:youtube\.com\/embed\/)([^"&?\/\s]{11})/,
      /(?:youtube\.com\/live\/)([^"&?\/\s]{11})/,
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
        const embedUrl = `https://www.youtube.com/embed/videoseries?list=${playlistId}&autoplay=0&rel=0&modestbranding=1&showinfo=0&controls=1&cc_load_policy=0&iv_load_policy=3&origin=${window.location.origin}`;
        console.log('🎬 Playlist embed URL created:', embedUrl);
        return embedUrl;
      }
    }
    
    const videoId = extractVideoId(url);
    if (videoId) {
      const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1&showinfo=0&controls=1&cc_load_policy=0&iv_load_policy=3&origin=${window.location.origin}`;
      console.log('🎬 Video embed URL created:', embedUrl);
      return embedUrl;
    }
    
    console.error('🎬 Could not create embed URL for:', url);
    return '';
  };

  const getThumbnailUrl = (url: string): string => {
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
        <p className="text-gray-600 dark:text-gray-400 text-sm">Loading video content...</p>
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
    <div className="space-y-6">
      {/* Single Video Display */}
      {videos.length === 1 ? (
        <div className="w-full max-w-4xl mx-auto">
          <Card className="overflow-hidden">
            <div className="p-6">
              {/* Video Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Badge variant={videos[0].content_type === 'playlist' ? 'default' : 'secondary'}>
                    {videos[0].content_type === 'playlist' ? (
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
                  <h3 className="text-xl font-semibold">{videos[0].title}</h3>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href={videos[0].youtube_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Watch Video
                  </a>
                </Button>
              </div>
              
              {videos[0].description && (
                <p className="text-gray-600 dark:text-gray-400 mb-4">{videos[0].description}</p>
              )}
              
              {/* Video Player */}
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                {getEmbedUrl(videos[0].youtube_url, videos[0].content_type) ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={getEmbedUrl(videos[0].youtube_url, videos[0].content_type)}
                    title={videos[0].title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Video className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm mb-2">Unable to load video</p>
                      <Button variant="outline" size="sm" asChild>
                        <a href={videos[0].youtube_url} target="_blank" rel="noopener noreferrer">
                          Watch Video
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      ) : (
        /* Multiple Videos Carousel - Navigation arrows removed */
        <div className="w-full max-w-6xl mx-auto">
          <Carousel 
            className="w-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {videos.map((video, index) => {
                const embedUrl = getEmbedUrl(video.youtube_url, video.content_type);
                
                return (
                  <CarouselItem key={video.id} className="pl-2 md:pl-4 basis-full">
                    <Card className="overflow-hidden h-full">
                      <div className="p-4 md:p-6">
                        {/* Video Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <Badge variant={video.content_type === 'playlist' ? 'default' : 'secondary'} className="flex-shrink-0">
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
                            <h3 className="text-lg md:text-xl font-semibold truncate">{video.title}</h3>
                          </div>
                          <Button variant="outline" size="sm" asChild className="flex-shrink-0 ml-2">
                            <a href={video.youtube_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        </div>
                        
                        {video.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                            {video.description}
                          </p>
                        )}
                        
                        {/* Video Player */}
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
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                              <div className="text-center p-4">
                                <Video className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500 text-sm mb-2">Unable to load video</p>
                                <Button variant="outline" size="sm" asChild>
                                  <a href={video.youtube_url} target="_blank" rel="noopener noreferrer">
                                    Watch Video
                                  </a>
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Video Counter */}
                        <div className="flex justify-center mt-4">
                          <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {index + 1} of {videos.length}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </div>
      )}
    </div>
  );
}
