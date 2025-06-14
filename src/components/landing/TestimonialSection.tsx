
import React from "react";
import { Music } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function TestimonialSection() {
  const isMobile = useIsMobile();
  
  return (
    <section className="py-8 md:py-12 bg-glee-columbia/5 dark:bg-glee-columbia/10">
      <div className="max-w-full md:max-w-3xl lg:max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center">
          <Music className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-glee-columbia mx-auto mb-4 sm:mb-5 md:mb-6 opacity-70" />
          <blockquote className="font-playfair text-xl sm:text-2xl md:text-3xl lg:text-3xl italic mb-8 sm:mb-10 md:mb-12 leading-relaxed flex items-center justify-center min-h-[5rem] md:min-h-[6rem] text-pretty">
            "The Spelman College Glee Club represents the pinnacle of collegiate choral excellence, with a century-long tradition of magnificent performances."
          </blockquote>
          <div className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-700 mt-6 font-inter">
            — The New York Times
          </div>
        </div>
      </div>
    </section>
  );
}
