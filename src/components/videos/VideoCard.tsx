
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Video } from "@/types/video";

interface VideoCardProps {
  video: Video;
  isSelected: boolean;
  onClick: () => void;
}

export function VideoCard({ video, isSelected, onClick }: VideoCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex cursor-pointer gap-2 overflow-hidden rounded-lg border p-2 transition-all hover:bg-accent",
        isSelected && "border-primary bg-accent/50"
      )}
    >
      <div className="relative aspect-video w-24 flex-shrink-0 rounded-md overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="line-clamp-2 text-sm font-medium">{video.title}</h4>
        <p className="mt-1 text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true })}
        </p>
        {video.category && (
          <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
            {video.category}
          </span>
        )}
      </div>
    </div>
  );
}
