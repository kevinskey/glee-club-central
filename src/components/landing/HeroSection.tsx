
import React, { useState, useEffect } from "react";
import { BackgroundSlideshow } from "./BackgroundSlideshow";
import { HeroContent } from "./hero/HeroContent";
import { HeroSeal } from "./hero/HeroSeal";
import { supabase } from "@/integrations/supabase/client";

export function HeroSection() {
  // Initialize state for dynamic background images
  const [backgroundImages, setBackgroundImages] = useState<string[]>([
    "/lovable-uploads/a2e734d0-cb83-4b32-be93-9f3f0da03fc4.png",
    "/lovable-uploads/e06ff100-0add-4adc-834f-50ef81098d35.png",
    "/lovable-uploads/8aa13e63-fb9a-4c52-95cf-86b458c58f1c.png",
    "/lovable-uploads/10bab1e7-0f4e-402f-ab65-feb4710b5eaf.png",
    "/lovable-uploads/642b93d7-fc15-4c2c-a7df-fe81aadb2f3b.png",
    "/lovable-uploads/4df78d4e-3a15-4e50-9326-6f47a48e2bab.png"
  ]);
  
  // Fetch hero images from the database
  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const { data, error } = await supabase
          .from('site_images')
          .select('file_url')
          .eq('category', 'hero')
          .order('position', { ascending: true });
        
        if (error) {
          console.error("Error fetching hero images:", error);
          return;
        }
        
        if (data && data.length > 0) {
          // Extract file URLs
          const heroImageUrls = data
            .map(item => item.file_url)
            .filter(url => url); // Filter out any null values
            
          // If we have hero images from the database, use them
          if (heroImageUrls.length > 0) {
            setBackgroundImages(heroImageUrls);
          }
        }
      } catch (error) {
        console.error("Error in fetchHeroImages:", error);
      }
    };
    
    fetchHeroImages();
  }, []);
  
  return (
    <section className="relative bg-glee-dark py-4 sm:py-5 md:py-8 lg:py-12 xl:py-20 min-h-[320px] sm:min-h-[360px] md:min-h-[440px] lg:min-h-[520px] xl:min-h-[600px] w-full overflow-hidden flex items-center justify-start">
      <div className="absolute inset-0 z-[1]">
        <BackgroundSlideshow 
          images={backgroundImages} 
          duration={10000} 
          transition={2000}
          overlayOpacity={0.5}
        />
      </div>
      
      <div className="relative z-10 mx-auto px-4 sm:px-6 md:px-8 w-full flex items-center justify-start">
        <HeroContent />
      </div>

      <HeroSeal />
    </section>
  );
}
