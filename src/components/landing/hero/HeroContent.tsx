
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ResponsiveText } from "@/components/ui/responsive-text";
import { useIsMobile, useIsSmallMobile } from "@/hooks/use-mobile";

export function HeroContent() {
  const isMobile = useIsMobile();
  const isSmallMobile = useIsSmallMobile();
  
  return (
    <div className="max-w-4xl text-center mx-auto mb-6 md:mb-8">
      <div className="mb-4 sm:mb-6 relative">
        {isSmallMobile ? (
          // Extra small screens
          <h1 className="text-3xl font-bold text-white drop-shadow-xl">
            <span className="block mb-1">Spelman</span>
            <span className="block mb-1">College</span>
            <span className="block">Glee Club</span>
          </h1>
        ) : isMobile ? (
          // Standard mobile
          <h1 className="text-4xl font-bold text-white drop-shadow-xl">
            <span className="block mb-2">Spelman College</span>
            <span className="block">Glee Club</span>
          </h1>
        ) : (
          // Tablet and Desktop
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white drop-shadow-xl">
            <span className="whitespace-nowrap">Spelman College Glee Club</span>
          </h1>
        )}
      </div>
      
      <ResponsiveText 
        as="p" 
        size={isMobile ? "lg" : "xl"}
        className="text-white mb-6 md:mb-8 drop-shadow-lg max-w-2xl mx-auto px-4 sm:px-0"
      >
        A distinguished ensemble with a rich heritage of musical excellence
      </ResponsiveText>
      
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4 sm:px-0">
        <Button
          asChild
          className="bg-glee-purple hover:bg-glee-purple/90 text-white px-4 sm:px-6 py-3 sm:py-5 text-base md:text-lg h-auto"
        >
          <Link to="/calendar">
            Upcoming Performances <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
        
        <Button
          asChild
          variant="outline"
          className="bg-black/30 backdrop-blur-sm border-white text-white hover:bg-black/50 px-4 sm:px-6 py-3 sm:py-5 text-base md:text-lg h-auto"
        >
          <Link to="/about">
            Our Story
          </Link>
        </Button>
      </div>
    </div>
  );
}
