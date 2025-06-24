
import React, { useEffect, useState } from "react";
import { Footer } from "@/components/landing/Footer";
import { HomePageContent } from "@/components/landing/HomePageContent";
import { HeroSystem } from "@/components/hero/HeroSystem";
import { HomePageLoader } from "@/components/landing/HomePageLoader";
import { useHomePageData } from "@/hooks/useHomePageData";
import { useAnalyticsTracking } from "@/hooks/useAnalyticsTracking";

export default function HomePage() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
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
      setIsInitialLoading(false);
      
      trackFeatureUsage('homepage_loaded', {
        eventsCount: upcomingEvents.length,
        productsCount: storeProducts.length,
        tracksCount: audioTracks.length
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [upcomingEvents.length, storeProducts.length, audioTracks.length, trackFeatureUsage]);

  if (isInitialLoading) {
    console.log('HomePage: Showing loader');
    return <HomePageLoader />;
  }

  console.log('HomePage: Rendering main content');

  return (
    <div className="min-h-screen bg-background">
      <main className="relative">
        <HeroSystem 
          sectionId="homepage-main"
          autoAdvance={true}
          interval={7000}
        />
        
        <div className="bg-background">
          <HomePageContent
            heroImages={[]}
            upcomingEvents={upcomingEvents}
            storeProducts={storeProducts}
            audioTracks={audioTracks}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
