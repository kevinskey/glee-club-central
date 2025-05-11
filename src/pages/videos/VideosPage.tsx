
import React, { useEffect, useState } from 'react';
import { VideoGrid } from '@/components/videos/VideoGrid';
import { VideoFilters } from '@/components/videos/VideoFilters';
import { useVideoData } from '@/hooks/useVideoData';
import { PageHeader } from '@/components/ui/page-header';
import { Separator } from '@/components/ui/separator';
import { Video } from '@/types/video';

export default function VideosPage() {
  const { videos, isLoading, error } = useVideoData();
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  useEffect(() => {
    if (videos) {
      if (filterCategory === 'all') {
        setFilteredVideos(videos);
      } else {
        setFilteredVideos(videos.filter(video => video.category === filterCategory));
      }
    }
  }, [videos, filterCategory]);

  const handleCategoryChange = (category: string) => {
    setFilterCategory(category);
  };

  return (
    <div className="container px-4 py-6 mx-auto">
      <PageHeader
        title="Glee Club Videos"
        description="Watch our performances and rehearsals"
      />
      <Separator className="my-6" />
      
      <VideoFilters 
        selectedCategory={filterCategory} 
        onCategoryChange={handleCategoryChange} 
      />
      
      <div className="mt-6">
        <VideoGrid videos={filteredVideos} loading={isLoading} error={error} />
      </div>
    </div>
  );
}
