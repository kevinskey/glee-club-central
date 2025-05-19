
import React, { useState, useEffect } from "react";
import { BackgroundSlideshow } from "@/components/landing/BackgroundSlideshow";
import { HeroContent } from "@/components/landing/hero/HeroContent";
import { HeroSeal } from "@/components/landing/hero/HeroSeal";
import { useSiteImages } from "@/hooks/useSiteImages";
import { Spinner } from "@/components/ui/spinner";

export function EnhancedHeroSection() {
  const [isLoading, setIsLoading] = useState(true);
  
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
  
  useEffect(() => {
    // Set loading state based on image loading
    if (imagesLoading) {
      setIsLoading(true);
    } else {
      // Give a slight delay before hiding loading indicator to ensure smooth transition
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [imagesLoading]);
  
  // Always use default images initially, then use custom ones if they exist and are loaded
  const heroImageUrls = (images && images.length > 0)
    ? images.map(img => img.file_url)
    : defaultHeroImages;

  return (
    <section className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[700px] flex items-center justify-center overflow-hidden">
      <BackgroundSlideshow 
        images={heroImageUrls} 
        overlayOpacity={0.45} 
        duration={8000} // 8 seconds between transitions
        transition={1500} // 1.5 seconds for the transition effect
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-background/50 backdrop-blur-sm">
          <Spinner size="lg" />
        </div>
      )}
      
      {/* Content overlay with Spelman Glee Club branding */}
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        <HeroContent />
      </div>
      
      {/* Seal/Logo */}
      <HeroSeal />
    </section>
  );
}
