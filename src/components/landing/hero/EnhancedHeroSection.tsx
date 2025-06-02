
import React, { useState, useEffect } from "react";
import { HeroContent } from "@/components/landing/hero/HeroContent";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { BackgroundSlideshow } from "@/components/landing/slideshow/BackgroundSlideshow";
import { useSiteImages } from "@/hooks/useSiteImages";
import { MobileOptimizedContainer } from "@/components/mobile/MobileOptimizedContainer";
import { cn } from "@/lib/utils";

export function EnhancedHeroSection() {
  const isMobile = useIsMobile();
  const { images, isLoading } = useSiteImages("hero");
  const [heroImage, setHeroImage] = useState<string | null>(null);

  useEffect(() => {
    if (images && images.length > 0) {
      // Use only the first image
      setHeroImage(images[0].file_url);
    }
  }, [images]);

  return (
    <section className="relative w-full overflow-hidden m-0 p-0" style={{ height: isMobile ? '40vh' : '60vh' }}>
      {/* Single Hero Image */}
      {heroImage ? (
        <BackgroundSlideshow 
          images={[heroImage]} 
          overlayOpacity={0.6} 
        />
      ) : (
        <div className="absolute inset-0 bg-black/60"></div>
      )}
      
      {/* Content overlay with Spelman Glee Club branding */}
      <div className="relative z-10 h-full flex items-center justify-center m-0 p-0">
        <div className="w-full text-center px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className={cn(
              "font-bold text-white mb-3 leading-tight",
              isMobile ? "text-xl sm:text-2xl" : "text-3xl md:text-4xl lg:text-5xl"
            )}>
              Spelman College Glee Club
            </h1>
            <p className={cn(
              "text-white/90 mb-4 max-w-2xl mx-auto",
              isMobile ? "text-sm sm:text-base" : "text-base md:text-lg lg:text-xl"
            )}>
              A distinguished ensemble with a rich heritage of musical excellence
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Button size={isMobile ? "default" : "lg"} asChild className="bg-indigo-500 hover:bg-indigo-600 text-white w-auto px-6">
                <Link to="/events">
                  Upcoming Performances <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
              <Button size={isMobile ? "default" : "lg"} variant="outline" asChild className="bg-background/20 backdrop-blur border-white/40 text-white hover:bg-background/30 w-auto px-6">
                <Link to="/press-kit">
                  Press Kit
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
