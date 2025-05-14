
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export function HeroContent() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <div className={`text-white max-w-4xl mx-auto ${isMobile ? 'px-4 text-left' : 'text-center'}`}>
      <h1 className={`font-playfair ${isMobile ? 'text-3xl sm:text-4xl' : 'text-4xl md:text-5xl lg:text-6xl'} font-bold mb-4 tracking-tight text-white drop-shadow-md`}>
        Spelman College Glee Club
      </h1>
      
      <p className={`font-inter mb-8 ${isMobile ? 'text-base' : 'text-lg md:text-xl'} text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow`}>
        Welcome to the official website of the Spelman College Glee Club, 
        where musical excellence meets a century-long tradition of vocal artistry and performance.
      </p>
      
      <div className={`flex gap-4 ${isMobile ? 'flex-col sm:flex-row' : 'justify-center'}`}>
        <Button 
          size={isMobile ? "default" : "lg"} 
          onClick={() => navigate("/about")}
          className="bg-glee-spelman hover:bg-glee-spelman/90 text-white font-inter"
        >
          Our History
        </Button>
        
        <Button 
          size={isMobile ? "default" : "lg"} 
          variant="outline"
          onClick={() => navigate("/performances")}
          className="bg-white/10 text-white border-white hover:bg-white/20 font-inter"
        >
          Upcoming Performances
        </Button>
      </div>
    </div>
  );
}
