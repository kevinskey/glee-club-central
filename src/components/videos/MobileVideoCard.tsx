
import React from 'react';
import { Video } from '@/types/video';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface MobileVideoCardProps {
  video: Video;
  onClick: (video: Video) => void;
}

export function MobileVideoCard({ video, onClick }: MobileVideoCardProps) {
  const handleClick = () => {
    onClick(video);
  };
  
  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow border-border"
      onClick={handleClick}
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
      <CardContent className="p-3">
        <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
        <div className="flex items-center mt-2 text-muted-foreground text-xs gap-3">
          <div className="flex items-center">
            <CalendarDays className="h-3 w-3 mr-1" />
            {formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true })}
          </div>
          {video.views && (
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {video.views} views
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
