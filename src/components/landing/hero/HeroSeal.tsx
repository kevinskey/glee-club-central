
import React from "react";
import { Icons } from "@/components/Icons";

export function HeroSeal() {
  return (
    <div className="absolute top-6 right-6 md:top-8 md:right-8 z-20 pointer-events-none">
      <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
        <img 
          src="/lovable-uploads/8aa13e63-fb9a-4c52-95cf-86b458c58f1c.png" 
          alt="Spelman College Glee Club" 
          className="w-full h-full object-contain drop-shadow-lg"
        />
      </div>
    </div>
  );
}
