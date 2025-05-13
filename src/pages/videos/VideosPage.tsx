import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Video } from 'lucide-react';
import useVideoData from '@/hooks/useVideoData';
import VideoGrid from '@/components/videos/VideoGrid';

export default function VideosPage() {
  const { videos, loading, error } = useVideoData();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Videos"
        description="Watch our latest performances and events"
        icon={<Video className="h-6 w-6" />}
      />
      <VideoGrid videos={videos} loading={loading} error={error} />
    </div>
  );
}
