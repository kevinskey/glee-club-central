
import React from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { TestimonialSection } from "@/components/landing/TestimonialSection";
import { CTASection } from "@/components/landing/CTASection";
import { YouTubeSection } from "@/components/landing/youtube/YouTubeSection";
import { SidebarProvider } from "@/components/ui/sidebar";
import { EventsSlider } from "@/components/landing/events/EventsSlider";

const LandingPage: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full">
        <main>
          <HeroSection />
          <EventsSlider />
          <YouTubeSection />
          <TestimonialSection />
          <CTASection />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default LandingPage;
