import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const images = [
  "/lovable-uploads/10bab1e7-0f4e-402f-ab65-feb4710b5eaf.png",
  "/lovable-uploads/1536a1d1-51f6-4121-8f53-423d37672f2e.png",
  "/lovable-uploads/312fd1a4-7f46-4000-8711-320383aa565a.png",
];

export function HeroSlider() {
  return (
    <div className="relative w-full h-[60vh] md:h-[80vh] lg:h-screen overflow-hidden">
      <Carousel className="h-full" opts={{ loop: true }} showArrows>
        <CarouselContent className="h-full">
          {images.map((src, idx) => (
            <CarouselItem key={idx} className="relative h-full">
              <img src={src} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white" />
        <CarouselNext className="right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white" />
      </Carousel>
    </div>
  );
}
