
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { HeroContent } from "./hero/HeroContent";

export function Hero() {
  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-br from-glee-spelman to-glee-purple/80 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center space-y-6 text-center">
          <HeroContent />
          
          <div className="flex flex-wrap gap-4 mt-6">
            <Link to="/calendar">
              <Button size="lg" className="bg-white text-glee-purple hover:bg-white/90">
                <Calendar className="mr-2 h-4 w-4" /> View Events
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/20">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
