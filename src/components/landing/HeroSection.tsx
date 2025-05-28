
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HeroImageWithEvents } from './HeroImageWithEvents';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-glee-purple/10 to-glee-spelman/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                <span className="text-glee-purple">Spelman College</span>
                <br />
                <span className="text-glee-spelman">Glee Club</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                A tradition of excellence in choral performance since 1881. 
                Experience the power of sisterhood through song.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/about">
                <Button size="lg" className="bg-glee-spelman hover:bg-glee-spelman/90 text-white px-8 py-4 text-lg">
                  Learn About Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="border-glee-purple text-glee-purple hover:bg-glee-purple hover:text-white px-8 py-4 text-lg">
                  <Music className="mr-2 h-5 w-5" />
                  Get Involved
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Right side - Hero image */}
          <div className="order-first lg:order-last">
            <HeroImageWithEvents />
          </div>
        </div>
      </div>
    </section>
  );
}
