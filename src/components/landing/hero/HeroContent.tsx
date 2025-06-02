
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { MobileResponsiveText } from "@/components/mobile/MobileResponsiveText";
import { useIsMobile, useIsSmallMobile } from "@/hooks/use-mobile";

export function HeroContent() {
  const isMobile = useIsMobile();
  const isSmallMobile = useIsSmallMobile();
  
  return (
    <div className="text-center px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 sm:mb-6 relative">
          {isSmallMobile ? (
            // Extra small screens
            <MobileResponsiveText as="h1" size="3xl" weight="bold" className="text-white drop-shadow-xl">
              <span className="block mb-1">Spelman</span>
              <span className="block mb-1">College</span>
              <span className="block">Glee Club</span>
            </MobileResponsiveText>
          ) : isMobile ? (
            // Standard mobile
            <MobileResponsiveText as="h1" size="4xl" weight="bold" className="text-white drop-shadow-xl">
              <span className="block mb-2">Spelman College</span>
              <span className="block">Glee Club</span>
            </MobileResponsiveText>
          ) : (
            // Tablet and Desktop
            <MobileResponsiveText as="h1" size="5xl" weight="bold" className="text-white drop-shadow-xl">
              <span className="whitespace-nowrap">Spelman College Glee Club</span>
            </MobileResponsiveText>
          )}
        </div>
        
        <MobileResponsiveText 
          as="p" 
          size={isMobile ? "lg" : "xl"}
          className="text-white mb-6 md:mb-8 drop-shadow-lg max-w-2xl mx-auto"
        >
          A distinguished ensemble with a rich heritage of musical excellence
        </MobileResponsiveText>
        
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
          <Button
            asChild
            className="bg-glee-purple hover:bg-glee-purple/90 text-white mobile-button"
          >
            <Link to="/calendar">
              Upcoming Performances <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          
          <Button
            asChild
            variant="outline"
            className="bg-black/30 backdrop-blur-sm border-white text-white hover:bg-black/50 mobile-button"
          >
            <Link to="/about">
              Our Story
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
