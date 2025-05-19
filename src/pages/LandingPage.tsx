
import React, { useEffect, useState } from 'react';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { AnnouncementBanner } from '@/components/landing/AnnouncementBanner';
import { PerformanceSection } from '@/components/landing/performance/PerformanceSection';
import { TestimonialSection } from '@/components/landing/TestimonialSection';
import { CTASection } from '@/components/landing/CTASection';
import { MemberPortalBox } from '@/components/landing/MemberPortalBox';
import { HeroImageInitializer } from '@/components/landing/HeroImageInitializer';
import { EventsSlider } from '@/components/landing/events/EventsSlider';
import { Spinner } from "@/components/ui/spinner";

const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Add a small delay to ensure hero images are loaded
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <>
      {/* Initialize hero images */}
      <HeroImageInitializer />
      
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[600px]">
          <Spinner size="lg" />
        </div>
      ) : (
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
      )}
    </>
  );
};

export default LandingPage;
