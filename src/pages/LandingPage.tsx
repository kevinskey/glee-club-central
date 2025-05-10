
import React from "react";
import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { PerformanceSection } from "@/components/landing/performance/PerformanceSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { TestimonialSection } from "@/components/landing/TestimonialSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";
import { NewsFeed } from "@/components/news/NewsFeed";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col" id="home">
      <NewsFeed />
      <Header initialShowNewsFeed={false} />
      <HeroSection />
      <PerformanceSection />
      <FeaturesSection />
      <TestimonialSection />
      <CTASection />
      <Footer />
    </div>
  );
}
