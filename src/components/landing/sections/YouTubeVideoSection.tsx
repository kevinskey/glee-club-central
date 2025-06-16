
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ExternalLink, Play, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface YouTubeVideo {
  id: string;
  title: string;
  description?: string;
  youtube_url: string;
  thumbnail_url?: string;
  is_active: boolean;
  display_order: number;
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
      const { data, error } = await supabase
        .from('youtube_videos')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error loading YouTube videos:', error);
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const extractVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getEmbedUrl = (url: string): string => {
    const videoId = extractVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  };

  const getThumbnailUrl = (url: string): string => {
    const videoId = extractVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">Loading videos...</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          No videos available yet.
        </p>
        <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
          Check back soon for performance videos and behind-the-scenes content.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Carousel className="w-full max-w-6xl mx-auto">
        <CarouselContent>
          {videos.map((video, index) => (
            <CarouselItem key={video.id}>
              <Card className="overflow-hidden">
                <div className="p-6">
                  {/* Video Header */}
                  <div className="flex items-start gap-6 mb-6">
                    {/* Video Thumbnail */}
                    <div className="flex-shrink-0 w-32 h-24 md:w-40 md:h-30">
                      <img
                        src={video.thumbnail_url || getThumbnailUrl(video.youtube_url)}
                        alt={video.title}
                        className="w-full h-full object-cover rounded-lg shadow-sm"
                        onError={(e) => {
                          e.currentTarget.src = `https://via.placeholder.com/320x240/f3f4f6/9ca3af?text=Video`;
                        }}
                      />
                    </div>
                    
                    {/* Video Info */}
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
                  
                  {/* YouTube Player */}
                  <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <iframe
                      width="100%"
                      height="100%"
                      src={getEmbedUrl(video.youtube_url)}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>

      {/* Video Navigation Dots */}
      {videos.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {videos.map((_, index) => (
            <div
              key={index}
              className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"
              aria-label={`Video ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
