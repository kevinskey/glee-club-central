
import React from 'react';
import { Button } from '@/components/ui/button';

export function HeroDefault() {
  return (
    <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center bg-gradient-to-br from-primary to-orange-500">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Spelman College Glee Club
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
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
