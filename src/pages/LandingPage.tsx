
import React from "react";
import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { TestimonialSection } from "@/components/landing/TestimonialSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";
import { PerformanceSection } from "@/components/landing/performance/PerformanceSection";
import { YouTubeSection } from "@/components/landing/youtube/YouTubeSection";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header initialShowNewsFeed={false} />
      <main>
        <HeroSection />
        <PerformanceSection />
        <YouTubeSection />
        <TestimonialSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
