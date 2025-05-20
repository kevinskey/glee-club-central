
import React from 'react';
import { Layout } from "@/components/landing/Layout";
import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        <Layout>
          <HeroSection />
          <section className="py-12">
            <h1 className="text-3xl font-bold text-center mb-6">Welcome to GleeWorld</h1>
            <p className="text-center text-lg">
              The central hub for Spelman College Glee Club
            </p>
          </section>
        </Layout>
      </main>
    </div>
  );
};

export default HomePage;
