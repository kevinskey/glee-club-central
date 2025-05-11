
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export function HeroContent() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <div className="text-white space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 md:pr-6 max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl mx-auto text-center md:text-left md:mx-0">
      <h1 className="font-playfair tracking-tight">
        <span className="block text-xl sm:text-2xl md:text-3xl lg:text-[3rem] xl:text-[3.8rem] font-bold mb-3 sm:mb-4 md:mb-5">
          Spelman College
        </span>
        <span className="animate-gradient bg-clip-text text-transparent text-3xl sm:text-4xl md:text-[3.5rem] lg:text-[4.5rem] xl:text-[6.5rem] font-bold">
          Glee Club
        </span>
      </h1>
      <p className="text-xs sm:text-sm md:text-[1.14rem] lg:text-[1.32rem] leading-normal opacity-90 mt-1 sm:mt-2 md:mt-3">
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
  );
}
