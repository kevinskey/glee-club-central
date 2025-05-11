
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export function HeroContent() {
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
    </div>
  );
}
