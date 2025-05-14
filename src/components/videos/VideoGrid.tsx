
import React from 'react';
import { Video } from '@/types/video';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { CalendarDays, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface VideoGridProps {
  videos: Video[];
  loading?: boolean;
  error?: Error | null;
  onVideoSelect?: (video: Video) => void;
}

export function VideoGrid({ videos, loading = false, error = null, onVideoSelect }: VideoGridProps) {
  const isMobile = useIsMobile();
  
  const handleVideoClick = (video: Video) => {
    if (onVideoSelect) {
      onVideoSelect(video);
    }
  };
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <AspectRatio ratio={16 / 9}>
              <Skeleton className="w-full h-full rounded-t-md" />
            </AspectRatio>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-[70%] mb-2" />
              <Skeleton className="h-4 w-[50%]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  if (!videos || videos.length === 0) {
    return <div>No videos found.</div>;
  }

  // Show unified video card design for both mobile and desktop
  return (
    <div className={`grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3`}>
      {videos.map((video) => (
        <Card 
          key={video.id} 
          className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => handleVideoClick(video)}
        >
          <div className="relative">
            <AspectRatio ratio={16 / 9}>
              <img 
                src={video.thumbnailUrl}
                alt={video.title} 
                className="object-cover w-full h-full rounded-t-md"
                loading="lazy"
              />
              {video.duration && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                  {video.duration}
                </div>
              )}
            </AspectRatio>
          </div>
          <CardContent className="p-4">
            <h3 className="font-medium truncate">{video.title}</h3>
            {video.description && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{video.description}</p>
            )}
            <div className="mt-2 flex justify-between items-center">
              <div className="flex items-center text-muted-foreground text-xs">
                <CalendarDays className="h-3 w-3 mr-1" />
                {formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true })}
              </div>
              {video.viewCount && (
                <div className="flex items-center text-muted-foreground text-xs">
                  <Eye className="h-3 w-3 mr-1" />
                  {video.viewCount} views
                </div>
              )}
              {video.category && (
                <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
                  {video.category}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default VideoGrid;
