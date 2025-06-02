
import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { MobileOptimizedContainer } from "@/components/mobile/MobileOptimizedContainer";
import { MobileResponsiveText } from "@/components/mobile/MobileResponsiveText";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface HeroImage {
  id: string;
  url: string;
  title?: string;
  alt?: string;
}

interface HeroBannerProps {
  images: HeroImage[];
  autoPlayInterval?: number;
  showOverlayText?: boolean;
  className?: string;
}

export function HeroBanner({
  images = [],
  autoPlayInterval = 5000,
  showOverlayText = true,
  className = ""
}: HeroBannerProps) {
  const isMobile = useIsMobile();
  
  // Fallback image if no images provided
  const fallbackImage = {
    id: "fallback",
    url: "/placeholder.svg",
    title: "Spelman College Glee Club",
    alt: "Glee Club Performance"
  };

  const displayImages = images.length > 0 ? images : [fallbackImage];

  return (
    <section className={`relative w-full max-w-[90vw] mx-auto overflow-hidden ${className}`}>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {displayImages.map((image, index) => (
            <CarouselItem key={image.id || index} className="pl-0">
              <Card className="border-0 rounded-none">
                <div className={cn(
                  "relative overflow-hidden w-full",
                  isMobile ? "aspect-[4/3] max-h-[40vh]" : "aspect-[16/9] md:aspect-[21/9] max-h-[60vh]"
                )}>
                  <img
                    src={image.url}
                    alt={image.alt || image.title || "Hero image"}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40" />
                  
                  {/* Text Overlay */}
                  {showOverlayText && image.title && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <MobileOptimizedContainer padding="sm" className="text-center text-white w-full">
                        <MobileResponsiveText 
                          as="h1" 
                          size={isMobile ? "2xl" : "3xl"} 
                          weight="bold" 
                          className="mb-2"
                        >
                          {image.title}
                        </MobileResponsiveText>
                        <MobileResponsiveText 
                          as="p" 
                          size={isMobile ? "sm" : "lg"} 
                          className="text-white/90 max-w-2xl mx-auto"
                        >
                          Spelman College Glee Club
                        </MobileResponsiveText>
                      </MobileOptimizedContainer>
                    </div>
                  )}
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {displayImages.length > 1 && !isMobile && (
          <>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </>
        )}
      </Carousel>
    </section>
  );
}
