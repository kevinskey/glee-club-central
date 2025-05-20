
import React, { useState, useEffect } from "react";
import { BackgroundSlideshow } from "@/components/landing/BackgroundSlideshow";
import { HeroContent } from "@/components/landing/hero/HeroContent";
import { HeroSeal } from "@/components/landing/hero/HeroSeal";
import { useSiteImages } from "@/hooks/useSiteImages";
import { Spinner } from "@/components/ui/spinner";

export function EnhancedHeroSection() {
  const [isLoading, setIsLoading] = useState(true);
  const [imagesReady, setImagesReady] = useState(false);
  
  // Default hero images that we'll always use if no custom ones are set
  const defaultHeroImages = [
    "/lovable-uploads/c69d3562-4bdc-4e42-9415-aefdd5f573e8.png",
    "/lovable-uploads/65c0e4fd-f960-4e32-a3cd-dc46f81be743.png",
    "/lovable-uploads/1536a1d1-51f6-4121-8f53-423d37672f2e.png",
    "/lovable-uploads/daf81087-d822-4f6c-9859-43580f9a3971.png",
    "/lovable-uploads/a1d9a510-4276-40df-bfb5-86a441d06e4f.png"
  ];
  
  // Fetch any custom hero images, but use default ones immediately
  const { images, isLoading: imagesLoading } = useSiteImages("hero");
  
  // Preload images to avoid flashing
  useEffect(() => {
    const preloadImages = () => {
      const imagesToPreload = defaultHeroImages.concat(
        (images || []).map(img => img.file_url)
      );
      
      let loadedCount = 0;
      const totalImages = imagesToPreload.length;
      
      // Fast-track loading if images are already cached
      const preloadedTimer = setTimeout(() => {
        if (!imagesReady) {
          setImagesReady(true);
          setIsLoading(false);
        }
      }, 800);
      
      imagesToPreload.forEach(src => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          if (loadedCount >= Math.min(2, totalImages)) {
            setImagesReady(true);
            
            // Give a slight delay before hiding loading indicator for smooth transition
            const timer = setTimeout(() => {
              setIsLoading(false);
              clearTimeout(preloadedTimer);
            }, 100);
            
            return () => clearTimeout(timer);
          }
        };
        img.src = src;
      });
      
      return () => clearTimeout(preloadedTimer);
    };
    
    preloadImages();
  }, [images]);
  
  // Always use default images initially, then use custom ones if they exist and are loaded
  const heroImageUrls = (images && images.length > 0)
    ? images.map(img => img.file_url)
    : defaultHeroImages;

  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] flex flex-col justify-end pb-16 md:pb-24 overflow-hidden">
      <BackgroundSlideshow 
        images={heroImageUrls} 
        overlayOpacity={0.4} 
        duration={8000} // 8 seconds between transitions
        transition={1200} // 1.2 seconds for transition effect
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-background/50 backdrop-blur-sm transition-opacity duration-300">
          <Spinner size="lg" />
        </div>
      )}
      
      {/* Content overlay with Spelman Glee Club branding */}
      <div className={`relative z-10 container mx-auto transition-opacity duration-300 mt-auto ${imagesReady ? 'opacity-100' : 'opacity-0'}`}>
        <HeroContent />
      </div>
      
      {/* Seal/Logo */}
      <HeroSeal />
    </section>
  );
}
