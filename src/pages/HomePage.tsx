
import React from "react";
import { useHomePageData } from "@/hooks/useHomePageData";
import { HomePageLoader } from "@/components/landing/HomePageLoader";
import { HomePageContent } from "@/components/landing/HomePageContent";
import { Header } from "@/components/landing/Header";
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
    <div className="min-h-screen home-page overflow-x-hidden bg-background">
      <Header />
      
      {/* Temporary Admin Access Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => navigate('/admin/slider-console')}
          className="bg-glee-spelman hover:bg-glee-spelman/90 text-white shadow-lg"
          size="lg"
        >
          <Sliders className="h-4 w-4 mr-2" />
          Create Slides
        </Button>
      </div>
      
      {/* Content wrapper - account for fixed header */}
      <div className="pt-[80px]">
        {/* Custom Slide Renderer - directly under header */}
        <CustomSlideRenderer />
        
        {/* Main Content - directly under slider */}
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
