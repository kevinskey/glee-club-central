
import React from "react";
import { useHomePageData } from "@/hooks/useHomePageData";
import { HomePageLoader } from "@/components/landing/HomePageLoader";
import { HomePageContent } from "@/components/landing/HomePageContent";
import { PublicPageWrapper } from "@/components/landing/PublicPageWrapper";
import { CustomSlideRenderer } from "@/components/landing/CustomSlideRenderer";

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
    <PublicPageWrapper showTopSlider={true} className="home-page overflow-x-hidden">
      {/* Custom Slide Renderer - for other custom slides */}
      <CustomSlideRenderer />
      
      {/* Main Content */}
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
