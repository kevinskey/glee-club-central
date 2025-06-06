
import React from "react";
import { useHomePageData } from "@/hooks/useHomePageData";
import { HomePageLoader } from "@/components/landing/HomePageLoader";
import { HomePageContent } from "@/components/landing/HomePageContent";
import { PublicPageWrapper } from "@/components/landing/PublicPageWrapper";
import { HeroSection } from "@/components/landing/HeroSection";

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
    <PublicPageWrapper showTopSlider={false} className="home-page overflow-x-hidden">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Main Content - Starting with events */}
      <HomePageContent
        heroImages={heroImages}
        upcomingEvents={upcomingEvents}
        storeProducts={storeProducts}
        audioTracks={audioTracks}
      />
    </PublicPageWrapper>
  );
};

export default HomePage;
