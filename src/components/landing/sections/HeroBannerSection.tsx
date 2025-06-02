
import React from "react";
import { UniversalHero } from "@/components/hero/UniversalHero";

export function HeroBannerSection() {
  return (
    <section className="w-full">
      <UniversalHero 
        sectionId="homepage-main"
        height="standard"
        showNavigation={false}
        showPlayPause={false}
        showCounter={true}
        showDots={false}
        enableAutoplay={true}
      />
    </section>
  );
}
