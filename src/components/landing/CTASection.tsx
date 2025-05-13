
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export function CTASection() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <section className="relative py-8 sm:py-10 md:py-14 w-full bg-glee-dark text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: "url('/lovable-uploads/3ad02de0-04d1-4a5e-9279-898e9c317d80.png')", 
          }}
        ></div>
      </div>
      <div className="px-4 sm:px-6 md:container relative z-10">
        <div className="max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl xl:max-w-3xl mx-auto text-center">
          <h2 className="font-playfair text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 md:mb-4 tracking-tight">Join Our Digital Choir Community</h2>
          <p className="font-inter text-sm sm:text-base md:text-lg mb-6 sm:mb-7 md:mb-8 opacity-90 text-pretty leading-relaxed">
            Connect with the Spelman College Glee Club community and stay updated with our performances and events.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button 
              size={isMobile ? "default" : "lg"} 
              variant="outline"
              className="bg-white/10 text-white border-white hover:bg-white/20 w-full sm:w-auto font-inter"
              onClick={() => navigate("/fan-page")}
            >
              Guest Access
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
