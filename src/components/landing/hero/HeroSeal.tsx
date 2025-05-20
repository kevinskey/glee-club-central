
import React from "react";

export function HeroSeal() {
  return (
    <div className="absolute top-4 right-4 md:top-6 md:right-6 w-16 h-16 md:w-24 md:h-24 z-20 opacity-70 pointer-events-none">
      {/* Seal/Logo image would go here */}
      <div className="w-full h-full rounded-full border-2 border-white/50 bg-black/20 backdrop-blur-sm flex items-center justify-center">
        <span className="sr-only">Spelman College Seal</span>
      </div>
    </div>
  );
}
