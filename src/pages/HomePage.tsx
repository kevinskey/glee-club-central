
import React from "react";
import { useHomePageData } from "@/hooks/useHomePageData";
import { HomePageLoader } from "@/components/landing/HomePageLoader";
import { HomePageContent } from "@/components/landing/HomePageContent";

const HomePage = () => {
  const {
    heroImages,
    upcomingEvents,
    storeProducts,
    audioTracks,
    isLoading
  } = useHomePageData();

  if (isLoading) {
    return <HomePageLoader />;
  }

  return (
    <HomePageContent
      heroImages={heroImages}
      upcomingEvents={upcomingEvents}
      storeProducts={storeProducts}
      audioTracks={audioTracks}
    />
  );
};

export default HomePage;
