
import React from "react";
import { BackgroundSlideshow } from "./BackgroundSlideshow";
import { HeroContent } from "./hero/HeroContent";
import { HeroSeal } from "./hero/HeroSeal";

export function HeroSection() {
  // Static background images only (no Flickr)
  const backgroundImages = [
    "/lovable-uploads/a2e734d0-cb83-4b32-be93-9f3f0da03fc4.png",
    "/lovable-uploads/e06ff100-0add-4adc-834f-50ef81098d35.png",
    "/lovable-uploads/8aa13e63-fb9a-4c52-95cf-86b458c58f1c.png",
    "/lovable-uploads/10bab1e7-0f4e-402f-ab65-feb4710b5eaf.png",
    "/lovable-uploads/642b93d7-fc15-4c2c-a7df-fe81aadb2f3b.png",
    // Add new images here
    "/lovable-uploads/4df78d4e-3a15-4e50-9326-6f47a48e2bab.png", // Spelman College Glee Club Syracuse Jazz Festival image
    "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=80"
  ];
  
  return (
    <section className="relative bg-glee-dark py-4 sm:py-6 md:py-10 lg:py-16 xl:py-24 min-h-[300px] sm:min-h-[385px] md:min-h-[500px] lg:min-h-[600px] xl:min-h-[700px] w-full overflow-hidden flex items-center justify-start">
      <div className="absolute inset-0 opacity-50 bg-blend-overlay bg-black">
        <BackgroundSlideshow 
          images={backgroundImages} 
          duration={10000} 
          transition={2000}
        />
      </div>
      
      <div className="relative z-10 mx-auto px-6 md:container h-full flex items-center justify-start w-full">
        <HeroContent />
      </div>

      <HeroSeal />
    </section>
  );
}
