
import React from "react";
import { VideoCard } from "./VideoCard";
import { Video } from "@/types/video";

interface VideoGridProps {
  videos: Video[];
  selectedVideoId: string | null;
  onSelectVideo: (id: string) => void;
}

export function VideoGrid({ videos, selectedVideoId, onSelectVideo }: VideoGridProps) {
  // If we don't have any videos, show a message
  if (!videos.length) {
    return (
      <div className="rounded-lg border border-muted bg-muted/20 p-6 text-center">
        <p className="text-muted-foreground">No videos found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 overflow-auto pr-2" style={{ maxHeight: "calc(100vh - 400px)" }}>
      <h3 className="font-medium">More Videos</h3>
      
      <div className="grid grid-cols-1 gap-4">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            isSelected={video.id === selectedVideoId}
            onClick={() => onSelectVideo(video.id)}
          />
        ))}
      </div>
    </div>
  );
}
