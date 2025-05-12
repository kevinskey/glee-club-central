
import React, { useState } from 'react';
import { useYouTubeData } from '@/hooks/useYouTubeData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Skeleton } from '@/components/ui/skeleton';
import { PlayCircle, ExternalLink } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';

export function YouTubeSection() {
  const { videos, isLoading, error } = useYouTubeData();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  
  const handleVideoClick = (videoId: string) => {
    setSelectedVideo(videoId);
  };

  const handleCloseDialog = () => {
    setSelectedVideo(null);
  };

  if (error) {
    return (
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-500">Failed to load YouTube videos. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="youtube" className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-glee-dark">Featured Videos</h2>
            <p className="text-gray-600 mt-2">Watch performances from the Spelman College Glee Club</p>
          </div>
          <a 
            href="https://www.youtube.com/@SpelmanCollegeGleeClub" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-glee-purple hover:text-glee-purple/80"
          >
            <span className="mr-1">Visit our channel</span>
            <ExternalLink size={16} />
          </a>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden">
                <AspectRatio ratio={16 / 9}>
                  <Skeleton className="h-full w-full" />
                </AspectRatio>
                <div className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
              <Card 
                key={video.id} 
                className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => handleVideoClick(video.id)}
              >
                <div className="relative">
                  <AspectRatio ratio={16 / 9}>
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <PlayCircle className="text-white w-12 h-12" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium line-clamp-2 mb-1 text-glee-dark group-hover:text-glee-purple">{video.title}</h3>
                  <p className="text-sm text-gray-500">{new Date(video.publishedAt).toLocaleDateString()}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={selectedVideo !== null} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>
              {selectedVideo && videos.find(v => v.id === selectedVideo)?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedVideo && videos.find(v => v.id === selectedVideo)?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="relative aspect-video w-full">
            {selectedVideo && (
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              ></iframe>
            )}
          </div>
          <div className="p-4 flex justify-end">
            <Button variant="outline" onClick={handleCloseDialog}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
