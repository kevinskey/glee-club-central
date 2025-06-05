
import React, { useEffect } from "react";
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
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Header />
      
      {/* Custom Slide Renderer - Reset all margins and position directly under header */}
      <div className="pt-20 md:pt-24">
        <div className="m-0 p-0">
          <CustomSlideRenderer />
        </div>
      </div>
      
      {/* Main Content - Reset top spacing */}
      <div className="m-0 p-0">
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
