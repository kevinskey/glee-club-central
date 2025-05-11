
import React, { useState, useEffect } from "react";
import { BackgroundSlideshow } from "./BackgroundSlideshow";
import { HeroContent } from "./hero/HeroContent";
import { HeroSeal } from "./hero/HeroSeal";
import { fetchFlickrPhotos } from "@/utils/mediaUtils";
import { toast } from "sonner";

export function HeroSection() {
  const [flickrImages, setFlickrImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Default/fallback background images
  const defaultBackgroundImages = [
    "/lovable-uploads/a2e734d0-cb83-4b32-be93-9f3f0da03fc4.png",
    "/lovable-uploads/e06ff100-0add-4adc-834f-50ef81098d35.png",
    "/lovable-uploads/8aa13e63-fb9a-4c52-95cf-86b458c58f1c.png",
    "/lovable-uploads/10bab1e7-0f4e-402f-ab65-feb4710b5eaf.png",
    "/lovable-uploads/642b93d7-fc15-4c2c-a7df-fe81aadb2f3b.png"
  ];
  
  useEffect(() => {
    const loadFlickrPhotos = async () => {
      try {
        // Fetch photos from Flickr
        const photos = await fetchFlickrPhotos('129581018@N02', 10);
        
        if (photos && photos.length > 0) {
          // Extract image URLs from the Flickr response
          const imageUrls = photos.map(photo => photo.imageUrl);
          setFlickrImages(imageUrls);
        } else {
          // If no photos fetched, use default images
          console.log("No Flickr photos found, using default images");
        }
      } catch (error) {
        console.error("Error fetching Flickr photos:", error);
        toast("Could not load Flickr photos", {
          description: "Using default hero images instead."
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadFlickrPhotos();
  }, []);
  
  // Use Flickr images if available, otherwise fall back to default images
  const backgroundImages = flickrImages.length > 0 ? flickrImages : defaultBackgroundImages;
  
  return (
    <section className="relative bg-glee-dark py-6 sm:py-10 md:py-16 lg:py-24 xl:py-32 min-h-[385px] md:min-h-[500px] lg:min-h-[600px] xl:min-h-[700px] overflow-hidden">
      <div className="absolute inset-0 opacity-50 bg-blend-overlay bg-black">
        <BackgroundSlideshow 
          images={backgroundImages} 
          duration={10000} 
          transition={2000}
        />
      </div>
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 md:px-8 lg:px-12 h-full flex items-center pt-3 sm:pt-4 md:pt-6 lg:pt-8">
        <HeroContent />
      </div>

      <HeroSeal />
    </section>
  );
}
