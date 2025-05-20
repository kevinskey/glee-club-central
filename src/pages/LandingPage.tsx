
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
  const [imagesInitialized, setImagesInitialized] = useState(false);
  
  // Set up initialization tracking
  useEffect(() => {
    // Check if images were already initialized
    const alreadyInitialized = localStorage.getItem('heroImagesInitialized') === 'true';
    
    if (alreadyInitialized) {
      setImagesInitialized(true);
      
      // Short delay to ensure smooth transition
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 200);
      
      return () => clearTimeout(timer);
    }
    
    // Set up listener for image initialization complete
    const checkInitialization = setInterval(() => {
      if (localStorage.getItem('heroImagesInitialized') === 'true') {
        setImagesInitialized(true);
        clearInterval(checkInitialization);
        
        // Short delay to ensure smooth transition
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    }, 100);
    
    // Safety timeout - if images aren't initialized after 3 seconds, show the page anyway
    const safetyTimeout = setTimeout(() => {
      setIsLoading(false);
      clearInterval(checkInitialization);
    }, 3000);
    
    return () => {
      clearInterval(checkInitialization);
      clearTimeout(safetyTimeout);
    };
  }, []);
  
  return (
    <>
      {/* Initialize hero images in the background */}
      <HeroImageInitializer onInitialized={() => setImagesInitialized(true)} />
      
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
