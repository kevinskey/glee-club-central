
import React from "react";
import { Music } from "lucide-react";

export function TestimonialSection() {
  return (
    <section className="py-12 md:py-20 bg-glee-purple/5 dark:bg-glee-dark/50">
      <div className="container px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Music className="h-8 w-8 md:h-10 md:w-10 text-glee-purple mx-auto mb-4 md:mb-6 opacity-70" />
          <blockquote className="text-xl md:text-2xl lg:text-3xl font-playfair italic mb-6 md:mb-8">
            "The Spelman College Glee Club represents the pinnacle of collegiate choral excellence, with a century-long tradition of magnificent performances."
          </blockquote>
          <div className="text-base md:text-lg font-medium text-gray-700 dark:text-gray-300">
            — The New York Times
          </div>
        </div>
      </div>
    </section>
  );
}
