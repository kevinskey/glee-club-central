
import React from "react";
import { HeroContent } from "@/components/landing/hero/HeroContent";
import { HeroSeal } from "@/components/landing/hero/HeroSeal";
import { useIsMobile } from "@/hooks/use-mobile";

export function EnhancedHeroSection() {
  // Use a single fixed background image for stability
  const heroImage = "/lovable-uploads/c69d3562-4bdc-4e42-9415-aefdd5f573e8.png";
  const isMobile = useIsMobile();

  return (
    <section className="relative h-[75vh] md:h-[95vh] flex flex-col justify-end pb-8 md:pb-24 overflow-hidden">
      {/* Fixed background instead of slideshow */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${heroImage}')` }}
      />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-55" />
      
      {/* Content overlay with Spelman Glee Club branding */}
      <div className="relative z-10 container mx-auto transition-opacity duration-300 mt-auto px-4 md:px-6">
        <HeroContent />
      </div>
      
      {/* Seal/Logo */}
      <HeroSeal />
    </section>
  );
}
