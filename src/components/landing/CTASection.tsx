
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function CTASection() {
  const navigate = useNavigate();
  
  return (
    <section className="relative py-16 bg-glee-dark text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: "url('/lovable-uploads/3ad02de0-04d1-4a5e-9279-898e9c317d80.png')", 
          }}
        ></div>
      </div>
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-playfair font-bold mb-6">Join Our Digital Choir Community</h2>
          <p className="text-lg mb-8 opacity-90">
            Access sheet music, submit recordings, check schedules, and connect with fellow members.
          </p>
          <Button 
            size="lg" 
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
