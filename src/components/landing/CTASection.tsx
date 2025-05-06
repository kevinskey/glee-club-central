
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export function CTASection() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <section className="relative py-12 md:py-16 bg-glee-dark text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: "url('/lovable-uploads/3ad02de0-04d1-4a5e-9279-898e9c317d80.png')", 
          }}
        ></div>
      </div>
      <div className="container px-4 md:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-playfair font-bold mb-4 md:mb-6">Join Our Digital Choir Community</h2>
          <p className="text-base md:text-lg mb-6 md:mb-8 opacity-90">
            Access sheet music, submit recordings, check schedules, and connect with fellow members.
          </p>
          <Button 
            size={isMobile ? "default" : "lg"} 
            className="bg-white text-glee-purple hover:bg-white/90"
            onClick={() => navigate("/login")}
          >
            Member Login
          </Button>
        </div>
      </div>
    </section>
  );
}
