
import React from "react";
import { Music } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function TestimonialSection() {
  const isMobile = useIsMobile();
  
  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-glee-purple/5 dark:bg-glee-light">
      <div className="container px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl lg:max-w-4xl mx-auto text-center">
          <Music className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-glee-purple mx-auto mb-3 sm:mb-4 md:mb-5 opacity-70" />
          <blockquote className="text-base sm:text-lg md:text-xl lg:text-2xl font-playfair italic mb-4 sm:mb-6 md:mb-8 prose-spacing flex items-center justify-center min-h-[5rem] md:min-h-[6rem]">
            "The Spelman College Glee Club represents the pinnacle of collegiate choral excellence, with a century-long tradition of magnificent performances."
          </blockquote>
          <div className="text-sm sm:text-base md:text-lg font-medium text-gray-700 dark:text-gray-700 mt-5">
            — The New York Times
          </div>
        </div>
      </div>
    </section>
  );
}
