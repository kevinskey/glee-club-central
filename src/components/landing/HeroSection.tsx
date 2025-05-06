
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BackgroundSlideshow } from "./BackgroundSlideshow";
import { useIsMobile } from "@/hooks/use-mobile";

export function HeroSection() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const backgroundImages = [
    "/lovable-uploads/a2e734d0-cb83-4b32-be93-9f3f0da03fc4.png",
    "/lovable-uploads/e06ff100-0add-4adc-834f-50ef81098d35.png",
    "/lovable-uploads/8aa13e63-fb9a-4c52-95cf-86b458c58f1c.png",
    "/lovable-uploads/10bab1e7-0f4e-402f-ab65-feb4710b5eaf.png",
    "/lovable-uploads/642b93d7-fc15-4c2c-a7df-fe81aadb2f3b.png"
  ];
  
  return (
    <section className="relative bg-glee-dark py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 min-h-[400px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[600px] xl:min-h-[650px] overflow-hidden">
      <div className="absolute inset-0 opacity-50 bg-blend-overlay bg-black">
        <BackgroundSlideshow 
          images={backgroundImages} 
          duration={10000} 
          transition={2000}
        />
      </div>
      <div className="container relative z-10 mx-auto px-4 sm:px-6 md:px-8 lg:px-12 items-center">
        <div className="text-white space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8 md:pr-6 max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl mx-auto text-center md:text-left md:mx-0">
          <h1 className="font-playfair tracking-tight">
            <span className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-1 sm:mb-2">Spelman College</span>
            <span className="animate-gradient bg-clip-text text-transparent text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-bold">
              Glee Club
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed opacity-90 mt-2 sm:mt-3 md:mt-4">
            A distinguished ensemble with a rich heritage of musical excellence, directed by Dr. Kevin Phillip Johnson.
          </p>
          <div className="pt-3 sm:pt-4 md:pt-5 lg:pt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
            <Button 
              size={isMobile ? "default" : "lg"} 
              className="bg-glee-purple hover:bg-glee-purple/90 text-white"
              onClick={() => navigate("/login")}
            >
              Member Portal
            </Button>
            <Button 
              variant="outline" 
              size={isMobile ? "default" : "lg"} 
              className="border-white/20 bg-white/5 text-white hover:bg-white/10"
              onClick={() => navigate("/calendar")}
            >
              Performance Schedule
            </Button>
          </div>
        </div>
      </div>

      {/* Right side image - Restored Glee100 image */}
      <div className="hidden md:block absolute bottom-4 right-4 md:bottom-6 md:right-6 lg:bottom-8 lg:right-8 xl:right-12 z-10 w-10 sm:w-12 md:w-16 lg:w-20 xl:w-28 animate-fade-in">
        <img 
          src="/lovable-uploads/9a044e72-80dc-40a6-b716-2d5c2d35b878.png" 
          alt="Spelman Glee Club 100 Crest" 
          className="w-full h-auto drop-shadow-lg"
        />
      </div>
    </section>
  );
}
