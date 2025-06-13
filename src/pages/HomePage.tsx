
import React, { useEffect, useState } from "react";
import { PublicPageWrapper } from "@/components/landing/PublicPageWrapper";
import { HomePageContent } from "@/components/landing/HomePageContent";
import { HomePageLoader } from "@/components/landing/HomePageLoader";
import { Hero } from "@/components/landing/Hero";
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

  if (isLoading || dataLoading) {
    return <HomePageLoader />;
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/lovable-uploads/69a9fc5f-3edb-4cf9-bbb0-353dd208e064.png')`
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen">
        <PublicPageWrapper showTopSlider={true}>
          {/* New Hero Section */}
          <Hero />
          
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
