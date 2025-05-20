
import React, { useState, useEffect } from "react";
import { HeroContent } from "@/components/landing/hero/HeroContent";
import { HeroSeal } from "@/components/landing/hero/HeroSeal";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSiteImages } from "@/hooks/useSiteImages";
import { BackgroundSlideshow } from "@/components/landing/slideshow/BackgroundSlideshow";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export function EnhancedHeroSection() {
  // Get the hero images from our site images hook
  const { images, isLoading } = useSiteImages("hero");
  const isMobile = useIsMobile();
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // Prepare image URLs for slideshow
  useEffect(() => {
    if (images && images.length > 0) {
      setImageUrls(images.map(img => img.file_url));
    } else {
      // Fallback image if no images are available
      setImageUrls(["/lovable-uploads/c69d3562-4bdc-4e42-9415-aefdd5f573e8.png"]);
    }
  }, [images]);

  return (
    <section className="relative h-[70vh] md:h-[80vh] flex flex-col justify-center pb-6 md:pb-12 overflow-hidden">
      {/* Slideshow background */}
      {isLoading ? (
        <div className="absolute inset-0">
          <Skeleton className="h-full w-full" />
        </div>
      ) : (
        <BackgroundSlideshow 
          images={imageUrls} 
          overlayOpacity={0.7}
          duration={8000}
          transition={1200}
        />
      )}
      
      {/* Content overlay with Spelman Glee Club branding */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 flex flex-col justify-center h-full">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Spelman College Glee Club
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8">
            A distinguished ensemble with a rich heritage of musical excellence
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" asChild className="bg-indigo-500 hover:bg-indigo-600 text-white px-8">
              <Link to="/events">
                Upcoming Performances <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="bg-background/20 backdrop-blur border-white/40 text-white hover:bg-background/30">
              <Link to="/about">
                Our Story
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Seal/Logo */}
      <HeroSeal />
    </section>
  );
}
