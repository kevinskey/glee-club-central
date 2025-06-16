
import React, { useEffect, useState } from "react";
import { UnifiedPublicHeader } from "@/components/landing/UnifiedPublicHeader";
import { Footer } from "@/components/landing/Footer";
import { OptimizedNewsTicker } from "@/components/landing/news/OptimizedNewsTicker";
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
    <div className="min-h-screen bg-background">
      {/* News ticker at the very top */}
      <OptimizedNewsTicker autoHide={false} />
      
      {/* Main content - no spacing around hero */}
      <main className="relative">
        {/* Dynamic Hero Section - Full Screen */}
        <DynamicHero />
        
        {/* Header positioned absolutely over the hero */}
        <div className="absolute top-0 left-0 right-0 z-50">
          <UnifiedPublicHeader />
        </div>
        
        {/* Rest of homepage content */}
        <div className="bg-black/95 backdrop-blur-sm">
          <HomePageContent
            heroImages={[]} // No hero images needed anymore
            upcomingEvents={upcomingEvents}
            storeProducts={storeProducts}
            audioTracks={audioTracks}
          />
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
