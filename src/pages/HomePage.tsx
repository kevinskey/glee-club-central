
import React, { useEffect, useState } from "react";
import { UnifiedPublicHeader } from "@/components/landing/UnifiedPublicHeader";
import { Footer } from "@/components/landing/Footer";
import { HomePageContent } from "@/components/landing/HomePageContent";
import { HomePageLoader } from "@/components/landing/HomePageLoader";
import { useHomePageData } from "@/hooks/useHomePageData";
import { useAnalyticsTracking } from "@/hooks/useAnalyticsTracking";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const { 
    upcomingEvents, 
    storeProducts, 
    audioTracks, 
    isLoading: dataLoading 
  } = useHomePageData();
  
  const { trackFeatureUsage } = useAnalyticsTracking();

  useEffect(() => {
    console.log('HomePage: Component mounted');
    const timer = setTimeout(() => {
      console.log('HomePage: Initial loading complete');
      setIsLoading(false);
      // Track homepage feature usage
      trackFeatureUsage('homepage_loaded', {
        eventsCount: upcomingEvents.length,
        productsCount: storeProducts.length,
        tracksCount: audioTracks.length
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [upcomingEvents.length, storeProducts.length, audioTracks.length, trackFeatureUsage]);

  // Show loader while initial page is loading, but don't wait for data indefinitely
  if (isLoading) {
    console.log('HomePage: Showing loader');
    return <HomePageLoader />;
  }

  console.log('HomePage: Rendering main content');

  return (
    <div className="min-h-screen bg-background">
      {/* Header - will be sticky on its own */}
      <UnifiedPublicHeader />
      
      {/* Main content */}
      <main className="relative">
        {/* Default hero section */}
        <section className="hero-section relative w-full min-h-[80vh] sm:min-h-[50vh] md:min-h-[55vh] lg:min-h-[60vh] flex items-center justify-center overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-royal-600 via-royal-500 to-powder-500">
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 text-center text-white w-full max-w-[1800px] mx-auto px-6 md:px-8 py-6 md:py-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight">
              Spelman College Glee Club
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 md:mb-8 opacity-90 leading-relaxed">
              To Amaze and Inspire
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center">
              <a
                href="/about"
                className="bg-white text-royal-600 hover:bg-white/90 text-sm sm:text-base px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-md font-medium transition-colors inline-block"
              >
                Learn More
              </a>
              <a
                href="/contact"
                className="border border-white text-white hover:bg-white/20 text-sm sm:text-base px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-md font-medium transition-colors inline-block"
              >
                Get In Touch
              </a>
            </div>
          </div>
        </section>
        
        {/* Rest of homepage content */}
        <div className="bg-background">
          <HomePageContent
            heroImages={[]} // No hero images needed anymore
            upcomingEvents={upcomingEvents}
            storeProducts={storeProducts}
            audioTracks={audioTracks}
          />
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
