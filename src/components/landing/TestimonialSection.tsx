
import React from "react";
import { Music } from "lucide-react";

export function TestimonialSection() {
  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-glee-purple/5 dark:bg-glee-dark/50">
      <div className="container px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl lg:max-w-4xl mx-auto text-center">
          <Music className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-glee-purple mx-auto mb-3 sm:mb-4 md:mb-5 opacity-70" />
          <blockquote className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-playfair italic mb-4 sm:mb-5 md:mb-6">
            "The Spelman College Glee Club represents the pinnacle of collegiate choral excellence, with a century-long tradition of magnificent performances."
          </blockquote>
          <div className="text-sm sm:text-base md:text-lg font-medium text-gray-700 dark:text-gray-300">
            — The New York Times
          </div>
        </div>
      </div>
    </section>
  );
}
