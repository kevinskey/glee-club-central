
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
  
  // Set up initialization tracking - simplified approach
  useEffect(() => {
    // Check if images were already initialized
    const alreadyInitialized = localStorage.getItem('heroImagesInitialized') === 'true';
    
    if (alreadyInitialized) {
      // Short delay to ensure smooth transition
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 10);
      
      return () => clearTimeout(timer);
    }
    
    // Safety timeout - if images aren't initialized after 2 seconds, show the page anyway
    const safetyTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => {
      clearTimeout(safetyTimeout);
    };
  }, []);
  
  // Handle image initialization completion
  const handleImagesInitialized = () => {
    // Short delay to ensure smooth transition
    setTimeout(() => {
      setIsLoading(false);
    }, 10);
  };
  
  return (
    <>
      {/* Initialize hero images in the background */}
      <HeroImageInitializer onInitialized={handleImagesInitialized} />
      
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[600px] w-full">
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
