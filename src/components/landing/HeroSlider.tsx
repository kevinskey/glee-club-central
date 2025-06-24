
import React from "react";
import { HeroSystem } from "@/components/hero/HeroSystem";

export function HeroSlider() {
  return (
    <HeroSystem 
      sectionId="homepage-main"
      autoAdvance={true}
      interval={7000}
    />
  );
}
