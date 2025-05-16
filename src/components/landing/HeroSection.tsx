
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-glee-spelman py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl">
          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Spelman College Glee Club
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl">
            A distinguished choral ensemble with a tradition of musical 
            excellence spanning nearly a century
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              asChild 
              variant="default" 
              className="bg-white text-glee-spelman hover:bg-white/90 text-base"
            >
              <Link to="/about">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              className="bg-transparent text-white border-white hover:bg-white/10 text-base"
            >
              <Link to="/fan">
                Fan Portal
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
