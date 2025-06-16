
import React from 'react';
import { Button } from '@/components/ui/button';
import { UnifiedContainer } from '@/components/ui/unified-container';

export function HeroDefault() {
  return (
    <div className="w-full bg-background">
      <UnifiedContainer size="xl" padding="md">
        <section className="relative md:h-[60vh] md:min-h-[400px] flex items-center justify-center rounded-lg overflow-hidden">
          {/* Liquid Glass Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-royal-600 via-royal-500 to-powder-500 rounded-lg">
            <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
          </div>
          
          {/* Content with Liquid Glass Styling */}
          <div className="relative z-10 text-center text-white max-w-[90%] sm:max-w-4xl mx-auto px-10 py-8 md:py-0">
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-3 sm:mb-6 leading-tight text-shadow-glass">
              Spelman College Glee Club
            </h1>
            <p className="text-base sm:text-xl md:text-2xl mb-4 sm:mb-8 opacity-90 leading-relaxed text-shadow-glass">
              To Amaze and Inspire
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button 
                size="lg" 
                className="glass-button-primary text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4"
              >
                Learn More
              </Button>
              <Button 
                size="lg" 
                className="glass-button-secondary text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4"
              >
                Our Music
              </Button>
            </div>
          </div>
        </section>
      </UnifiedContainer>
    </div>
  );
}
