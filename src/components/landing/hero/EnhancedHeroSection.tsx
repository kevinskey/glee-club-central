
import React from "react";
import { BackgroundSlideshow } from "@/components/landing/slideshow/BackgroundSlideshow";
import { HeroContent } from "@/components/landing/hero/HeroContent";
import { HeroSeal } from "@/components/landing/hero/HeroSeal";
import { useSiteImages } from "@/hooks/useSiteImages";

export function EnhancedHeroSection() {
  // Default hero images that we'll always use if no custom ones are set
  const defaultHeroImages = [
    "/lovable-uploads/c69d3562-4bdc-4e42-9415-aefdd5f573e8.png",
    "/lovable-uploads/65c0e4fd-f960-4e32-a3cd-dc46f81be743.png",
    "/lovable-uploads/1536a1d1-51f6-4121-8f53-423d37672f2e.png",
    "/lovable-uploads/daf81087-d822-4f6c-9859-43580f9a3971.png",
    "/lovable-uploads/a1d9a510-4276-40df-bfb5-86a441d06e4f.png"
  ];
  
  // Fetch any custom hero images, but use default ones immediately
  const { images: customImages } = useSiteImages("hero");
  
  // Use custom images if available, otherwise use defaults
  const heroImageUrls = customImages && customImages.length > 0
    ? customImages.map(img => img.file_url)
    : defaultHeroImages;

  return (
    <section className="relative h-[75vh] md:h-[85vh] flex flex-col justify-end pb-8 md:pb-24 overflow-hidden">
      <BackgroundSlideshow 
        images={heroImageUrls} 
        overlayOpacity={0.55}
        duration={8000}
        transition={1200}
      />
      
      {/* Content overlay with Spelman Glee Club branding */}
      <div className="relative z-10 container mx-auto transition-opacity duration-300 mt-auto opacity-100">
        <HeroContent />
      </div>
      
      {/* Seal/Logo */}
      <HeroSeal />
    </section>
  );
}
