
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export function CTASection() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <section className="relative py-8 md:py-12 w-full bg-blue-500 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: "url('/lovable-uploads/3ad02de0-04d1-4a5e-9279-898e9c317d80.png')", 
          }}
        ></div>
        <div className="absolute inset-0 bg-black/90"></div>
      </div>
      <div className="max-w-full md:max-w-3xl lg:max-w-6xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h2 className="font-playfair text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 md:mb-4 tracking-tight">Join Our Digital Choir Community</h2>
          <p className="font-inter text-sm sm:text-base md:text-lg mb-6 sm:mb-7 md:mb-8 opacity-90 text-pretty leading-relaxed max-w-2xl mx-auto">
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
