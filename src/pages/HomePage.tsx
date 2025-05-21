
import React, { useEffect } from 'react';
import { EnhancedHeroSection } from "@/components/landing/hero/EnhancedHeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { TestimonialSection } from "@/components/landing/TestimonialSection";
import { CTASection } from "@/components/landing/CTASection";
import { MemberPortalBox } from "@/components/landing/MemberPortalBox";
import { ConcertsScroller } from "@/components/landing/concerts/ConcertsScroller";
import { updateHeroImageWithFeaturedMedia } from "@/utils/heroImageUtils";
import { GlobalMetronome } from "@/components/ui/global-metronome";

const HomePage = () => {
  // Sync hero images with featured media on initial load
  useEffect(() => {
    updateHeroImageWithFeaturedMedia().catch(err => 
      console.error("Error updating hero images:", err)
    );
  }, []);

  return (
    <div className="flex-1">
      <EnhancedHeroSection />
      <ConcertsScroller />
      <FeaturesSection />
      <TestimonialSection />
      <CTASection />
      <MemberPortalBox />
      <GlobalMetronome />
    </div>
  );
};

export default HomePage;
