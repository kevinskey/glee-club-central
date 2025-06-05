
import React from "react";
import { useHomePageData } from "@/hooks/useHomePageData";
import { HomePageLoader } from "@/components/landing/HomePageLoader";
import { HomePageContent } from "@/components/landing/HomePageContent";
import { PublicPageWrapper } from "@/components/landing/PublicPageWrapper";
import { CustomSlideRenderer } from "@/components/landing/CustomSlideRenderer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sliders } from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();
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
      {/* Unified Admin Access Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => navigate('/admin/unified-slide-management')}
          className="bg-glee-spelman hover:bg-glee-spelman/90 text-white shadow-lg"
          size="lg"
        >
          <Sliders className="h-4 w-4 mr-2" />
          Manage Slides
        </Button>
      </div>
      
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
