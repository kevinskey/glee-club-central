
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

interface VideoPlayerProps {
  videoId: string;
  title: string;
  description?: string;
}

export function VideoPlayer({ videoId, title, description }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  
  // Construct a proper YouTube embed URL with additional parameters
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&origin=${origin}&rel=0`;
  
  const handleIframeLoad = () => {
    setIsLoading(false);
  };
  
  const handleIframeError = () => {
    setIsLoading(false);
    setLoadError(true);
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="line-clamp-2 text-xl md:text-2xl">{title}</CardTitle>
        {description && <CardDescription className="mt-1 line-clamp-2">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative aspect-video w-full overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
              <Skeleton className="h-full w-full" />
            </div>
          )}
          
          {!loadError ? (
            <iframe
              src={youtubeEmbedUrl}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
            ></iframe>
          ) : (
            <div className="absolute inset-0 bg-muted/80 flex flex-col items-center justify-center p-6">
              <AlertCircle className="text-muted-foreground h-12 w-12 mb-4" />
              <p className="text-muted-foreground text-center">Video unavailable. Please try again later or view it directly on YouTube.</p>
              <a 
                href={`https://www.youtube.com/watch?v=${videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 text-primary hover:underline"
              >
                View on YouTube
              </a>
            </div>
          )}
        </div>
      </CardContent>
      {description && !loadError && (
        <CardFooter className="p-4 md:p-6">
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardFooter>
      )}
    </Card>
  );
}
