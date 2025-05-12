
import React, { useState } from 'react';
import { useYouTubeData } from '@/hooks/useYouTubeData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Skeleton } from '@/components/ui/skeleton';
import { PlayCircle, ExternalLink, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';

export function YouTubeSection() {
  const { videos, isLoading, error } = useYouTubeData();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
  // Don't render on mobile devices
  if (isMobile) {
    return null;
  }
  
  const handleVideoClick = (videoId: string) => {
    setSelectedVideo(videoId);
  };

  const handleCloseDialog = () => {
    setSelectedVideo(null);
  };

  if (error) {
    return (
      <section className="py-8 bg-glee-spelman/90">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-blue-100">Failed to load YouTube videos. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="youtube" 
      className="py-10 relative bg-glee-spelman text-white"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4)),
          repeating-linear-gradient(
            to right,
            #072a62 0px,
            #0b3c84 20px,
            #072a62 40px
          )
        `,
        boxShadow: 'inset 0 10px 30px -10px rgba(0,0,0,0.8), inset 0 -10px 30px -10px rgba(0,0,0,0.8)'
      }}
    >
      {/* Top curtain fold design */}
      <div 
        className="absolute top-0 left-0 w-full h-12"
        style={{
          background: 'linear-gradient(to bottom, #051d45 0%, transparent 100%)',
          borderBottom: '2px solid rgba(200,220,255,0.15)'
        }}
      ></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-blue-100">Featured Videos</h2>
            <p className="text-blue-200/80 mt-2">Watch performances from the Spelman College Glee Club</p>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              to="/videos" 
              className="flex items-center gap-1 text-blue-200 hover:text-blue-100 md:mr-4"
            >
              <span className="hidden md:inline">View all videos</span>
              <span className="inline md:hidden">All videos</span>
              <Youtube size={16} className="ml-1" />
            </Link>
            <a 
              href="https://www.youtube.com/@SpelmanCollegeGleeClub" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-blue-200 hover:text-blue-100"
            >
              <span className="hidden md:inline">Visit our channel</span>
              <span className="inline md:hidden">Channel</span>
              <ExternalLink size={16} className="ml-1" />
            </a>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden bg-black/20 border-blue-900/30">
                <AspectRatio ratio={16 / 9}>
                  <Skeleton className="h-full w-full bg-black/40" />
                </AspectRatio>
                <div className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2 bg-black/40" />
                  <Skeleton className="h-4 w-full bg-black/30" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
              <Card 
                key={video.id} 
                className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group bg-black/20 border-blue-900/30"
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
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <PlayCircle className="text-blue-200 w-12 h-12" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium line-clamp-2 mb-1 text-blue-100 group-hover:text-blue-200">{video.title}</h3>
                  <p className="text-sm text-blue-200/70">{new Date(video.publishedAt).toLocaleDateString()}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
        
        <div className="mt-8 text-center">
          <Link 
            to="/videos" 
            className="inline-flex items-center px-6 py-3 rounded-full bg-blue-800/40 hover:bg-blue-800/60 text-blue-100 transition-colors border border-blue-700/50"
          >
            <span>Browse our complete video collection</span>
            <Youtube size={18} className="ml-2" />
          </Link>
        </div>
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
