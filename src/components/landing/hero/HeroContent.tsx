
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroContent() {
  return (
    <div className="max-w-3xl text-center mx-auto">
      <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 md:mb-6 drop-shadow-xl">
        Spelman College<br />
        <span className="text-glee-purple bg-white/90 px-3 py-1 inline-block mt-2">
          Glee Club
        </span>
      </h1>
      
      <p className="text-lg md:text-xl text-white mb-8 drop-shadow-lg max-w-2xl mx-auto">
        Uplifting voices, inspiring audiences, and preserving the rich musical heritage 
        of the African diaspora since 1925.
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
