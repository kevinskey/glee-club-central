
import React, { useEffect } from "react";
import { useHomePageData } from "@/hooks/useHomePageData";
import { HomePageLoader } from "@/components/landing/HomePageLoader";
import { HomePageContent } from "@/components/landing/HomePageContent";
import { Header } from "@/components/landing/Header";
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
    <div className="min-h-screen overflow-x-hidden bg-blue-50">
      <Header />
      
      {/* Top Slider - No spacing needed as it sits flush with header */}
      <TopSlider />
      
      {/* Main Content - Proper spacing from top slider */}
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
