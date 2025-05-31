
import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";

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
  // Fallback image if no images provided
  const fallbackImage = {
    id: "fallback",
    url: "/placeholder.svg",
    title: "Spelman College Glee Club",
    alt: "Glee Club Performance"
  };

  const displayImages = images.length > 0 ? images : [fallbackImage];

  return (
    <section className={`relative w-full ${className}`}>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {displayImages.map((image, index) => (
            <CarouselItem key={image.id || index}>
              <Card className="border-0 rounded-none">
                <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden">
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
                      <div className="text-center text-white px-4">
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-playfair font-bold mb-4">
                          {image.title}
                        </h1>
                        <p className="text-lg md:text-xl text-white/90 max-w-2xl">
                          Spelman College Glee Club
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {displayImages.length > 1 && (
          <>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </>
        )}
      </Carousel>
    </section>
  );
}
