
import React from "react";
import { useHomePageData } from "@/hooks/useHomePageData";
import { HomePageLoader } from "@/components/landing/HomePageLoader";
import { HomePageContent } from "@/components/landing/HomePageContent";
import { Header } from "@/components/landing/Header";
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
    <div className="min-h-screen home-page overflow-x-hidden bg-background">
      <Header />
      
      {/* Custom Slide Renderer - Seamless positioning under header */}
      <div className="md:pt-[96px]">
        <CustomSlideRenderer />
      </div>
      
      {/* Main Content - Remove any top spacing on mobile */}
      <div className="md:mt-0">
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
