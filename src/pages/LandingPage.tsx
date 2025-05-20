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
    // Set up loading state
    const readyState = document.readyState;
    
    if (readyState === 'complete') {
      // If document is already loaded, wait a short time to ensure hero images initialize
      setTimeout(() => setIsLoading(false), 300);
    } else {
      // Otherwise wait for window load plus a short delay for hero images
      const handleLoad = () => {
        setTimeout(() => setIsLoading(false), 300);
      };
      
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
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
