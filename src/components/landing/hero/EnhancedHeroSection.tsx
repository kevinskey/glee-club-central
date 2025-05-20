
import React, { useState, useEffect } from "react";
import { HeroContent } from "@/components/landing/hero/HeroContent";
import { HeroSeal } from "@/components/landing/hero/HeroSeal";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSiteImages } from "@/hooks/useSiteImages";
import { BackgroundSlideshow } from "@/components/landing/slideshow/BackgroundSlideshow";
import { Skeleton } from "@/components/ui/skeleton";

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
    <section className="relative h-[50vh] md:h-[60vh] flex flex-col justify-end pb-6 md:pb-12 overflow-hidden">
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
      <div className="relative z-10 container mx-auto transition-opacity duration-300 mt-auto px-4 md:px-6">
        <HeroContent />
      </div>
      
      {/* Seal/Logo */}
      <HeroSeal />
    </section>
  );
}
