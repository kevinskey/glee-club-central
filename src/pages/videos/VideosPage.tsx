
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { VideoPlayer } from "@/components/videos/VideoPlayer";
import { VideoGrid } from "@/components/videos/VideoGrid";
import { VideoListSkeleton } from "@/components/videos/VideoListSkeleton";
import { useVideoData } from "@/hooks/useVideoData";
import { VideoFilters } from "@/components/videos/VideoFilters";
import { Music2, Video } from "lucide-react";

export default function VideosPage() {
  const { videos, featuredVideo, isLoading, error } = useVideoData();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  // Set the featured video as the default selected video when data is loaded
  useEffect(() => {
    if (featuredVideo && !selectedVideo) {
      setSelectedVideo(featuredVideo.id);
    }
  }, [featuredVideo, selectedVideo]);

  // Filter videos based on selected category
  const filteredVideos = filterCategory
    ? videos.filter(video => video.category === filterCategory)
    : videos;

  const currentVideo = selectedVideo
    ? videos.find(video => video.id === selectedVideo) || featuredVideo
    : featuredVideo;

  // Get unique categories for filter
  const categories = [...new Set(videos.map(video => video.category))];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Glee Club Videos"
        description="Watch performances and recordings from the Spelman College Glee Club"
        icon={<Video className="h-6 w-6" />}
      />

      {isLoading ? (
        <VideoListSkeleton />
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          <p>Error loading videos. Please try again later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {currentVideo && (
              <VideoPlayer 
                videoId={currentVideo.id} 
                title={currentVideo.title} 
                description={currentVideo.description} 
              />
            )}
          </div>
          
          <div className="space-y-4 lg:col-span-1">
            <VideoFilters 
              categories={categories} 
              selectedCategory={filterCategory}
              onSelectCategory={setFilterCategory}
            />
            
            <VideoGrid 
              videos={filteredVideos}
              selectedVideoId={selectedVideo}
              onSelectVideo={setSelectedVideo}
            />
          </div>
        </div>
      )}
    </div>
  );
}
