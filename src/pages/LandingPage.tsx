
import React from 'react';
import { HeroSection } from '@/components/landing/HeroSection';
import { PerformanceSection } from '@/components/landing/performance/PerformanceSection';
import { TestimonialSection } from '@/components/landing/TestimonialSection';
import { CTASection } from '@/components/landing/CTASection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { MemberPortalBox } from '@/components/landing/MemberPortalBox';

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <PerformanceSection />
      <FeaturesSection />
      {/* YouTube section removed */}
      <TestimonialSection />
      <CTASection />
      <MemberPortalBox />
    </>
  );
}
