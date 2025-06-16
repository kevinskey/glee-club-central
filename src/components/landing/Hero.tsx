
import React from 'react';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative h-[37vh] min-h-[225px] md:h-[41vh] md:min-h-[260px] flex items-center justify-center bg-gradient-to-br from-primary to-orange-500">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6">
          Spelman College Glee Club
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl mb-8 opacity-90">
          To Amaze and Inspire
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-primary hover:bg-white/90">
            Learn More
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
            Our Music
          </Button>
        </div>
      </div>
    </section>
  );
}
