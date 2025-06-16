
import React, { useEffect, useState } from "react";
import { PublicPageWrapper } from "@/components/landing/PublicPageWrapper";
import { HomePageContent } from "@/components/landing/HomePageContent";
import { HomePageLoader } from "@/components/landing/HomePageLoader";
import { DynamicHero } from "@/components/landing/DynamicHero";
import { useHomePageData } from "@/hooks/useHomePageData";
import { useAnalyticsTracking } from "@/hooks/useAnalyticsTracking";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const { 
    upcomingEvents, 
    storeProducts, 
    audioTracks, 
    isLoading: dataLoading 
  } = useHomePageData();
  
  const { trackFeatureUsage } = useAnalyticsTracking();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Track homepage feature usage
      trackFeatureUsage('homepage_loaded', {
        eventsCount: upcomingEvents.length,
        productsCount: storeProducts.length,
        tracksCount: audioTracks.length
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [upcomingEvents.length, storeProducts.length, audioTracks.length, trackFeatureUsage]);

  // Show loader while initial page is loading, but don't wait for data indefinitely
  if (isLoading) {
    return <HomePageLoader />;
  }

  return (
    <div className="relative">
      {/* Dynamic Hero Section - Full Screen */}
      <DynamicHero />
      
      {/* Content Wrapper */}
      <PublicPageWrapper showTopSlider={true}>
        {/* Rest of homepage content */}
        <div className="bg-black/95 backdrop-blur-sm">
          <HomePageContent
            heroImages={[]} // No hero images needed anymore
            upcomingEvents={upcomingEvents}
            storeProducts={storeProducts}
            audioTracks={audioTracks}
          />
        </div>
      </PublicPageWrapper>
    </div>
  );
}
