
import React, { useState } from 'react';
import { useYouTubeData } from '@/hooks/useYouTubeData';
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from '@/components/ui/spinner';
import { YouTubeVideo } from '@/types/youtube';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ExternalLink, Youtube } from 'lucide-react';

export default function YoutubeVideosPage() {
  const { videos, isLoading, error } = useYouTubeData();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [videoFilter, setVideoFilter] = useState<string>("all");
  
  // Simple filter function based on video title or description
  const filteredVideos = videos.filter(video => {
    if (videoFilter === "all") return true;
    
    const searchTerms = {
      "concerts": ["concert", "performance", "live", "showcase"],
      "rehearsals": ["rehearsal", "practice", "behind the scenes"],
      "tours": ["tour", "travel", "visiting", "guest"]
    };
    
    const terms = searchTerms[videoFilter as keyof typeof searchTerms] || [];
    const content = (video.title + " " + video.description).toLowerCase();
    
    return terms.some(term => content.includes(term));
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header initialShowNewsFeed={false} />
      
      <main className="flex-1 container px-4 py-8">
        <PageHeader
          title="Spelman College Glee Club Videos"
          description="Watch performances, rehearsals, and behind-the-scenes footage from the Spelman College Glee Club"
          icon={<Youtube className="h-6 w-6" />}
          className="mb-8"
        />
        
        <Tabs defaultValue="all" className="mb-8" onValueChange={setVideoFilter}>
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-3">
            <TabsTrigger value="all">All Videos</TabsTrigger>
            <TabsTrigger value="concerts">Concerts</TabsTrigger>
            <TabsTrigger value="rehearsals">Rehearsals</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {isLoading ? (
          <div className="flex justify-center my-12">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <p className="text-red-700 dark:text-red-300">Failed to load YouTube videos. Please try again later.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <VideoCard key={video.id} video={video} onClick={() => setSelectedVideo(video.id)} />
              ))}
            </div>
            
            {filteredVideos.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No videos found matching this category.</p>
              </div>
            )}
          </>
        )}
        
        <div className="mt-12 text-center">
          <a 
            href="https://www.youtube.com/@SpelmanCollegeGleeClub" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-glee-spelman hover:underline"
          >
            <span>Visit our official YouTube channel</span>
            <ExternalLink size={16} />
          </a>
        </div>
      </main>
      
      <Dialog open={selectedVideo !== null} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden">
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
          <div className="p-4">
            <Button variant="outline" onClick={() => setSelectedVideo(null)} className="ml-auto">Close</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
}

interface VideoCardProps {
  video: YouTubeVideo;
  onClick: () => void;
}

function VideoCard({ video, onClick }: VideoCardProps) {
  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group bg-card border-border"
      onClick={onClick}
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
          <div className="h-16 w-16 rounded-full bg-glee-spelman/80 flex items-center justify-center">
            <Youtube className="text-white w-8 h-8" />
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium line-clamp-2 mb-1 group-hover:text-glee-spelman">{video.title}</h3>
        <p className="text-sm text-muted-foreground">{new Date(video.publishedAt).toLocaleDateString()}</p>
      </div>
    </Card>
  );
}
