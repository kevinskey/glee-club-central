
import React from "react";
import { HeroBanner } from "@/components/landing/HeroBanner";

interface HeroImage {
  id: string;
  url: string;
  title?: string;
  alt?: string;
}

interface HeroBannerSectionProps {
  images: HeroImage[];
}

export function HeroBannerSection({ images }: HeroBannerSectionProps) {
  return (
    <section className="w-full flex justify-center px-4 sm:px-0">
      <HeroBanner 
        images={images}
        autoPlayInterval={5000}
        showOverlayText={true}
      />
    </section>
  );
}
