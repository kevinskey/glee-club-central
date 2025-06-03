
import React, { useEffect } from "react";
import { useHomePageData } from "@/hooks/useHomePageData";
import { HomePageLoader } from "@/components/landing/HomePageLoader";
import { HomePageContent } from "@/components/landing/HomePageContent";
import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { TopSlider } from "@/components/landing/TopSlider";

const HomePage = () => {
  const {
    heroImages,
    upcomingEvents,
    storeProducts,
    audioTracks,
    isLoading
  } = useHomePageData();

  // Show loader while data is being fetched
  if (isLoading) {
    return <HomePageLoader />;
  }

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: '#F9F9F9' }}>
      <Header />
      
      {/* Top Slider - No spacing needed as it sits flush with header */}
      <TopSlider />
      
      {/* Hero Section - Small gap from slider */}
      <div className="mt-2 md:mt-4">
        <HeroSection />
      </div>
      
      {/* Main Content - Proper spacing from hero */}
      <div className="mt-8 md:mt-12 lg:mt-16">
        <HomePageContent
          heroImages={heroImages}
          upcomingEvents={upcomingEvents}
          storeProducts={storeProducts}
          audioTracks={audioTracks}
        />
      </div>
    </div>
  );
};

export default HomePage;
