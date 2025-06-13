
import React from 'react';
import { Button } from '@/components/ui/button';

export function HeroDefault() {
  return (
    <section className="relative h-[60vh] sm:h-[70vh] min-h-[400px] sm:min-h-[500px] flex items-center justify-center bg-gradient-to-br from-primary to-orange-500">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 text-center text-white max-w-[90%] sm:max-w-4xl mx-auto px-2 sm:px-4">
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-3 sm:mb-6 leading-tight">
          Spelman College Glee Club
        </h1>
        <p className="text-sm sm:text-xl md:text-2xl mb-4 sm:mb-8 opacity-90 leading-relaxed">
          To Amaze and Inspire
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Button 
            size="default" 
            className="bg-white text-primary hover:bg-white/90 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
          >
            Learn More
          </Button>
          <Button 
            size="default" 
            variant="outline" 
            className="border-white text-white hover:bg-white/10 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
          >
            Our Music
          </Button>
        </div>
      </div>
    </section>
  );
}
