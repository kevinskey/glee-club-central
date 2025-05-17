
import React from 'react';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { AnnouncementBanner } from '@/components/landing/AnnouncementBanner';
import { PerformanceSection } from '@/components/landing/performance/PerformanceSection';
import { TestimonialSection } from '@/components/landing/TestimonialSection';
import { CTASection } from '@/components/landing/CTASection';
import { MemberPortalBox } from '@/components/landing/MemberPortalBox';

const LandingPage = () => {
  return (
    <>
      <AnnouncementBanner 
        message="Welcome to the Spelman College Glee Club website" 
        link={{ text: "Learn more", url: "/about" }}
      />
      <HeroSection />
      <MemberPortalBox />
      <FeaturesSection />
      <PerformanceSection />
      <TestimonialSection />
      <CTASection />
    </>
  );
};

export default LandingPage;
