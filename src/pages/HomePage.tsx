
import React from 'react';
import { Layout } from "@/components/landing/Layout";
import { HeroSection } from "@/components/landing/HeroSection";
import { ResponsiveSection } from "@/components/ui/responsive-section";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        <HeroSection />
        <ResponsiveSection className="py-12 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-center mb-6">Welcome to GleeWorld</h1>
          <p className="text-center text-lg max-w-2xl mx-auto">
            The central hub for Spelman College Glee Club
          </p>
        </ResponsiveSection>
      </main>
    </div>
  );
};

export default HomePage;
