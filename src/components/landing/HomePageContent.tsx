
import React from "react";
import { FeaturesSection } from "./FeaturesSection";
import { EventsSection } from "./sections/EventsSection";
import { StoreSection } from "./sections/StoreSection";
import { TestimonialSection } from "./TestimonialSection";
import { CTASection } from "./CTASection";

export function HomePageContent() {
  return (
    <div className="space-y-12 md:space-y-16 lg:space-y-20">
      <FeaturesSection />
      <EventsSection events={[]} />
      <StoreSection products={[]} />
      <TestimonialSection />
      <CTASection />
    </div>
  );
}
