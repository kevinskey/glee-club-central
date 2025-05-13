
import React from "react";
import { Hero } from "./Hero";
import { HeroSeal } from "./hero/HeroSeal";

export function HeroSection() {
  return (
    <div className="relative w-full overflow-hidden">
      <Hero />
      <HeroSeal />
    </div>
  );
}
