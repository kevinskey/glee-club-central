
import React from "react";
import { useHomePageData } from "@/hooks/useHomePageData";
import { HomePageLoader } from "@/components/landing/HomePageLoader";
import { PublicPageWrapper } from "@/components/landing/PublicPageWrapper";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { EventsSection } from "@/components/landing/sections/EventsSection";
import { StoreSection } from "@/components/landing/sections/StoreSection";
import { TestimonialSection } from "@/components/landing/TestimonialSection";
import { CTASection } from "@/components/landing/CTASection";

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
      
      {/* Main Content Sections */}
      <div className="space-y-12 md:space-y-16 lg:space-y-20">
        <FeaturesSection />
        <EventsSection events={upcomingEvents || []} />
        <StoreSection products={storeProducts || []} />
        <TestimonialSection />
        <CTASection />
      </div>
    </PublicPageWrapper>
  );
};

export default HomePage;
