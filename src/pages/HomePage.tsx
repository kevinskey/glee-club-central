
import React from 'react';
import { Layout } from "@/components/landing/Layout";
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { EventsSlider } from '@/components/landing/events/EventsSlider';
import { TestimonialSection } from '@/components/landing/TestimonialSection';
import { CTASection } from '@/components/landing/CTASection';
import { MemberPortalBox } from '@/components/landing/MemberPortalBox';

export default function HomePage() {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <EventsSlider />
      <TestimonialSection />
      <CTASection />
      <MemberPortalBox />
    </Layout>
  );
}
