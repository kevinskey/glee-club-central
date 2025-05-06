
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const navigate = useNavigate();
  
  return (
    <section className="relative bg-glee-dark py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 opacity-40 bg-blend-overlay bg-black">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: "url('/lovable-uploads/3ad02de0-04d1-4a5e-9279-898e9c317d80.png')", 
            filter: "blur(1px)"
          }}
        ></div>
      </div>
      <div className="container relative z-10 mx-auto md:grid-cols-1 items-center">
        <div className="text-white space-y-6 md:pr-6 max-w-2xl mx-auto text-center md:text-left md:mx-0">
          <h1 className="font-playfair tracking-tight">
            <span className="block text-3xl md:text-4xl lg:text-5xl font-bold">Spelman College</span>
            <span className="animate-gradient bg-clip-text text-transparent text-5xl md:text-6xl lg:text-7xl font-bold">
              Glee Club
            </span>
          </h1>
          <p className="text-lg md:text-xl leading-relaxed opacity-90">
            A distinguished ensemble with a rich heritage of musical excellence, directed by Dr. Kevin Phillip Johnson.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button 
              size="lg" 
              className="bg-glee-purple hover:bg-glee-purple/90 text-white"
              onClick={() => navigate("/login")}
            >
              Member Portal
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/20 bg-white/5 text-white hover:bg-white/10"
            >
              Performance Schedule
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
