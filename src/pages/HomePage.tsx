
import React, { useEffect, useState } from "react";
import { PublicPageWrapper } from "@/components/landing/PublicPageWrapper";
import { HomePageContent } from "@/components/landing/HomePageContent";
import { HomePageLoader } from "@/components/landing/HomePageLoader";
import { DynamicHero } from "@/components/landing/DynamicHero";
import { useHomePageData } from "@/hooks/useHomePageData";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const { 
    upcomingEvents, 
    storeProducts, 
    audioTracks, 
    isLoading: dataLoading 
  } = useHomePageData();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Show loader while initial page is loading, but don't wait for data indefinitely
  if (isLoading) {
    return <HomePageLoader />;
  }

  return (
    <div className="relative min-h-screen">
      {/* Content */}
      <div className="relative z-10 min-h-screen">
        <PublicPageWrapper showTopSlider={true}>
          {/* Dynamic Hero Section */}
          <DynamicHero />
          
          {/* Rest of homepage content */}
          <div className="bg-white/95 backdrop-blur-sm">
            <HomePageContent
              heroImages={[]} // No hero images needed anymore
              upcomingEvents={upcomingEvents}
              storeProducts={storeProducts}
              audioTracks={audioTracks}
            />
          </div>
        </PublicPageWrapper>
      </div>
    </div>
  );
}
