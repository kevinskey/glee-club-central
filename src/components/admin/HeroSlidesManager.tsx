
import React from "react";
import { SectionSpecificHeroManager } from "./SectionSpecificHeroManager";

interface HeroSlidesManagerProps {
  sectionId?: string;
  sectionName?: string;
  onUpdate?: () => void;
}

export function HeroSlidesManager({ 
  sectionId = "homepage-main", 
  sectionName = "Homepage Hero",
  onUpdate
}: HeroSlidesManagerProps) {
  return (
    <SectionSpecificHeroManager 
      sectionId={sectionId} 
      sectionName={sectionName}
      onUpdate={onUpdate}
    />
  );
}
