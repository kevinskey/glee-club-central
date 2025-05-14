
import React from 'react';
import { HeroSection } from '@/components/landing/HeroSection';
import { PerformanceSection } from '@/components/landing/performance/PerformanceSection';
import { TestimonialSection } from '@/components/landing/TestimonialSection';
import { CTASection } from '@/components/landing/CTASection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { MemberPortalBox } from '@/components/landing/MemberPortalBox';
import { HeroCalendarSync } from '@/components/landing/HeroCalendarSync';

export default function LandingPage() {
  return (
    <>
      {/* This component ensures hero images sync with calendar events */}
      <HeroCalendarSync />
      
      <HeroSection />
      <PerformanceSection />
      <FeaturesSection />
      <TestimonialSection />
      <CTASection />
      <MemberPortalBox />
    </>
  );
}
