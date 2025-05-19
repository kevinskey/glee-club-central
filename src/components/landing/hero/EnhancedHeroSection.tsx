
import React from "react";
import { BackgroundSlideshow } from "@/components/landing/BackgroundSlideshow";
import { HeroContent } from "@/components/landing/hero/HeroContent";
import { HeroSeal } from "@/components/landing/hero/HeroSeal";
import { useSiteImages } from "@/hooks/useSiteImages";

export function EnhancedHeroSection() {
  // Default hero images that we'll always use if no custom ones are set
  const defaultHeroImages = [
    "/lovable-uploads/92a39fc3-43b7-4240-982b-bff85ae2fdca.png",
    "/lovable-uploads/eaea8db1-e2e0-4022-b6ce-a5ece2f64448.png",
    "/lovable-uploads/1536a1d1-51f6-4121-8f53-423d37672f2e.png",
    "/lovable-uploads/daf81087-d822-4f6c-9859-43580f9a3971.png",
    "/lovable-uploads/a1d9a510-4276-40df-bfb5-86a441d06e4f.png"
  ];
  
  // Fetch any custom hero images, but don't wait for them
  const { images } = useSiteImages("hero");
  
  // Always use default images initially, then use custom ones if they exist and are loaded
  const heroImageUrls = (images && images.length > 0)
    ? images.map(img => img.file_url)
    : defaultHeroImages;

  return (
    <section className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[700px] flex items-center justify-center overflow-hidden">
      <BackgroundSlideshow 
        images={heroImageUrls} 
        overlayOpacity={0.5} 
        duration={8000} // 8 seconds between transitions
        transition={1500} // 1.5 seconds for the transition effect
      />
      
      {/* Content overlay with Spelman Glee Club branding */}
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        <HeroContent />
      </div>
      
      {/* Seal/Logo */}
      <HeroSeal />
    </section>
  );
}
