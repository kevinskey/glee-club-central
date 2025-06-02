
import React from "react";
import { SectionSpecificHeroManager } from "./SectionSpecificHeroManager";

interface HeroSlidesManagerProps {
  sectionId?: string;
  sectionName?: string;
}

export function HeroSlidesManager({ sectionId = "homepage-main", sectionName = "Homepage Hero" }: HeroSlidesManagerProps) {
  return (
    <SectionSpecificHeroManager 
      sectionId={sectionId} 
      sectionName={sectionName}
    />
  );
}
