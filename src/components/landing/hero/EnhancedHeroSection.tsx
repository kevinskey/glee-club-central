
import React, { useState, useEffect } from "react";
import { HeroContent } from "@/components/landing/hero/HeroContent";
import { HeroSeal } from "@/components/landing/hero/HeroSeal";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { BackgroundSlideshow } from "@/components/landing/slideshow/BackgroundSlideshow";
import { useSiteImages } from "@/hooks/useSiteImages";

export function EnhancedHeroSection() {
  const isMobile = useIsMobile();
  const { images, isLoading } = useSiteImages("hero");
  const [slideImages, setSlideImages] = useState<string[]>([]);

  useEffect(() => {
    if (images && images.length > 0) {
      // Extract URLs from image objects
      const imageUrls = images.map(img => img.file_url);
      setSlideImages(imageUrls);
    }
  }, [images]);

  return (
    <section className="relative h-[70vh] md:h-[80vh] flex flex-col justify-center pb-6 md:pb-12 overflow-hidden">
      {/* Image Slideshow */}
      {slideImages.length > 0 ? (
        <BackgroundSlideshow 
          images={slideImages} 
          duration={7000} 
          transition={1500} 
          overlayOpacity={0.6} 
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-glee-purple to-glee-purple/80"></div>
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
              <Link to="/press-kit">
                Press Kit
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
