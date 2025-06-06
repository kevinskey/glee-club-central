
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
    <PublicPageWrapper showTopSlider={false} className="home-page">
      {/* Hero Section - Full Width */}
      <HeroSection />
      
      {/* Main Content */}
      <HomePageContent />
    </PublicPageWrapper>
  );
};

export default HomePage;
