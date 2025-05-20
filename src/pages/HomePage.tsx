
import React, { useEffect, useState } from 'react';
import { EnhancedHeroSection } from "@/components/landing/hero/EnhancedHeroSection";
import { ResponsiveSection } from "@/components/ui/responsive-section";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { TestimonialSection } from "@/components/landing/TestimonialSection";
import { CTASection } from "@/components/landing/CTASection";
import { MemberPortalBox } from "@/components/landing/MemberPortalBox";
import { HeroImageInitializer } from "@/components/landing/HeroImageInitializer";

const HomePage = () => {
  const [imagesInitialized, setImagesInitialized] = useState(false);
  
  const handleImagesInitialized = () => {
    setImagesInitialized(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero images initializer - will seed default images if none exist */}
      <HeroImageInitializer onInitialized={handleImagesInitialized} />
      
      <main className="flex-1">
        <EnhancedHeroSection />
        
        <ResponsiveSection className="py-12 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-center mb-6">Welcome to GleeWorld</h1>
          <p className="text-center text-lg max-w-2xl mx-auto">
            The central hub for Spelman College Glee Club
          </p>
        </ResponsiveSection>
        
        <FeaturesSection />
        <TestimonialSection />
        <CTASection />
        <MemberPortalBox />
      </main>
    </div>
  );
};

export default HomePage;
