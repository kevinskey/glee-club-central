
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
            <span className="block text-xl sm:text-2xl md:text-3xl lg:text-[3rem] xl:text-[3.8rem] font-bold mb-1 sm:mb-2">Spelman College</span>
            <span className="animate-gradient bg-clip-text text-transparent text-2xl sm:text-3xl md:text-[3rem] lg:text-[3.8rem] xl:text-[5.3rem] font-bold">
              Glee Club
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-[1.34rem] lg:text-[1.52rem] leading-relaxed opacity-90 mt-2 sm:mt-3 md:mt-4">
            A distinguished ensemble with a rich heritage of musical excellence, directed by Dr. Kevin Phillip Johnson.
          </p>
          <div className="pt-3 sm:pt-4 md:pt-5 lg:pt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
            <Button 
              size={isMobile ? "default" : "lg"} 
              className="bg-glee-purple hover:bg-glee-purple/90 text-white text-[1.13rem] py-[0.7rem] px-[1.3rem]"
              onClick={() => navigate("/login")}
            >
              Member Portal
            </Button>
            <Button 
              variant="outline" 
              size={isMobile ? "default" : "lg"} 
              className="border-white/20 bg-white/5 text-white hover:bg-white/10 text-[1.13rem] py-[0.7rem] px-[1.3rem]"
              onClick={() => navigate("/calendar")}
            >
              Performance Schedule
            </Button>
          </div>
        </div>
      </div>

      {/* Right side image - Smaller seal with more padding */}
      <div className="hidden md:block absolute bottom-6 right-8 md:bottom-8 md:right-10 lg:bottom-10 lg:right-12 xl:right-16 z-10 w-8 sm:w-10 md:w-12 lg:w-14 xl:w-16 animate-fade-in">
        <img 
          src="/lovable-uploads/9a044e72-80dc-40a6-b716-2d5c2d35b878.png" 
          alt="Spelman Glee Club 100 Crest" 
          className="w-full h-auto drop-shadow-lg"
        />
      </div>
    </section>
  );
}
