
import React, { useEffect, useState } from "react";
import { UnifiedPublicHeader } from "@/components/landing/UnifiedPublicHeader";
import { Footer } from "@/components/landing/Footer";
import { HomePageContent } from "@/components/landing/HomePageContent";
import { HeroSlider } from "@/components/landing/HeroSlider";
import { HomePageLoader } from "@/components/landing/HomePageLoader";
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
    console.log('HomePage: Component mounted');
    const timer = setTimeout(() => {
      console.log('HomePage: Initial loading complete');
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
    console.log('HomePage: Showing loader');
    return <HomePageLoader />;
  }

  console.log('HomePage: Rendering main content');

  return (
    <div className="min-h-screen bg-background">
      {/* Header - will be sticky on its own */}
      <UnifiedPublicHeader />
      
      {/* Main content */}
      <main className="relative">
        <HeroSlider />
        {/* Rest of homepage content */}
        <div className="bg-background">
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
