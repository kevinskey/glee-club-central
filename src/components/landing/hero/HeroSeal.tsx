
import React from "react";

export function HeroSeal() {
  return (
    <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-10 hidden md:block">
      <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center shadow-lg opacity-80 hover:opacity-100 transition-opacity">
        <img 
          src="/lovable-uploads/8fa96710-a03a-4033-9ee0-032306d74daa.png" 
          alt="Spelman College Seal" 
          className="w-20 h-20 md:w-28 md:h-28 object-contain"
        />
      </div>
    </div>
  );
}
