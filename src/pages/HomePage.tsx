
import React, { useEffect } from "react";
import { useHomePageData } from "@/hooks/useHomePageData";
import { HomePageLoader } from "@/components/landing/HomePageLoader";
import { HomePageContent } from "@/components/landing/HomePageContent";
import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { migrateHeroImages } from "@/utils/heroMigration";

const HomePage = () => {
  const {
    heroImages,
    upcomingEvents,
    storeProducts,
    audioTracks,
    isLoading
  } = useHomePageData();

  // Run hero migration on first load
  useEffect(() => {
    const runMigration = async () => {
      const result = await migrateHeroImages();
      if (result.success && result.migrated > 0) {
        console.log(`✅ Migrated ${result.migrated} hero images to new system`);
      }
    };
    
    runMigration();
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
