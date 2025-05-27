
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Music, Users, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { HeroCalendarSync } from "./HeroCalendarSync";
import { BackgroundSlideshow } from "./BackgroundSlideshow";
import { useAuth } from "@/contexts/AuthContext";

export function HeroSection() {
  const { isAuthenticated } = useAuth();

  // Define hero images for the slideshow
  const heroImages = [
    "/lovable-uploads/92a39fc3-43b7-4240-982b-bff85ae2fdca.png",
    "/lovable-uploads/8aa13e63-fb9a-4c52-95cf-86b458c58f1c.png",
    "/lovable-uploads/65c0e4fd-f960-4e32-a3cd-dc46f81be743.png",
    "/lovable-uploads/daf81087-d822-4f6c-9859-43580f9a3971.png"
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <BackgroundSlideshow images={heroImages} />
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 z-10" />
      
      {/* Hero Content */}
      <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
            <Users className="w-12 h-12 md:w-16 md:h-16 text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          Spelman College
          <span className="block text-glee-spelman">Glee Club</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
          Experience the rich tradition of musical excellence with Atlanta's premier collegiate choir
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            size="lg" 
            className="bg-glee-spelman hover:bg-glee-spelman/90 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-2xl"
            asChild
          >
            <Link to="/events">
              <Calendar className="mr-2 h-5 w-5" />
              View Performances
            </Link>
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="border-2 border-white text-white hover:bg-white hover:text-glee-spelman px-8 py-4 text-lg font-semibold rounded-full backdrop-blur-sm"
            asChild
          >
            <Link to="/about">
              Learn Our Story
            </Link>
          </Button>

          {/* Dashboard Access for authenticated users */}
          {isAuthenticated && (
            <Button 
              size="lg" 
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-8 py-4 text-lg font-semibold rounded-full backdrop-blur-sm"
              asChild
            >
              <Link to="/role-dashboard">
                <Music className="mr-2 h-5 w-5" />
                My Dashboard
              </Link>
            </Button>
          )}
        </div>
        
        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <Music className="w-8 h-8 mx-auto mb-3 text-glee-spelman" />
            <h3 className="font-semibold text-lg mb-2">Musical Excellence</h3>
            <p className="text-white/80 text-sm">Award-winning performances and rich musical tradition</p>
          </div>
          
          <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <Users className="w-8 h-8 mx-auto mb-3 text-glee-spelman" />
            <h3 className="font-semibold text-lg mb-2">Sisterhood</h3>
            <p className="text-white/80 text-sm">Building lifelong bonds through music and friendship</p>
          </div>
          
          <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <Star className="w-8 h-8 mx-auto mb-3 text-glee-spelman" />
            <h3 className="font-semibold text-lg mb-2">Legacy</h3>
            <p className="text-white/80 text-sm">Over 90 years of inspiring audiences worldwide</p>
          </div>
        </div>
        
        {/* Calendar Sync Component */}
        <div className="mt-12">
          <HeroCalendarSync />
        </div>
      </div>
    </section>
  );
}
