
import React from "react";
import { useHomePageData } from "@/hooks/useHomePageData";
import { HomePageLoader } from "@/components/landing/HomePageLoader";
import { HomePageContent } from "@/components/landing/HomePageContent";
import { EnhancedHeroSection } from "@/components/landing/hero/EnhancedHeroSection";

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
    <div className="min-h-screen overflow-x-hidden">
      {/* First Hero Section at the top */}
      <EnhancedHeroSection />
      
      {/* Add spacing after first hero section */}
      <div className="h-8 sm:h-12"></div>
      
      {/* Additional Hero Section */}
      <EnhancedHeroSection />
      
      <HomePageContent
        heroImages={heroImages}
        upcomingEvents={upcomingEvents}
        storeProducts={storeProducts}
        audioTracks={audioTracks}
      />
    </div>
  );
};

export default HomePage;
