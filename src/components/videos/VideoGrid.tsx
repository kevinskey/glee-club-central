
import React from 'react';
import { Video } from '@/types/video';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Skeleton } from '@/components/ui/skeleton';

export interface VideoGridProps {
  videos: Video[];
  loading?: boolean;
  error?: Error | null;
}

export function VideoGrid({ videos, loading = false, error = null }: VideoGridProps) {
  // Show loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="relative">
              <AspectRatio ratio={16 / 9}>
                <Skeleton className="h-full w-full" />
              </AspectRatio>
            </div>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-2/3 mb-2" />
              <Skeleton className="h-3 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
        <p className="text-red-600">Error loading videos: {error.message}</p>
        <p className="text-sm text-red-500 mt-2">Please try again later.</p>
      </div>
    );
  }

  // Show empty state
  if (!videos || videos.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
        <p className="text-gray-600">No videos available.</p>
        <p className="text-sm text-gray-500 mt-2">Check back later for new content.</p>
      </div>
    );
  }

  // Show videos grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative">
            <AspectRatio ratio={16 / 9}>
              <img 
                src={video.thumbnail} 
                alt={video.title} 
                className="object-cover w-full h-full rounded-t-md"
              />
            </AspectRatio>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end">
              <div className="p-4 text-white w-full">
                <h3 className="font-medium truncate">{video.title}</h3>
              </div>
            </div>
          </div>
          <CardContent className="p-4">
            <h3 className="font-medium truncate">{video.title}</h3>
            {video.description && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{video.description}</p>
            )}
            <div className="mt-2 flex justify-between items-center">
              <span className="text-xs text-gray-400">
                {new Date(video.publishedAt).toLocaleDateString()}
              </span>
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
