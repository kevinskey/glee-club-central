
import React, { useState, useEffect } from "react";
import { BackgroundSlideshow } from "@/components/landing/slideshow/BackgroundSlideshow";
import { HeroContent } from "@/components/landing/hero/HeroContent";
import { HeroSeal } from "@/components/landing/hero/HeroSeal";
import { useSiteImages } from "@/hooks/useSiteImages";
import { Spinner } from "@/components/ui/spinner";

export function EnhancedHeroSection() {
  const [isLoading, setIsLoading] = useState(false); // Start with false to avoid double loading indicators
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
  const { images: customImages, isLoading: imagesLoading } = useSiteImages("hero");
  const [heroImageUrls, setHeroImageUrls] = useState<string[]>(defaultHeroImages);
  
  // Update hero images when custom ones are loaded
  useEffect(() => {
    if (customImages && customImages.length > 0) {
      const validImages = customImages
        .filter(img => img && img.file_url)
        .map(img => img.file_url);
      
      if (validImages.length > 0) {
        setHeroImageUrls(validImages);
      }
    }
  }, [customImages]);
  
  // Simplified image preloading to avoid excessive state changes
  useEffect(() => {
    let mounted = true;
    
    // Mark images as ready immediately if we have the default images
    setImagesReady(true);
    
    // Short timeout to hide the loading indicator
    setTimeout(() => {
      if (mounted) {
        setIsLoading(false);
      }
    }, 100);
    
    return () => {
      mounted = false;
    };
  }, [heroImageUrls]);

  return (
    <section className="relative h-[75vh] md:h-[85vh] flex flex-col justify-end pb-8 md:pb-24 overflow-hidden">
      <BackgroundSlideshow 
        images={heroImageUrls} 
        overlayOpacity={0.55}
        duration={8000} // 8 seconds between transitions
        transition={1200} // 1.2 seconds for transition effect
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-background/50 backdrop-blur-sm transition-opacity duration-300">
          <Spinner size="lg" />
        </div>
      )}
      
      {/* Content overlay with Spelman Glee Club branding */}
      <div className={`relative z-10 container mx-auto transition-opacity duration-300 mt-auto opacity-100`}>
        <HeroContent />
      </div>
      
      {/* Seal/Logo */}
      <HeroSeal />
    </section>
  );
}
