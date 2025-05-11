
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export function HeroContent() {
  const isMobile = useIsMobile();
  
  return (
    <div className="text-white space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-5 md:pr-6 max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl text-left pl-4 sm:pl-6 md:pl-8 lg:pl-10">
      <h1 className="font-playfair tracking-tight">
        <span className="block text-xl sm:text-2xl md:text-[2.6rem] lg:text-[2.75rem] xl:text-[3.5rem] font-bold mb-0.5 sm:mb-1 md:mb-1.5">
          Spelman College
        </span>
        <span className="animate-gradient bg-clip-text text-transparent text-[2.2rem] sm:text-[3.3rem] md:text-[3.3rem] lg:text-[4.4rem] xl:text-[6rem] font-bold">
          Glee Club
        </span>
      </h1>
      <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-normal opacity-90 mt-1 sm:mt-2 md:mt-3">
        A distinguished ensemble with a rich heritage of musical excellence, directed by <span className="whitespace-nowrap">Dr. Kevin Phillip Johnson.</span>
      </p>
    </div>
  );
}
