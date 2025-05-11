
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export function HeroContent() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <div className="text-white space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-5 md:pr-6 max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl mx-auto md:mx-4 lg:mx-8 xl:mx-12 text-center md:text-left">
      <h1 className="font-playfair tracking-tight">
        <span className="block text-lg sm:text-xl md:text-2xl lg:text-[2.5rem] xl:text-[3.2rem] font-bold mb-1 sm:mb-2 md:mb-3">
          Spelman College
        </span>
        <span className="animate-gradient bg-clip-text text-transparent text-2xl sm:text-3xl md:text-[3rem] lg:text-[4rem] xl:text-[5.5rem] font-bold">
          Glee Club
        </span>
      </h1>
      <p className="text-xs sm:text-sm md:text-base lg:text-lg leading-normal opacity-90 mt-1 sm:mt-2 md:mt-3">
        A distinguished ensemble with a rich heritage of musical excellence, directed by <span className="whitespace-nowrap">Dr. Kevin Phillip Johnson.</span>
      </p>
      <div className="pt-2 sm:pt-3 md:pt-4 flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center md:justify-start">
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "default"} 
          className="border-white/20 bg-white/5 text-white hover:bg-white/10 text-xs sm:text-sm py-1.5 sm:py-[0.6rem] px-3 sm:px-[1.1rem]"
          onClick={() => navigate("/fan-page")}
        >
          Guest Login
        </Button>
        <Button 
          size={isMobile ? "sm" : "default"} 
          className="bg-glee-purple hover:bg-glee-purple/90 text-white text-xs sm:text-sm py-1.5 sm:py-[0.6rem] px-3 sm:px-[1.1rem]"
          onClick={() => navigate("/login")}
        >
          Member Portal
        </Button>
      </div>
    </div>
  );
}
