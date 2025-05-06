
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
    <section className="relative bg-glee-dark py-6 sm:py-10 md:py-12 lg:py-14 xl:py-16 min-h-[385px] overflow-hidden">
      <div className="absolute inset-0 opacity-50 bg-blend-overlay bg-black">
        <BackgroundSlideshow 
          images={backgroundImages} 
          duration={10000} 
          transition={2000}
        />
      </div>
      <div className="container relative z-10 mx-auto px-4 sm:px-6 md:px-8 lg:px-12 items-center pt-3 sm:pt-4 md:pt-6 lg:pt-8">
        <div className="text-white space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 md:pr-6 max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl mx-auto text-center md:text-left md:mx-0">
          <h1 className="font-playfair tracking-tight">
            <span className="block text-xl sm:text-2xl md:text-3xl lg:text-[3rem] xl:text-[3.8rem] font-bold mb-1 sm:mb-2">Spelman College</span>
            <span className="animate-gradient bg-clip-text text-transparent text-3xl sm:text-4xl md:text-[3.5rem] lg:text-[4.5rem] xl:text-[6.5rem] font-bold">
              Glee Club
            </span>
          </h1>
          <p className="text-xs sm:text-sm md:text-[1.14rem] lg:text-[1.32rem] leading-relaxed opacity-90 mt-1 sm:mt-2 md:mt-3">
            A distinguished ensemble with a rich heritage of musical excellence, directed by <span className="whitespace-nowrap">Dr. Kevin Phillip Johnson.</span>
          </p>
          <div className="pt-2 sm:pt-3 md:pt-4 lg:pt-5 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
            <Button 
              variant="outline" 
              size={isMobile ? "sm" : "default"} 
              className="border-white/20 bg-white/5 text-white hover:bg-white/10 text-sm sm:text-base py-[0.6rem] px-[1.1rem]"
              onClick={() => navigate("/fan-page")}
            >
              Guest Login
            </Button>
            <Button 
              size={isMobile ? "sm" : "default"} 
              className="bg-glee-purple hover:bg-glee-purple/90 text-white text-sm sm:text-base py-[0.6rem] px-[1.1rem]"
              onClick={() => navigate("/login")}
            >
              Member Portal
            </Button>
          </div>
        </div>
      </div>

      {/* Right side image - Smaller seal with more padding */}
      <div className="hidden md:block absolute bottom-4 right-6 md:bottom-6 md:right-8 lg:bottom-8 lg:right-10 xl:right-12 z-10 w-8 sm:w-10 md:w-12 lg:w-14 xl:w-16 animate-fade-in">
        <img 
          src="/lovable-uploads/9a044e72-80dc-40a6-b716-2d5c2d35b878.png" 
          alt="Spelman Glee Club 100 Crest" 
          className="w-full h-auto drop-shadow-lg"
        />
      </div>
    </section>
  );
}
