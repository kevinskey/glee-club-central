
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface VideoPlayerProps {
  videoId: string;
  title: string;
  description?: string;
}

export function VideoPlayer({ videoId, title, description }: VideoPlayerProps) {
  // Construct a proper YouTube embed URL with additional parameters
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&origin=${window.location.origin}&rel=0`;
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="line-clamp-2 text-xl md:text-2xl">{title}</CardTitle>
        {description && <CardDescription className="mt-1 line-clamp-2">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative aspect-video w-full overflow-hidden">
          <iframe
            src={youtubeEmbedUrl}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          ></iframe>
        </div>
      </CardContent>
      {description && (
        <CardFooter className="p-4 md:p-6">
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardFooter>
      )}
    </Card>
  );
}
