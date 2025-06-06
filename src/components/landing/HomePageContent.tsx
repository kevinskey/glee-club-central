
import React from "react";
import { AnnouncementBanner } from "./AnnouncementBanner";
import { HeroSection } from "./HeroSection";
import { FeaturesSection } from "./FeaturesSection";
import { EventsSection } from "./sections/EventsSection";
import { StoreSection } from "./sections/StoreSection";
import { TestimonialSection } from "./TestimonialSection";
import { CTASection } from "./CTASection";

export function HomePageContent() {
  return (
    <>
      <AnnouncementBanner message="Welcome to Spelman Glee Club" />
      <HeroSection />
      <FeaturesSection />
      <EventsSection events={[]} />
      <StoreSection products={[]} />
      <TestimonialSection />
      <CTASection />
    </>
  );
}
