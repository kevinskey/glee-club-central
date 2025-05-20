
import React from "react";
import { Icons } from "@/components/Icons";

export function HeroSeal() {
  return (
    <div className="absolute top-4 right-4 md:top-6 md:right-6 w-16 h-16 md:w-20 md:h-20 z-20 pointer-events-none">
      <div className="w-full h-full flex items-center justify-center">
        <Icons.logo className="w-full h-full object-contain drop-shadow-lg" />
      </div>
    </div>
  );
}
