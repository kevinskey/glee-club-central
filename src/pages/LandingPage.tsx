
import React from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { TestimonialSection } from "@/components/landing/TestimonialSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";
import { PerformanceSection } from "@/components/landing/performance/PerformanceSection";
import { YouTubeSection } from "@/components/landing/youtube/YouTubeSection";
import { Header } from "@/components/landing/Header";
import { SidebarProvider } from "@/components/ui/sidebar";

const LandingPage: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full">
        <Header initialShowNewsFeed={true} />
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
