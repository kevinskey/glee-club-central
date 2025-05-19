
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroContent() {
  return (
    <div className="max-w-3xl text-center mx-auto">
      <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 md:mb-6 drop-shadow-xl">
        Spelman College
      </h1>
      <div className="mb-6">
        <span className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-glee-blue bg-white/90 px-3 py-1 inline-block">
          Glee Club
        </span>
      </div>
      
      <p className="text-lg md:text-xl text-white mb-8 drop-shadow-lg max-w-2xl mx-auto">
        A distinguished ensemble with a rich heritage of musical excellence, directed by Dr. Kevin Phillip Johnson.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          asChild
          className="bg-glee-purple hover:bg-glee-purple/90 text-white px-6 py-3 text-lg"
        >
          <Link to="/calendar">
            Upcoming Performances <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
        
        <Button
          asChild
          variant="outline"
          className="bg-black/30 backdrop-blur-sm border-white text-white hover:bg-black/50 px-6 py-3 text-lg"
        >
          <Link to="/about">
            Our Story
          </Link>
        </Button>
      </div>
    </div>
  );
}
