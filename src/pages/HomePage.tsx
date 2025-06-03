
import React, { useEffect } from "react";
import { useHomePageData } from "@/hooks/useHomePageData";
import { HomePageLoader } from "@/components/landing/HomePageLoader";
import { HomePageContent } from "@/components/landing/HomePageContent";
import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { migrateHeroImages } from "@/utils/heroMigration";
import { deleteAllHeroSlides } from "@/utils/deleteAllHeroSlides";

const HomePage = () => {
  const {
    heroImages,
    upcomingEvents,
    storeProducts,
    audioTracks,
    isLoading
  } = useHomePageData();

  // Delete all hero slides on first load
  useEffect(() => {
    const runCleanup = async () => {
      try {
        await deleteAllHeroSlides();
        console.log('✅ All hero slides deleted');
      } catch (error) {
        console.error('❌ Failed to delete hero slides:', error);
      }
    };
    
    runCleanup();
  }, []);

  // Show loader while data is being fetched
  if (isLoading) {
    return <HomePageLoader />;
  }

  return (
    <div className="min-h-screen overflow-x-hidden m-0 p-0" style={{ backgroundColor: '#F9F9F9' }}>
      <Header />
      <HeroSection />
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
