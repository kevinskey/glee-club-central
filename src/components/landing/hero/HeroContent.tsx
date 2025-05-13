
import React from "react";

export function HeroContent() {
  return (
    <div className="text-center max-w-3xl mx-auto">
      <h1 className="font-playfair tracking-tight mb-0">
        <span className="block text-xl sm:text-2xl md:text-[2.6rem] lg:text-[2.75rem] xl:text-[3.5rem] font-bold mb-1 sm:mb-2 md:mb-2 text-shadow-lg">
          Spelman College
        </span>
        <span className="animate-gradient bg-clip-text text-transparent text-[2.2rem] sm:text-[3.3rem] md:text-[3.3rem] lg:text-[4.4rem] xl:text-[6rem] font-bold letter-spacing-tight">
          Glee Club
        </span>
      </h1>
      
      <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed opacity-90 mt-5 mb-8 sm:mb-10 md:mb-12 lg:mb-16 max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl mx-auto font-inter">
        A distinguished ensemble with a rich heritage of musical excellence, directed by <span className="whitespace-nowrap">Dr. Kevin Phillip Johnson.</span>
      </p>
    </div>
  );
}
