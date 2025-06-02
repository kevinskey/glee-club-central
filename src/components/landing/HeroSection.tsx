
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ModernHeroSection } from '@/components/landing/hero/ModernHeroSection';

export function HeroSection() {
  return (
    <section className="relative">
      <ModernHeroSection />
      
      {/* Action Buttons Overlay */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10">
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/about">
            <Button size="lg" className="bg-glee-columbia hover:bg-glee-columbia/90 text-white px-8 py-4 text-lg">
              Learn About Us
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-glee-columbia px-8 py-4 text-lg backdrop-blur-sm">
              <Music className="mr-2 h-5 w-5" />
              Get Involved
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
