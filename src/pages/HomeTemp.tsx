
import React from 'react';
import { Layout } from "@/components/landing/Layout";
import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { TestimonialSection } from "@/components/landing/TestimonialSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { CTASection } from "@/components/landing/CTASection";
import { MemberPortalBox } from "@/components/landing/MemberPortalBox";
import { Footer } from "@/components/landing/Footer";

const HomeTemp = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header initialShowNewsFeed={false} />
      <main className="flex-1">
        <HeroSection />
        <TestimonialSection />
        <FeaturesSection />
        <CTASection />
        <MemberPortalBox />
      </main>
      <Footer />
    </div>
  );
};

export default HomeTemp;
