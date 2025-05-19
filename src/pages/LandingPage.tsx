
import React, { useEffect } from 'react';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { AnnouncementBanner } from '@/components/landing/AnnouncementBanner';
import { PerformanceSection } from '@/components/landing/performance/PerformanceSection';
import { TestimonialSection } from '@/components/landing/TestimonialSection';
import { CTASection } from '@/components/landing/CTASection';
import { MemberPortalBox } from '@/components/landing/MemberPortalBox';
import { HeroImageInitializer } from '@/components/landing/HeroImageInitializer';
import { EventsSlider } from '@/components/landing/events/EventsSlider';

const LandingPage = () => {
  // Initialize hero images if needed
  useEffect(() => {
    // This will run only on the client side after mount
    const initImages = async () => {
      try {
        const { seedDefaultHeroImages } = await import('@/utils/siteImages');
        await seedDefaultHeroImages();
      } catch (error) {
        console.error("Failed to initialize hero images", error);
      }
    };
    
    initImages();
  }, []);

  return (
    <>
      <AnnouncementBanner 
        message="Welcome to the Spelman College Glee Club website" 
        link={{ text: "Learn more", url: "/about" }}
      />
      <HeroSection />
      <MemberPortalBox />
      <FeaturesSection />
      <EventsSlider />
      <PerformanceSection />
      <TestimonialSection />
      <CTASection />
    </>
  );
};

export default LandingPage;
