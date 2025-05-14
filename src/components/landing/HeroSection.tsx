
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
    "/lovable-uploads/4df78d4e-3a15-4e50-9326-6f47a48e2bab.png",
    "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=80"
  ]);
  
  // Fetch hero images from the database
  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const { data, error } = await supabase
          .from('site_images')
          .select('file_url')
          .eq('category', 'hero')
          .order('updated_at', { ascending: false });
        
        if (error) {
          console.error("Error fetching hero images:", error);
          return;
        }
        
        if (data && data.length > 0) {
          // Extract file URLs and add them to the beginning of our images array
          const heroImageUrls = data
            .map(item => item.file_url)
            .filter(url => url); // Filter out any null values
            
          // If we have hero images from the database, prioritize them
          if (heroImageUrls.length > 0) {
            setBackgroundImages(prevImages => {
              // Combine the hero images with the default ones, but limit to avoid too many
              const combinedImages = [...heroImageUrls, ...prevImages];
              return combinedImages.slice(0, 10); // Limit to 10 images to keep performance good
            });
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
          overlayOpacity={0.75} // Set black overlay to 75% opacity
        />
      </div>
      
      <div className="relative z-10 mx-auto px-4 sm:px-6 md:px-8 w-full flex items-center justify-start">
        <HeroContent />
      </div>

      <HeroSeal />
    </section>
  );
}
