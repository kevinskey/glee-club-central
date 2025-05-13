
import React from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { TestimonialSection } from "@/components/landing/TestimonialSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";
import { PerformanceSection } from "@/components/landing/performance/PerformanceSection";
import { YouTubeSection } from "@/components/landing/youtube/YouTubeSection";
import { ConsolidatedHeader } from "@/components/layout/ConsolidatedHeader";
import { SidebarProvider } from "@/components/ui/sidebar";

const LandingPage: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full">
        <ConsolidatedHeader />
        <main>
          <HeroSection />
          <PerformanceSection />
          <YouTubeSection />
          <TestimonialSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </SidebarProvider>
  );
};

export default LandingPage;
