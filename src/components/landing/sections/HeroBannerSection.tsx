
import React from "react";
import { UniversalHero } from "@/components/hero/UniversalHero";

export function HeroBannerSection() {
  return (
    <section className="w-full">
      <UniversalHero 
        sectionId="homepage-main"
        height="standard"
        showNavigation={true}
        showPlayPause={true}
        showCounter={true}
        showDots={true}
        enableAutoplay={true}
      />
    </section>
  );
}
